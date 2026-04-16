import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { validateRequest } from "@/lib/security";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  if (rateLimit(ip, 15).isLimited) return NextResponse.json({ error: "Limit Exceeded" }, { status: 429 });
  if (!validateRequest(req).isValid) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const text = (formData.get("text") as string) || "Kira-Kira Pixels";
    const style = formData.get("style") as string; 
    const author = formData.get("author") as string;
    const description = formData.get("description") as string;

    if (!file) throw new Error("No image provided");

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    // 1. Dinamisasi Ukuran berdasarkan Karakter agar TILE tidak terpotong
    const fontSize = Math.round(width / 25);
    // Estimasi lebar teks: jumlah karakter * rata-rata lebar font monospace
    const estimatedTextWidth = text.length * (fontSize * 0.6);
    const patternSize = Math.max(estimatedTextWidth * 1.5, width / 4);

    // Padding untuk posisi pojok
    const p = Math.round(width * 0.02); 

    const svgWatermark = Buffer.from(
      `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tile-pattern" x="0" y="0" width="${patternSize}" height="${patternSize}" patternUnits="userSpaceOnUse">
            <text 
              x="50%" 
              y="50%" 
              text-anchor="middle" 
              fill="white" 
              fill-opacity="0.25" 
              font-family="monospace" 
              font-size="${fontSize}px" 
              font-weight="bold"
              transform="rotate(-30, ${patternSize/2}, ${patternSize/2})"
            >
              ${text}
            </text>
          </pattern>
        </defs>

        <style>
          .wm-text { 
            fill: white; 
            fill-opacity: 0.5; 
            font-family: monospace; 
            font-size: ${fontSize}px; 
            font-weight: bold; 
          }
        </style>

        ${(() => {
          switch (style) {
            case 'tile':
              return `<rect width="100%" height="100%" fill="url(#tile-pattern)" />`;
            case 'center':
              return `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="wm-text">${text}</text>`;
            case 'top-left':
              return `<text x="${p}" y="${p + fontSize}" text-anchor="start" class="wm-text">${text}</text>`;
            case 'top-right':
              return `<text x="${width - p}" y="${p + fontSize}" text-anchor="end" class="wm-text">${text}</text>`;
            case 'bottom-left':
              return `<text x="${p}" y="${height - p}" text-anchor="start" class="wm-text">${text}</text>`;
            case 'bottom-right':
            default:
              return `<text x="${width - p}" y="${height - p}" text-anchor="end" class="wm-text">${text}</text>`;
          }
        })()}
      </svg>`
    );

    const processedImage = await sharp(buffer)
      .composite([{ input: svgWatermark, blend: 'over' }])
      .withMetadata({
        exif: {
          IFD0: {
            Artist: author || "Kira-Kira Pixels",
            ImageDescription: description || "Neural Protected Asset",
            Copyright: `© ${new Date().getFullYear()} ${author || "Kira-Kira Pixels"}`,
          }
        }
      })
      .toBuffer();

    return new NextResponse(new Uint8Array(processedImage), {
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="protected-${file.name}"`,
      },
    });
  } catch (error: any) {
    console.error("Watermark Error:", error);
    return NextResponse.json({ error: "Neural processing failed" }, { status: 500 });
  }
}