import { NextRequest, NextResponse } from 'next/server';
import { executeIloveApiTask } from '@/lib/iloveapi-service';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File;
  const level = formData.get('level');

  try {
    const blob = await executeIloveApiTask(file, 'compressimage', {
      compression_level: level
    });

    return new NextResponse(blob, {
      headers: { 'Content-Type': 'image/jpeg' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}