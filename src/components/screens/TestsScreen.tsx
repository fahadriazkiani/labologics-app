"use client";

import { useMemo, useState } from "react";
import {
  COMMON_TESTS,
  FALLBACK_PRICES,
  LAB_LOCATIONS,
  findPrice,
  formatPKR,
} from "@/lib/prices";
import { TEST_SUGGESTIONS } from "@/lib/suggestions";

/**
 * Tests tab = Test Suggestions (HTML) + Smart Price Checker (Reportsay).
 * Prices are the FALLBACK_PRICES from app.py — approximate, Lahore.
 */
export default function TestsScreen() {
  const [selectedTest, setSelectedTest] = useState<string>(COMMON_TESTS[0]);

  const comparison = useMemo(() => {
    const rows = Object.entries(FALLBACK_PRICES)
      .map(([lab, tests]) => ({ lab, price: findPrice(tests, selectedTest) }))
      .filter((row): row is { lab: string; price: number } => row.price != null);
    const prices = rows.map((r) => r.price);
    return {
      rows,
      min: prices.length ? Math.min(...prices) : null,
      max: prices.length ? Math.max(...prices) : null,
      avg: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null,
    };
  }, [selectedTest]);

  return (
    <div className="px-5 pb-4 pt-6 animate-fade-in">
      <div className="mb-2 flex items-center gap-3">
        <span className="text-xl text-amber-400" aria-hidden="true">💡</span>
        <h2 className="text-2xl font-bold text-slate-900">Test Suggestions</h2>
      </div>
      <p className="mb-6 text-sm font-medium text-slate-500">
        Recommended tests based on general wellness profiles.
      </p>

      <div className="space-y-4">
        {TEST_SUGGESTIONS.map((s) => (
          <div key={s.id} className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="absolute right-0 top-0 p-4">
              <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${s.badgeClass}`}>
                {s.badge}
              </span>
            </div>
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg ${s.iconClass}`}>
                {s.icon}
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mb-3 text-sm leading-relaxed text-slate-500">{s.description}</p>
                {s.cta ? (
                  <button type="button" className="text-sm font-bold text-teal-600 transition hover:text-teal-700">
                    {s.cta}
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                    <span className="text-slate-400" aria-hidden="true">{s.footerIcon}</span> {s.footerLabel}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Smart Price Checker (Reportsay Tab 2) ── */}
      <div className="mt-10">
        <h3 className="mb-1 text-lg font-bold text-slate-900">🏥 Compare Lab Test Prices in Lahore</h3>
        <p className="mb-4 text-sm text-slate-500">
          Prices shown are approximate. Contact labs directly to confirm current rates.
        </p>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Select a test</span>
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] font-medium text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          >
            {COMMON_TESTS.map((test) => (
              <option key={test} value={test}>
                {test}
              </option>
            ))}
          </select>
        </label>

        <h4 className="mt-6 mb-3 font-bold text-slate-800">
          💰 Price Comparison for: {selectedTest}
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {comparison.rows.map(({ lab, price }) => (
            <div
              key={lab}
              className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="font-bold text-slate-800">{lab}</p>
              <p className="my-2 text-2xl font-black text-emerald-700">{formatPKR(price)}</p>
              <a
                href={LAB_LOCATIONS[lab] ?? "https://www.google.com/maps/search/diagnostic+labs+lahore"}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 py-2.5 font-semibold text-white transition hover:opacity-90"
              >
                📍 Get Directions
              </a>
            </div>
          ))}
          {comparison.rows.length === 0 && (
            <p className="text-sm text-slate-500">Call labs to confirm the price for this test.</p>
          )}
        </div>

        {comparison.min != null && comparison.max != null && comparison.avg != null && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-slate-700">
            💡 <strong>Price Summary for {selectedTest}:</strong> Lowest{" "}
            <strong>{formatPKR(comparison.min)}</strong> | Highest{" "}
            <strong>{formatPKR(comparison.max)}</strong> | Average{" "}
            <strong>{formatPKR(comparison.avg)}</strong>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-slate-700">
          📞 <strong>Tip:</strong> Many labs offer home sample collection for an
          additional Rs. 200–500. Call ahead to book a slot and confirm prices,
          as they may vary by branch.
        </div>
      </div>
    </div>
  );
}
