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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { gpa, labels } from "@/data/studentData";
import type { Lang } from "@/data/studentData";
import { usePortfolio } from "@/lib/usePortfolio";
import { getStudent, isValidStudentSlug } from "@/lib/students";
import { SkillCard } from "@/components/SkillCard";
import { ReportModeToggle } from "@/components/ReportModeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { VideoModal } from "@/components/VideoModal";
import { CertificateModal } from "@/components/CertificateModal";

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
  mata: "text-teal-400",
  punna: "text-pink-400",
};

const themeWatchBtn: Record<string, string> = {
  mata: "border-teal-500/40 bg-teal-500/10 text-teal-300 hover:border-teal-400/50 hover:bg-teal-500/20 hover:shadow-[0_0_28px_rgba(45,212,191,0.2)] shadow-[0_0_20px_rgba(45,212,191,0.15)]",
  punna: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:border-cyan-400/50 hover:bg-cyan-500/20 hover:shadow-[0_0_28px_rgba(34,211,238,0.2)] shadow-[0_0_20px_rgba(34,211,238,0.15)]",
};

const themeReportBtn: Record<string, string> = {
  mata: "border-pink-500/40 bg-pink-500/10 text-pink-300 hover:border-pink-400/50 hover:bg-pink-500/20",
  punna: "border-pink-500/40 bg-pink-500/10 text-pink-300 hover:border-pink-400/50 hover:bg-pink-500/20",
};

const themeInitial: Record<string, string> = {
  mata: "text-violet-300/60",
  punna: "text-cyan-300/60",
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
  const [certOpen, setCertOpen] = useState(false);
  const { gpaValue, presentationVideo, profilePhoto, active, completed, skills } =
    usePortfolio(studentSlug);

  const openVideo = (url: string) => {
    setVideoUrl(url);
    setVideoOpen(true);
  };

  const openCertificate = (url: string) => {
    setCertUrl(url);
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

  /* ── Main Dashboard ── */
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-30 border-b border-slate-500/20 bg-slate-900/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
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
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mb-14 flex flex-col items-center text-center"
        >
          <motion.div variants={fadeUp} className="relative mb-6">
            <div className="profile-ring">
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
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition ${themeReportBtn[fallbackSlug]}`}
            >
              <ScrollText className="h-4 w-4" />
              {labels.annualReport[lang]}
            </Link>
          </motion.div>
        </motion.section>

        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mb-14"
        >
          <motion.div
            variants={fadeUp}
            className="mb-5 flex items-center justify-between"
          >
            <h2 className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400`}>
              <GraduationCap className={`h-4 w-4 ${themeIconColor[fallbackSlug]}`} />
              {labels.activeCourses[lang]}
            </h2>
            <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${student.badgeBorder} ${student.badgeBg} ${student.badgeText} shadow-[0_0_16px_rgba(251,191,36,0.15)]`}>
              <Star className={`h-3 w-3 fill-current ${student.badgeText}`} />
              {gpa.label[lang]} {gpaValue.toFixed(2)}
            </span>
          </motion.div>

          {active.length === 0 ? (
            <motion.p
              variants={fadeUp}
              className="py-10 text-center text-sm text-slate-500"
            >
              No active courses this week.
            </motion.p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {active.map((course) => (
                <motion.div
                  key={String(course.id)}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card group rounded-2xl p-5 transition ${student.cardGlow}`}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold leading-tight text-slate-100">
                        {course.subject[lang]}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">{course.grade[lang]}</p>
                    </div>
                    <span className={`flex-shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${themeLetterBadge[fallbackSlug]}`}>
                      {course.letterGrade}
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-slate-700/60">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${course.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      className={`progress-glow h-full rounded-full bg-gradient-to-r ${student.progressBar}`}
                    />
                  </div>
                  <p className={`mt-2 text-right text-sm font-semibold ${themeProgressText[fallbackSlug]}`}>
                    {course.progress}%
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mb-14"
        >
          <motion.h2
            variants={fadeUp}
            className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400"
          >
            <Trophy className={`h-4 w-4 ${student.badgeText}/80`} />
            {labels.milestones[lang]}
          </motion.h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completed.map((course) => (
              <motion.div
                key={String(course.id)}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="glass-gold group rounded-2xl p-5 transition hover:shadow-[0_0_40px_rgba(251,191,36,0.15)]"
              >
                <div className="mb-3 flex items-start justify-between">
                  <Award className={`h-6 w-6 ${student.badgeText}/70`} />
                  <span className="rounded-full border border-teal-500/40 bg-teal-500/15 px-2.5 py-0.5 text-xs font-bold text-teal-300">
                    100%
                  </span>
                </div>
                <h3 className="mb-1 font-semibold text-slate-100">
                  {course.subject[lang]}
                </h3>
                <p className="text-xs text-slate-400">{course.grade[lang]}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {course.completedDate[lang] || "—"}
                </p>
                {course.certificateUrl && (
                  <button
                    onClick={() => openCertificate(course.certificateUrl!)}
                    className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-medium transition hover:bg-amber-400/20 ${student.badgeBorder} ${student.badgeBg} ${student.badgeText}`}
                  >
                    <ScrollText className="h-3.5 w-3.5" />
                    {labels.viewCertificate[lang]}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-xs font-medium uppercase tracking-wider text-slate-400"
          >
            {labels.practicalSkillModules[lang]}
          </motion.h2>
          <div className="space-y-3">
            {skills.map((category) => (
              <motion.div key={category.id} variants={fadeUp}>
                <SkillCard
                  category={category}
                  lang={lang}
                  onPlayVideo={openVideo}
                  onViewImage={openCertificate}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <VideoModal open={videoOpen} onOpenChange={setVideoOpen} url={videoUrl} />
      <CertificateModal
        open={certOpen}
        onOpenChange={setCertOpen}
        url={certUrl}
      />
    </div>
  );
}
