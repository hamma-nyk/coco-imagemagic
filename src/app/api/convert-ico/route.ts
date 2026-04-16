import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { validateRequest } from "@/lib/security";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  if (rateLimit(ip, 20).isLimited) return NextResponse.json({ error: "Limit Exceeded" }, { status: 429 });
  if (!validateRequest(req).isValid) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const selectedSizes = JSON.parse(formData.get("sizes") as string) as number[];

    if (!file || selectedSizes.length === 0) throw new Error("Missing data");

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    // 1. Generate PNG buffer untuk setiap ukuran yang dipilih menggunakan Sharp
    const pngBuffers = await Promise.all(
      selectedSizes.map((size) =>
        sharp(inputBuffer)
          .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer()
      )
    );

    // 2. Gabungkan semua PNG buffer menjadi satu file ICO
    const icoBuffer = await pngToIco(pngBuffers);

    return new NextResponse(icoBuffer, {
      headers: {
        "Content-Type": "image/x-icon",
        "Content-Disposition": `attachment; filename="${file.name.split('.')[0]}.ico"`,
      },
    });
  } catch (error: any) {
    console.error("ICO Conversion Error:", error);
    return NextResponse.json({ error: "Failed to generate ICO" }, { status: 500 });
  }
}