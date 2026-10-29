export const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
export async function generateWithGemini(prompt: string, imageBase64?: string, mimeType: string = "image/jpeg") {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"];
  
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const body: any = {
        contents: [{
          parts: [
            { text: prompt },
            ...(imageBase64 ? [{ inline_data: { mime_type: mimeType, data: imageBase64 } }] : [])
          ]
        }]
      };
      // Fix for inlineData format
      if (imageBase64) {
        body.contents[0].parts = [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: imageBase64 } }
        ];
      }
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      if (data.error) throw new Error(data.error.message);
    } catch (e) {
      continue;
    }
  }
  throw new Error("All Gemini models failed");
}
