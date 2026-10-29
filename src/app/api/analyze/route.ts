import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, image, mimeType } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    
    const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"];
    let lastError = "";

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const body = {
          contents: [{
            parts: [
              { text: prompt || "Analyze this lab report" },
              ...(image ? [{ inline_data: { mime_type: mimeType || "image/jpeg", data: image } }] : [])
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
          lastError = data.error.message;
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
