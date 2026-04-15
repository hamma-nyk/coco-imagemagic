"use client";
import { useState } from 'react';
import { Palette, Download, Loader2, Image as ImageIcon, Sparkles, Zap } from 'lucide-react';

export default function ColorizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");

  const handleAction = async () => {
    if (!file) return;
    setLoading(true);
    setResultUrl("");

    const fd = new FormData();
    fd.append('image', file);

    try {
      const res = await fetch('/api/colorize', { method: 'POST', body: fd });
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
        
        {/* KOLOM KIRI: INPUT */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Input_Source_BW</h3>
          <div className={`relative border border-white/10 bg-white/[0.02] rounded-2xl p-4 transition-all duration-500 ${file ? 'border-lime-500/30 bg-lime-500/5 shadow-[0_0_20px_rgba(163,230,53,0.05)]' : 'hover:border-white/20'}`}>
            <input 
              type="file" 
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setResultUrl("");
              }} 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            />
            <div className="text-center">
              {file ? (
                <div className="space-y-2">
                  <div className="relative group overflow-hidden rounded-lg bg-black/40">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="h-40 mx-auto object-contain transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 truncate px-4 uppercase italic tracking-tighter">{file.name}</p>
                </div>
              ) : (
                <div className="py-10 border border-dashed border-white/5 rounded-xl">
                  <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
                  <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Load_Monochrome_Data</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: OUTPUT */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-lime-400 uppercase tracking-[0.3em]">Neural_Restoration</h3>
          <div className="border border-white/5 bg-black/40 rounded-2xl h-[245px] flex flex-col items-center justify-center relative overflow-hidden group">
            {loading ? (
              <div className="text-center space-y-4 relative z-10">
                <div className="relative">
                  <Palette className="w-10 h-10 text-lime-500 animate-spin mx-auto opacity-80" />
                  <div className="absolute inset-0 bg-lime-500/20 blur-xl animate-pulse"></div>
                </div>
                <p className="text-[9px] font-mono text-lime-400 tracking-[0.2em] animate-pulse uppercase">Injecting_Color_Channels...</p>
              </div>
            ) : resultUrl ? (
              <div className="relative group/res animate-in zoom-in-95 duration-500 w-full h-full p-4 flex items-center justify-center">
                <img src={resultUrl} alt="Result" className="max-h-full object-contain shadow-[0_0_40px_rgba(163,230,53,0.15)] rounded-lg relative z-10" />
                {/* Decorative border glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-lime-500/5 to-transparent opacity-50"></div>
              </div>
            ) : (
              <div className="text-center space-y-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <Zap size={32} className="mx-auto text-white" />
                <p className="text-[9px] font-mono tracking-widest uppercase">Awaiting_Neural_Compute</p>
              </div>
            )}
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={handleAction}
          disabled={loading || !file}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-lime-500 to-yellow-500 p-[1px] rounded-xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          <div className="bg-[#0a0a0c] group-hover:bg-transparent transition-colors py-4 rounded-[11px] flex justify-center items-center gap-3">
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 text-lime-500" />
            ) : (
              <>
                <Sparkles size={16} className="text-lime-400 group-hover:text-black transition-colors" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors">
                  Initiate_Color_Restoration
                </span>
              </>
            )}
          </div>
        </button>

        {resultUrl && (
          <a 
            href={resultUrl} 
            download={`colorized-${file?.name || 'result'}.jpg`} 
            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono font-bold text-lime-500 hover:bg-lime-500 hover:text-black transition-all duration-300 uppercase tracking-widest"
          >
            <Download size={14} /> Download_Final_Asset
          </a>
        )}
      </div>
    </div>
  );
}