"use client";

import { useState } from "react";

/** Top app bar — converted from the <header> in labologics-preview.html. */
export default function Header() {
  const [showNotice, setShowNotice] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 px-5 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 text-sm text-white shadow-sm shadow-teal-500/30">
          <span aria-hidden="true">🔬</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Labologics</h1>
      </div>
      <div className="relative">
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setShowNotice((v) => !v)}
          className="rounded-full p-2 text-slate-400 transition hover:bg-slate-50 hover:text-teal-600"
        >
          <span aria-hidden="true" className="text-xl leading-none">🔔</span>
        </button>
        {showNotice && (
          <div className="absolute right-0 top-11 w-64 rounded-2xl border border-slate-100 bg-white p-4 text-sm shadow-xl">
            <p className="font-bold text-slate-900">Notifications</p>
            <p className="mt-1 leading-relaxed text-slate-500">
              No new notifications. New analyses and price updates will appear here.
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
