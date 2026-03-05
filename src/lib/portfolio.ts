import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { PortfolioSettings, CourseRow, ActivityRow, ReportSectionRow } from "./database.types";
import {
  student as staticStudent,
  gpa as staticGpa,
  activeCourses as staticActive,
  completedCourses as staticCompleted,
  practicalSkills as staticSkills,
} from "@/data/studentData";
import type { ActiveCourse, CompletedCourse, SkillCategory } from "@/data/studentData";

/** Fetches fresh data from Supabase; no client or Next.js cache. */
export async function fetchPortfolioData(studentSlug: string) {
  if (!isSupabaseConfigured) {
    return {
      gpaValue: staticGpa.value,
      presentationVideo: staticStudent.presentationVideo,
      profilePhoto: null,
      active: staticActive,
      completed: staticCompleted,
      skills: staticSkills,
      hasDb: false,
    };
  }

  const sb = getSupabase();
  const slug = (studentSlug || "").trim() || "mata";
  const [sRes, cRes, aRes] = await Promise.all([
    sb.from("portfolio_settings").select("*").eq("student_slug", slug).maybeSingle(),
    sb.from("courses").select("*").eq("student_slug", slug).order("id"),
    sb.from("activities").select("*").eq("student_slug", slug).order("sort_order"),
  ]);

  const settings = !sRes.error && sRes.data ? (sRes.data as PortfolioSettings) : null;
  const courseRows: CourseRow[] = !cRes.error && cRes.data ? (cRes.data as CourseRow[]) : [];
  const activityRows: ActivityRow[] = !aRes.error && aRes.data ? (aRes.data as ActivityRow[]) : [];

  // eslint-disable-next-line no-console -- debug: raw DB rows
  console.log("Raw Database Rows:", courseRows);

  const hasDb = !!settings;

  const gpaValue = hasDb ? settings!.gpa : staticGpa.value;
  const presentationVideo = hasDb ? (settings!.presentation_video_url ?? "") : staticStudent.presentationVideo;
  const profilePhoto = hasDb ? settings!.profile_photo_url : null;

  const norm = (v: string | null | undefined) => (v ?? "").toLowerCase().trim();
  const activeFiltered = courseRows
    .filter((c) => norm(c.status) === "active")
    .sort((a, b) => b.progress - a.progress);
  const completedFiltered = courseRows.filter((c) => norm(c.status) === "completed");

  const dedupeCompleted = (rows: CourseRow[]) => {
    const bySubject = new Map<string, CourseRow>();
    for (const c of rows) {
      const key = (c.subject_en ?? "").trim();
      if (!key) continue;
      const existing = bySubject.get(key);
      const cHasCert = !!(c.certificate_url?.trim());
      const exHasCert = !!(existing?.certificate_url?.trim());
      const keep =
        !existing ||
        (cHasCert && !exHasCert) ||
        (cHasCert === exHasCert && (c.id > existing!.id || (c.id === existing!.id && (c.progress ?? 0) > (existing!.progress ?? 0))));
      if (keep) bySubject.set(key, c);
    }
    return Array.from(bySubject.values()).sort((a, b) => {
      const dateA = (a.completed_date_en ?? "").trim();
      const dateB = (b.completed_date_en ?? "").trim();
      return dateB.localeCompare(dateA, undefined, { numeric: true });
    });
  };

  const completedFilteredDeduped = dedupeCompleted(completedFiltered);

  const dedupeActive = (rows: typeof activeFiltered) => {
    const seen = new Set<string>();
    return rows.filter((c) => {
      const key = (c.subject_en ?? "").trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const activeFilteredDeduped = dedupeActive(activeFiltered);

  // eslint-disable-next-line no-console -- debug: verify filter output
  console.log("Final Active Courses:", activeFilteredDeduped);
  // eslint-disable-next-line no-console -- debug: verify filter output
  console.log("Final Completed Courses:", completedFilteredDeduped);

  const fallbackDate = { en: "Recently Completed", th: "สำเร็จล่าสุด" };
  const safeDate = (en: string | null, th: string | null) => {
    const enVal = en != null && String(en).trim() !== "" ? String(en).trim() : fallbackDate.en;
    const thVal = th != null && String(th).trim() !== "" ? String(th).trim() : fallbackDate.th;
    return { en: enVal, th: thVal };
  };

  const active: ActiveCourse[] =
    activeFilteredDeduped.length > 0
      ? activeFilteredDeduped.map((c) => ({
          id: String(c.id),
          subject: { en: c.subject_en ?? "", th: c.subject_th ?? "" },
          grade: { en: c.grade_en ?? "", th: c.grade_th ?? "" },
          progress: c.progress,
          letterGrade: c.letter_grade ?? "",
        }))
      : staticActive;

  const completed: CompletedCourse[] =
    completedFilteredDeduped.length > 0
      ? completedFilteredDeduped.map((c) => ({
          id: String(c.id),
          subject: { en: c.subject_en ?? "", th: c.subject_th ?? "" },
          grade: { en: c.grade_en ?? "", th: c.grade_th ?? "" },
          completedDate: safeDate(c.completed_date_en, c.completed_date_th),
          certificateUrl: c.certificate_url ?? undefined,
        }))
      : staticCompleted;

  const catMap: Record<string, { title: { en: string; th: string } }> = {
    "agri-science": { title: { en: "Agri-Science", th: "เกษตรศาสตร์" } },
    "adventure-fitness": { title: { en: "Adventure & Fitness", th: "ผจญภัยและฟิตเนส" } },
    "life-skills": { title: { en: "Life Skills", th: "ทักษะชีวิต" } },
  };

  const skills: SkillCategory[] = activityRows.length
    ? Object.entries(catMap).map(([id, meta]) => ({
        id,
        title: meta.title,
        items: activityRows
          .filter((a) => a.category === id)
          .map((a) => ({
            title: { en: a.title_en, th: a.title_th },
            description: { en: a.description_en, th: a.description_th },
            image: a.image_url ?? undefined,
            videoUrl: a.video_url ?? undefined,
          })),
      }))
    : staticSkills;

  return { gpaValue, presentationVideo, profilePhoto, active, completed, skills, hasDb };
}

export type ReportSectionsMap = Record<string, { en: string; th: string }>;

const REPORT_SECTION_NAMES = ["integrated_skills", "wellness", "strengths", "future_plan", "signature"] as const;

export async function fetchReportSections(studentSlug: string): Promise<ReportSectionsMap> {
  if (!isSupabaseConfigured) return {};
  const sb = getSupabase();
  const slug = (studentSlug || "").trim() || "mata";
  let { data, error } = await sb
    .from("report_sections")
    .select("section_name, content_en, content_th")
    .eq("student_slug", slug);
  if ((error || !data?.length) && slug === "mata") {
    const fallback = await sb.from("report_sections").select("section_name, content_en, content_th");
    if (!fallback.error && fallback.data) data = fallback.data;
  }
  if (!data) return {};
  const out: ReportSectionsMap = {};
  for (const row of data as Pick<ReportSectionRow, "section_name" | "content_en" | "content_th">[]) {
    if (row.section_name && REPORT_SECTION_NAMES.includes(row.section_name as (typeof REPORT_SECTION_NAMES)[number])) {
      out[row.section_name] = {
        en: row.content_en ?? "",
        th: row.content_th ?? "",
      };
    }
  }
  return out;
}
