import { NextRequest, NextResponse } from 'next/server';
import { executeIloveApiTask } from '@/lib/iloveapi-service';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const scale = Number(formData.get('scale')) || 2; // Default 2x

    const blob = await executeIloveApiTask(file, 'upscaleimage', {
      multiplier: scale
    });

    return new NextResponse(blob, {
      headers: { 
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="upscaled-${file.name}"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}