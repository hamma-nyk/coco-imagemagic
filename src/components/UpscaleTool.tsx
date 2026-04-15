"use client";
import { useState } from 'react';
import { Maximize, Download, Loader2, Image as ImageIcon, Zap, Sparkles } from 'lucide-react';

export default function UpscaleTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [scale, setScale] = useState(2);
  const [originalDim, setOriginalDim] = useState({ width: 0, height: 0 });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setResultUrl("");

    if (selectedFile) {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);
      img.onload = () => {
        setOriginalDim({ width: img.width, height: img.height });
      };
    }
  };

  const handleAction = async () => {
    if (!file) return;
    setLoading(true);
    setResultUrl("");

    const fd = new FormData();
    fd.append('image', file);
    fd.append('scale', String(scale));

    try {
      const res = await fetch('/api/upscale', { method: 'POST', body: fd });
      if (res.ok) {
        const blob = await res.blob();
        setResultUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error("Upscale error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* KOLOM KIRI: INPUT & MULTIPLIER */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Source_Low_Resolution</h3>
          <div className={`relative border border-white/10 bg-white/[0.02] rounded-2xl p-4 transition-all duration-500 ${file ? 'border-purple-500/30 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.05)]' : 'hover:border-white/20'}`}>
            <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <div className="text-center">
              {file ? (
                <div className="space-y-2">
                  <div className="relative group overflow-hidden rounded-lg bg-black/40">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="h-40 mx-auto object-contain transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <p className="text-[10px] font-mono text-purple-400 font-bold tracking-tighter uppercase italic">
                    Base: {originalDim.width}px × {originalDim.height}px
                  </p>
                </div>
              ) : (
                <div className="py-10 border border-dashed border-white/5 rounded-xl">
                  <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
                  <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Load_Low_Res_Data</p>
                </div>
              )}
            </div>
          </div>

          {/* MULTIPLIER SELECTOR PANEL */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Enhancement_Multiplier</h4>
            <div className="grid grid-cols-2 gap-3">
              {[2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`relative overflow-hidden py-3 rounded-xl border font-mono transition-all duration-300 ${
                    scale === s 
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                    : 'border-white/5 bg-black/20 text-slate-500 hover:border-white/20'
                  }`}
                >
                  <span className="relative z-10 text-base font-bold">{s}X</span>
                  <p className="relative z-10 text-[8px] uppercase tracking-tighter opacity-60">Scale_Factor</p>
                  {scale === s && (
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: OUTPUT */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.3em]">AI_Enhanced_Render</h3>
          <div className="border border-white/5 bg-black/40 rounded-2xl h-[335px] flex flex-col items-center justify-center relative overflow-hidden group">
            {loading ? (
              <div className="text-center space-y-4 relative z-10">
                <div className="relative">
                  <Sparkles className="w-10 h-10 text-purple-500 animate-pulse mx-auto opacity-80" />
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl animate-pulse"></div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-mono text-purple-400 tracking-[0.2em] animate-pulse uppercase">AI_Reconstructing_Pixels...</p>
                  <p className="text-[8px] font-mono text-slate-600 italic uppercase">
                    Target: {originalDim.width * scale}px × {originalDim.height * scale}px
                  </p>
                </div>
              </div>
            ) : resultUrl ? (
              <div className="relative animate-in zoom-in-95 duration-500 w-full h-full p-6 flex flex-col items-center justify-center">
                <img src={resultUrl} alt="Result" className="max-h-[210px] object-contain shadow-[0_0_40px_rgba(168,85,247,0.2)] border border-white/10 rounded-lg relative z-10" />
                <div className="mt-6 pt-4 border-t border-white/5 w-full text-center">
                   <p className="text-[10px] font-mono text-green-400 uppercase tracking-widest font-bold">
                     Enhanced_Resolution: {originalDim.width * scale} × {originalDim.height * scale}
                   </p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <Zap size={32} className="mx-auto text-white" />
                <p className="text-[9px] font-mono tracking-widest uppercase text-white">Awaiting_Neural_Compute</p>
              </div>
            )}
            
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.05] pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={handleAction}
          disabled={loading || !file}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-700 p-[1px] rounded-xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          <div className="bg-[#0a0a0c] group-hover:bg-transparent transition-colors py-4 rounded-[11px] flex justify-center items-center gap-3">
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 text-purple-500" />
            ) : (
              <>
                <Sparkles size={16} className="text-purple-400 group-hover:text-black transition-colors" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors">
                  Initiate_Neural_Upscale
                </span>
              </>
            )}
          </div>
        </button>

        {resultUrl && (
          <a 
            href={resultUrl} 
            download={`upscaled-${scale}x-${file?.name || 'result'}.jpg`}
            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono font-bold text-purple-400 hover:bg-purple-500 hover:text-black transition-all duration-300 uppercase tracking-widest"
          >
            <Download size={14} /> Fetch_HD_Asset
          </a>
        )}
      </div>
    </div>
  );
}