"use client";

import Link from "next/link";
import { STUDENTS } from "@/lib/students";

export default function LobbyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <h1 className="mb-12 text-center text-2xl font-light tracking-wide text-stone-700 sm:text-3xl">
          Kawila Sisters&apos; Learning Journey
        </h1>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
          <Link
            href="/mata"
            className="group flex flex-col items-center rounded-2xl border border-stone-200 bg-white p-8 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/10"
          >
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-stone-200 bg-stone-100 transition-colors group-hover:border-amber-300">
              <span className="flex h-full w-full items-center justify-center text-3xl font-light text-amber-600/80">
                {STUDENTS.mata.name.en.charAt(0)}
              </span>
            </div>
            <span className="text-lg font-medium text-stone-700 group-hover:text-amber-700">
              Mata&apos;s Universe
            </span>
          </Link>

          <Link
            href="/punna"
            className="group flex flex-col items-center rounded-2xl border border-stone-200 bg-white p-8 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-stone-200 bg-stone-100 transition-colors group-hover:border-cyan-300">
              <span className="flex h-full w-full items-center justify-center text-3xl font-light text-cyan-600/80">
                {STUDENTS.punna.name.en.charAt(0)}
              </span>
            </div>
            <span className="text-lg font-medium text-stone-700 group-hover:text-cyan-700">
              Punna&apos;s Universe
            </span>
          </Link>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-stone-400">
        Homeschooling with Love by Tommy &amp; Family
      </footer>
    </div>
  );
}
