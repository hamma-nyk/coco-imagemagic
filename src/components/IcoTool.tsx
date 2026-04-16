"use client";
import { useState } from "react";
import { FileCode, Download, Loader2, Image as ImageIcon, CheckCircle2, Circle } from "lucide-react";

const AVAILABLE_SIZES = [256, 128, 64, 48, 40, 32, 24, 20, 16];

export default function IcoTool() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([256, 64, 32]); // Default
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");

  const toggleSize = (size: number) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleAction = async () => {
    if (!file || selectedSizes.length === 0) return;
    setLoading(true);

    const fd = new FormData();
    fd.append("image", file);
    fd.append("sizes", JSON.stringify(selectedSizes));

    try {
      const res = await fetch("/api/convert-ico", { method: "POST", body: fd });
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
        
        {/* INPUT SOURCE */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Source_Neural_Asset</h3>
          <div className="relative border border-white/10 bg-white/[0.02] rounded-2xl p-4">
            {!file ? (
              <div className="py-12 text-center border border-dashed border-white/5 rounded-xl relative">
                <input type="file" accept="image/png" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
                <p className="text-[10px] font-mono text-slate-600 uppercase">Load_PNG_Buffer</p>
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <img src={URL.createObjectURL(file)} className="h-32 mx-auto object-contain rounded-lg shadow-xl" alt="Source" />
                <p className="text-[10px] font-mono text-lime-500 uppercase tracking-tighter">{file.name}</p>
                <button onClick={() => setFile(null)} className="text-[9px] text-rose-500 underline uppercase">Eject_File</button>
              </div>
            )}
          </div>

          {/* SIZE SELECTOR GRID */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Target_Dimensions_Matrix</h4>
            <div className="grid grid-cols-3 gap-2">
              {AVAILABLE_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border font-mono text-[10px] transition-all ${
                    selectedSizes.includes(size)
                      ? "border-lime-500 bg-lime-500/10 text-lime-400"
                      : "border-white/5 bg-black/20 text-slate-600"
                  }`}
                >
                  <span>{size}px</span>
                  {selectedSizes.includes(size) ? <CheckCircle2 size={12} /> : <Circle size={12} className="opacity-20" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* OUTPUT PREVIEW */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-lime-400 uppercase tracking-[0.3em]">ICO_Container_Output</h3>
          <div className="border border-white/5 bg-black/40 rounded-2xl h-[365px] flex flex-col items-center justify-center relative overflow-hidden">
             {loading ? (
                <div className="text-center animate-pulse">
                  <Loader2 className="w-10 h-10 text-lime-500 animate-spin mx-auto mb-2" />
                  <p className="text-[9px] font-mono text-lime-400 uppercase tracking-widest">Encoding_Multi_Layer_ICO...</p>
                </div>
             ) : resultUrl ? (
               <div className="text-center space-y-4">
                  <div className="p-6 bg-white/5 rounded-full border border-lime-500/20 shadow-[0_0_30px_rgba(132,204,22,0.1)]">
                    <FileCode size={48} className="text-lime-500 mx-auto" />
                  </div>
                  <p className="text-[10px] font-mono text-slate-400">Container_Ready: {selectedSizes.length} Layers</p>
               </div>
             ) : (
               <div className="text-center opacity-10">
                 <FileCode size={40} className="mx-auto mb-2 text-white" />
                 <p className="text-[9px] font-mono uppercase">Awaiting_Transcode</p>
               </div>
             )}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleAction}
          disabled={loading || !file || selectedSizes.length === 0}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-lime-500 to-emerald-600 p-[1px] rounded-xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          <div className="bg-[#0a0a0c] group-hover:bg-transparent transition-colors py-4 rounded-[11px] flex justify-center items-center gap-3">
            {loading ? <Loader2 className="animate-spin w-5 h-5 text-lime-500" /> : (
              <>
                <FileCode size={16} className="text-lime-400 group-hover:text-black transition-colors" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors">Generate_Neural_ICO</span>
              </>
            )}
          </div>
        </button>

        {resultUrl && (
          <a href={resultUrl} download={`${file?.name.split('.')[0]}.ico`} className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono font-bold text-lime-400 hover:bg-lime-500 hover:text-black transition-all uppercase tracking-widest">
            <Download size={14} /> Fetch_ICO_Asset
          </a>
        )}
      </div>
    </div>
  );
}