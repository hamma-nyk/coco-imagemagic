"use client";
import { useState } from 'react';
import { Sparkles, Download, Loader2, Image as ImageIcon, Zap, Highlighter } from 'lucide-react';

export default function EnhanceTool() {
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
      const res = await fetch('/api/enhance', { method: 'POST', body: fd });
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
        
        {/* KOLOM KIRI: INPUT SOURCE */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Source_Low_Def</h3>
          <div className={`relative border border-white/10 bg-white/[0.02] rounded-2xl p-4 transition-all duration-500 ${file ? 'border-sky-500/30 bg-sky-500/5 shadow-[0_0_20px_rgba(14,165,233,0.05)]' : 'hover:border-white/20'}`}>
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
                  <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Load_Degraded_Asset</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: OUTPUT RENDER */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em]">High_Definition_Render</h3>
          <div className="border border-white/5 bg-black/40 rounded-2xl h-[245px] flex flex-col items-center justify-center relative overflow-hidden group">
            {loading ? (
              <div className="text-center space-y-4 relative z-10">
                <div className="relative">
                  <Highlighter className="w-10 h-10 text-sky-500 animate-pulse mx-auto" />
                  <div className="absolute inset-0 bg-sky-500/20 blur-xl animate-pulse"></div>
                </div>
                <p className="text-[9px] font-mono text-sky-400 tracking-[0.2em] animate-pulse uppercase">Reconstructing_Details...</p>
              </div>
            ) : resultUrl ? (
              <div className="relative group/res animate-in zoom-in-95 duration-500 w-full h-full p-4 flex items-center justify-center">
                <img src={resultUrl} alt="Result" className="max-h-full object-contain shadow-[0_0_40px_rgba(14,165,233,0.2)] rounded-lg relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-500/5 to-transparent opacity-50"></div>
              </div>
            ) : (
              <div className="text-center space-y-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <Sparkles size={32} className="mx-auto text-white" />
                <p className="text-[9px] font-mono tracking-widest uppercase">Awaiting_Neural_Enhance</p>
              </div>
            )}
            
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={handleAction}
          disabled={loading || !file}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-sky-500 to-cyan-600 p-[1px] rounded-xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          <div className="bg-[#0a0a0c] group-hover:bg-transparent transition-colors py-4 rounded-[11px] flex justify-center items-center gap-3">
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 text-sky-500" />
            ) : (
              <>
                <Zap size={16} className="text-sky-400 group-hover:text-black transition-colors" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors">
                  Initiate_AI_Enhancement
                </span>
              </>
            )}
          </div>
        </button>

        {resultUrl && (
          <a 
            href={resultUrl} 
            download={`enhanced-${file?.name || 'result'}.jpg`} 
            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono font-bold text-sky-400 hover:bg-sky-500 hover:text-black transition-all duration-300 uppercase tracking-widest"
          >
            <Download size={14} /> Fetch_Enhanced_Asset
          </a>
        )}
      </div>
    </div>
  );
}