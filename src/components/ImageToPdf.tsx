"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { jsPDF } from "jspdf";
import { Reorder } from "framer-motion"; // Library untuk drag reorder
import { 
  FileText, Download, Loader2, Image as ImageIcon, 
  Plus, X, FileType, Maximize, File as FileIcon, GripVertical 
} from "lucide-react";

export default function ImageToPdf() {
  const [images, setImages] = useState<{ id: string; file: File; preview: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfRatio, setPdfRatio] = useState<"original" | "a4">("original");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9), // ID unik untuk reordering
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newFiles]);
    setPdfUrl("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    noClick: images.length > 0, // Agar klik tidak terpicu saat user ingin drag gambar
  });

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find(img => img.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter(img => img.id !== id);
    });
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setLoading(true);

    try {
      const doc = new jsPDF({ orientation: "p", unit: "px" });

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imgData = await getImageData(img.preview);
        const imgProps = doc.getImageProperties(imgData);

        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();

        let finalW, finalH;

        if (pdfRatio === "original") {
          finalW = imgProps.width;
          finalH = imgProps.height;
          
          if (i === 0) {
            doc.deletePage(1);
            doc.addPage([finalW, finalH], finalW > finalH ? "l" : "p");
          } else {
            doc.addPage([finalW, finalH], finalW > finalH ? "l" : "p");
          }
        } else {
          if (i > 0) doc.addPage();
          finalW = pdfWidth;
          finalH = (imgProps.height * pdfWidth) / imgProps.width;
        }

        doc.addImage(imgData, "JPEG", 0, 0, finalW, finalH);
      }

      const pdfBlob = doc.output("blob");
      setPdfUrl(URL.createObjectURL(pdfBlob));
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageData = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };
      img.src = url;
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* INPUT SOURCE & REORDERABLE LIST */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Neural_Asset_Uploader</h3>
          
          <div {...getRootProps()} className={`relative border border-white/10 bg-white/[0.02] rounded-2xl p-4 min-h-[300px] ${isDragActive ? "border-cyan-500/50 bg-cyan-500/5" : ""}`}>
            <input {...getInputProps()} />
            
            {images.length === 0 ? (
              <div className="py-20 text-center opacity-30">
                <Plus className="w-10 h-10 mx-auto mb-2 text-cyan-500" />
                <p className="text-[10px] font-mono">Drop_Files_Here</p>
              </div>
            ) : (
              <Reorder.Group axis="y" values={images} onReorder={setImages} className="space-y-2">
                {images.map((img) => (
                  <Reorder.Item 
                    key={img.id} 
                    value={img}
                    className="flex items-center gap-3 p-2 bg-black/40 border border-white/5 rounded-xl cursor-grab active:cursor-grabbing hover:border-cyan-500/30 transition-colors group"
                  >
                    <GripVertical size={14} className="text-slate-700 group-hover:text-cyan-500" />
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                      <img src={img.preview} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-[10px] font-mono text-slate-400 truncate uppercase">{img.file.name}</p>
                      <p className="text-[8px] font-mono text-slate-600">{(img.file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => removeImage(img.id)} className="p-2 text-rose-500/50 hover:text-rose-500 transition-colors">
                      <X size={14} />
                    </button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
            
            {images.length > 0 && (
              <label className="mt-4 block py-3 border border-dashed border-white/10 rounded-xl text-center cursor-pointer hover:bg-white/5 transition-colors">
                <span className="text-[9px] font-mono text-slate-500 uppercase">+ Append_More_Assets</span>
                <input type="file" multiple accept="image/*" onChange={(e) => {
                  if (e.target.files) onDrop(Array.from(e.target.files));
                }} className="hidden" />
              </label>
            )}
          </div>

          {/* RATIO CONFIG */}
          <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
            <button 
              onClick={() => setPdfRatio("original")}
              className={`flex-1 py-2 rounded-lg font-mono text-[9px] transition-all ${pdfRatio === "original" ? "bg-cyan-500 text-black font-bold" : "text-slate-500 hover:text-slate-300"}`}
            >
              ASPECT_FIT
            </button>
            <button 
              onClick={() => setPdfRatio("a4")}
              className={`flex-1 py-2 rounded-lg font-mono text-[9px] transition-all ${pdfRatio === "a4" ? "bg-cyan-500 text-black font-bold" : "text-slate-500 hover:text-slate-300"}`}
            >
              A4_STANDARD
            </button>
          </div>
        </div>

        {/* OUTPUT PREVIEW */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.3em]">Compiled_Output</h3>
          <div className="border border-white/5 bg-black/40 rounded-2xl h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
             {loading ? (
                <div className="text-center animate-pulse">
                  <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mx-auto mb-2" />
                  <p className="text-[9px] font-mono text-cyan-400">Synthesizing_Document...</p>
                </div>
             ) : pdfUrl ? (
               <div className="text-center">
                  <div className="p-8 bg-cyan-500/5 rounded-full border border-cyan-500/20 mb-4 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                    <FileText size={48} className="text-cyan-500" />
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Document_Encrypted_Ready</p>
                  <p className="text-[8px] font-mono text-cyan-700 uppercase mt-1">{images.length}_Layers_Detected</p>
               </div>
             ) : (
               <div className="text-center opacity-10 italic text-[10px]">Awaiting_Neural_Sequence...</div>
             )}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
        <button
          onClick={generatePdf}
          disabled={loading || images.length === 0}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 p-[1px] rounded-xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          <div className="bg-[#0a0a0c] group-hover:bg-transparent transition-colors py-4 rounded-[11px] flex justify-center items-center gap-3">
            {loading ? <Loader2 className="animate-spin w-5 h-5 text-cyan-500" /> : (
              <>
                <FileText size={16} className="text-cyan-400 group-hover:text-black transition-colors" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors">Initiate_PDF_Synthesis</span>
              </>
            )}
          </div>
        </button>

        {pdfUrl && (
          <a href={pdfUrl} download="coco-image-to-pdf-export.pdf" className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono font-bold text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <Download size={14} /> Fetch_Document_Asset
          </a>
        )}
      </div>
    </div>
  );
}