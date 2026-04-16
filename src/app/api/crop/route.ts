// app/api/crop/route.ts
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { validateRequest } from "@/lib/security";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  // 1. Ambil IP Pengguna
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  // 2. Cek Rate Limit
  const limitCheck = rateLimit(ip, 30);
  if (limitCheck.isLimited) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again in 1 minute.",
        code: "RATE_LIMIT_EXCEEDED",
      },
      { status: 429 }
    );
  }

  // 3. Validasi Keamanan (Referer & Origin)
  const check = validateRequest(req);
  if (!check.isValid) {
    return NextResponse.json(
      { error: check.message, code: "UNAUTHORIZED_ACCESS" },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const isCircle = formData.get("isCircle") === "true"; // Ambil flag isCircle

    // Ambil koordinat
    const x = Math.round(Number(formData.get("x")));
    const y = Math.round(Number(formData.get("y")));
    const width = Math.round(Number(formData.get("width")));
    const height = Math.round(Number(formData.get("height")));

    if (!file) throw new Error("No image provided");

    const buffer = Buffer.from(await file.arrayBuffer());

    // --- LOGIKA PEMROSESAN LOKAL (SHARP) ---
    
    // Tahap 1: Ekstraksi area kotak (Dasar untuk semua mode)
    let pipeline = sharp(buffer).extract({ left: x, top: y, width, height });

    if (isCircle) {
      // Tahap 2: Jika Circle, buat Masking SVG
      // Lingkaran sempurna membutuhkan radius = lebar / 2
      const radius = width / 2;
      const svgMask = Buffer.from(
        `<svg width="${width}" height="${height}">
          <circle cx="${radius}" cy="${radius}" r="${radius}" fill="black" />
        </svg>`
      );

      // Gunakan blend 'dest-in' untuk memotong area di luar lingkaran menjadi transparan
      pipeline = pipeline.composite([
        {
          input: svgMask,
          blend: "dest-in",
        },
      ]);
    }

    // Tahap 3: Finalisasi Buffer
    // Jika circle, WAJIB PNG agar transparansi (alpha channel) tidak hilang
    const finalBuffer = isCircle 
      ? await pipeline.png().toBuffer() 
      : await pipeline.toBuffer();

    return new NextResponse(new Uint8Array(finalBuffer), {
      headers: {
        "Content-Type": isCircle ? "image/png" : file.type,
        "Content-Disposition": `attachment; filename="cropped-${file.name}${isCircle ? '.png' : ''}"`,
      },
    });

  } catch (error: any) {
    console.error("Crop error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during image processing" },
      { status: 500 }
    );
  }
}