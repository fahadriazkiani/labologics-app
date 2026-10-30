import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

export async function analyzeWithGemini(imageBase64: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are a medical lab report OCR expert. 
  Extract all tests from this lab report image.
  Return ONLY valid JSON in this format:
  {
    "tests": [
      {"name": "Haemoglobin", "value": "12.2", "unit": "g/dL", "reference": "13-17", "status": "low"},
      {"name": "WBC", "value": "8000", "unit": "/cmm", "reference": "4000-11000", "status": "normal"}
    ]
  }
  If reference range not visible, leave empty.
  Set status as low/high/normal based on reference.
  `;

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    },
  ]);

  const text = result.response.text();
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return { raw: text };
  }
}
