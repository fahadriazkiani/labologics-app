import type { SavedReport } from "./types";
import { createClient } from "./supabase/client";

const GUEST_KEY = "labologics_guest_reports_v1";

/* ── Guest (localStorage) — used before sign-in / when Supabase is unset ── */

export function loadGuestReports(): SavedReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedReport[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGuestReport(report: SavedReport): SavedReport[] {
  const existing = loadGuestReports();
  const next = [report, ...existing].slice(0, 50);
  try {
    window.localStorage.setItem(GUEST_KEY, JSON.stringify(next));
  } catch {
    // Storage full / private mode — the in-memory list still shows.
  }
  return next;
}

export function deleteGuestReport(id: string): SavedReport[] {
  const next = loadGuestReports().filter((r) => r.id !== id);
  try {
    window.localStorage.setItem(GUEST_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

/* ── Supabase (production) ── */

export interface NewReportInput {
  title: string;
  lab: string | null;
  fileName: string | null;
  language: string;
  summary: string;
  imageUrl: string | null;
}

function toSavedReport(row: Record<string, unknown>): SavedReport {
  return {
    id: String(row.id),
    title: String(row.title ?? "Lab Report"),
    lab: (row.lab as string | null) ?? null,
    fileName: (row.file_name as string | null) ?? null,
    language: String(row.language ?? "English"),
    summary: String(row.summary ?? ""),
    imageUrl: (row.image_url as string | null) ?? null,
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

export async function loadSupabaseReports(): Promise<SavedReport[]> {
  const supabase = createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("reports")
    .select("id,title,lab,file_name,language,summary,image_url,created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return (data as unknown as Record<string, unknown>[]).map(toSavedReport);
}

export async function insertSupabaseReport(
  input: NewReportInput,
): Promise<SavedReport | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("reports")
    .insert({
      title: input.title,
      lab: input.lab,
      file_name: input.fileName,
      language: input.language,
      summary: input.summary,
      image_url: input.imageUrl,
    })
    .select("id,title,lab,file_name,language,summary,image_url,created_at")
    .single();
  if (error || !data) return null;
  return toSavedReport(data as unknown as Record<string, unknown>);
}

export async function deleteSupabaseReport(id: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;
  const { error } = await supabase.from("reports").delete().eq("id", id);
  return !error;
}

/**
 * Upload the original report image to Supabase Storage (bucket:
 * `report-images`, see supabase/schema.sql). Returns a signed/public
 * URL, or null when Storage is unavailable — analysis still works.
 * The image is only uploaded for signed-in users; guests keep the
 * file on-device, matching Reportsay's "not stored" privacy note.
 */
export async function uploadReportImage(
  file: File,
  userId: string,
): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${userId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage
    .from("report-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) return null;
  const { data } = supabase.storage.from("report-images").getPublicUrl(path);
  return data.publicUrl;
}

/** Guess a report title/lab from the file name, e.g. "CBC_Chughtai.jpg". */
export function guessTitleAndLab(fileName: string): { title: string; lab: string | null } {
  const base = fileName.replace(/\.[^.]+$/, "");
  const knownLabs = ["Chughtai", "IDC", "Mughal", "Shaukat Khanum", "Al-Noor", "Excel"];
  const lab = knownLabs.find((l) => base.toLowerCase().includes(l.toLowerCase())) ?? null;
  const knownTests = ["CBC", "HbA1c", "Lipid", "Thyroid", "LFT", "RFT", "Glucose", "Vitamin"];
  const test = knownTests.find((t) => base.toLowerCase().includes(t.toLowerCase()));
  return {
    title: test
      ? test === "Lipid"
        ? "Lipid Profile"
        : test === "Thyroid"
          ? "Thyroid Profile"
          : test
      : "Lab Report",
    lab,
  };
}
