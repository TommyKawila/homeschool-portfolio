"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export function CertificateModal({
  open,
  onOpenChange,
  url,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string | null;
}) {
  if (!url) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content asChild>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="flex max-h-[calc(100vh-8rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-amber-400/30 bg-slate-900 shadow-[0_0_40px_rgba(251,191,36,0.12)]"
            >
              <Dialog.Title className="sr-only">Certificate</Dialog.Title>
              <Dialog.Description className="sr-only">
                Certificate of completion
              </Dialog.Description>
              <div className="flex h-16 flex-none items-center justify-between px-3">
                <span aria-hidden className="w-9" />
                <Dialog.Close asChild>
                  <button
                    className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-700/50 hover:text-slate-200"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </div>
              <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-gray-900 p-4">
                <div className="flex flex-1 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt="Certificate"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
