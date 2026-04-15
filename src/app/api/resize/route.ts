import { NextRequest, NextResponse } from 'next/server';
import { executeIloveApiTask } from '@/lib/iloveapi-service';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File;
  const width = formData.get('width');
  const height = formData.get('height');

  try {
    const blob = await executeIloveApiTask(file, 'resizeimage', {
      pixels_width:width,
      pixels_height: height,
      resize_mode: 'pixels'
    });

    return new NextResponse(blob, {
      headers: { 'Content-Type': 'image/jpeg' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}