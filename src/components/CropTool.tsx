"use client";
import { useState, useRef } from "react";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Crop as CropIcon,
  Download,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

export default function CropTool() {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setResultUrl("");
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || ""),
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  const handleAction = async () => {
    if (!completedCrop || !imgRef.current) return;
    setLoading(true);

    const image = imgRef.current;

    // --- LOGIKA SKALASI ---
    // Kita hitung rasio antara ukuran asli (natural) dan ukuran tampilan (client)
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const fd = new FormData();
    const response = await fetch(imgSrc);
    const blob = await response.blob();

    fd.append("image", blob, "image.jpg");

    // Kirim koordinat yang SUDAH DISKALA ke backend
    fd.append("x", String(Math.round(completedCrop.x * scaleX)));
    fd.append("y", String(Math.round(completedCrop.y * scaleY)));
    fd.append("width", String(Math.round(completedCrop.width * scaleX)));
    fd.append("height", String(Math.round(completedCrop.height * scaleY)));

    try {
      const res = await fetch("/api/crop", { method: "POST", body: fd });
      if (res.ok) {
        const resultBlob = await res.blob();
        setResultUrl(URL.createObjectURL(resultBlob));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* KOLOM KIRI: EDITOR */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
            Manual_Extraction_Interface
          </h3>
          <div className="relative border border-white/10 bg-white/[0.02] rounded-2xl p-4 transition-all">
            {!imgSrc ? (
              <div className="py-12 text-center border border-dashed border-white/5 rounded-xl">
                <input
                  type="file"
                  onChange={onSelectFile}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
                <p className="text-[10px] font-mono text-slate-600 uppercase">
                  Input_Asset_To_Slice
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  className="max-h-[400px] overflow-hidden rounded-lg"
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    className="max-h-[400px] object-contain"
                  />
                </ReactCrop>
                <button
                  onClick={() => setImgSrc("")}
                  className="mt-4 text-[9px] font-mono text-rose-500 underline uppercase"
                >
                  Reset_Source
                </button>
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: PREVIEW */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.3em]">
            Cropped_Buffer_Preview
          </h3>
          <div className="border border-white/5 bg-black/40 rounded-2xl h-[300px] flex flex-col items-center justify-center relative overflow-hidden group">
            {loading ? (
              <div className="text-center animate-pulse">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-2" />
                <p className="text-[9px] font-mono text-emerald-400 uppercase">
                  Slicing_Pixels...
                </p>
              </div>
            ) : resultUrl ? (
              <img
                src={resultUrl}
                alt="Result"
                className="max-h-full p-4 object-contain animate-in zoom-in-95"
              />
            ) : (
              <div className="text-center opacity-10">
                <CropIcon size={40} className="mx-auto mb-2" />
                <p className="text-[9px] font-mono uppercase">
                  Awaiting_Selection
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleAction}
          disabled={loading || !completedCrop}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 p-[1px] rounded-xl transition-all active:scale-[0.98] disabled:opacity-30"
        >
          <div className="bg-[#0a0a0c] group-hover:bg-transparent transition-colors py-4 rounded-[11px] flex justify-center items-center gap-3">
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 text-emerald-500" />
            ) : (
              <>
                <CropIcon
                  size={16}
                  className="text-emerald-400 group-hover:text-black"
                />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-black">
                  Confirm_Slicing_Sequence
                </span>
              </>
            )}
          </div>
        </button>

        {resultUrl && (
          <a
            href={resultUrl}
            download="cropped-image.jpg"
            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono font-bold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all uppercase tracking-widest"
          >
            <Download size={14} /> Fetch_Cropped_Asset
          </a>
        )}
      </div>
    </div>
  );
}
