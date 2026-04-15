import { NextRequest, NextResponse } from 'next/server';
import { executeIloveApiTask } from '@/lib/iloveapi-service';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const targetFormat = formData.get('to') as string;

    if (!file || !targetFormat) {
      return NextResponse.json({ error: 'Image and Target Format are required' }, { status: 400 });
    }

    const blob = await executeIloveApiTask(file, 'convertimage', {
      to: targetFormat
    });

    return new NextResponse(blob, {
      headers: { 
        'Content-Type': `image/${targetFormat}`,
        'Content-Disposition': `attachment; filename="converted-${file.name.split('.')[0]}.${targetFormat}"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}