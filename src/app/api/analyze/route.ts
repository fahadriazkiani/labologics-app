import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, image, mimeType } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    
    if (!image) {
        return NextResponse.json({ error: "No image received on server" }, { status: 400 });
    }

    // Strip data:image/jpeg;base64, prefix if present
    const cleanBase64 = image.includes(",") ? image.split(",")[1] : image;

    const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
    let lastError = "";

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const body = {
          contents: [{
            parts: [
              { text: prompt || "Analyze this lab report in detail. Extract all tests, values, reference ranges and explain what they mean in simple language." },
              { 
                inlineData: {  // <-- FIX 1: camelCase
                  mimeType: mimeType || "image/jpeg", // <-- FIX 2: camelCase
                  data: cleanBase64 
                } 
              }
            ]
          }]
        };

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
          return NextResponse.json({ text, modelUsed: model });
        }
        if (data.error) {
          lastError = JSON.stringify(data.error);
          console.log("Model", model, "error:", data.error);
          continue;
        }
      } catch (e: any) {
        lastError = e.message;
        continue;
      }
    }

    return NextResponse.json({ error: `AI error: ${lastError}` }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
