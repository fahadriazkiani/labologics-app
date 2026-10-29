"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import LoginForm from "@/components/LoginForm";
import type { SavedReport, TabId } from "@/lib/types";

interface ProfileScreenProps {
  reports: SavedReport[];
  onSwitchTab: (tab: TabId) => void;
}

/** Profile — screen-profile from labologics-preview.html, wired to Supabase Auth. */
export default function ProfileScreen({ reports, onSwitchTab }: ProfileScreenProps) {
  const { user, configured, loading, signOut, displayName } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [signedOut, setSignedOut] = useState(false);

  const initials = displayName
    ? displayName.slice(0, 2).toUpperCase()
    : user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : "GU";
  const fullName = displayName || user?.email?.split("@")[0] || "Guest";

  async function handleSignOut() {
    await signOut();
    setSignedOut(true);
  }

  return (
    <div className="px-5 pb-4 pt-6 animate-fade-in">
      {!configured && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
          <strong>Demo mode.</strong> Supabase is not configured in this
          deployment, so sign-in is unavailable and reports stay on this
          device. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, run{" "}
          <code>supabase/schema.sql</code>, and redeploy to enable accounts.
        </div>
      )}

      <div className="relative mb-6 rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-tr from-teal-500 to-blue-500 text-3xl font-bold text-white shadow-lg shadow-teal-500/20">
          {user ? initials : "👤"}
        </div>
        <h2 className="mb-1 text-2xl font-bold text-slate-900">
          {user ? fullName : "Welcome to Labologics"}
        </h2>
        <p className="text-sm font-medium text-slate-500">
          {user ? user.email : "Sign in to save reports across devices"}
        </p>
        <div className="mt-6 flex justify-center gap-6 border-t border-slate-200/60 pt-6">
          <div className="flex-1 text-center">
            <p className="text-xl font-bold text-slate-900">{reports.length}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">Reports</p>
          </div>
          <div className="w-px bg-slate-200" />
          <div className="flex-1 text-center">
            <p className="text-xl font-bold text-slate-900">
              {reports.filter((r) => r.language.includes("Urdu")).length}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">Urdu summaries</p>
          </div>
        </div>
      </div>

      {!user && configured && !loading && (
        <div className="mb-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-slate-900">Sign in</h3>
          {signedOut && (
            <p className="mb-3 text-sm text-slate-500">You have signed out.</p>
          )}
          <LoginForm />
        </div>
      )}

      <h3 className="mb-3 px-2 text-lg font-bold text-slate-900">Settings &amp; Preferences</h3>
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => onSwitchTab("home")}
          className="flex w-full items-center justify-between border-b border-slate-50 p-5 transition hover:bg-slate-50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500">👤</div>
            <span className="text-[15px] font-bold text-slate-700">My Reports</span>
          </div>
          <span className="text-sm text-slate-300" aria-hidden="true">›</span>
        </button>
        <button
          type="button"
          onClick={() => onSwitchTab("tests")}
          className="flex w-full items-center justify-between border-b border-slate-50 p-5 transition hover:bg-slate-50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500">📁</div>
            <span className="text-[15px] font-bold text-slate-700">Medical Records Vault</span>
          </div>
          <span className="text-sm text-slate-300" aria-hidden="true">›</span>
        </button>
        <button
          type="button"
          onClick={() => setNotifications((v) => !v)}
          aria-pressed={notifications}
          className="flex w-full items-center justify-between border-b border-slate-50 p-5 transition hover:bg-slate-50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500">🔔</div>
            <span className="text-[15px] font-bold text-slate-700">Notifications</span>
          </div>
          <span
            className={`relative h-6 w-11 rounded-full transition ${notifications ? "bg-teal-600" : "bg-slate-300"}`}
            aria-hidden="true"
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                notifications ? "left-[22px]" : "left-0.5"
              }`}
            />
          </span>
        </button>
        {user ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="group flex w-full items-center justify-between p-5 text-red-500 transition hover:bg-red-50/50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-sm transition group-hover:bg-red-100">
                ⎋
              </div>
              <span className="text-[15px] font-bold">Log Out</span>
            </div>
          </button>
        ) : (
          <p className="p-5 text-sm leading-relaxed text-slate-500">
            You are browsing as a guest. Analyses work without an account;
            saved reports stay on this device until you sign in.
          </p>
        )}
      </div>

      <p className="mt-6 px-2 text-center text-xs leading-relaxed text-slate-400">
        Labologics by Fahad Riaz Kiani — MLS, Founder Insilicologics +
        Labologics Academy. AI summaries are educational only and never
        replace a physician.
      </p>
    </div>
  );
}
