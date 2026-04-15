// app/layout.tsx
import { Metadata } from 'next'
import Link from 'next/link';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: {
    default: 'Coco ImageMagic',
    template: '%s | Coco ImageMagic' // %s akan digantikan oleh title dari tiap halaman
  },
  icons: {
    icon: '/favicon.ico', // Pastikan file ada di folder public/ atau app/
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-[#0a0a0c] text-slate-200 min-h-screen`}>
        {/* Background Overlay untuk efek Cyber */}
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="fixed inset-0 z-[-1] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <nav className="border-b border-white/5 bg-[#050505]/60 backdrop-blur-xl sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    
    {/* LOGO AREA */}
    <Link href="/" className="group flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-yellow-500 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300">
        <span className="text-black font-black text-xl leading-none">C</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-black tracking-tight text-white">
          Coco Image<span className="text-lime-400">Magic</span>
        </span>
        <span className="text-[8px] font-mono text-slate-500 tracking-[0.2em] uppercase">
          Neural_Interface
        </span>
      </div>
    </Link>

    {/* NAVIGATION RIGHT */}
    <div className="flex items-center gap-4">
      <a 
        href="https://ikonyek-dev.vercel.app" // Ganti dengan URL kumpulan project Anda
        target="_blank"
        rel="noopener noreferrer"
        className="group relative px-4 py-2 overflow-hidden rounded-full border border-lime-500/20 bg-lime-500/5 transition-all hover:border-lime-500/50"
      >
        {/* Glow Effect on Hover */}
        <div className="absolute inset-0 bg-lime-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="relative flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-lime-500 tracking-wider">
            ALL_PROJECTS
          </span>
          <div className="w-1 h-1 bg-lime-500 rounded-full animate-pulse"></div>
        </div>
      </a>
    </div>

  </div>
</nav>
        
        <main>{children}</main>
      </body>
    </html>
  );
}