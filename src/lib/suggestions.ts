export interface TestSuggestion {
  id: string;
  badge: string;
  badgeClass: string;
  icon: string;
  iconClass: string;
  title: string;
  description: string;
  footerLabel: string;
  footerIcon: string;
  cta?: string;
}

/** Test Suggestions — from screen-suggestions in labologics-preview.html. */
export const TEST_SUGGESTIONS: TestSuggestion[] = [
  {
    id: "lipid",
    badge: "Age 35+",
    badgeClass: "bg-slate-100 text-slate-600",
    icon: "❤",
    iconClass: "bg-red-50 text-red-500",
    title: "Lipid Profile",
    description:
      "Check cholesterol and triglycerides to evaluate heart disease risk.",
    footerLabel: "Recommended every 5 years",
    footerIcon: "◷",
  },
  {
    id: "hba1c",
    badge: "Age 45+",
    badgeClass: "bg-slate-100 text-slate-600",
    icon: "▦",
    iconClass: "bg-blue-50 text-blue-600",
    title: "HbA1c (Diabetes)",
    description:
      "Recommended if you have a family history of diabetes, are overweight, or experience frequent thirst.",
    footerLabel: "Baseline check at 45",
    footerIcon: "🩺",
  },
  {
    id: "thyroid",
    badge: "Symptom Based",
    badgeClass: "bg-teal-50 text-teal-600",
    icon: "🧠",
    iconClass: "bg-purple-50 text-purple-500",
    title: "Thyroid Profile",
    description:
      "Consider this test if you are experiencing unexplained fatigue, sudden weight changes, or hair loss.",
    footerLabel: "Read more about Symptoms",
    footerIcon: "",
    cta: "Read more about Symptoms",
  },
];

export const DEMO_REPORTS = [
  {
    id: "demo-cbc",
    title: "CBC Blood Test",
    lab: "Chughtai Lab",
    dateLabel: "Oct 24, 2026",
    icon: "🩸",
    iconClass: "bg-red-50 text-red-500",
  },
  {
    id: "demo-lipid",
    title: "Lipid Profile",
    lab: "IDC",
    dateLabel: "Sep 12, 2026",
    icon: "🧪",
    iconClass: "bg-teal-50 text-teal-600",
  },
];
