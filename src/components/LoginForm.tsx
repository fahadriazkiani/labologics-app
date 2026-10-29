"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Supabase Auth: email + password sign-in / sign-up, plus magic link.
 * When Supabase is not configured, this form is not rendered — callers
 * show the guest/demo state instead (see ProfileScreen).
 */
export default function LoginForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup" | "magic">("signin");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase is not configured yet. Add the env vars in .env.local.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "magic") {
        const { error: err } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (err) throw err;
        setStatus("Check your email for a sign-in link.");
      } else if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        setStatus(
          "Account created. Check your email to confirm, then sign in.",
        );
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        setStatus("Signed in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        {(
          [
            ["signin", "Sign in"],
            ["signup", "Sign up"],
            ["magic", "Magic link"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition ${
              mode === key
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] font-medium text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
      </label>

      {mode !== "magic" && (
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] font-medium text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </label>
      )}

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      {status && (
        <p role="status" className="rounded-xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700">
          {status}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-2xl bg-slate-900 py-3.5 font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 disabled:opacity-50"
      >
        {busy
          ? "Please wait…"
          : mode === "magic"
            ? "Send sign-in link"
            : mode === "signup"
              ? "Create account"
              : "Sign in"}
      </button>

      {!compact && (
        <p className="text-center text-xs leading-relaxed text-slate-400">
          Your reports are private to your account. Labologics never sells
          health data. See the disclaimer on every analysis.
        </p>
      )}
    </form>
  );
}
