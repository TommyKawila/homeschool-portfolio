"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Loader2, AlertCircle } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const sb = getSupabase();
    const { error: authError } = await sb.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm rounded-2xl border border-slate-500/25 bg-slate-800/50 p-8 shadow-2xl backdrop-blur-md"
      >
        <h1 className="mb-1 text-xl font-semibold text-slate-100">Admin Login</h1>
        <p className="mb-6 text-sm text-slate-400">Mata Panna Homeschool</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-500/30 bg-slate-700/50 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-500/30 bg-slate-700/50 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-900/40 px-3 py-2 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
}
