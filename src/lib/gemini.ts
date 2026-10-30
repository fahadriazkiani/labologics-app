export const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

export async function generateWithGemini(prompt: string, imageBase64?: string, mimeType: string = "image/jpeg") {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  // Clean base64 prefix if present
  const cleanBase64 = imageBase64?.includes(",") ? imageBase64.split(",")[1] : imageBase64;

  const models = ["gemini-2.0-flash", "gemini-1.5-flash"];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      const parts: any[] = [{ text: prompt }];
      
      if (cleanBase64) {
        parts.push({
          inlineData: {  // FIXED: camelCase
            mimeType: mimeType, // FIXED: camelCase
            data: cleanBase64
          }
        });
      }

      const body = {
        contents: [{ parts }]
      };
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      if (data.error) {
        console.log(`Model ${model} failed:`, data.error.message);
        continue;
      }
    } catch (e) {
      continue;
    }
  }
  throw new Error("All Gemini models failed");
}
