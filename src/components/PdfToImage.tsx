"use client";
import { useState, useRef } from "react";
import * as pdfjs from "pdfjs-dist";
import { 
  FileImage, Download, Loader2, FileText, 
  X, Image as ImageIcon, Layers, FileDown 
} from "lucide-react";

// Inisialisasi worker PDF.js (Wajib agar tidak error)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<{ url: string; page: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setImages([]);
    }
  };

  const convertPdfToImages = async () => {
    if (!file) return;
    setLoading(true);
    setImages([]);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      const totalPages = pdf.numPages;
      const resultImages = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Scale 2.0 untuk kualitas HD
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          resultImages.push({
            url: canvas.toDataURL("image/png"),
            page: i
          });
        }
        setProgress(Math.round((i / totalPages) * 100));
      }

      setImages(resultImages);
    } catch (error) {
      console.error("PDF Conversion Error:", error);
      alert("Gagal memproses PDF. Pastikan file tidak diproteksi password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* INPUT SOURCE */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Source_Document_Buffer</h3>
          <div className={`relative border border-white/10 bg-white/[0.02] rounded-2xl p-6 transition-all ${file ? 'border-orange-500/30' : ''}`}>
            {!file ? (
              <div className="py-12 text-center relative">
                <input type="file" accept=".pdf" onChange={onFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <FileText className="w-10 h-10 text-slate-700 mx-auto mb-3 opacity-50" />
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Load_PDF_Asset</p>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 animate-in slide-in-from-left">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500">
                  <FileText size={24} />
                </div>
                <div className="flex-1 truncate">
                  <p className="text-[10px] font-mono text-slate-300 truncate uppercase">{file.name}</p>
                  <p className="text-[8px] font-mono text-slate-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="p-2 text-rose-500/50 hover:text-rose-500">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={convertPdfToImages}
            disabled={loading || !file}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-orange-500 to-amber-600 p-[1px] rounded-xl transition-all active:scale-[0.98] disabled:opacity-30"
          >
            <div className="bg-[#0a0a0c] group-hover:bg-transparent transition-colors py-4 rounded-[11px] flex justify-center items-center gap-3">
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin w-4 h-4 text-orange-500" />
                  <span className="text-xs font-mono text-orange-500">{progress}%_EXTRACTING</span>
                </div>
              ) : (
                <>
                  <Layers size={16} className="text-orange-400 group-hover:text-black transition-colors" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-black">Initiate_PDF_Deconstruction</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* OUTPUT PREVIEW GALLERY */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-orange-400 uppercase tracking-[0.3em]">Extracted_Frames</h3>
          <div className="border border-white/5 bg-black/40 rounded-2xl h-[450px] overflow-y-auto p-4 custom-scrollbar">
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="space-y-2 group animate-in zoom-in-95 duration-300">
                    <div className="relative aspect-[3/4] bg-black rounded-lg overflow-hidden border border-white/5 shadow-xl">
                      <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={`Page ${img.page}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <p className="text-[8px] font-mono text-white tracking-widest uppercase">Page_{img.page}</p>
                      </div>
                    </div>
                    <a 
                      href={img.url} 
                      download={`page-${img.page}.png`}
                      className="flex items-center justify-center gap-2 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-mono text-slate-400 hover:text-orange-400 hover:border-orange-500/30 transition-all uppercase"
                    >
                      <Download size={10} /> Save_Page
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <FileImage size={48} className="text-white mb-2" />
                <p className="text-[9px] font-mono uppercase tracking-widest">No_Frames_Detected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}