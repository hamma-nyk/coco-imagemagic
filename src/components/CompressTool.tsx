"use client";
import { useState } from 'react';
import { Zap, Download, Loader2, Image as ImageIcon } from 'lucide-react';

export default function CompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAction = async () => {
    if (!file) return;
    setLoading(true);
    setResultUrl("");
    setCompressedSize(null);

    const fd = new FormData();
    fd.append('image', file);
    fd.append('level', 'recommended');

    try {
      const res = await fetch('/api/compress', { method: 'POST', body: fd });
      if (res.ok) {
        const blob = await res.blob();
        setCompressedSize(blob.size);
        setResultUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error("Compression error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* KOLOM KIRI: INPUT SOURCE */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Input_Raw_Buffer</h3>
          <div className={`relative border border-white/10 bg-white/[0.02] rounded-2xl p-4 transition-all duration-500 ${file ? 'border-orange-500/30 bg-orange-500/5 shadow-[0_0_20px_rgba(249,115,22,0.05)]' : 'hover:border-white/20'}`}>
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
                  <div className="flex justify-between items-center px-2">
                    <p className="text-[10px] font-mono text-slate-400 truncate max-w-[120px] uppercase italic tracking-tighter">{file.name}</p>
                    <p className="text-[10px] text-orange-400 font-bold font-mono">{formatSize(file.size)}</p>
                  </div>
                </div>
              ) : (
                <div className="py-10 border border-dashed border-white/5 rounded-xl">
                  <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
                  <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Load_Uncompressed_Data</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: OPTIMIZED OUTPUT */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-orange-400 uppercase tracking-[0.3em]">Optimized_Output</h3>
          <div className="border border-white/5 bg-black/40 rounded-2xl h-[245px] flex flex-col items-center justify-center relative overflow-hidden group">
            {loading ? (
              <div className="text-center space-y-4 relative z-10">
                <div className="relative">
                  <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto opacity-80" />
                  <div className="absolute inset-0 bg-orange-500/20 blur-xl animate-pulse"></div>
                </div>
                <p className="text-[9px] font-mono text-orange-400 tracking-[0.2em] animate-pulse uppercase">Recoding_Data_Blocks...</p>
              </div>
            ) : resultUrl ? (
              <div className="relative group/res animate-in zoom-in-95 duration-500 w-full h-full p-4 flex items-center justify-center">
                <img src={resultUrl} alt="Result" className="max-h-full object-contain shadow-[0_0_40px_rgba(249,115,22,0.15)] rounded-lg relative z-10" />
                <div className="absolute bottom-4 left-0 right-0 px-6 z-20 flex justify-between items-center">
                  <p className="text-[9px] font-mono text-slate-400 italic bg-black/60 px-2 py-0.5 rounded">Ready_Signal</p>
                  <p className="text-[10px] text-green-400 font-bold font-mono bg-black/60 px-2 py-0.5 rounded">{formatSize(compressedSize || 0)}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent opacity-50"></div>
              </div>
            ) : (
              <div className="text-center space-y-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <Zap size={32} className="mx-auto text-white" />
                <p className="text-[9px] font-mono tracking-widest uppercase">Standing_By_For_Compression</p>
              </div>
            )}
            
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
            
            {/* Animasi Scanline saat Loading */}
            {loading && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-1 bg-orange-500/40 blur-sm animate-[scan_2s_linear_infinite]"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={handleAction}
          disabled={loading || !file}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-orange-500 to-amber-600 p-[1px] rounded-xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          <div className="bg-[#0a0a0c] group-hover:bg-transparent transition-colors py-4 rounded-[11px] flex justify-center items-center gap-3">
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 text-orange-500" />
            ) : (
              <>
                <Zap size={16} className="text-orange-400 group-hover:text-black transition-colors" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors">
                  Execute_Compression_Sequence
                </span>
              </>
            )}
          </div>
        </button>

        {resultUrl && (
          <div className="flex gap-3">
             <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 flex items-center justify-between">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Ratio_Reduced</span>
                <span className="text-xs font-mono font-bold text-orange-400">
                  -{Math.round(((file!.size - compressedSize!) / file!.size) * 100)}%
                </span>
             </div>
             <a 
                href={resultUrl} 
                download={`compressed-${file?.name || 'result'}.jpg`} 
                className="flex items-center justify-center gap-2 py-3 px-8 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono font-bold text-orange-500 hover:bg-orange-500 hover:text-black transition-all duration-300 uppercase tracking-widest shadow-[0_0_15px_rgba(249,115,22,0.1)]"
              >
                <Download size={14} /> Fetch_Asset
              </a>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-10px); }
          100% { transform: translateY(250px); }
        }
      `}</style>
    </div>
  );
}