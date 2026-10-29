"use client";

import { useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { AuthProvider, useAuth } from "../AuthProvider"
import ShareCard from "../ShareCard";
import { formatMarkdown, stripMarkdown } from "../../lib/formatMarkdown";
import { ACCEPTED_MIME_TYPES, MAX_FILE_BYTES } from "../../lib/gemini";
import {
  guessTitleAndLab,
  insertSupabaseReport,
  saveGuestReport,
  uploadReportImage,
} from "../../lib/reports";
import { downloadBlob, shareViaWhatsApp } from "../../lib/share";
import type { Language, SavedReport } from "../../lib/types";

interface InterpreterScreenProps {
  onReportSaved?: (report: SavedReport) => void;
  onGoToProfile?: () => void;
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Downscale very large photos (phone cameras) to max 1600px on the long
 * edge before base64 encoding, so the Gemini payload stays reasonable.
 * Small images pass through untouched, as in the original FileReader flow.
 */
async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  if (!file.type.startsWith("image/")) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    return { base64: dataUrl.split(",")[1], mimeType: file.type };
  }
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap || Math.max(bitmap.width, bitmap.height) <= 1600) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    return { base64: dataUrl.split(",")[1], mimeType: file.type };
  }
  const scale = 1600 / Math.max(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const dataUrl = canvas.toDataURL(mimeType, 0.88);
  return { base64: dataUrl.split(",")[1], mimeType };
}

export default function InterpreterScreen({
  onReportSaved,
  onGoToProfile,
}: InterpreterScreenProps) {
  const { user } = useAuth();

  const [language, setLanguage] = useState<Language>("English");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Global state for upload — same names as labologics-preview.html
  const [currentImageBase64, setCurrentImageBase64] = useState<string | null>(null);
  const [currentImageMime, setCurrentImageMime] = useState<string | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // handleImageSelection — ported from labologics-preview.html (FileReader
  // → base64, enable the Analyze button, hide the results area).
  async function handleImageSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setError(null);
    setShareStatus(null);
    setSaved(false);

    if (!(ACCEPTED_MIME_TYPES as readonly string[]).includes(selected.type)) {
      setError("Only JPEG, PNG, WEBP images and PDF reports are supported.");
      return;
    }
    if (selected.size > MAX_FILE_BYTES) {
      setError("File is too large (over 10 MB). Please upload a smaller file.");
      return;
    }

    try {
      const { base64, mimeType } = await fileToBase64(selected);
      setCurrentImageBase64(base64);
      setCurrentImageMime(mimeType);
      setFile(selected);
      setFileName(selected.name);
      const pdf = selected.type === "application/pdf";
      setIsPdf(pdf);
      setPreviewUrl(pdf ? null : URL.createObjectURL(selected));
      setResultText(null);
    } catch {
      setError("Could not read that file. Please try a different photo or PDF.");
    }
  }

  function resetUpload() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreviewUrl(null);
    setFileName(null);
    setIsPdf(false);
    setFile(null);
    setCurrentImageBase64(null);
    setCurrentImageMime(null);
    setResultText(null);
    setError(null);
    setSaved(false);
    setShareStatus(null);
  }

  // analyzeReport — ported from labologics-preview.html. The Gemini
  // payload (contents / inlineData) is now built server-side in
  // /api/analyze so GEMINI_API_KEY never reaches the browser.
  async function analyzeReport() {
    if (!currentImageBase64 || !currentImageMime) return;
    setAnalyzing(true);
    setError(null);
    setResultText(null);
    setSaved(false);
    setShareStatus(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: currentImageBase64,
          mimeType: currentImageMime,
          language,
          fileName,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          typeof result?.error === "string"
            ? result.error
            : "We couldn't clearly interpret the report. Please try again.",
        );
      } else if (typeof result?.text === "string") {
        setResultText(result.text);
        setModelName(typeof result?.model === "string" ? result.model : null);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 100);
      } else {
        setError("We couldn't clearly interpret the report. Please try again.");
      }
    } catch {
      setError(
        "Connection error. We couldn't reach the AI securely. Please check your internet connection and try again.",
      );
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleSave() {
    if (!resultText || saving || saved) return;
    setSaving(true);
    const { title, lab } = guessTitleAndLab(fileName ?? "Lab Report");
    const report: SavedReport = {
      id: `local-${Date.now()}`,
      title,
      lab,
      fileName,
      language,
      summary: resultText,
      imageUrl: null,
      createdAt: new Date().toISOString(),
    };
    try {
      if (user) {
        let imageUrl: string | null = null;
        if (file) imageUrl = await uploadReportImage(file, user.id);
        const inserted = await insertSupabaseReport({
          title,
          lab,
          fileName,
          language,
          summary: resultText,
          imageUrl,
        });
        if (inserted) {
          onReportSaved?.(inserted);
          setSaved(true);
        } else {
          // Supabase table missing / RLS — fall back to on-device save
          // so the analysis is never lost.
          const next = saveGuestReport(report);
          onReportSaved?.(next[0]);
          setSaved(true);
        }
      } else {
        const next = saveGuestReport(report);
        onReportSaved?.(next[0]);
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleShareWhatsApp() {
    if (!resultText || !shareCardRef.current || sharing) return;
    setSharing(true);
    setShareStatus(null);
    try {
      const blob = await toBlob(shareCardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      if (!blob) throw new Error("Could not render share image");
      const { title } = guessTitleAndLab(fileName ?? "Lab Report");
      const outcome = await shareViaWhatsApp(
        blob,
        `Labologics-${title.replace(/\s+/g, "-")}.png`,
        title,
        resultText,
      );
      setShareStatus(
        outcome === "shared"
          ? "Share sheet opened — choose WhatsApp to send the image."
          : "Image downloaded. WhatsApp opened — attach the PNG to send it.",
      );
    } catch {
      setShareStatus("Could not create the share image. Try Copy summary instead.");
    } finally {
      setSharing(false);
    }
  }

  async function handleDownloadPng() {
    if (!resultText || !shareCardRef.current) return;
    const blob = await toBlob(shareCardRef.current, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });
    if (!blob) return;
    const { title } = guessTitleAndLab(fileName ?? "Lab Report");
    downloadBlob(blob, `Labologics-${title.replace(/\s+/g, "-")}.png`);
  }

  async function handleCopy() {
    if (!resultText) return;
    await navigator.clipboard.writeText(stripMarkdown(resultText));
    setShareStatus("Summary copied to clipboard.");
  }

  const hasImage = Boolean(currentImageBase64);
  const reportTitle = guessTitleAndLab(fileName ?? "Lab Report").title;

  return (
    <div className="flex h-full flex-col px-5 pb-4 pt-6">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-600 shadow-sm">
          ✨
        </div>
        <h2 className="text-2xl font-bold text-slate-900">AI Interpreter</h2>
        <p className="mx-auto mt-2 max-w-[250px] text-sm font-medium text-slate-500">
          Upload a clear photo of your lab report for an easy-to-understand summary.
        </p>
      </div>

      {/* Language — from Reportsay (English / Urdu) */}
      <div className="mb-4 flex gap-2" role="group" aria-label="Interpretation language">
        {(["English", "Urdu (اردو)"] as Language[]).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            aria-pressed={language === lang}
            className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
              language === lang
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/30"
                : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {lang === "English" ? "English" : "Urdu (اردو)"}
          </button>
        ))}
      </div>
      <p className="mb-4 text-center text-xs text-slate-400">
        Urdu support is in beta. Medical terms may still appear in English.
      </p>

      {/* Upload Area — from labologics-preview.html */}
      <div
        className={`relative flex min-h-[220px] flex-col items-center justify-center rounded-3xl border-2 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors ${
          hasImage
            ? "border-solid border-teal-400 bg-teal-50/20"
            : "border-dashed border-slate-200 hover:border-teal-400 hover:bg-teal-50/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleImageSelection}
          title="Upload report"
          aria-label="Upload lab report"
          className={`absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0 ${
            hasImage ? "hidden" : ""
          }`}
        />

        {!hasImage && (
          <div className="pointer-events-none flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
              <span className="text-2xl text-slate-400" aria-hidden="true">☁️</span>
            </div>
            <p className="text-lg font-bold text-slate-700">Tap to upload</p>
            <p className="mt-1 text-sm font-medium text-slate-400">JPEG, PNG, WEBP or PDF · max 10 MB</p>
            <p className="mt-2 max-w-[260px] text-xs leading-relaxed text-slate-400">
              Tip: for PDFs, the first page is analysed. Photograph a single
              report page for best results.
            </p>
          </div>
        )}

        {hasImage && (
          <div className="relative z-10 flex w-full flex-col items-center animate-fade-in">
            <div className="relative w-full">
              {isPdf ? (
                <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <span className="text-2xl" aria-hidden="true">📄</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">{fileName}</p>
                    <p className="text-xs text-slate-500">PDF report — ready to analyse</p>
                  </div>
                </div>
              ) : (
                previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Report preview"
                    className="mb-4 max-h-56 w-full rounded-xl border border-slate-200 bg-slate-50 object-contain shadow-sm"
                  />
                )
              )}
              <button
                type="button"
                onClick={resetUpload}
                aria-label="Remove uploaded file"
                className="absolute -right-3 -top-3 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-md hover:text-red-500"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-bold text-teal-600">
              ✓ Image loaded
            </div>
          </div>
        )}
      </div>

      {/* Privacy note — from Reportsay */}
      <p className="mt-3 text-center text-xs leading-relaxed text-slate-400">
        🔒 Your document is sent directly to Gemini AI for analysis. Do not
        upload documents containing your full name, CNIC, or address.
        {!user && " Guests: nothing is stored on our servers."}
      </p>

      {/* Action Button */}
      <button
        type="button"
        onClick={analyzeReport}
        disabled={!hasImage || analyzing}
        className={`mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 font-bold text-white shadow-lg transition-all ${
          hasImage
            ? "bg-teal-600 shadow-teal-600/30 hover:bg-teal-700"
            : "pointer-events-none bg-slate-900 opacity-50 shadow-slate-900/20"
        }`}
      >
        <span aria-hidden="true">🧠</span>
        <span>{analyzing ? "Analyzing…" : "Analyze with AI"}</span>
      </button>

      {error && (
        <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium leading-relaxed text-red-700">
          {error}
        </p>
      )}

      {/* Loading State */}
      {analyzing && (
        <div className="mt-4 flex flex-col items-center justify-center py-10 animate-fade-in">
          <div className="relative mb-4 h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
            <div className="absolute inset-0 flex items-center justify-center text-sm text-teal-500">✨</div>
          </div>
          <h3 className="mb-1 text-lg font-bold text-slate-800">Analyzing Data</h3>
          <p className="text-sm font-medium text-slate-500">Gemini AI is reading your report…</p>
        </div>
      )}

      {/* Results Area */}
      {resultText && !analyzing && (
        <div
          ref={resultsRef}
          className="relative mb-4 mt-8 overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] animate-fade-in"
        >
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-teal-400 to-blue-500" />
          <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-teal-600">✓</div>
            <h3 className="text-lg font-bold text-slate-900">Your Results Summary</h3>
          </div>
          {modelName && (
            <p className="mb-3 text-xs font-medium text-slate-400">
              Analysed with {modelName} • {language}
            </p>
          )}
          {/* formatMarkdown output — HTML is escaped inside the formatter */}
          <div
            className="prose text-sm"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(resultText) }}
          />
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-orange-100/50 bg-orange-50/80 p-4">
            <span className="mt-0.5 text-orange-500" aria-hidden="true">⚠️</span>
            <p className="text-xs font-medium leading-relaxed text-orange-800">
              <strong>Disclaimer:</strong> This interpretation is generated by AI
              and is for educational purposes only. It is not medical advice.
              Always consult your physician for clinical diagnosis and treatment.
            </p>
          </div>

          {/* Actions: save / share / download / copy */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || saved}
              className="rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              {saved ? "✓ Saved" : saving ? "Saving…" : "Save report"}
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              disabled={sharing}
              className="rounded-xl bg-[#25d366] px-4 py-3 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60"
            >
              {sharing ? "Preparing…" : "Share on WhatsApp"}
            </button>
            <button
              type="button"
              onClick={handleDownloadPng}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Download image
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Copy summary
            </button>
          </div>

          {shareStatus && (
            <p role="status" className="mt-3 text-center text-sm font-medium text-teal-700">
              {shareStatus}
            </p>
          )}
          {!user && saved && (
            <p className="mt-3 text-center text-sm text-slate-500">
              Saved on this device.{" "}
              <button type="button" onClick={onGoToProfile} className="font-bold text-teal-600">
                Sign in
              </button>{" "}
              to keep reports across devices.
            </p>
          )}
          <button
            type="button"
            onClick={resetUpload}
            className="mt-4 w-full py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
          >
            🗑 Clear &amp; analyze another report
          </button>
        </div>
      )}

      {/* Off-screen share card (1080px) — rendered only with a result */}
      {resultText && (
        <div aria-hidden="true" className="pointer-events-none fixed left-[-9999px] top-0">
          <ShareCard
            ref={shareCardRef}
            title={reportTitle}
            dateLabel={todayLabel()}
            summary={resultText}
            language={language}
          />
        </div>
      )}
    </div>
  );
}
