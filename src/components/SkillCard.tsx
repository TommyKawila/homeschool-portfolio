"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronDown, ChevronUp, Play } from "lucide-react";
import type { Lang, SkillCategory } from "@/data/studentData";
import { labels } from "@/data/studentData";

export function SkillCard({
  category,
  lang,
  onPlayVideo,
  onViewImage,
}: {
  category: SkillCategory;
  lang: Lang;
  onPlayVideo?: (url: string) => void;
  onViewImage?: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      className="glass-white overflow-hidden rounded-xl shadow-lg transition-shadow hover:border-white/20 hover:shadow-[0_0_24px_rgba(255,255,255,0.06)]"
      initial={false}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-100">{category.title[lang]}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-500/20"
          >
            <ul className="space-y-0 divide-y divide-slate-500/15">
              {category.items.map((item) => {
                const hasMedia = (item.image && onViewImage) || (item.videoUrl && onPlayVideo);
                return (
                  <li key={item.title.en} className="px-5 py-3">
                    <div className="flex gap-3">
                      {item.image && (
                        <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-700/50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.title[lang]} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-slate-200">{item.title[lang]}</span>
                        <p className="mt-0.5 text-sm text-slate-400">{item.description[lang]}</p>
                        {hasMedia && (
                          <div className="mt-2 flex items-center gap-2 print:hidden">
                            {item.image && onViewImage && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onViewImage(item.image!); }}
                                className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm transition hover:bg-white/20 hover:text-slate-100"
                                aria-label={labels.viewPhoto[lang]}
                              >
                                <Camera className="h-3 w-3" />
                                {labels.viewPhoto[lang]}
                              </button>
                            )}
                            {item.videoUrl && onPlayVideo && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onPlayVideo(item.videoUrl!); }}
                                className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm transition hover:bg-white/20 hover:text-slate-100"
                                aria-label={labels.watchClip[lang]}
                              >
                                <Play className="h-3 w-3 fill-current" />
                                {labels.watchClip[lang]}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
