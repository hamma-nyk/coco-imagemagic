import { NextRequest, NextResponse } from 'next/server';
import { executeIloveApiTask } from '@/lib/iloveapi-service';
import { validateRequest } from '@/lib/security';

export async function POST(req: NextRequest) {
  // --- PROTEKSI START ---
  const check = validateRequest(req);
  if (!check.isValid) {
    return NextResponse.json(
      { error: check.message, code: 'UNAUTHORIZED_ACCESS' }, 
      { status: 403 }
    );
  }
  // --- PROTEKSI END ---
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