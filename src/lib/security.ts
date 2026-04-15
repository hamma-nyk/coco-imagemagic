// lib/security.ts
import { NextRequest } from 'next/server';

export function validateRequest(req: NextRequest) {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host'); // Contoh: localhost:3000 atau kirakira.com

  // 1. Definisikan domain yang diizinkan
  const allowedOrigins = [
    'http://localhost:3000', 
    'https://coco-imagemagic.vercel.app', // Ganti dengan domain asli Anda nanti
    //`http://${host}`,
    //`https://${host}`
  ];

  // 2. Cek Origin (Biasanya dikirim oleh browser pada POST request)
  if (origin && !allowedOrigins.includes(origin)) {
    return { isValid: false, message: "Cross-Origin request blocked." };
  }

  // 3. Cek Referer (Memastikan request datang dari halaman web Anda)
  // Header ini sulit dimanipulasi oleh script di dalam browser
  if (!referer || !referer.includes(host as string)) {
    return { isValid: false, message: "Invalid referer: Access denied." };
  }

  return { isValid: true };
}