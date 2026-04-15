import { NextRequest, NextResponse } from 'next/server';
import { executeCutoutTask } from '@/lib/cutout-service';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const blob = await executeCutoutTask(file, 'colorize');
    return new NextResponse(blob, { headers: { 'Content-Type': 'image/jpeg' } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}