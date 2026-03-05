"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import type { Lang } from "@/data/studentData";
import { labels } from "@/data/studentData";

export function ReportModeToggle({
  reportMode,
  onToggle,
  lang,
}: {
  reportMode: boolean;
  onToggle: () => void;
  lang: Lang;
}) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-2 rounded-full border border-slate-500/30 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-300 shadow-sm backdrop-blur-sm transition hover:border-slate-400/40 hover:bg-slate-700/50 hover:text-slate-200 print:hidden"
      aria-pressed={reportMode}
    >
      <FileText className="h-4 w-4" />
      {reportMode ? labels.dashboard[lang] : labels.reportMode[lang]}
    </motion.button>
  );
}
