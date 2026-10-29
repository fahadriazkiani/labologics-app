import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from env
const apiKey = 
  process.env.GEMINI_API_KEY || 
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
  "";

if (!apiKey) {
  console.error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

// List of models to try - auto fallback if one is retired
const MODEL_CANDIDATES = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-flash-latest",
  "gemini-1.5-pro",
  "gemini-pro"
];

/**
 * This function automatically picks the available model
 * So if gemini-2.5 is removed, it will try 2.0, then 1.5 etc.
 */
export async function generateWithGemini(
  prompt: string,
  imageBase64?: string,
  mimeType: string = "image/jpeg"
): Promise<string> {
  let lastError: any = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      console.log(`Trying Gemini model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      let result;
      if (imageBase64) {
        result = await model.generateContent([
          { text: prompt },
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
        ]);
      } else {
        result = await model.generateContent(prompt);
      }

      const text = result.response.text();
      if (text) {
        console.log(`Success with model: ${modelName}`);
        return text;
      }
    } catch (error: any) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
      continue; // try next model
    }
  }

  // If all models fail
  throw new Error(
    `All Gemini models failed. Last error: ${lastError?.message || "Unknown"}. Please check API key and quota.`
  );
}

// Keep backward compatibility for old code
export async function analyzeLabReport(prompt: string, imageData?: any) {
  return generateWithGemini(prompt, imageData);
}

export async function interpretReport(prompt: string, imageData?: any) {
  return generateWithGemini(prompt, imageData);
}

export { genAI };
export default genAI;
