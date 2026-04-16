// app/page.tsx
import Link from "next/link";
import {
  Maximize,
  Minimize2,
  Zap,
  Eraser,
  RefreshCw,
  Palette,
  Sparkles,
  Scissors,
} from "lucide-react";

const tools = [
  {
    title: "Resizer", // Nama lebih pendek agar kotak ringkas
    desc: "Ubah dimensi gambar presisi pixel.",
    icon: <Minimize2 className="w-5 h-5 text-cyan-400" />,
    href: "/tools/resize",
    color: "group-hover:border-cyan-500/50",
  },
  {
    title: "Compressor",
    desc: "Kecilkan ukuran file tanpa rusak.",
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    href: "/tools/compress",
    color: "group-hover:border-yellow-500/50",
  },
  {
    title: "Upscaler",
    desc: "Tingkatkan resolusi hingga 4x.",
    icon: <Maximize className="w-5 h-5 text-blue-400" />,
    href: "/tools/upscale",
    color: "group-hover:border-blue-500/50",
  },
  {
    title: "BG Remover",
    desc: "Hapus latar belakang otomatis AI.",
    icon: <Eraser className="w-5 h-5 text-rose-400" />,
    href: "/tools/remove-bg",
    color: "group-hover:border-rose-500/50",
  },
  {
    title: "Converter",
    desc: "Ubah format WebP, PNG, JPG.",
    icon: <RefreshCw className="w-5 h-5 text-amber-400" />,
    href: "/tools/convert",
    color: "group-hover:border-amber-500/50",
  },
  {
    title: "Colorizer",
    desc: "Warnai foto hitam putih lama.",
    icon: <Palette className="w-5 h-5 text-lime-400" />,
    href: "/tools/colorize",
    color: "group-hover:border-lime-500/50",
  },
  {
    title: "Enhancer",
    desc: "Pertajam detail foto kusam.",
    icon: <Sparkles className="w-5 h-5 text-sky-400" />,
    href: "/tools/enhance",
    color: "group-hover:border-sky-500/50",
  },
  {
    title: "Cropper",
    desc: "Potong foto sesuai kebutuhan.",
    icon: <Scissors className="w-5 h-5 text-purple-400" />,
    href: "/tools/crop",
    color: "group-hover:border-purple-500/50",
  },
];

export default function Dashboard() {
  return (
    // Background dengan gradasi Kuning-Hijau-Gelap yang modern
    <div className="min-h-screen bg-[#050505] relative overflow-hidden selection:bg-lime-500/30">
      {/* Efek Cahaya Background (Mesh Gradient) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-lime-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <header className="mb-16 text-center">
          <div className="inline-block px-3 py-1 rounded-full border border-lime-500/20 bg-lime-500/5 text-[10px] font-mono text-lime-500 tracking-widest uppercase mb-4 animate-pulse">
            Neural Engine v1.0 Active
          </div>
          <h2 className="text-5xl font-black mb-4 pb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            Coco Image<span className="text-lime-400">Magic.</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium max-w-md mx-auto">
            Proses aset digital Anda dengan modul AI generasi terbaru.
          </p>
        </header>

        {/* Grid Kotak Kecil (4 kolom di desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <div
                className={`h-full p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md transition-all duration-500 hover:bg-white/[0.05] ${tool.color} hover:shadow-[0_0_30px_-10px_rgba(163,230,53,0.2)]`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-black/50 rounded-lg border border-white/5 group-hover:scale-110 group-hover:border-white/10 transition-all duration-500">
                    {tool.icon}
                  </div>
                  <div className="text-[8px] font-mono text-slate-600 group-hover:text-lime-500 transition-colors uppercase tracking-widest">
                    Ready_
                  </div>
                </div>

                <h3 className="text-base font-bold mb-1 text-slate-200 group-hover:text-white transition-colors">
                  {tool.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  {tool.desc}
                </p>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">
                    Execute
                  </span>
                  <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
                    <div className="w-1 h-1 bg-white group-hover:bg-black rounded-full"></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-20 text-center">
          <p className="text-[10px] font-mono text-slate-700 tracking-[0.5em] uppercase">
            // Secure Connection Established //
          </p>
        </footer>
      </div>
    </div>
  );
}
