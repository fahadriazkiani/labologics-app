"use client";

import type { TabId } from "@/lib/types";

interface BottomNavProps {
  activeTab: TabId;
  /** switchTab — same name and behaviour as labologics-preview.html. */
  onSwitchTab: (tab: TabId) => void;
}

function NavButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`nav-item group flex flex-1 flex-col items-center justify-center gap-1.5 ${
        active ? "active" : ""
      }`}
    >
      <span aria-hidden="true" className="text-xl leading-none transition-transform group-hover:scale-110">
        {icon}
      </span>
      <span className="text-[10px] font-bold tracking-wide">{label}</span>
    </button>
  );
}

/**
 * Bottom navigation — EXACT layout from the screenshot / HTML:
 * Home (left) · Info (2nd) · CENTER BIG teal FAB AI Interpreter ·
 * Tests (4th) · Profile (right).
 * Glassmorphism bar, 72px, FAB raised -top-6, w-16 h-16, gradient
 * teal, border-4 white/80, teal shadow.
 */
export default function BottomNav({ activeTab, onSwitchTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 z-50 flex h-[72px] w-full items-center justify-between border-t border-slate-200/60 bg-white/80 px-3 pb-safe shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)] backdrop-blur-md">
      <NavButton
        label="Home"
        icon="🏠"
        active={activeTab === "home"}
        onClick={() => onSwitchTab("home")}
      />
      <NavButton
        label="Info"
        icon="📖"
        active={activeTab === "info"}
        onClick={() => onSwitchTab("info")}
      />

      {/* Center Action Button — the hero FAB */}
      <div className="relative -top-6 flex flex-1 justify-center">
        <button
          type="button"
          onClick={() => onSwitchTab("interpreter")}
          aria-label="AI Interpreter"
          aria-current={activeTab === "interpreter" ? "page" : undefined}
          className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/80 bg-gradient-to-tr from-teal-500 to-teal-400 text-2xl text-white shadow-fab transition-transform hover:scale-105 active:scale-95"
        >
          <span aria-hidden="true">✨</span>
        </button>
      </div>

      <NavButton
        label="Tests"
        icon="📋"
        active={activeTab === "tests"}
        onClick={() => onSwitchTab("tests")}
      />
      <NavButton
        label="Profile"
        icon="👤"
        active={activeTab === "profile"}
        onClick={() => onSwitchTab("profile")}
      />
    </nav>
  );
}
