import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

// Order = newest first. If first fails, it tries next automatically.
const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL || "", // allow override from Vercel env
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
].filter(Boolean);

export async function analyzeWithGemini(imageBase64: string) {
  const prompt = `You are a medical lab report OCR expert. Extract all tests from this lab report image. Return ONLY valid JSON: {"tests": [{"name": "Haemoglobin", "value": "12.2", "unit": "g/dL", "reference": "13-17", "status": "low"}]}`;

  let lastError: any = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        { text: prompt },
        { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
      ]);
      const text = result.response.text();
      const cleaned = text.replace(/```json|```/g, "").trim();
      try {
        return JSON.parse(cleaned);
      } catch {
        return { raw: text, modelUsed: modelName };
      }
    } catch (e: any) {
      console.warn(`Model ${modelName} failed: ${e.message}`);
      lastError = e;
      continue; // try next model
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
}
