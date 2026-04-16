"use client";
import { useState } from "react";
import { Stamp, Download, Loader2, Image as ImageIcon, Type, User, Info } from "lucide-react";

export default function WatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [config, setConfig] = useState({
    text: "Coco ImageMagic", // Default watermark text
    style: "bottom-right",
    author: "",
    description: ""
  });

  const handleAction = async () => {
    if (!file) return;
    setLoading(true);

    const fd = new FormData();
    fd.append("image", file);
    fd.append("text", config.text);
    fd.append("style", config.style);
    fd.append("author", config.author);
    fd.append("description", config.description);

    try {
      const res = await fetch("/api/watermark", { method: "POST", body: fd });
      if (res.ok) {
        const blob = await res.blob();
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(URL.createObjectURL(blob));
      }
    } finally {
      setLoading(false);
    }
  };

  const STAMP_OPTIONS = [
    { id: 'top-left', label: 'Top_L' },
    { id: 'center', label: 'Center' },
    { id: 'top-right', label: 'Top_R' },
    { id: 'bottom-left', label: 'Bot_L' },
    { id: 'tile', label: 'Tiled' },
    { id: 'bottom-right', label: 'Bot_R' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* INPUT & CONFIG */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Neural_Protection_Config</h3>
          
          <div className="relative border border-white/10 bg-white/[0.02] rounded-2xl p-4 transition-all overflow-hidden">
            {!file ? (
              <div className="py-10 text-center border border-dashed border-white/5 rounded-xl relative">
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Load_Base_Asset</p>
              </div>
            ) : (
              <div className="text-center p-2">
                <img src={URL.createObjectURL(file)} className="h-32 mx-auto object-contain rounded-lg shadow-2xl" alt="Source" />
                <button onClick={() => setFile(null)} className="mt-3 text-[9px] text-rose-500 uppercase font-bold tracking-tighter hover:bg-rose-500/10 px-3 py-1 rounded-full transition-colors">Eject_File</button>
              </div>
            )}
          </div>

          <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-4">
            {/* TEXT INPUT */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono text-slate-500 flex items-center gap-2 uppercase tracking-widest"><Type size={10}/> Watermark_String</label>
              <input 
                type="text" 
                value={config.text}
                onChange={(e) => setConfig({...config, text: e.target.value})}
                className="w-full bg-black/60 border border-white/10 rounded-xl py-2.5 px-4 font-mono text-purple-400 text-xs outline-none focus:border-purple-500/50 transition-all"
                placeholder="Enter watermark text..."
              />
            </div>
            
            {/* ALIGNMENT MATRIX */}
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Stamp_Alignment_Matrix</label>
              <div className="grid grid-cols-3 gap-2">
                {STAMP_OPTIONS.map((s) => (
                  <button 
                    key={s.id}
                    onClick={() => setConfig({...config, style: s.id})}
                    className={`group relative py-3 rounded-xl border font-mono text-[9px] uppercase transition-all duration-300 ${
                      config.style === s.id 
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                        : 'border-white/5 bg-black/20 text-slate-600 hover:border-white/20'
                    }`}
                  >
                    {/* Visual Positional Dot */}
                    <div className={`absolute w-1 h-1 rounded-full transition-all duration-500 ${
                      config.style === s.id ? 'bg-purple-400 scale-125' : 'bg-slate-800 opacity-30'
                    } ${
                      s.id === 'top-left' ? 'top-1.5 left-1.5' :
                      s.id === 'top-right' ? 'top-1.5 right-1.5' :
                      s.id === 'bottom-left' ? 'bottom-1.5 left-1.5' :
                      s.id === 'bottom-right' ? 'bottom-1.5 right-1.5' :
                      'hidden'
                    }`} />
                    <span className="relative z-10">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* METADATA PANEL */}
          <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-slate-500 flex items-center gap-2 uppercase tracking-widest"><User size={10}/> Exif_Author</label>
                <input 
                  type="text" 
                  value={config.author}
                  placeholder="Neural Artist"
                  onChange={(e) => setConfig({...config, author: e.target.value})}
                  className="w-full bg-black/60 border border-white/10 rounded-xl py-2 px-3 font-mono text-slate-300 text-xs outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-slate-500 flex items-center gap-2 uppercase tracking-widest"><Info size={10}/> Description_Tag</label>
                <input 
                  type="text" 
                  value={config.description}
                  placeholder="Processed via Coco ImageMagic"
                  onChange={(e) => setConfig({...config, description: e.target.value})}
                  className="w-full bg-black/60 border border-white/10 rounded-xl py-2 px-3 font-mono text-slate-300 text-xs outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW PANEL */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.3em]">Protected_Output_Preview</h3>
          <div className="border border-white/5 bg-black/40 rounded-2xl h-[530px] flex flex-col items-center justify-center relative overflow-hidden group">
            {loading ? (
              <div className="text-center space-y-4">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto opacity-80" />
                  <Stamp className="w-4 h-4 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[9px] font-mono text-purple-400 tracking-[0.2em] animate-pulse uppercase">Injecting_Neural_Stamp...</p>
              </div>
            ) : resultUrl ? (
              <div className="relative animate-in zoom-in-95 duration-500 w-full h-full py-10 px-4 flex flex-col items-center justify-center">
                <img src={resultUrl} className="max-h-full object-contain shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-lg" alt="Result" />
                <div className="mt-4 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-[8px] font-mono text-purple-400 text-center uppercase tracking-widest">
                   Status: Meta_Data_Injected // Protection_Applied
                </div>
              </div>
            ) : (
              <div className="text-center opacity-10 flex flex-col items-center">
                <Stamp size={48} className="text-white mb-4" />
                <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-white">Awaiting_Neural_Stamp</p>
              </div>
            )}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleAction}
          disabled={loading || !file}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-500 to-fuchsia-600 p-[1px] rounded-2xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          <div className="bg-[#0a0a0c] group-hover:bg-transparent transition-all duration-500 py-4 rounded-[15px] flex justify-center items-center gap-3">
            {loading ? <Loader2 className="animate-spin w-5 h-5 text-purple-500" /> : (
              <>
                <Stamp size={16} className="text-purple-400 group-hover:text-black transition-colors" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-white group-hover:text-black transition-colors">Apply_Protection_Stamp</span>
              </>
            )}
          </div>
        </button>

        {resultUrl && (
          <a href={resultUrl} download={`protected-${file?.name}`} className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono font-bold text-purple-400 hover:bg-purple-500 hover:text-black transition-all duration-500 uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.1)]">
            <Download size={14} /> Fetch_Protected_Asset
          </a>
        )}
      </div>
    </div>
  );
}