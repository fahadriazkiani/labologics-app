export interface Article {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  excerpt: string;
  imageText: string;
  imageBg: string;
  body: string[];
}

export const ARTICLES: Article[] = [
  {
    id: "cbc",
    tag: "Blood Work",
    tagColor: "bg-teal-500/90",
    title: "What is a Complete Blood Count (CBC)?",
    excerpt:
      "A CBC evaluates your overall health and detects a wide range of disorders, including anemia, infection and leukemia.",
    imageText: "CBC+Test+Guide",
    imageBg: "0f172a/0d9488",
    body: [
      "A Complete Blood Count (CBC) is the most common blood test ordered in Pakistan — and the one most people see first on a Chughtai or IDC report. It counts the three main types of blood cells: red blood cells (which carry oxygen), white blood cells (which fight infection), and platelets (which help blood clot).",
      "The key numbers to look at are haemoglobin, which is low in anaemia and can explain tiredness and breathlessness; the white cell count, which rises with infection and inflammation; and platelets, which matter for bleeding and bruising. A single value slightly outside the range is often not serious on its own — trends and symptoms matter more.",
      "If your CBC is abnormal, your doctor will usually ask about symptoms, diet, medicines, and recent illness before ordering any follow-up test. Bring the full report, not just one number, to that conversation.",
    ],
  },
  {
    id: "hba1c",
    tag: "Diabetes",
    tagColor: "bg-blue-500/90",
    title: "Understanding HbA1c Levels",
    excerpt:
      "The hemoglobin A1c test tells you your average level of blood sugar over the past 2 to 3 months.",
    imageText: "HbA1c+Explained",
    imageBg: "0f172a/3b82f6",
    body: [
      "HbA1c measures how much sugar has stuck to your haemoglobin over the past 2 to 3 months. Unlike a fasting glucose test, which is a snapshot of one morning, HbA1c shows the longer-term picture — which is why doctors use it to diagnose diabetes and to check how well treatment is working.",
      "In general, below 5.7% is considered normal, 5.7–6.4% is prediabetes, and 6.5% or above, confirmed on repeat testing, points to diabetes. Your lab's own reference range is the one to trust, and conditions such as anaemia can affect the result.",
      "If your HbA1c is in the prediabetes range, this is the most reversible stage. Weight, walking after meals, sleep, and sugary drinks are the levers your doctor will talk about first — before, or alongside, any medicine.",
    ],
  },
  {
    id: "lipid",
    tag: "Heart Health",
    tagColor: "bg-rose-500/90",
    title: "Lipid Profile: Cholesterol, Explained Simply",
    excerpt:
      "Total cholesterol alone tells you very little. LDL, HDL and triglycerides together tell the story of your heart risk.",
    imageText: "Lipid+Profile",
    imageBg: "0f172a/f43f5e",
    body: [
      "A lipid profile measures total cholesterol, LDL ('bad') cholesterol, HDL ('good') cholesterol, and triglycerides. LDL is the main target for treatment, because high LDL over years drives plaque in arteries. HDL helps clear cholesterol away, and triglycerides rise with excess sugar, alcohol, and calories.",
      "A 9–12 hour fast is usually requested so triglycerides are measured accurately. If only triglycerides are high, diet and activity often move them quickly; if LDL is high, your doctor weighs your overall risk — age, blood pressure, smoking, diabetes, and family history — before deciding on a statin.",
      "Do not start or stop a cholesterol medicine based on one report alone. Compare with previous reports and discuss the full risk picture with your doctor.",
    ],
  },
  {
    id: "thyroid",
    tag: "Hormones",
    tagColor: "bg-violet-500/90",
    title: "Thyroid Profile: TSH, T3 and T4",
    excerpt:
      "Unexplained fatigue, weight change, or hair loss? Your thyroid numbers are often the first place to look.",
    imageText: "Thyroid+Profile",
    imageBg: "0f172a/8b5cf6",
    body: [
      "The thyroid is a small gland in the neck that sets the pace of your metabolism. TSH is the signal from the brain telling the thyroid to work; T4 is the main hormone it makes, and T3 is the active form. A high TSH with low T4 usually means an underactive thyroid (hypothyroidism); a low TSH with high T4 usually means overactive (hyperthyroidism).",
      "Symptoms overlap with many other conditions — tiredness, weight change, feeling hot or cold, hair loss, and mood changes — so blood tests, not symptoms alone, make the diagnosis. Thyroid medicines are usually taken on an empty stomach, at the same time each day, away from calcium and iron supplements.",
      "If you already take thyroxine, take the tablet as usual unless your doctor tells you otherwise on the morning of the test, and always bring your dose and timing to the appointment.",
    ],
  },
];
