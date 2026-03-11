"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  Play,
  ScrollText,
  Trophy,
  Award,
  Star,
  Camera,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { gpa, labels } from "@/data/studentData";
import type { Lang } from "@/data/studentData";
import { usePortfolio } from "@/lib/usePortfolio";
import { getStudent, isValidStudentSlug } from "@/lib/students";
import { ReportModeToggle } from "@/components/ReportModeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { VideoModal } from "@/components/VideoModal";
import { CertificateModal } from "@/components/CertificateModal";
import { SkillCarousel } from "@/components/SkillCarousel";
import type { SkillItem } from "@/types/studentData";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const themeIconColor: Record<string, string> = {
  mata: "text-violet-400/80",
  punna: "text-cyan-400/80",
};

const themeLetterBadge: Record<string, string> = {
  mata: "border-violet-400/50 bg-violet-500/15 text-violet-300 shadow-[0_0_12px_rgba(167,139,250,0.2)]",
  punna: "border-cyan-400/50 bg-cyan-500/15 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]",
};

const themeProgressText: Record<string, string> = {
  mata: "text-violet-300",
  punna: "text-cyan-300",
};

const themeSparkle: Record<string, string> = {
  mata: "text-fuchsia-400",
  punna: "text-emerald-400",
};

const themeWatchBtn: Record<string, string> = {
  mata: "border-violet-500/40 bg-violet-500/10 text-violet-300 hover:border-fuchsia-400/50 hover:bg-violet-500/20 hover:shadow-[0_0_28px_rgba(167,139,250,0.25)] shadow-[0_0_20px_rgba(167,139,250,0.15)]",
  punna: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:border-emerald-400/50 hover:bg-cyan-500/20 hover:shadow-[0_0_28px_rgba(34,211,238,0.25)] shadow-[0_0_20px_rgba(34,211,238,0.15)]",
};

const themeInitial: Record<string, string> = {
  mata: "text-violet-300/60",
  punna: "text-cyan-300/60",
};

const themeCardGlow: Record<string, string> = {
  mata: "border-rose-400/20 shadow-[0_0_24px_rgba(251,113,133,0.15)] hover:border-rose-400/40 hover:shadow-[0_0_32px_rgba(251,113,133,0.25)]",
  punna: "border-cyan-400/20 shadow-[0_0_24px_rgba(34,211,238,0.15)] hover:border-cyan-400/40 hover:shadow-[0_0_32px_rgba(34,211,238,0.25)]",
};

export default function StudentDashboard() {
  const params = useParams();
  const studentSlug = (params?.student as string) ?? "mata";
  const themeStudent = getStudent(studentSlug);
  const fallbackSlug = isValidStudentSlug(studentSlug) ? studentSlug : "mata";
  const student = themeStudent ?? getStudent("mata")!;

  const [reportMode, setReportMode] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [certUrl, setCertUrl] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[] | null>(null);
  const [certOpen, setCertOpen] = useState(false);
  const [exhibitionMode, setExhibitionMode] = useState(false);
  const [expandedSkill, setExpandedSkill] = useState<{
    layoutId: string;
    item: SkillItem;
    categoryTitle: { en: string; th: string };
  } | null>(null);
  const { gpaValue, presentationVideo, profilePhoto, active, completed, skills } =
    usePortfolio(studentSlug);

  const openVideo = (url: string) => {
    setVideoUrl(url);
    setVideoOpen(true);
  };

  const openCertificate = (url: string) => {
    setCertUrl(url);
    setGalleryUrls(null);
    setCertOpen(true);
  };

  const openGallery = (urls: string[]) => {
    setGalleryUrls(urls);
    setCertUrl(null);
    setCertOpen(true);
  };

  if (!themeStudent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <p className="text-slate-400">Student not found.</p>
      </div>
    );
  }

  /* ── Report mode (inline) ── */
  if (reportMode) {
    return (
      <div className="report-mode min-h-screen bg-white print:bg-white">
        <header className="border-b border-stone-200 px-6 py-4 print:py-3">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <h1 className="text-xl font-semibold text-stone-900">
              {student.name[lang]}
            </h1>
            <ReportModeToggle
              reportMode={true}
              onToggle={() => setReportMode(false)}
              lang={lang}
            />
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-6 py-8 print:py-6">
          <section className="mb-8">
            <p className="text-stone-600">
              {student.identity[lang]} ({labels.age[lang]} {student.age})
            </p>
            <p className="mt-2 italic text-stone-500">
              &ldquo;{student.philosophy[lang]}&rdquo;
            </p>
          </section>
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-stone-900">
              {labels.academicSummary[lang]}
            </h2>
            <p className="text-stone-700">
              <strong>{gpa.label[lang]}:</strong> {gpaValue.toFixed(2)} (Scale{" "}
              {gpa.scale})
            </p>
            <h3 className="mt-4 text-base font-medium text-stone-800">
              {labels.activeCourses[lang]}
            </h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-stone-700">
              {active.map((r) => (
                <li key={r.id}>
                  {r.subject[lang]} ({r.grade[lang]}): {r.progress}% —{" "}
                  {r.letterGrade}
                </li>
              ))}
            </ul>
            <h3 className="mt-4 text-base font-medium text-stone-800">
              {labels.completedCourses[lang]}
            </h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-stone-700">
              {completed.map((r) => (
                <li key={r.id}>
                  {r.subject[lang]} ({r.grade[lang]}): 100% —{" "}
                  {r.completedDate[lang]}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="mb-4 text-lg font-semibold text-stone-900">
              {labels.practicalSkillModules[lang]}
            </h2>
            {skills.map((cat) => (
              <div key={cat.id} className="mb-6">
                <h3 className="font-medium text-stone-800">
                  {cat.title[lang]}
                </h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-stone-700">
                  {cat.items.map((item) => (
                    <li key={item.title.en}>
                      <strong>{item.title[lang]}:</strong>{" "}
                      {item.description[lang]}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </main>
      </div>
    );
  }

  const safeSkills = Array.isArray(skills) ? skills : [];
  const proudAchievements = safeSkills.find((c) => c.id === "proud_achievements")?.items ?? [];
  const otherCategories = safeSkills.filter((c) => c.id !== "proud_achievements");
  const safeActive = Array.isArray(active) ? active : [];
  const safeCompleted = Array.isArray(completed) ? completed : [];
  const hasAnyContent =
    proudAchievements.length > 0 ||
    otherCategories.some((c) => (c.items ?? []).length > 0) ||
    safeActive.length > 0 ||
    safeCompleted.length > 0;

  // eslint-disable-next-line no-console -- debug: verify skills/activities from Supabase
  console.log("[Portfolio] skills:", safeSkills, "| active:", safeActive.length, "| completed:", safeCompleted.length);

  /* ── Main Dashboard ── */
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {!exhibitionMode && (
        <header className="sticky top-0 z-30 border-b border-slate-500/20 bg-slate-900/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <h1 className="text-lg font-semibold text-slate-100 sm:text-xl">
              {student.name[lang]}
            </h1>
            <div className="flex items-center gap-2">
              <LanguageToggle lang={lang} onSelect={setLang} />
              <ReportModeToggle
                reportMode={false}
                onToggle={() => setReportMode(true)}
                lang={lang}
              />
              <button
                onClick={() => setExhibitionMode(true)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-500/30 bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700/50 hover:text-slate-100"
                aria-label="Exhibition Mode"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Exhibition
              </button>
            </div>
          </div>
        </header>
      )}

      {exhibitionMode && (
        <button
          onClick={() => setExhibitionMode(false)}
          className="fixed right-4 top-4 z-50 flex items-center gap-1.5 rounded-full border border-slate-500/30 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md transition hover:bg-slate-800/80 hover:text-slate-100"
          aria-label="Exit Exhibition Mode"
        >
          <Minimize2 className="h-3.5 w-3.5" />
          Exit
        </button>
      )}

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mb-14 flex flex-col items-center text-center"
        >
          <motion.div variants={fadeUp} className="relative mb-6 mx-auto w-fit">
            <div className="relative h-32 w-32 sm:h-40 sm:w-40">
              <div className={`absolute inset-0 rounded-full opacity-90 ${student.profileAtmosphere}`} aria-hidden />
              <div className="profile-ring relative">
              <div className="relative h-32 w-32 overflow-hidden rounded-full bg-slate-800 sm:h-40 sm:w-40">
                {profilePhoto ? (
                  <Image
                    src={profilePhoto}
                    alt={student.name.en}
                    fill
                    className="object-cover"
                    sizes="160px"
                    priority
                  />
                ) : (
                  <div className={`flex h-full w-full items-center justify-center text-4xl sm:text-5xl ${themeInitial[fallbackSlug]}`}>
                    {student.name.en.charAt(0)}
                  </div>
                )}
              </div>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              className={`absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full border px-3 py-1.5 backdrop-blur-md ${student.badgeBorder} ${student.badgeBg} shadow-[0_0_20px_rgba(251,191,36,0.2)]`}
            >
              <Star className={`h-3.5 w-3.5 fill-current ${student.badgeText}`} />
              <span className={`text-sm font-bold ${student.badgeText}`}>
                {gpa.label[lang]} {gpaValue.toFixed(2)}
              </span>
            </motion.div>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className={`mb-2 bg-gradient-to-r ${student.welcomeGradient} bg-clip-text text-2xl font-bold text-transparent sm:text-3xl`}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={`welcome-${lang}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {labels.welcomeMessage[lang]}
              </motion.span>
            </AnimatePresence>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-slate-300">
            {student.identity[lang]} ({labels.age[lang]} {student.age})
          </motion.p>

          <motion.p
            variants={fadeUp}
            className={`mt-3 flex flex-wrap items-center justify-center gap-2 text-slate-400`}
          >
            <Sparkles className={`h-4 w-4 ${themeSparkle[fallbackSlug]}`} />
            <AnimatePresence mode="wait">
              <motion.span
                key={lang}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="italic"
              >
                &ldquo;{student.philosophy[lang]}&rdquo;
              </motion.span>
            </AnimatePresence>
          </motion.p>

          {!exhibitionMode && (
          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 print:hidden"
          >
            {presentationVideo && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openVideo(presentationVideo)}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition ${themeWatchBtn[fallbackSlug]}`}
              >
                <Play className="h-4 w-4 fill-current" />
                {labels.watchVideo[lang]}
              </motion.button>
            )}
            <Link
              href={`/${fallbackSlug}/report`}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition ${student.reportBtn}`}
            >
              <ScrollText className="h-4 w-4" />
              {labels.annualReport[lang]}
            </Link>
          </motion.div>
          )}
        </motion.section>

        {/* Bento Gallery Grid — visible in both normal and Exhibition modes */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {/* Featured: Proud Achievements (large) */}
          {proudAchievements.map((item, i) => {
            const layoutId = `skill-proud-${item.title.en}-${i}`;
            const isExpanded = expandedSkill?.layoutId === layoutId;
            const img = item.images?.[0];
            return isExpanded ? null : (
              <motion.article
                key={`proud-${item.title.en}-${i}`}
                layoutId={layoutId}
                variants={fadeUp}
                whileHover={{ scale: 1.02 }}
                onClick={() => setExpandedSkill({ layoutId, item, categoryTitle: { en: "Proud Achievements", th: "ความภาคภูมิใจ" } })}
                className={`group col-span-2 row-span-2 flex min-h-[220px] cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white/5 p-0 backdrop-blur-md transition-all duration-300 ${themeCardGlow[fallbackSlug]}`}
              >
                <div className="relative h-32 min-h-[120px] flex-1 overflow-hidden sm:h-40">
                  {img ? (
                    <Image
                      src={img}
                      alt={item.title[lang]}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className={`flex h-full w-full items-center justify-center text-5xl ${themeInitial[fallbackSlug]}`}>
                      <Trophy className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <h3 className="font-semibold text-slate-100">{item.title[lang]}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{item.description[lang]}</p>
                </div>
              </motion.article>
            );
          })}

          {/* Active courses */}
          {safeActive.map((course) => (
            <motion.article
              key={String(course.id)}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              className={`group flex flex-col overflow-hidden rounded-2xl border bg-white/5 p-4 backdrop-blur-md transition-all duration-300 ${themeCardGlow[fallbackSlug]}`}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <GraduationCap className={`h-5 w-5 shrink-0 ${themeIconColor[fallbackSlug]}`} />
                <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${themeLetterBadge[fallbackSlug]}`}>
                  {course.letterGrade}
                </span>
              </div>
              <h3 className="font-semibold text-slate-100">{course.subject[lang]}</h3>
              <p className="text-xs text-slate-500">{course.grade[lang]}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800/80">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${course.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full ${student.progressBar}`}
                />
              </div>
              <p className={`mt-1 text-right text-xs font-semibold ${themeProgressText[fallbackSlug]}`}>{course.progress}%</p>
            </motion.article>
          ))}

          {/* Completed milestones */}
          {safeCompleted.map((course) => (
            <motion.article
              key={String(course.id)}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              className={`group flex flex-col overflow-hidden rounded-2xl border bg-white/5 p-4 backdrop-blur-md transition-all duration-300 ${themeCardGlow[fallbackSlug]}`}
            >
              <div className="mb-2 flex items-start justify-between">
                <Award className={`h-5 w-5 ${student.badgeText}/70`} />
                <span className="rounded-full border border-teal-500/40 bg-teal-500/15 px-2 py-0.5 text-xs font-bold text-teal-300">100%</span>
              </div>
              <h3 className="font-semibold text-slate-100">{course.subject[lang]}</h3>
              <p className="text-xs text-slate-400">{course.grade[lang]}</p>
              <p className="mt-1 text-xs text-slate-500">{course.completedDate[lang] || "—"}</p>
              {course.certificateUrl && (
                <button
                  onClick={() => openCertificate(course.certificateUrl!)}
                  className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-medium transition hover:bg-amber-400/20 ${student.badgeBorder} ${student.badgeBg} ${student.badgeText}`}
                >
                  <ScrollText className="h-3.5 w-3.5" />
                  {labels.viewCertificate[lang]}
                </button>
              )}
            </motion.article>
          ))}

          {/* All other categories: agri-science, adventure-fitness, life-skills */}
          {otherCategories.flatMap((cat) =>
            (cat.items ?? []).map((item, i) => {
              const layoutId = `skill-${cat.id}-${item.title.en}-${i}`;
              const isExpanded = expandedSkill?.layoutId === layoutId;
              const img = item.images?.[0];
              return isExpanded ? null : (
                <motion.article
                  key={`${cat.id}-${item.title.en}-${i}`}
                  layoutId={layoutId}
                  variants={fadeUp}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setExpandedSkill({ layoutId, item, categoryTitle: cat.title })}
                  className={`group flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white/5 backdrop-blur-md transition-all duration-300 ${themeCardGlow[fallbackSlug]}`}
                >
                  {img && (
                    <div className="relative h-24 w-full overflow-hidden rounded-t-2xl">
                      <Image
                        src={img}
                        alt={item.title[lang]}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="font-semibold text-slate-100">{item.title[lang]}</h3>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{item.description[lang]}</p>
                  </div>
                </motion.article>
              );
            })
          )}

          {!hasAnyContent && (
            <motion.div
              variants={fadeUp}
              className="col-span-full rounded-2xl border border-slate-500/20 bg-white/5 px-8 py-16 text-center backdrop-blur-md"
            >
              <p className="text-slate-400">No activities yet.</p>
              <p className="mt-1 text-sm text-slate-500">
                Add activities in the admin panel or check that Supabase is configured.
              </p>
            </motion.div>
          )}
        </motion.section>
      </main>

      <AnimatePresence>
        {expandedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setExpandedSkill(null)}
          >
            <motion.div
              layoutId={expandedSkill.layoutId}
              layout
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`mx-auto grid h-[85vh] w-[95vw] max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border bg-white/5 shadow-2xl backdrop-blur-md md:grid-cols-2 ${themeCardGlow[fallbackSlug]}`}
            >
              <div className="overflow-y-auto p-6 md:p-10">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h2 className="text-xl font-bold text-slate-100 md:text-2xl">
                    {expandedSkill.item.title.en}
                  </h2>
                  <button
                    onClick={() => setExpandedSkill(null)}
                    className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-slate-100"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="mb-2 text-sm text-slate-400">{expandedSkill.item.title.th}</p>
                <p className="mb-4 text-sm font-medium text-slate-300">
                  {expandedSkill.categoryTitle.en} / {expandedSkill.categoryTitle.th}
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Description (EN)</h3>
                    <p className="text-slate-200">{expandedSkill.item.description.en}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">คำอธิบาย (TH)</h3>
                    <p className="text-slate-200">{expandedSkill.item.description.th}</p>
                  </div>
                </div>
              </div>
              <div className="relative flex min-h-[300px] w-full flex-col border-t border-slate-500/20 p-6 md:border-l md:border-t-0">
                <div className="h-full min-h-0 w-full flex-1" style={{ width: "100%", height: "100%" }}>
                  <SkillCarousel
                    images={expandedSkill.item.images ?? []}
                    videoUrl={expandedSkill.item.videoUrl}
                    themeGlow={themeCardGlow[fallbackSlug]}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <VideoModal open={videoOpen} onOpenChange={setVideoOpen} url={videoUrl} />
      <CertificateModal
        open={certOpen}
        onOpenChange={setCertOpen}
        url={certUrl}
        urls={galleryUrls ?? undefined}
      />
    </div>
  );
}
