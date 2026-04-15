"use client";
import { useState } from 'react';
import { RefreshCw, Download, Loader2, Image as ImageIcon, FileType } from 'lucide-react';

const FORMATS = ['jpg', 'png', 'webp', 'tiff', 'gif'];

export default function ConvertTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [targetFormat, setTargetFormat] = useState("webp");

  const handleAction = async () => {
    if (!file) return;
    setLoading(true);
    setResultUrl("");

    const fd = new FormData();
    fd.append('image', file);
    fd.append('to', targetFormat);

    try {
      const res = await fetch('/api/convert', { method: 'POST', body: fd });
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
        
        {/* KOLOM KIRI: INPUT & SELECTOR */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Source_Encoding</h3>
            <div className={`relative border border-white/10 bg-white/[0.02] rounded-2xl p-4 transition-all duration-500 ${file ? 'border-amber-500/30 bg-amber-500/5' : 'hover:border-white/20'}`}>
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
                    <img src={URL.createObjectURL(file)} alt="Preview" className="h-32 mx-auto object-contain rounded-lg shadow-2xl" />
                    <p className="text-[10px] font-mono text-amber-500 uppercase font-bold tracking-tighter">
                      Detected: {file.type.split('/')[1].toUpperCase()}
                    </p>
                  </div>
                ) : (
                  <div className="py-8 border border-dashed border-white/5 rounded-xl">
                    <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Load_Byte_Data</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TARGET SELECTOR */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase ml-1 tracking-[0.2em]">Target_Transcode</h4>
            <div className="grid grid-cols-5 gap-2">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setTargetFormat(fmt)}
                  className={`py-2 rounded-lg border font-mono text-[10px] transition-all duration-300 ${
                    targetFormat === fmt 
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-bold' 
                    : 'border-white/5 bg-black/20 text-slate-500 hover:border-white/20 hover:text-slate-300'
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: OUTPUT */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.3em]">Transcoded_Buffer</h3>
          <div className="border border-white/5 bg-black/40 rounded-2xl h-[260px] flex flex-col items-center justify-center relative overflow-hidden group">
            {loading ? (
              <div className="text-center space-y-4 relative z-10">
                <div className="relative">
                  <RefreshCw className="w-10 h-10 text-amber-500 animate-spin mx-auto opacity-80" />
                  <div className="absolute inset-0 bg-amber-500/20 blur-xl animate-pulse"></div>
                </div>
                <p className="text-[9px] font-mono text-amber-400 tracking-[0.2em] animate-pulse uppercase">Rewriting_File_System...</p>
              </div>
            ) : resultUrl ? (
              <div className="relative animate-in zoom-in-95 duration-500 w-full h-full p-6 flex flex-col items-center justify-center">
                <img src={resultUrl} alt="Result" className="max-h-[160px] object-contain shadow-[0_0_40px_rgba(245,158,11,0.15)] rounded-lg relative z-10" />
                <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                  <FileType size={10} className="text-amber-400" />
                  <span className="text-[9px] font-mono text-amber-400 uppercase font-bold tracking-widest">
                    MIME: {targetFormat.toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <RefreshCw size={32} className="mx-auto text-white" />
                <p className="text-[9px] font-mono tracking-widest uppercase">Waiting_For_Transcode</p>
              </div>
            )}
            
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={handleAction}
          disabled={loading || !file}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 p-[1px] rounded-xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          <div className="bg-[#0a0a0c] group-hover:bg-transparent transition-colors py-4 rounded-[11px] flex justify-center items-center gap-3">
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 text-amber-500" />
            ) : (
              <>
                <RefreshCw size={16} className="text-amber-400 group-hover:text-black transition-colors" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors">
                  Initiate_Transcoding
                </span>
              </>
            )}
          </div>
        </button>

        {resultUrl && (
          <a 
            href={resultUrl} 
            download={`converted-${file?.name.split('.')[0] || 'result'}.${targetFormat}`}
            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono font-bold text-amber-500 hover:bg-amber-500 hover:text-black transition-all duration-300 uppercase tracking-widest"
          >
            <Download size={14} /> Fetch_Converted_Asset
          </a>
        )}
      </div>
    </div>
  );
}