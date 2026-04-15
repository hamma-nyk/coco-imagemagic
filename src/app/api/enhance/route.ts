import { NextRequest, NextResponse } from 'next/server';
import { executeCutoutTask } from '@/lib/cutout-service';
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  
  // Ganti dengan domain produksi Anda nantinya
  const allowedOrigins = ['http://localhost:3000', 'https://coco.com'];

  if (!origin || !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const blob = await executeCutoutTask(file, 'photoEnhance');
    return new NextResponse(blob, { headers: { 'Content-Type': 'image/jpeg' } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}