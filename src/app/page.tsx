"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { STUDENTS } from "@/lib/students";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/mata");
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--bg)] px-4">
      <p className="text-slate-400">Redirecting…</p>
      <div className="flex gap-3">
        <Link
          href="/mata"
          className="rounded-lg border border-slate-500/30 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700/50"
        >
          {STUDENTS.mata.name.en}
        </Link>
        <Link
          href="/punna"
          className="rounded-lg border border-slate-500/30 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700/50"
        >
          {STUDENTS.punna.name.en}
        </Link>
      </div>
    </div>
  );
}
