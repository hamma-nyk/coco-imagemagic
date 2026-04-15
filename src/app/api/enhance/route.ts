import { NextRequest, NextResponse } from 'next/server';
import { executeCutoutTask } from '@/lib/cutout-service';
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
    const blob = await executeCutoutTask(file, 'photoEnhance');
    return new NextResponse(blob, { headers: { 'Content-Type': 'image/jpeg' } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}