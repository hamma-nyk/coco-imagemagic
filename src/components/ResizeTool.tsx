"use client";
import { useState } from 'react';
import { Minimize2, Download, Loader2, Image as ImageIcon, Link as LinkIcon, Link2Off } from 'lucide-react';

export default function ResizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [originalDim, setOriginalDim] = useState({ width: 0, height: 0 });
  const [maintainAspect, setMaintainAspect] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setResultUrl("");

    if (selectedFile) {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
        setOriginalDim({ width: img.width, height: img.height });
      };
    }
  };

  const updateWidth = (w: number) => {
    if (maintainAspect && originalDim.width > 0) {
      const ratio = originalDim.height / originalDim.width;
      setDimensions({ width: w, height: Math.round(w * ratio) });
    } else {
      setDimensions({ ...dimensions, width: w });
    }
  };

  const updateHeight = (h: number) => {
    if (maintainAspect && originalDim.height > 0) {
      const ratio = originalDim.width / originalDim.height;
      setDimensions({ height: h, width: Math.round(h * ratio) });
    } else {
      setDimensions({ ...dimensions, height: h });
    }
  };

  const handleAction = async () => {
    if (!file) return;
    setLoading(true);
    setResultUrl("");

    const fd = new FormData();
    fd.append('image', file);
    fd.append('width', String(dimensions.width));
    fd.append('height', String(dimensions.height));

    try {
      const res = await fetch('/api/resize', { method: 'POST', body: fd });
      if (res.ok) {
        const blob = await res.blob();
        setResultUrl(URL.createObjectURL(blob));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* KOLOM KIRI: INPUT & CONTROLS */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Source_Asset_Buffer</h3>
          <div className={`relative border border-white/10 bg-white/[0.02] rounded-2xl p-4 transition-all duration-500 ${file ? 'border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'hover:border-white/20'}`}>
            <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <div className="text-center">
              {file ? (
                <div className="space-y-2">
                  <div className="relative group overflow-hidden rounded-lg bg-black/40">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="h-40 mx-auto object-contain transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <p className="text-[10px] font-mono text-cyan-400 font-bold tracking-tighter uppercase italic">
                    Original: {originalDim.width}px × {originalDim.height}px
                  </p>
                </div>
              ) : (
                <div className="py-10 border border-dashed border-white/5 rounded-xl">
                  <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
                  <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Load_Neural_Asset</p>
                </div>
              )}
            </div>
          </div>

          {/* RESIZE SETTINGS PANEL */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Dimension_Settings</h4>
              <button 
                onClick={() => setMaintainAspect(!maintainAspect)}
                className={`p-1.5 rounded-md transition-all duration-300 ${maintainAspect ? 'text-cyan-400 bg-cyan-400/10 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-slate-600 bg-white/5'}`}
              >
                {maintainAspect ? <LinkIcon size={14} /> : <Link2Off size={14} />}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-600 ml-1 uppercase">Width_PX</label>
                <input 
                  type="number" 
                  value={dimensions.width}
                  onChange={(e) => updateWidth(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/10 rounded-lg py-2 px-3 font-mono text-cyan-400 text-xs focus:border-cyan-500/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-600 ml-1 uppercase">Height_PX</label>
                <input 
                  type="number" 
                  value={dimensions.height}
                  onChange={(e) => updateHeight(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/10 rounded-lg py-2 px-3 font-mono text-cyan-400 text-xs focus:border-cyan-500/50 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: OUTPUT */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em]">Reconstructed_Buffer</h3>
          <div className="border border-white/5 bg-black/40 rounded-2xl h-[335px] flex flex-col items-center justify-center relative overflow-hidden group">
            {loading ? (
              <div className="text-center space-y-4 relative z-10">
                <div className="relative">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto opacity-80" />
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse"></div>
                </div>
                <p className="text-[9px] font-mono text-blue-400 tracking-[0.2em] animate-pulse uppercase">Recalculating_Geometry...</p>
              </div>
            ) : resultUrl ? (
              <div className="relative animate-in zoom-in-95 duration-500 w-full h-full p-6 flex flex-col items-center justify-center">
                <img src={resultUrl} alt="Result" className="max-h-[200px] object-contain shadow-[0_0_40px_rgba(59,130,246,0.15)] rounded-lg relative z-10" />
                <div className="mt-6 pt-4 border-t border-white/5 w-full text-center">
                   <p className="text-[10px] font-mono text-green-400 uppercase tracking-widest font-bold">
                     Resolution_Set: {dimensions.width} × {dimensions.height}
                   </p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <Minimize2 size={32} className="mx-auto text-white" />
                <p className="text-[9px] font-mono tracking-widest uppercase text-white">Awaiting_Command</p>
              </div>
            )}
            
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>

            {/* Scanline Animation Effect */}
            {loading && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-1 bg-blue-500/40 blur-sm animate-[scan_2s_linear_infinite]"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={handleAction}
          disabled={loading || !file || dimensions.width <= 0}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 p-[1px] rounded-xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          <div className="bg-[#0a0a0c] group-hover:bg-transparent transition-colors py-4 rounded-[11px] flex justify-center items-center gap-3">
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
            ) : (
              <>
                <Minimize2 size={16} className="text-cyan-400 group-hover:text-black transition-colors" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors">
                  Execute_Resize_Sequence
                </span>
              </>
            )}
          </div>
        </button>

        {resultUrl && (
          <a 
            href={resultUrl} 
            download={`resized-${file?.name || 'result'}`}
            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono font-bold text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all duration-300 uppercase tracking-widest"
          >
            <Download size={14} /> Fetch_Geometric_Asset
          </a>
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-10px); }
          100% { transform: translateY(340px); }
        }
      `}</style>
    </div>
  );
}