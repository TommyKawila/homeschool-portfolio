"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { labels } from "@/data/studentData";
import type { Lang, ActiveCourse, CompletedCourse } from "@/data/studentData";

export function AcellusModal({
  open,
  onOpenChange,
  lang,
  activeCourses,
  completedCourses,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: Lang;
  activeCourses: ActiveCourse[];
  completedCourses: CompletedCourse[];
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-violet fixed top-[50%] left-[50%] z-50 flex max-h-[90dvh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-violet-400/20 shadow-2xl backdrop-blur-xl"
          >
            <Dialog.Title className="sr-only">
              Academic Performance Report - Martha Kawila
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Detailed view of Martha&apos;s grades and course completion from Acellus Power Home School.
            </Dialog.Description>

            {/* Sticky header */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-500/25 bg-slate-800/90 px-6 py-4 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-slate-100">{labels.acellusReport[lang]}</h2>
              <Dialog.Close asChild>
                <button
                  className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-600/50 hover:text-slate-200"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-6 py-4">
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <span className="rounded bg-violet-500/25 px-2 py-0.5 text-xs font-medium text-violet-300">
                    {labels.activeCourses[lang]}
                  </span>
                </h3>
                <div className="grid gap-3">
                  {activeCourses.map((row) => (
                    <div
                    key={row.id}
                    className="rounded-lg border border-slate-500/25 bg-slate-700/40 px-3 py-2.5"
                    >
                      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium text-slate-200">{row.subject[lang]}</span>
                        <span className="rounded border border-violet-500/40 bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-300">
                          {row.letterGrade}
                        </span>
                      </div>
                      <p className="mb-1.5 text-xs text-slate-400">{row.grade[lang]}</p>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-600">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${row.progress}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-full rounded-full bg-violet-500/80"
                        />
                      </div>
                      <p className="mt-1 text-right text-xs text-slate-500">{row.progress}%</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-6 border-t border-slate-500/25 pt-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <span className="rounded bg-teal-500/25 px-2 py-0.5 text-xs font-medium text-teal-300">
                    {labels.completedCourses[lang]}
                  </span>
                </h3>
                <ul className="space-y-2">
                  {completedCourses.map((row) => (
                    <li
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-700/40 px-3 py-2.5 text-sm"
                    >
                      <span className="font-medium text-slate-200">{row.subject[lang]}</span>
                      <span className="text-slate-400">{row.grade[lang]}</span>
                      <span className="rounded border border-teal-500/40 bg-teal-500/20 px-2 py-0.5 text-xs font-medium text-teal-300">
                        100% · {row.completedDate[lang]}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
