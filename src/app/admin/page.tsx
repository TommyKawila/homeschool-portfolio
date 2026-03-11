"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { PortfolioSettings, CourseRow, ActivityRow, ReportSectionRow } from "@/lib/database.types";
import { type ReportSectionsMap } from "@/lib/portfolio";

type LocalActivityRow = Omit<ActivityRow, "id"> & { id: number | string };
import { STUDENT_SLUGS, STUDENTS } from "@/lib/students";
import type { StudentSlug } from "@/lib/students";
import { FileUploader } from "@/components/admin/FileUploader";
import {
  Save, GraduationCap, BookOpen, Sprout, Dumbbell, Home, Award,
  Plus, Trash2, Loader2, CheckCircle2, AlertCircle, LogOut, FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { revalidatePortfolioPaths } from "@/app/actions";

type Toast = { type: "ok" | "err"; msg: string } | null;

const isUuid = (id: unknown) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));

const categoryMeta: Record<string, { label: string; icon: typeof Sprout }> = {
  "agri-science": { label: "Agri-Science", icon: Sprout },
  "adventure-fitness": { label: "Adventure & Fitness", icon: Dumbbell },
  "life-skills": { label: "Life Skills", icon: Home },
  "proud_achievements": { label: "Proud Achievements", icon: Award },
};

function SectionHeading({ icon: Icon, children }: { icon: typeof Save; children: React.ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
      <Icon className="h-4 w-4 text-teal-400" />
      {children}
    </h2>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-500/25 bg-slate-800/50 p-4 backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-xs font-medium text-slate-400">{children}</label>;
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  step,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  step?: string;
}) {
  return (
    <input
      type={type}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-500/30 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-slate-500/30 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
    />
  );
}

const REPORT_SECTION_KEYS = ["integrated_skills", "wellness", "strengths", "future_plan", "proud_achievements", "signature"] as const;
const REPORT_SECTION_LABELS: Record<(typeof REPORT_SECTION_KEYS)[number], string> = {
  integrated_skills: "Integrated Skills",
  wellness: "Wellness & Mental Health",
  strengths: "Strengths",
  future_plan: "Future Plans",
  proud_achievements: "Proud Achievements",
  signature: "Parent Signature",
};

const defaultSettings = (slug: StudentSlug): PortfolioSettings => ({
  student_slug: slug,
  gpa: 4.0,
  profile_photo_url: null,
  presentation_video_url: null,
  annual_report_summary_en: null,
  annual_report_summary_th: null,
  future_plans_en: null,
  future_plans_th: null,
  parent_signature_en: null,
  parent_signature_th: null,
  updated_at: "",
});

export default function AdminPage() {
  const [selectedStudentSlug, setSelectedStudentSlug] = useState<StudentSlug>("mata");
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [activities, setActivities] = useState<LocalActivityRow[]>([]);
  const [reportSections, setReportSections] = useState<ReportSectionsMap>({});
  const [saving, setSaving] = useState(false);
  const [savingActivityId, setSavingActivityId] = useState<number | string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [gpaInput, setGpaInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (settings != null) setGpaInput(String(settings.gpa ?? ""));
  }, [settings]);

  const showToast = (t: Toast) => { setToast(t); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async (slug: StudentSlug) => {
    if (!isSupabaseConfigured) {
      setSettings(defaultSettings(slug));
      setCourses([]);
      setActivities([]);
      setReportSections({});
      return;
    }
    const sb = getSupabase();
    const [sRes, cRes, aRes, rRes] = await Promise.all([
      sb.from("portfolio_settings").select("*").eq("student_slug", slug).maybeSingle(),
      sb.from("courses").select("*").eq("student_slug", slug).order("id"),
      sb.from("activities").select("*").eq("student_slug", slug).order("sort_order"),
      sb.from("report_sections").select("section_name, content_en, content_th").eq("student_slug", slug),
    ]);
    const settingsData = sRes.data as PortfolioSettings | null;
    setSettings(settingsData ?? defaultSettings(slug));
    setCourses((cRes.data as unknown as CourseRow[]) ?? []);
    setActivities((aRes.data as unknown as ActivityRow[]) ?? []);
    if (rRes.data && !rRes.error) {
      const map: ReportSectionsMap = {};
      for (const row of rRes.data as Pick<ReportSectionRow, "section_name" | "content_en" | "content_th">[]) {
        if (row.section_name) map[row.section_name] = { en: row.content_en ?? "", th: row.content_th ?? "" };
      }
      setReportSections(map);
    } else {
      setReportSections({});
    }
  }, []);

  useEffect(() => {
    load(selectedStudentSlug);
  }, [load, selectedStudentSlug]);

  const fetchData = useCallback(async (slug: StudentSlug) => {
    if (!isSupabaseConfigured) return;
    const sb = getSupabase();
    const [cRes, aRes] = await Promise.all([
      sb.from("courses").select("*").eq("student_slug", slug).order("id"),
      sb.from("activities").select("*").eq("student_slug", slug).order("sort_order"),
    ]);
    setCourses((cRes.data as CourseRow[]) ?? []);
    setActivities((aRes.data as LocalActivityRow[]) ?? []);
  }, []);

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const sb = getSupabase();
    const selectedSlug = selectedStudentSlug;
    const gpa = (() => {
      const parsed = parseFloat(String(gpaInput ?? "").replace(",", "."));
      return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : 0;
    })();
    const payload = {
      student_slug: selectedSlug,
      gpa,
      profile_photo_url: settings.profile_photo_url ?? null,
      presentation_video_url: settings.presentation_video_url ?? null,
      annual_report_summary_th: settings.annual_report_summary_th ?? null,
      annual_report_summary_en: settings.annual_report_summary_en ?? null,
      future_plans_th: settings.future_plans_th ?? null,
      future_plans_en: settings.future_plans_en ?? null,
      parent_signature_th: settings.parent_signature_th ?? null,
      parent_signature_en: settings.parent_signature_en ?? null,
      updated_at: new Date().toISOString(),
    };
    console.log("Saving payload:", payload);
    const { data, error } = await sb
      .from("portfolio_settings")
      .upsert(payload, { onConflict: "student_slug" })
      .select()
      .maybeSingle();
    setSaving(false);
    if (error) {
      showToast({ type: "err", msg: error.message });
      return;
    }
    if (data) setSettings(data as unknown as PortfolioSettings);
    else load(selectedSlug);
    showToast({ type: "ok", msg: "Settings saved" });
  };

  const saveCourse = async (c: CourseRow) => {
    const slug = selectedStudentSlug;
    const isTemp = typeof c.id === "string" && (c.id as string).startsWith("temp-");
    const hasDbId = c.id != null && !isTemp && isUuid(c.id);
    const { id: _id, ...dataToSave } = c;
    const payload: Record<string, unknown> = { ...dataToSave, student_slug: slug };
    if (hasDbId) payload.id = c.id;
    console.log("Payload being sent (course):", payload);
    const { error } = await getSupabase()
      .from("courses")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();
    if (!error) {
      await fetchData(slug);
      router.refresh();
    }
    showToast(error ? { type: "err", msg: error.message } : { type: "ok", msg: `Course "${c.subject_en}" saved` });
  };

  const deleteCourse = async (id: number | string) => {
    if (!window.confirm("Delete this course permanently?")) return;
    const isTemp = (typeof id === "string" && (id as string).startsWith("temp-")) || (typeof id === "number" && id >= 1e10);
    if (isTemp) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      showToast({ type: "ok", msg: "Course removed" });
      return;
    }
    const slug = selectedStudentSlug;
    const { error } = await getSupabase()
      .from("courses")
      .delete()
      .eq("id", id)
      .eq("student_slug", slug);
    if (!error) {
      await fetchData(slug);
      await revalidatePortfolioPaths();
      router.refresh();
    }
    showToast(error ? { type: "err", msg: error.message } : { type: "ok", msg: "Course deleted" });
  };

  const addCourse = (status: "active" | "completed") => {
    const temp: CourseRow = {
      id: Date.now(),
      student_slug: selectedStudentSlug,
      subject_en: "", subject_th: "", grade_en: "", grade_th: "",
      status, progress: 0, letter_grade: "A",
      completed_date_en: null, completed_date_th: null,
      certificate_url: null,
      images: null,
    };
    setCourses((prev) => [...prev, temp]);
  };

  const updateCourse = (id: number | string, patch: Partial<CourseRow>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const saveActivity = async (a: LocalActivityRow) => {
    if (savingActivityId !== null) return;
    setSavingActivityId(a.id);
    const slug = selectedStudentSlug;
    const isTemp = typeof a.id === "string" && (a.id as string).startsWith("temp-");
    const hasDbId = a.id != null && !isTemp && isUuid(a.id);
    const imagesArr = (a.images ?? []).filter(Boolean).slice(0, 5);
    const payload: Record<string, unknown> = {
      student_slug: slug,
      title_en: a.title_en ?? "",
      title_th: a.title_th ?? "",
      category: a.category,
      description_en: a.description_en ?? "",
      description_th: a.description_th ?? "",
      images: imagesArr,
      video_url: a.video_url ?? null,
      sort_order: a.sort_order,
    };
    if (hasDbId) payload.id = a.id;
    console.log("Payload being sent:", payload);
    const supabase = getSupabase();
    const { error } = await supabase
      .from("activities")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();
    setSavingActivityId(null);
    if (error) {
      const msg = error.code === "23505" ? "Already exists" : error.message;
      showToast({ type: "err", msg });
      return;
    }
    await fetchData(slug);
    router.refresh();
    showToast({ type: "ok", msg: `Activity "${a.title_en}" saved` });
  };

  const deleteActivity = async (activityId: number | string) => {
    if (!window.confirm("Delete this activity permanently?")) return;
    const isTemp = typeof activityId === "string" && (activityId as string).startsWith("temp-");
    if (isTemp) {
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
      showToast({ type: "ok", msg: "Activity removed" });
      return;
    }
    const slug = selectedStudentSlug;
    const supabase = getSupabase();
    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", activityId)
      .eq("student_slug", slug);
    if (error) {
      showToast({ type: "err", msg: error.message });
      return;
    }
    await fetchData(slug);
    await revalidatePortfolioPaths();
    router.refresh();
    showToast({ type: "ok", msg: "Activity deleted" });
  };

  const addActivity = (category: string) => {
    const temp: LocalActivityRow = {
      id: `temp-${Date.now()}`,
      student_slug: selectedStudentSlug,
      category: category as ActivityRow["category"],
      title_en: "", title_th: "", description_en: "", description_th: "",
      images: [], video_url: null, sort_order: activities.length,
    };
    setActivities((prev) => [...prev, temp]);
  };

  const updateActivity = (id: number | string, patch: Partial<LocalActivityRow>) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const updateReportSection = (key: (typeof REPORT_SECTION_KEYS)[number], en: string, th: string) => {
    setReportSections((prev) => ({ ...prev, [key]: { en, th } }));
  };

  const saveReportSection = async (key: (typeof REPORT_SECTION_KEYS)[number]) => {
    const section = reportSections[key] ?? { en: "", th: "" };
    const slug = selectedStudentSlug;
    setSaving(true);
    const payload = {
      student_slug: slug,
      section_name: key,
      content_en: section.en || null,
      content_th: section.th || null,
    };
    const { error } = await getSupabase()
      .from("report_sections")
      .upsert(payload, { onConflict: "student_slug,section_name" });
    setSaving(false);
    showToast(error ? { type: "err", msg: error.message } : { type: "ok", msg: `${REPORT_SECTION_LABELS[key]} saved` });
  };

  if (!settings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {toast && (
        <div className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm shadow-lg backdrop-blur-md ${
          toast.type === "ok"
            ? "border-teal-500/40 bg-teal-900/60 text-teal-200"
            : "border-red-500/40 bg-red-900/60 text-red-200"
        }`}>
          {toast.type === "ok" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-slate-500/20 bg-slate-900/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-slate-100">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-400">
              Student
              <select
                value={selectedStudentSlug}
                onChange={(e) => setSelectedStudentSlug(e.target.value as StudentSlug)}
                className="rounded-lg border border-slate-500/30 bg-slate-700/50 px-2 py-1.5 text-sm text-slate-200 focus:border-teal-500/50 focus:outline-none"
              >
                {STUDENT_SLUGS.map((s) => (
                  <option key={s} value={s}>
                    {STUDENTS[s].name.en}
                  </option>
                ))}
              </select>
            </label>
            <Link href="/mata" className="text-sm text-teal-400 hover:text-teal-300">
              ← Portfolio
            </Link>
            <button
              onClick={async () => {
                if (isSupabaseConfigured) {
                  await getSupabase().auth.signOut();
                }
                router.push("/login");
                router.refresh();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-500/30 bg-slate-700/40 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-600/50 hover:text-slate-100"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        {/* ── PROFILE & SETTINGS ── */}
        <GlassCard>
          <SectionHeading icon={GraduationCap}>Profile & Settings</SectionHeading>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Profile Photo</Label>
              <FileUploader
                bucket="portfolio"
                folder="avatars"
                pathFileName={`${selectedStudentSlug}-profile`}
                currentUrl={settings.profile_photo_url}
                onUploaded={(url) => setSettings({ ...settings, profile_photo_url: url })}
              />
            </div>
            <div className="sm:col-span-2 space-y-3">
              <div>
                <Label>GPA</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={gpaInput}
                  onChange={(v) => setGpaInput(v)}
                  placeholder="4.00"
                />
              </div>
              <div>
                <Label>Presentation Video URL</Label>
                <Input
                  value={settings.presentation_video_url ?? ""}
                  onChange={(v) => setSettings({ ...settings, presentation_video_url: v || null })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="mt-4 flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Settings
          </button>
        </GlassCard>

        {/* ── COURSES ── */}
        {(["active", "completed"] as const).map((status) => {
          const filtered = courses.filter((c) => c.status === status);
          return (
            <GlassCard key={status}>
              <SectionHeading icon={BookOpen}>
                {status === "active" ? "Active Courses" : "Completed Courses"}
              </SectionHeading>
              <div className="space-y-3">
                {filtered.map((c) => (
                  <div key={c.id} className="grid gap-2 rounded-lg border border-slate-500/20 bg-slate-700/30 p-3 sm:grid-cols-3">
                    <div>
                      <Label>Subject (EN)</Label>
                      <Input value={c.subject_en} onChange={(v) => updateCourse(c.id, { subject_en: v })} />
                    </div>
                    <div>
                      <Label>Subject (TH)</Label>
                      <Input value={c.subject_th} onChange={(v) => updateCourse(c.id, { subject_th: v })} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Grade EN</Label>
                        <Input value={c.grade_en} onChange={(v) => updateCourse(c.id, { grade_en: v })} placeholder="Grade 5" />
                      </div>
                      <div>
                        <Label>Grade TH</Label>
                        <Input value={c.grade_th} onChange={(v) => updateCourse(c.id, { grade_th: v })} placeholder="ป.5" />
                      </div>
                    </div>
                    {status === "active" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Progress %</Label>
                          <Input value={String(c.progress)} onChange={(v) => updateCourse(c.id, { progress: parseInt(v) || 0 })} />
                        </div>
                        <div>
                          <Label>Letter Grade</Label>
                          <Input value={c.letter_grade} onChange={(v) => updateCourse(c.id, { letter_grade: v })} />
                        </div>
                      </div>
                    )}
                    {status === "completed" && (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Completed (EN)</Label>
                            <Input value={c.completed_date_en ?? ""} onChange={(v) => updateCourse(c.id, { completed_date_en: v })} />
                          </div>
                          <div>
                            <Label>Completed (TH)</Label>
                            <Input value={c.completed_date_th ?? ""} onChange={(v) => updateCourse(c.id, { completed_date_th: v })} />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <Label>Certificate</Label>
                          {c.certificate_url ? (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-300">
                                ✅ Certificate Linked
                              </span>
                              <a
                                href={c.certificate_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-slate-400 underline hover:text-slate-200"
                              >
                                View
                              </a>
                              <button
                                type="button"
                                onClick={() => updateCourse(c.id, { certificate_url: null })}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <FileUploader
                              bucket="portfolio"
                              folder="certificates"
                              currentUrl={null}
                              accept=".pdf,.jpg,.jpeg,.png,image/*"
                              onUploaded={(url) => updateCourse(c.id, { certificate_url: url })}
                            />
                          )}
                        </div>
                      </>
                    )}
                    <div className="sm:col-span-3">
                      <Label>Images (up to 5)</Label>
                      <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                        {[0, 1, 2, 3, 4].map((i) => {
                          const urls = c.images ?? [];
                          const currentUrl = urls[i] ?? null;
                          return (
                            <div key={i}>
                              <FileUploader
                                bucket="portfolio"
                                folder="certificates"
                                currentUrl={currentUrl}
                                accept=".jpg,.jpeg,.png,image/*"
                                onUploaded={(url) => {
                                  const next = [...urls.slice(0, 5)];
                                  next[i] = url;
                                  updateCourse(c.id, { images: next.filter(Boolean) });
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-end gap-2 sm:col-span-3">
                      <button onClick={() => saveCourse(c)} className="flex items-center gap-1 rounded-lg bg-teal-600/80 px-3 py-1.5 text-xs text-white hover:bg-teal-500">
                        <Save className="h-3.5 w-3.5" /> Save
                      </button>
                      <button onClick={() => deleteCourse(c.id)} className="flex items-center gap-1 rounded-lg bg-red-600/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-600/50">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addCourse(status)}
                className="mt-3 flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300"
              >
                <Plus className="h-3.5 w-3.5" /> Add {status === "active" ? "Active" : "Completed"} Course
              </button>
            </GlassCard>
          );
        })}

        {/* ── ACTIVITIES ── */}
        {Object.entries(categoryMeta).map(([catId, meta]) => {
          const filtered = activities.filter((a) => a.category === catId);
          const CatIcon = meta.icon;
          return (
            <GlassCard key={catId}>
              <SectionHeading icon={CatIcon}>{meta.label}</SectionHeading>
              <div className="space-y-4">
                {filtered.map((a) => (
                  <div key={a.id} className="rounded-lg border border-slate-500/20 bg-slate-700/30 p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <Label>Title (EN)</Label>
                        <Input value={a.title_en} onChange={(v) => updateActivity(a.id, { title_en: v })} />
                      </div>
                      <div>
                        <Label>Title (TH)</Label>
                        <Input value={a.title_th} onChange={(v) => updateActivity(a.id, { title_th: v })} />
                      </div>
                      <div>
                        <Label>Description (EN)</Label>
                        <Textarea value={a.description_en} onChange={(v) => updateActivity(a.id, { description_en: v })} rows={2} />
                      </div>
                      <div>
                        <Label>Description (TH)</Label>
                        <Textarea value={a.description_th} onChange={(v) => updateActivity(a.id, { description_th: v })} rows={2} />
                      </div>
                    </div>
                    <div className="mt-2">
                      <Label>Images (up to 5)</Label>
                      <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                        {[0, 1, 2, 3, 4].map((i) => {
                          const urls = a.images ?? [];
                          const currentUrl = urls[i] ?? null;
                          return (
                            <div key={i}>
                              <FileUploader
                                bucket="portfolio"
                                folder="activities"
                                pathSubfolder={selectedStudentSlug}
                                useFileNameInPath
                                currentUrl={currentUrl}
                                onUploaded={(url) => {
                                  const next = [...urls.slice(0, 5)];
                                  next[i] = url;
                                  const newImages = next.filter(Boolean);
                                  updateActivity(a.id, { images: newImages });
                                  const updated = { ...a, images: newImages };
                                  saveActivity(updated);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div>
                        <Label>YouTube / Video URL</Label>
                        <Input
                          value={a.video_url ?? ""}
                          onChange={(v) => updateActivity(a.id, { video_url: v || null })}
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => saveActivity(a)}
                        disabled={savingActivityId !== null}
                        className="flex items-center gap-1 rounded-lg bg-teal-600/80 px-3 py-1.5 text-xs text-white hover:bg-teal-500 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {savingActivityId === a.id ? (
                          <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...</>
                        ) : (
                          <><Save className="h-3.5 w-3.5" /> Save</>
                        )}
                      </button>
                      <button onClick={() => deleteActivity(a.id)} className="flex items-center gap-1 rounded-lg bg-red-600/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-600/50">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addActivity(catId)}
                className="mt-3 flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300"
              >
                <Plus className="h-3.5 w-3.5" /> Add Activity
              </button>
            </GlassCard>
          );
        })}

        {/* ── REPORT CONTENT MANAGER ── */}
        <GlassCard>
          <SectionHeading icon={FileText}>Report Content Manager</SectionHeading>
          <p className="mb-4 text-xs text-slate-500">
            Edit content for the Annual Report page. One line per list item. Signature: first line = name, second = role.
          </p>
          <div className="space-y-4">
            {REPORT_SECTION_KEYS.map((key) => {
              const s = reportSections[key] ?? { en: "", th: "" };
              return (
                <div key={key} className="rounded-lg border border-slate-500/20 bg-slate-700/20 p-3">
                  <h3 className="mb-2 text-xs font-medium text-slate-300">{REPORT_SECTION_LABELS[key]}</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <Label>Content (EN)</Label>
                      <Textarea value={s.en} onChange={(v) => updateReportSection(key, v, s.th)} rows={4} placeholder="English content..." />
                    </div>
                    <div>
                      <Label>Content (TH)</Label>
                      <Textarea value={s.th} onChange={(v) => updateReportSection(key, s.en, v)} rows={4} placeholder="เนื้อหาภาษาไทย..." />
                    </div>
                  </div>
                  <button
                    onClick={() => saveReportSection(key)}
                    disabled={saving}
                    className="mt-2 flex items-center gap-1 rounded-lg bg-teal-600/80 px-3 py-1.5 text-xs text-white hover:bg-teal-500 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} Save
                  </button>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* ── ANNUAL REPORT EDITOR ── */}
        <GlassCard>
          <SectionHeading icon={BookOpen}>Annual Report Summary</SectionHeading>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Summary (EN)</Label>
              <Textarea
                value={settings.annual_report_summary_en ?? ""}
                onChange={(v) => setSettings({ ...settings, annual_report_summary_en: v || null })}
                rows={5}
                placeholder="Annual report summary in English..."
              />
            </div>
            <div>
              <Label>Summary (TH)</Label>
              <Textarea
                value={settings.annual_report_summary_th ?? ""}
                onChange={(v) => setSettings({ ...settings, annual_report_summary_th: v || null })}
                rows={5}
                placeholder="สรุปรายงานประจำปีภาษาไทย..."
              />
            </div>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="mt-4 flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Report Summary
          </button>
        </GlassCard>
      </main>
    </div>
  );
}
