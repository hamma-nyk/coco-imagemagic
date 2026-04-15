// lib/cutout-service.ts

const CUTOUT_KEYS = [
  process.env.CUTOUT_API_KEY,
];

export type CutoutTool = 'photoEnhance' | 'colorize';

export async function executeCutoutTask(
  file: File,
  tool: CutoutTool
) {
  let lastError = null;

  for (let i = 0; i < CUTOUT_KEYS.length; i++) {
    const currentKey = CUTOUT_KEYS[i];
    if (!currentKey) continue;

    try {
      console.log(`[Cutout.pro] Inisialisasi ${tool} dengan Key #${i + 1}`);

      // Tentukan URL berdasarkan tool
      const url = tool === 'photoEnhance' 
        ? 'https://www.cutout.pro/api/v1/photoEnhance' 
        : 'https://www.cutout.pro/api/v1/matting?mattingType=19';

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'APIKEY': currentKey
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      
      // Cutout.pro terkadang mengembalikan JSON jika error meskipun status 200
      // Kita cek jika blob sizenya terlalu kecil (biasanya pesan error JSON)
      if (blob.type === 'application/json') {
        const text = await blob.text();
        const json = JSON.parse(text);
        if (json.code !== 0) throw new Error(json.msg || "Limit Habis atau Error API");
      }

      console.log(`[Cutout.pro] ✅ Sukses dengan Key #${i + 1}`);
      return blob;

    } catch (error: any) {
      console.error(`[Cutout.pro] Key #${i + 1} Gagal:`, error.message);
      lastError = error;
    }
  }

  throw new Error(`Semua API Key Cutout gagal. ${lastError?.message}`);
}