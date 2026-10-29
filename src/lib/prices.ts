/**
 * Price database — cloned from Reportsay `app.py` (FALLBACK_PRICES,
 * LAB_LOCATIONS, COMMON_TESTS). Prices are approximate PKR, Lahore.
 * Contact labs directly to confirm current rates.
 */
export const FALLBACK_PRICES: Record<string, Record<string, number>> = {
  "Chughtai Lab": {
    CBC: 700,
    HbA1c: 1200,
    "Glucose Profile": 500,
    "Lipid Profile": 1800,
    LFTs: 2200,
    RFTs: 1600,
    "Thyroid Profile": 2500,
    Vitamins: 1800,
  },
  "Shaukat Khanum": {
    CBC: 900,
    HbA1c: 1500,
    "Glucose Profile": 600,
    "Lipid Profile": 2200,
    LFTs: 2800,
    RFTs: 2000,
    "Thyroid Profile": 3000,
    Vitamins: 2200,
  },
  "Mughal Labs": {
    CBC: 800,
    HbA1c: 2300,
    "Glucose Profile": 450,
    "Lipid Profile": 2500,
    LFTs: 2200,
    RFTs: 1650,
    "Cardiac Profile": 6400,
    "Thyroid Profile": 3950,
    Vitamins: 3950,
  },
  IDC: {
    CBC: 650,
    HbA1c: 1100,
    "Glucose Profile": 450,
    "Lipid Profile": 1700,
    LFTs: 2000,
    RFTs: 1500,
    "Thyroid Profile": 2400,
    Vitamins: 1700,
  },
  "Al-Noor": {
    CBC: 450,
    HbA1c: 850,
    "Glucose Profile": 350,
    "Lipid Profile": 1300,
    LFTs: 1600,
    RFTs: 1100,
    "Thyroid Profile": 1900,
    Vitamins: 1400,
  },
  "Excel Labs": {
    CBC: 600,
    HbA1c: 1000,
    "Glucose Profile": 420,
    "Lipid Profile": 1600,
    LFTs: 1900,
    RFTs: 1400,
    "Thyroid Profile": 2300,
    Vitamins: 1600,
  },
};

export const LAB_LOCATIONS: Record<string, string> = {
  "Mughal Labs": "https://www.google.com/maps/search/Mughal+Labs+Lahore",
  "Shaukat Khanum":
    "https://www.google.com/maps/search/Shaukat+Khanum+Laboratory+Lahore",
  IDC: "https://www.google.com/maps/search/Islamabad+Diagnostic+Centre+Lahore",
  "Chughtai Lab": "https://www.google.com/maps/search/Chughtai+Lab+Lahore",
  "Al-Noor":
    "https://www.google.com/maps/search/Al-Noor+Diagnostic+Centre+Lahore",
  "Excel Labs": "https://www.google.com/maps/search/Excel+Labs+Lahore",
};

export const COMMON_TESTS = [
  "CBC",
  "HbA1c",
  "Glucose Profile",
  "Lipid Profile",
  "LFTs",
  "RFTs",
  "Cardiac Profile",
  "Thyroid Profile",
  "Vitamins",
];

export function findPrice(
  labTests: Record<string, number>,
  testName: string,
): number | null {
  if (labTests[testName] != null) return labTests[testName];
  // Reportsay fallback: case-insensitive partial match, mirroring app.py.
  for (const [key, value] of Object.entries(labTests)) {
    if (key.toLowerCase().includes(testName.toLowerCase()) && key.length < 30) {
      return value;
    }
  }
  return null;
}

export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}
