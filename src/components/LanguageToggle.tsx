"use client";

import { motion } from "framer-motion";
import type { Lang } from "@/data/studentData";

export function LanguageToggle({
  lang,
  onSelect,
  variant = "dark",
}: {
  lang: Lang;
  onSelect: (l: Lang) => void;
  variant?: "dark" | "light";
}) {
  const isDark = variant === "dark";
  return (
    <div
      className={`flex print:hidden items-center rounded-full p-0.5 backdrop-blur-sm ${
        isDark
          ? "border border-slate-500/30 bg-slate-800/50"
          : "border border-pink-300/40 bg-white/60"
      }`}
    >
      <div className="relative flex">
        <motion.span
          className={`absolute inset-y-0.5 rounded-full ${
            isDark
              ? "bg-teal-500/25 shadow-[0_0_12px_rgba(45,212,191,0.15)]"
              : "bg-pink-500/20 shadow-[0_0_12px_rgba(236,72,153,0.1)]"
          }`}
          initial={false}
          animate={{
            left: lang === "th" ? 4 : "50%",
            width: "calc(50% - 6px)",
          }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        />
        <motion.button
          type="button"
          onClick={() => onSelect("th")}
          className={`relative z-10 px-3 py-1.5 text-xs font-medium transition-colors ${
            lang === "th"
              ? isDark ? "text-slate-100" : "text-pink-800"
              : isDark ? "text-slate-500" : "text-stone-400"
          }`}
          aria-pressed={lang === "th"}
          aria-label="ภาษาไทย"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          TH
        </motion.button>
        <motion.button
          type="button"
          onClick={() => onSelect("en")}
          className={`relative z-10 px-3 py-1.5 text-xs font-medium transition-colors ${
            lang === "en"
              ? isDark ? "text-slate-100" : "text-pink-800"
              : isDark ? "text-slate-500" : "text-stone-400"
          }`}
          aria-pressed={lang === "en"}
          aria-label="English"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          EN
        </motion.button>
      </div>
    </div>
  );
}
