// app/tools/[slug]/page.tsx
"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import ResizeTool from "@/components/ResizeTool";
import CompressTool from "@/components/CompressTool";
import UpscaleTool from "@/components/UpscaleTool";
import RemoveBgTool from "@/components/RemoveBgTool";
import ConvertTool from "@/components/ConvertTool";
import ColorizeTool from "@/components/ColorizeTool"; // Import baru
import EnhanceTool from "@/components/EnhanceTool"; // Import baru
import CropTool from "@/components/CropTool"; // Import baru
import IcoTool from "@/components/IcoTool";
import ImageToPdf from "@/components/ImageToPdf"; // Import baru untuk konversi gambar ke PDF
import PdfToImage from "@/components/PdfToImage";
import WatermarkTool from "@/components/WatermarkTool";
export default function ToolClientContent({ slug }: { slug: string }) {
  const renderTool = () => {
    switch (slug) {
      case "resize":
        return <ResizeTool />;
      case "compress":
        return <CompressTool />;
      case "upscale":
        return <UpscaleTool />;
      case "remove-bg":
        return <RemoveBgTool />;
      case "convert":
        return <ConvertTool />;
      case "colorize":
        return <ColorizeTool />; // Route baru
      case "enhance":
        return <EnhanceTool />; // Route baru
      case "crop":
        return <CropTool />; // Route baru
      case "ico":
        return <IcoTool />; // Route baru 
      case "image-to-pdf":
        return <ImageToPdf />; // Route baru untuk konversi gambar ke PDF
      case "pdf-to-image":
        return <PdfToImage />;
      case "watermark":
        return <WatermarkTool />;
      default:
        return (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <p className="text-slate-500 font-mono">
              MODULE_NOT_FOUND: ERROR_404
            </p>
            <Link
              href="/"
              className="text-cyan-400 text-sm underline mt-4 inline-block italic"
            >
              Return to Command Center
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <Link
          href="/"
          className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest"
        >
          &larr; BACK_TO_DASHBOARD
        </Link>
        <h1 className="text-4xl font-black capitalize mt-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-700 tracking-tighter">
          {slug.replace("-", " ")} <span className="text-cyan-500">_v1.0</span>
        </h1>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-3xl shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)]">
        {renderTool()}
      </div>

      {/* Footer teknis untuk memperkuat tema Cybertech */}
      <div className="mt-8 flex justify-between items-center text-[10px] font-mono text-slate-700 px-4 uppercase tracking-[0.3em]">
        <span>Status: System_Optimal</span>
        <span>Secure_Encryption_Active</span>
        <span>Neural_Engine: Online</span>
      </div>
    </div>
  );
}
