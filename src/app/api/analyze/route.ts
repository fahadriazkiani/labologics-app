import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("report") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an expert medical laboratory scientist in Pakistan. Analyze this lab report (likely from IDC, Chughtai, or Aga Khan). Identify abnormal biomarkers, explain them simply in a mix of English and Roman Urdu, and provide a structured summary.`;

    const imageParts = [{
      inlineData: { data: buffer.toString("base64"), mimeType: file.type },
    }];

    const result = await model.generateContent([prompt, ...imageParts]);
    const text = await result.response.text();

    return NextResponse.json({ interpretation: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to process report" }, { status: 500 });
  }
}
