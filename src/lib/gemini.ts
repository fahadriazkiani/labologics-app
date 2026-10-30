import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

const MODEL_CANDIDATES = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite", 
  "gemini-3.8-flash",
  "gemini-2.5-flash",
  "gemini-1.5-flash-latest",
].filter(Boolean);

export async function analyzeWithGemini(imageBase64: string) {
  // Stronger OCR prompt specifically for IDC, Chughtai, Agha Khan formats
  const prompt = `
You are an expert medical lab OCR for Pakistani labs (IDC, Chughtai, Shaukat Khanum).

Look at this lab report image carefully. Extract EVERY test row you can see, even if blurry.

Return ONLY this JSON - no markdown, no explanation:
{
  "tests": [
    {"name": "WBC Count", "value": "8.370", "unit": "/mm3", "reference": "4000-11000", "status": "normal"},
    {"name": "Haemoglobin", "value": "15.5", "unit": "g/dL", "reference": "13-17", "status": "normal"}
  ]
}

Rules:
- Extract ALL: Hematology, CBC, Differential, Absolute Counts
- Keep exact numbers: 8.370, 15.5, etc
- status: low/high/normal by comparing to reference range
- If you can't read a value, skip that test, don't hallucinate
- If image is blurry, do your best guess and return what you CAN read - never return empty
`;

  let lastError: any = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { temperature: 0.1, maxOutputTokens: 4096 }
      });
      
      const result = await model.generateContent([
        { text: prompt },
        { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
      ]);

      let text = result.response.text().trim();
      // Remove all markdown wrappers
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      // Find JSON object in text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        text = jsonMatch[0];
      }

      const parsed = JSON.parse(text);
      
      // Validate we got tests
      if (parsed.tests && parsed.tests.length > 0) {
        console.log(`Success with ${modelName}: ${parsed.tests.length} tests`);
        return { ...parsed, modelUsed: modelName };
      } else {
        throw new Error("No tests found");
      }

    } catch (e: any) {
      console.warn(`Model ${modelName} failed: ${e.message}`);
      lastError = e;
      continue;
    }
  }

  // If all fail, return friendly error that frontend can show
  throw new Error(`Could not read IDC report. Try taking photo in better light, crop closer to table. Last error: ${lastError?.message}`);
}
