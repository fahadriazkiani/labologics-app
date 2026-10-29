import { NextRequest, NextResponse } from "next/server";
import {
  ACCEPTED_MIME_TYPES,
  MAX_FILE_BYTES,
  buildAnalysisPrompt,
  geminiApiUrl,
  geminiModel,
} from "@/lib/gemini";
import type { Language } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/analyze
 *
 * Server-only Gemini call. The API key never reaches the browser — the
 * original HTML preview called Google directly with an empty key; this
 * route keeps the exact same payload shape (contents / inlineData) but
 * moves the key server-side, as required for production / Vercel.
 *
 * Body: { imageBase64: string, mimeType: string, language: Language,
 *         fileName?: string }
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY is not configured on the server. Add it in Vercel → Settings → Environment Variables, then redeploy.",
      },
      { status: 500 },
    );
  }

  let body: {
    imageBase64?: unknown;
    mimeType?: unknown;
    language?: unknown;
    fileName?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : "";
  const mimeType = typeof body.mimeType === "string" ? body.mimeType : "";
  const language: Language =
    body.language === "Urdu (اردو)" ? "Urdu (اردو)" : "English";

  if (!imageBase64 || !mimeType) {
    return NextResponse.json(
      { error: "No report file was uploaded." },
      { status: 400 },
    );
  }
  if (!(ACCEPTED_MIME_TYPES as readonly string[]).includes(mimeType)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WEBP images and PDF reports are supported." },
      { status: 400 },
    );
  }
  // Base64 is ~4/3 the byte size; reject clearly oversized payloads.
  if (imageBase64.length > Math.ceil((MAX_FILE_BYTES * 4) / 3) + 1024) {
    return NextResponse.json(
      { error: "File is too large. Please upload a file under 10 MB." },
      { status: 400 },
    );
  }

  const promptText = buildAnalysisPrompt(language);

  // Payload shape preserved from labologics-preview.html: inlineData.
  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: promptText },
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
  };

  let response: Response;
  try {
    response = await fetch(`${geminiApiUrl()}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Connection error. We couldn't reach the AI securely. Please check your internet connection and try again.",
      },
      { status: 502 },
    );
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const status = response.status;
    const message =
      result?.error?.message || "Gemini returned an error.";
    if (status === 429) {
      return NextResponse.json(
        {
          error:
            "API rate limit reached. Please wait 30–60 seconds and try again.",
        },
        { status: 429 },
      );
    }
    if (status === 400) {
      return NextResponse.json(
        {
          error:
            "The image could not be processed. Try a clearer photo or a different format.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: `AI error (${status}): ${message}` },
      { status: 502 },
    );
  }

  const text: string | undefined =
    result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    return NextResponse.json(
      {
        error:
          "We couldn't clearly interpret the report. Please make sure the photo is well-lit and all text is readable, then try again.",
      },
      { status: 422 },
    );
  }

  return NextResponse.json({ text, model: geminiModel(), language });
}
