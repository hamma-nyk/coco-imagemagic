// lib/iloveapi-service.ts

const ILOVEAPI_KEYS = [
  process.env.ILOVEAPI_PUBLIC_KEY,
  // Tambahkan key cadangan lainnya di .env
];

export async function executeIloveApiTask(
  file: File,
  tool: "resizeimage" | "compressimage" | "upscaleimage" | "removebackgroundimage" | "convertimage",
  params: Record<string, any>
) {
  let lastError = null;

  // Loop melalui kunci yang tersedia (Multi-key Fallback)
  for (let i = 0; i < ILOVEAPI_KEYS.length; i++) {
    const currentKey = ILOVEAPI_KEYS[i];
    if (!currentKey) continue;

    try {
      console.log(`[iLoveAPI] Inisialisasi ${tool} dengan Key #${i + 1}`);

      // --- 1. AUTHENTICATION ---
      const authRes = await fetch("https://api.ilovepdf.com/v1/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_key: currentKey }),
      });
      const authData = await authRes.json();
      if (!authData.token) throw new Error("Auth gagal atau Limit Habis");
      const token = authData.token;

      // --- 2. START TASK ---
      const startRes = await fetch(`https://api.ilovepdf.com/v1/start/${tool}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { server, task } = await startRes.json();

      // --- 3. UPLOAD ---
      const uploadData = new FormData();
      uploadData.append("task", task);
      uploadData.append("file", file);

      const uploadRes = await fetch(`https://${server}/v1/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });
      const { server_filename } = await uploadRes.json();

      // --- 4. PROCESS ---
      // Siapkan payload dinamis berdasarkan tool
      const processPayload: any = {
        task: task,
        tool: tool,
        files: [{
          server_filename: server_filename,
          filename: file.name,
        }],
      };

      // Merge parameter spesifik (multiplier, quality, width, dll)
      Object.assign(processPayload, params);

      const processRes = await fetch(`https://${server}/v1/process`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processPayload),
      });

      const processData = await processRes.json();
      if (processData.status !== "TaskSuccess") {
        throw new Error(`Proses gagal: ${processData.status}`);
      }

      // --- 5. DOWNLOAD ---
      const downloadRes = await fetch(`https://${server}/v1/download/${task}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`[iLoveAPI] ✅ Sukses dengan Key #${i + 1}`);
      return await downloadRes.blob();

    } catch (error: any) {
      console.error(`[iLoveAPI] Key #${i + 1} Gagal:`, error.message);
      lastError = error;
      // Lanjut ke iterasi berikutnya (mencoba key selanjutnya)
    }
  }

  throw new Error(`Semua API Key gagal. Error terakhir: ${lastError?.message}`);
}