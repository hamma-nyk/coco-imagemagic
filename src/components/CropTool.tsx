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
  Circle,
  Square,
  Maximize2,
} from "lucide-react";

export default function CropTool() {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isCircle, setIsCircle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);

  // Helper untuk inisialisasi center crop saat ganti ratio
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
  const { width, height } = e.currentTarget;
  // Jika ada aspect, buat kotak sesuai aspect. Jika tidak, buat kotak bebas.
  const initialCrop = centerCrop(
    makeAspectCrop(
      { unit: "%", width: 90 }, 
      aspect || 1, // Fallback ke 1:1 jika Free
      width, 
      height
    ), 
    width, 
    height
  );
  
  if (aspect === undefined) {
    delete initialCrop.aspect;
  }
  
  setCrop(initialCrop);
}

  function handleSetAspect(ratio: number | undefined, circleMode: boolean = false) {
  // Update state aspect dan mode circle
  setAspect(ratio);
  setIsCircle(circleMode);
  
  if (imgRef.current) {
    const { width, height } = imgRef.current;
    
    // Paksa pembuatan crop baru agar UI me-refresh bentuk mask-nya
    const newCrop = centerCrop(
      makeAspectCrop(
        { 
          unit: "%", 
          width: 90 
        }, 
        ratio || 1, // Jika ratio undefined (Free), gunakan default 1 sementara untuk inisialisasi
        width, 
        height
      ),
      width,
      height
    );

    // Jika pilih "Free", hapus aspek rasio setelah inisialisasi awal
    if (ratio === undefined) {
      newCrop.aspect = undefined;
    }

    setCrop(newCrop);
  }
}

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setResultUrl("");
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  const handleAction = async () => {
    if (!completedCrop || !imgRef.current) return;
    setLoading(true);

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const fd = new FormData();
    const response = await fetch(imgSrc);
    const blob = await response.blob();

    fd.append("image", blob, "image.jpg");
    fd.append("x", String(Math.round(completedCrop.x * scaleX)));
    fd.append("y", String(Math.round(completedCrop.y * scaleY)));
    fd.append("width", String(Math.round(completedCrop.width * scaleX)));
    fd.append("height", String(Math.round(completedCrop.height * scaleY)));
    fd.append("isCircle", String(isCircle)); // Flag untuk API Sharp

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
        
        {/* KOLOM KIRI: EDITOR & RATIO */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
            Manual_Extraction_Interface
          </h3>
          
          <div className="relative border border-white/10 bg-white/[0.02] rounded-2xl p-4 transition-all overflow-hidden">
            {!imgSrc ? (
              <div className="py-12 text-center border border-dashed border-white/5 rounded-xl">
                <input type="file" onChange={onSelectFile} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
                <p className="text-[10px] font-mono text-slate-600 uppercase">Input_Asset_To_Slice</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ReactCrop
  crop={crop}
  onChange={(c) => setCrop(c)}
  onComplete={(c) => setCompletedCrop(c)}
  aspect={aspect}          // Mengatur batasan rasio kotak
  circularCrop={isCircle}   // Mengatur bentuk visual (Lingkaran vs Kotak)
  className="max-h-[400px] overflow-hidden rounded-lg"
>
  <img ref={imgRef} alt="Crop source" src={imgSrc} onLoad={onImageLoad} className="max-h-[400px] object-contain" />
</ReactCrop>
                <button onClick={() => setImgSrc("")} className="mt-4 text-[9px] font-mono text-rose-500 underline uppercase tracking-widest">
                  Reset_Source
                </button>
              </div>
            )}
          </div>

          {/* RATIO SELECTOR PANEL */}
          <div className="grid grid-cols-4 gap-2">
             {[
               { label: 'FREE', icon: <Maximize2 size={12}/>, ratio: undefined, circ: false },
               { label: '1:1', icon: <Square size={12}/>, ratio: 1, circ: false },
               { label: 'CIRCLE', icon: <Circle size={12}/>, ratio: 1, circ: true },
               { label: '16:9', icon: <ImageIcon size={12}/>, ratio: 16/9, circ: false },
             ].map((opt) => (
               <button
                 key={opt.label}
                 onClick={() => handleSetAspect(opt.ratio, opt.circ)}
                 className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border font-mono text-[9px] transition-all ${
                   (aspect === opt.ratio && isCircle === opt.circ) 
                   ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                   : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/20'
                 }`}
               >
                 {opt.icon}
                 {opt.label}
               </button>
             ))}
          </div>
        </div>

        {/* KOLOM KANAN: PREVIEW */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.3em]">
            Cropped_Buffer_Preview
          </h3>
          <div className="border border-white/5 bg-black/40 rounded-2xl h-[335px] flex flex-col items-center justify-center relative overflow-hidden group">
            {/* Transparency Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: 'conic-gradient(#fff 0.25turn, #000 0.25turn 0.5turn, #fff 0.5turn 0.75turn, #000 0.75turn)', backgroundSize: '16px 16px' }}></div>
            
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
              {loading ? (
                <div className="text-center animate-pulse">
                  <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-2" />
                  <p className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">Slicing_Pixels...</p>
                </div>
              ) : resultUrl ? (
                <img src={resultUrl} alt="Result" className="max-h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] animate-in zoom-in-95 duration-500" />
              ) : (
                <div className="text-center opacity-10">
                  <CropIcon size={40} className="mx-auto mb-2 text-white" />
                  <p className="text-[9px] font-mono uppercase text-white">Awaiting_Selection</p>
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleAction}
          disabled={loading || !completedCrop}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 p-[1px] rounded-xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          <div className="bg-[#0a0a0c] group-hover:bg-transparent transition-colors py-4 rounded-[11px] flex justify-center items-center gap-3">
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 text-emerald-500" />
            ) : (
              <>
                <CropIcon size={16} className="text-emerald-400 group-hover:text-black transition-colors" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors">
                  Confirm_Slicing_Sequence
                </span>
              </>
            )}
          </div>
        </button>

        {resultUrl && (
          <a
            href={resultUrl}
            download={`cropped-${Date.now()}.${isCircle ? 'png' : 'jpg'}`}
            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono font-bold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all uppercase tracking-widest"
          >
            <Download size={14} /> Fetch_Cropped_Asset
          </a>
        )}
      </div>
    </div>
  );
}