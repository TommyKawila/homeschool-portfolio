"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  BookOpen,
  Sprout,
  Home,
  Sparkles,
  Moon,
  Heart,
  Star,
  Rocket,
  GraduationCap,
  Printer,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { gpa, annualReport, labels } from "@/data/studentData";
import type { Lang, Bilingual } from "@/data/studentData";
import { fetchReportSections, type ReportSectionsMap } from "@/lib/portfolio";
import { usePortfolio } from "@/lib/usePortfolio";
import { getStudent, isValidStudentSlug } from "@/lib/students";
import { LanguageToggle } from "@/components/LanguageToggle";
import Link from "next/link";

const iconMap: Record<string, typeof BookOpen> = {
  "book-open": BookOpen,
  sprout: Sprout,
  home: Home,
  sparkles: Sparkles,
  moon: Moon,
};

const fade = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.03 * i, duration: 0.25 },
});

function Section({
  icon: Icon,
  title,
  children,
  index,
  iconColor,
}: {
  icon: typeof BookOpen;
  title: string;
  children: React.ReactNode;
  index: number;
  iconColor: string;
}) {
  return (
    <motion.section
      {...fade(index)}
      className="report-card rounded-lg border border-slate-500/20 bg-slate-900/30 p-3 text-sm print:rounded print:border print:border-gray-300 print:bg-white print:p-2 print:text-[11px]"
    >
      <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-200 print:mb-1 print:!text-black print:[&_svg]:!text-black">
        <Icon className={`h-3.5 w-3.5 shrink-0 ${iconColor}`} />
        {title}
      </h3>
      {children}
    </motion.section>
  );
}

function Pills({ items, lang }: { items: Bilingual[]; lang: Lang }) {
  return (
    <div className="flex flex-wrap gap-1 print:gap-0.5">
      {items.map((item) => (
        <span
          key={item.en}
          className="rounded border border-slate-500/30 bg-slate-800/40 px-2 py-0.5 text-xs text-slate-300 print:!border-gray-400 print:!bg-transparent print:!text-black"
        >
          {item[lang]}
        </span>
      ))}
    </div>
  );
}

function BulletList({ items, lang }: { items: Bilingual[]; lang: Lang }) {
  return (
    <ul className="space-y-0.5 text-sm text-slate-300 print:!text-black print:text-[11px]">
      {items.map((item) => (
        <li key={item.en} className="flex items-start gap-1.5">
          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-teal-500 print:!text-black" strokeWidth={1.5} />
          <span>{item[lang]}</span>
        </li>
      ))}
    </ul>
  );
}

const checkIconClass =
  "mt-0.5 h-3 w-3 shrink-0 text-teal-500 print:!text-black";
const checkIconClassAmber =
  "mt-0.5 h-3 w-3 shrink-0 text-amber-400 print:!text-black";

function BulletListFromText({
  text,
  iconClassName = checkIconClass,
}: {
  text: string;
  iconClassName?: string;
}) {
  const items = text.trim().split(/\n/).filter(Boolean);
  return (
    <ul className="space-y-0.5 text-sm text-slate-300 print:!text-black print:text-[11px]">
      {items.map((line, i) => (
        <li key={i} className="flex items-start gap-1.5">
          <CheckCircle2
            className={iconClassName}
            strokeWidth={1.5}
          />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

export default function StudentReportPage() {
  const params = useParams();
  const studentSlug = (params?.student as string) ?? "mata";
  const themeStudent = getStudent(studentSlug);
  const student = themeStudent ?? getStudent("mata")!;

  const [lang, setLang] = useState<Lang>("en");
  const [reportSections, setReportSections] = useState<ReportSectionsMap>({});
  const { profilePhoto, gpaValue } = usePortfolio(studentSlug);
  const ar = annualReport;
  let idx = 0;

  useEffect(() => {
    fetchReportSections(studentSlug).then(setReportSections);
  }, [studentSlug]);

  if (!themeStudent || !isValidStudentSlug(studentSlug)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">Student not found.</p>
      </div>
    );
  }

  return (
    <div className="report-page relative min-h-screen bg-slate-950 text-sm print:!min-h-0 print:!bg-white print:!text-[11px]">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-25 print:hidden"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(1.5px 1.5px at 20% 30%, rgba(251,191,36,0.3), transparent),
            radial-gradient(1.5px 1.5px at 60% 70%, rgba(167,139,250,0.2), transparent)`,
          backgroundSize: "200px 200px",
        }}
      />

      <header className="sticky top-0 z-30 border-b border-slate-500/20 bg-slate-900/70 px-4 py-2.5 backdrop-blur-md print:!hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href={`/${studentSlug}`}
            className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            {labels.viewFullJourney[lang]}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle lang={lang} onSelect={setLang} variant="dark" />
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20"
            >
              <Printer className="h-3.5 w-3.5" />
              {labels.downloadPdf[lang]}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-4xl flex-col px-4 py-6 print:!max-w-none print:!flex-1 print:!gap-2 print:!p-0">
        <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-widest text-slate-500 print:!mb-1 print:!text-black">
          Martha&apos;s Learning Universe
        </p>

        <motion.div
          {...fade(idx++)}
          className="report-header mb-4 flex items-center gap-5 rounded-lg border border-slate-500/20 bg-slate-900/40 p-4 print:!mb-2 print:!flex print:!border-gray-300 print:!bg-white print:!gap-4 print:!p-3"
        >
          <div className="report-photo-keep-color relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full border border-slate-500/30 bg-slate-800 print:!border-gray-300">
            {profilePhoto ? (
              <Image src={profilePhoto} alt="" fill className="object-cover" sizes="120px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-amber-400/80 print:!text-black">
                {student.name.en.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-slate-100 print:!text-base print:!text-black">
              {student.name[lang]}
            </h1>
            <p className="mt-0.5 text-sm text-slate-400 print:!text-black">
              {ar.studentLevel[lang]} · {ar.academicYear[lang]}
            </p>
            <div className="mt-2 inline-block rounded border-2 border-amber-400/50 bg-amber-500/10 px-3 py-1 text-lg font-bold text-amber-400 print:!border-black print:!bg-transparent print:!text-black">
              {gpa.label[lang]} {gpaValue.toFixed(2)}
            </div>
          </div>
        </motion.div>

        <div className="grid flex-1 gap-3 gap-y-3 sm:grid-cols-2 print:!grid-cols-2 print:!gap-2">
          <Section
            icon={GraduationCap}
            title={ar.coreCurriculum.heading[lang]}
            index={idx++}
            iconColor="text-teal-400"
          >
            <Pills items={ar.coreCurriculum.items} lang={lang} />
          </Section>

          <Section
            icon={BookOpen}
            title={ar.integratedSkills.heading[lang]}
            index={idx++}
            iconColor="text-fuchsia-400"
          >
            {reportSections.integrated_skills?.[lang]?.trim() ? (
              <BulletListFromText
                text={reportSections.integrated_skills[lang]}
                iconClassName={checkIconClassAmber}
              />
            ) : (
              <ul className="space-y-0.5 text-sm text-slate-300 print:!text-black print:text-[11px]">
                {ar.integratedSkills.sections.map((sec) => (
                  <li key={sec.title.en} className="list-none">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2
                        className={checkIconClassAmber}
                        strokeWidth={1.5}
                      />
                      <span className="text-xs font-semibold text-slate-400 print:!text-black">
                        {sec.title[lang]}
                      </span>
                    </div>
                    {sec.items && (
                      <ul className="ml-5 mt-0.5 space-y-0.5">
                        {sec.items.map((it) => (
                          <li
                            key={it.en}
                            className="flex items-start gap-1.5 print:text-[11px]"
                          >
                            <CheckCircle2
                              className={checkIconClassAmber}
                              strokeWidth={1.5}
                            />
                            <span className="text-xs text-slate-400 print:!text-black">
                              {it[lang]}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section
            icon={Heart}
            title={ar.wellness.heading[lang]}
            index={idx++}
            iconColor="text-teal-400"
          >
            {reportSections.wellness?.[lang]?.trim() ? (
              <BulletListFromText text={reportSections.wellness[lang]} />
            ) : (
              <>
                <BulletList items={ar.wellness.items} lang={lang} />
                <p className="mt-1 text-[11px] italic text-slate-500 print:!text-black">
                  {ar.wellness.note[lang]}
                </p>
              </>
            )}
          </Section>

          <Section
            icon={Star}
            title={ar.strengths.heading[lang]}
            index={idx++}
            iconColor="text-amber-400"
          >
            {reportSections.strengths?.[lang]?.trim() ? (
              <BulletListFromText text={reportSections.strengths[lang]} />
            ) : (
              <BulletList items={ar.strengths.items} lang={lang} />
            )}
          </Section>
        </div>

        <Section
          icon={Rocket}
          title={ar.futurePlan.heading[lang]}
          index={idx++}
          iconColor="text-fuchsia-400"
        >
          {reportSections.future_plan?.[lang]?.trim() ? (
            <BulletListFromText text={reportSections.future_plan[lang]} />
          ) : (
            <BulletList items={ar.futurePlan.items} lang={lang} />
          )}
        </Section>

        <div className="report-signature-block mt-6 border-t border-slate-500/25 pt-4 text-center print:!mt-auto print:!border-gray-300 print:!pt-2">
          <div className="mx-auto w-40 border-b border-slate-500/40 pb-0.5 print:!border-black" />
          {reportSections.signature?.[lang]?.trim() ? (
            (() => {
              const lines = reportSections.signature[lang].trim().split(/\n/).filter(Boolean);
              return (
                <>
                  <p className="mt-1.5 text-xs font-semibold text-slate-200 print:!text-black">
                    {lines[0]}
                  </p>
                  {lines[1] && (
                    <p className="text-[11px] text-slate-500 print:!text-black">{lines[1]}</p>
                  )}
                </>
              );
            })()
          ) : (
            <>
              <p className="mt-1.5 text-xs font-semibold text-slate-200 print:!text-black">
                {ar.signature.name[lang]}
              </p>
              <p className="text-[11px] text-slate-500 print:!text-black">
                {ar.signature.role[lang]}
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
