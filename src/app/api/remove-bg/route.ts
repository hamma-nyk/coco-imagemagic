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

    if (!file) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // iLoveAPI Remove Background mengembalikan file PNG transparan
    const blob = await executeIloveApiTask(file, 'removebackgroundimage', {});

    return new NextResponse(blob, {
      headers: { 
        'Content-Type': 'image/png', // Selalu PNG untuk transparansi
        'Content-Disposition': `attachment; filename="no-bg-${file.name.split('.')[0]}.png"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}