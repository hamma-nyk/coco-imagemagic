import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { validateRequest } from "@/lib/security";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  // 1. Ambil IP Pengguna
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  // 2. Cek Rate Limit (Contoh: Max 5 request per menit per IP)
  const limitCheck = rateLimit(ip, 5);
  if (limitCheck.isLimited) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again in 1 minute.",
        code: "RATE_LIMIT_EXCEEDED",
      },
      { status: 429 }, // HTTP 429: Too Many Requests
    );
  }
  // --- PROTEKSI START ---
  const check = validateRequest(req);
  if (!check.isValid) {
    return NextResponse.json(
      { error: check.message, code: "UNAUTHORIZED_ACCESS" },
      { status: 403 },
    );
  }
  // --- PROTEKSI END ---
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    // Ambil data koordinat crop dari frontend
    const x = Math.round(Number(formData.get("x")));
    const y = Math.round(Number(formData.get("y")));
    const width = Math.round(Number(formData.get("width")));
    const height = Math.round(Number(formData.get("height")));

    if (!file) throw new Error("No image provided");

    // Konversi File ke Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // --- PROSES CROP LOKAL DENGAN SHARP ---
    const croppedBuffer = await sharp(buffer)
      .extract({ left: x, top: y, width: width, height: height })
      .toBuffer();

    return new NextResponse(croppedBuffer, {
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="cropped-${file.name}"`,
      },
    });
  } catch (error: any) {
    console.error("Crop error:", error);
    return NextResponse.json(
      { error: "Failed to crop image" },
      { status: 500 },
    );
  }
}
