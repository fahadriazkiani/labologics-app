"use client";

import { useState } from "react";
import { DEMO_REPORTS } from "@/lib/suggestions";
import type { SavedReport, TabId } from "@/lib/types";

interface HomeScreenProps {
  displayName: string;
  reports: SavedReport[];
  reportsLoading: boolean;
  onSwitchTab: (tab: TabId) => void;
  onOpenReport: (report: SavedReport) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function HomeScreen({
  displayName,
  reports,
  reportsLoading,
  onSwitchTab,
  onOpenReport,
}: HomeScreenProps) {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const demoSummaries: Record<string, string> = {
    "demo-cbc":
      "Sample report. Haemoglobin and white cell count were within range in this example. Upload your own CBC with the AI Interpreter to get your personal summary in English or Urdu.",
    "demo-lipid":
      "Sample report. Total cholesterol and LDL were flagged for review in this example. Upload your own Lipid Profile with the AI Interpreter to get your personal summary.",
  };

  return (
    <div className="px-5 pb-4 pt-6 animate-fade-in">
      <h2 className="mb-1 text-2xl font-bold text-slate-900">
        Hello{displayName ? `, ${displayName}` : ""}! ✨
      </h2>
      <p className="mb-6 text-sm font-medium text-slate-500">Your health dashboard is ready.</p>

      {/* Hero Card — from labologics-preview.html */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 to-slate-800 p-6 text-white shadow-lg shadow-blue-900/20">
        <div className="relative z-10">
          <span className="mb-3 inline-block rounded-full border border-teal-500/30 bg-teal-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-300">
            New Feature
          </span>
          <h3 className="mb-2 text-xl font-bold">Understand your labs</h3>
          <p className="mb-5 max-w-[85%] text-sm leading-relaxed text-slate-300">
            Upload your medical reports and get an instant, plain-English summary powered by AI.
          </p>
          <button
            type="button"
            onClick={() => onSwitchTab("interpreter")}
            className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-500/30 transition-all hover:bg-teal-400"
          >
            Try AI Interpreter <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="absolute -bottom-5 -right-5 h-40 w-40 rounded-full bg-teal-500/20 blur-2xl" />
        <span aria-hidden="true" className="absolute right-6 top-8 rotate-12 text-7xl text-white opacity-5">
          🩺
        </span>
      </div>

      <div className="mb-4 flex items-end justify-between">
        <h3 className="text-lg font-bold text-slate-800">Recent Reports</h3>
        <button
          type="button"
          onClick={() => onSwitchTab("tests")}
          className="text-sm font-semibold text-teal-600"
        >
          See all
        </button>
      </div>

      {reportsLoading ? (
        <p className="py-6 text-center text-sm text-slate-400">Loading your reports…</p>
      ) : reports.length === 0 ? (
        <div className="space-y-3">
          {/* Demo reports from the screenshot / HTML, shown until the first real report is saved */}
          {DEMO_REPORTS.map((demo) => (
            <div key={demo.id}>
              <button
                type="button"
                onClick={() => setSelectedDemo(selectedDemo === demo.id ? null : demo.id)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-100/60 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg ${demo.iconClass}`}>
                    {demo.icon}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-slate-900">
                      {demo.title} <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">Sample</span>
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {demo.lab} • {demo.dateLabel}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-slate-300" aria-hidden="true">›</span>
              </button>
              {selectedDemo === demo.id && (
                <p className="rounded-b-2xl border border-t-0 border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600 animate-fade-in">
                  {demoSummaries[demo.id]}
                </p>
              )}
            </div>
          ))}
          <p className="pt-2 text-center text-sm text-slate-400">
            No saved reports yet — your first analysis will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => onOpenReport(report)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-100/60 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-lg text-teal-600">
                  🧪
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold text-slate-900">{report.title}</p>
                  <p className="truncate text-xs font-medium text-slate-500">
                    {[report.lab, formatDate(report.createdAt)].filter(Boolean).join(" • ")}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-sm text-slate-300" aria-hidden="true">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
