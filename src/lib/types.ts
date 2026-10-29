export type TabId = "home" | "info" | "interpreter" | "tests" | "profile";

/** Tab ids in the original HTML were: home, blogs, interpreter, suggestions, profile. */
export type LegacyTabId = "home" | "blogs" | "interpreter" | "suggestions" | "profile";

export type Language = "English" | "Urdu (اردو)";

export interface SavedReport {
  id: string;
  title: string;
  lab: string | null;
  fileName: string | null;
  language: string;
  summary: string;
  imageUrl: string | null;
  createdAt: string;
  /** True for the two seeded demo reports shown before sign-in. */
  isDemo?: boolean;
}

export interface AnalysisResult {
  text: string;
  model: string;
  language: Language;
}
