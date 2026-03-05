"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";

/** Props for react-player (v3 uses `src`). Used to type the dynamic import. */
type ReactPlayerProps = {
  url?: string;
  src?: string;
  width?: string;
  height?: string;
  controls?: boolean;
  playing?: boolean;
  onError?: () => void;
  className?: string;
};

const ReactPlayer = dynamic<ReactPlayerProps>(
  () => import("react-player").then((mod) => mod.default as ComponentType<ReactPlayerProps>),
  { ssr: false }
);

export function VideoModal({
  open,
  onOpenChange,
  url,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string | null;
}) {
  const [error, setError] = useState(false);

  if (!url) return null;

  const rawUrl = url.trim();
  const showFallback = error || !rawUrl;

  useEffect(() => {
    setError(false);
  }, [url]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-500/30 bg-slate-900/90 p-0 shadow-2xl backdrop-blur-md"
          >
            <Dialog.Title className="sr-only">Video player</Dialog.Title>
            <Dialog.Description className="sr-only">Watch video content</Dialog.Description>
            <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-slate-800">
              {showFallback ? (
                <div className="flex flex-col items-center justify-center gap-2 p-6 text-center text-slate-400">
                  <p className="text-sm">Video not available</p>
                </div>
              ) : (
                <ReactPlayer
                  src={rawUrl}
                  width="100%"
                  height="100%"
                  controls
                  playing={open}
                  onError={() => setError(true)}
                  className="absolute left-0 top-0"
                />
              )}
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
