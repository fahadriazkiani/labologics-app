import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    let imageBase64: string | null = null;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      imageBase64 = body.image || body.file || body.imageBase64 || body.base64 || null;
      if (imageBase64 && imageBase64.includes(',')) {
        imageBase64 = imageBase64.split(',')[1];
      }
    } else {
      const formData = await req.formData();
      const file = (formData.get('image') || formData.get('file')) as File;
      if (file && file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        imageBase64 = buffer.toString('base64');
      }
    }

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image received on server' }, { status: 400 });
    }

    const result = await analyzeWithGemini(imageBase64);
    return NextResponse.json(result);

  } catch (e: any) {
    console.error('Analyze error:', e);
    return NextResponse.json({ error: e.message || 'Analysis failed' }, { status: 500 });
  }
}
