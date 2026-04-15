import { NextRequest, NextResponse } from 'next/server';
import { executeIloveApiTask } from '@/lib/iloveapi-service';

export async function POST(req: NextRequest) {
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