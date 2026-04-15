import { NextRequest, NextResponse } from 'next/server';
import { executeIloveApiTask } from '@/lib/iloveapi-service';
import { validateRequest } from '@/lib/security';
import { rateLimit } from '@/lib/ratelimit';

export async function POST(req: NextRequest) {
  // 1. Ambil IP Pengguna
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  
  // 2. Cek Rate Limit (Contoh: Max 5 request per menit per IP)
  const limitCheck = rateLimit(ip, 5);
  if (limitCheck.isLimited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in 1 minute.", code: 'RATE_LIMIT_EXCEEDED' }, 
      { status: 429 } // HTTP 429: Too Many Requests
    );
  }
  // --- PROTEKSI START ---
  const check = validateRequest(req);
  if (!check.isValid) {
    return NextResponse.json(
      { error: check.message, code: 'UNAUTHORIZED_ACCESS' }, 
      { status: 403 }
    );
  }
  // --- PROTEKSI END ---
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