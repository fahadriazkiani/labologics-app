"use client";

import { useCallback, useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import HomeScreen from "@/components/screens/HomeScreen";
import InfoScreen from "@/components/screens/InfoScreen";
import InterpreterScreen from "@/components/screens/InterpreterScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import TestsScreen from "@/components/screens/TestsScreen";
import { formatMarkdown } from "@/lib/formatMarkdown";
import {
  loadGuestReports,
  loadSupabaseReports,
} from "@/lib/reports";
import type { SavedReport, TabId } from "@/lib/types";

function AppShell() {
  const { user, configured, displayName } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [openReport, setOpenReport] = useState<SavedReport | null>(null);
  // Key forces a remount on every tab switch, re-triggering the
  // fade-in — the React equivalent of the original `void offsetWidth`
  // reflow trick in switchTab().
  const [screenKey, setScreenKey] = useState(0);

  const refreshReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      if (user) {
        const [remote, local] = await Promise.all([
          loadSupabaseReports(),
          Promise.resolve(loadGuestReports()),
        ]);
        // Signed-in: show Supabase reports first, then any guest reports
        // saved on this device before sign-in.
        const seen = new Set(remote.map((r) => r.id));
        setReports([...remote, ...local.filter((r) => !seen.has(r.id))]);
      } else {
        setReports(loadGuestReports());
      }
    } finally {
      setReportsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  // switchTab — same name as labologics-preview.html. Hides the current
  // screen, shows the target with animate-fade-in, updates nav state.
  function switchTab(tabId: TabId) {
    setActiveTab(tabId);
    setScreenKey((k) => k + 1);
    window.scrollTo({ top: 0 });
  }

  function handleReportSaved(report: SavedReport) {
    setReports((prev) =>
      prev.some((r) => r.id === report.id) ? prev : [report, ...prev],
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden text-slate-800">
      <Header />

      <main className="no-scrollbar relative flex-1 overflow-y-auto pb-28">
        <div key={screenKey}>
          {activeTab === "home" && (
            <HomeScreen
              displayName={configured ? displayName : ""}
              reports={reports}
              reportsLoading={reportsLoading}
              onSwitchTab={switchTab}
              onOpenReport={setOpenReport}
            />
          )}
          {activeTab === "info" && <InfoScreen />}
          {activeTab === "interpreter" && (
            <InterpreterScreen
              onReportSaved={handleReportSaved}
              onGoToProfile={() => switchTab("profile")}
            />
          )}
          {activeTab === "tests" && <TestsScreen />}
          {activeTab === "profile" && (
            <ProfileScreen reports={reports} onSwitchTab={switchTab} />
          )}
        </div>
      </main>

      <BottomNav activeTab={activeTab} onSwitchTab={switchTab} />

      {/* Saved-report detail */}
      {openReport && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openReport.title}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/50 sm:items-center"
          onClick={() => setOpenReport(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl animate-fade-in sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{openReport.title}</h3>
                <p className="text-sm text-slate-500">
                  {[openReport.lab, openReport.language].filter(Boolean).join(" • ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenReport(null)}
                aria-label="Close report"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600"
              >
                ✕
              </button>
            </div>
            <div
              className="prose text-sm"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(openReport.summary) }}
            />
            <div className="mt-5 rounded-2xl bg-orange-50/80 p-4 text-xs font-medium leading-relaxed text-orange-800">
              <strong>Disclaimer:</strong> AI-generated summary for education
              only — not medical advice. Always consult your physician.
            </div>
            <button
              type="button"
              onClick={() => {
                setOpenReport(null);
                switchTab("interpreter");
              }}
              className="mt-5 w-full rounded-2xl bg-teal-600 py-3.5 font-bold text-white hover:bg-teal-700"
            >
              Analyze a new report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
