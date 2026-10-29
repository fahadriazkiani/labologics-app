import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Auto-select working model
const MODEL_CANDIDATES = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-flash-latest"
];

export async function generateWithFallback(prompt: string, imageData?: any) {
  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(imageData ? [prompt, imageData] : prompt);
      return result.response.text();
    } catch (e) {
      console.warn(`Model ${modelName} failed, trying next...`);
    }
  }
  throw new Error("All Gemini models failed. Check API key.");
}

export { genAI };
