'use client';

import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { Coffee, MapPin, Clock, ExternalLink } from 'lucide-react';

export default function QRCodePage() {
  // Fungsi untuk mendapatkan URL dasar aplikasi
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    }
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app';
  };

  // QR diarahkan ke /start untuk aktivasi session 1 jam
  const qrValue = `${getBaseUrl()}/start`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50/30 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        
        {/* LOGO & HEADER */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-amber-600 text-white p-4 rounded-2xl shadow-xl shadow-amber-200 mb-4">
            <Coffee size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
            TS <span className="text-amber-600">KOPI</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-widest">
            Digital Menu System
          </p>
        </div>

        {/* QR CODE CONTAINER */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 inline-block mb-10 relative">
          <div className="bg-gray-50 p-4 rounded-[1.5rem] border-2 border-dashed border-gray-200">
            <QRCodeSVG
              value={qrValue}
              size={240}
              level="H"
              includeMargin={true}
              bgColor="#F9FAFB" // Menyesuaikan dengan bg-gray-50
              fgColor="#111827" // Slate-900
            />
          </div>

          <div className="mt-6 space-y-1">
            <p className="text-sm font-black text-gray-800 uppercase tracking-wider">
              Scan QR Code
            </p>
            <p className="text-[11px] text-gray-400 font-medium italic">
              Arahkan kamera ponsel Anda ke kode di atas
            </p>
          </div>
          
          {/* Aksesoris Sudut Decoratif */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-amber-600 rounded-tl-lg"></div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-amber-600 rounded-br-lg"></div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-4 w-full px-4">
          <Link
            href="/start"
            className="group flex items-center justify-center gap-3 w-full bg-gray-900 text-white py-4 rounded-md font-bold text-base hover:bg-amber-600 transition-all duration-300 shadow-xl active:scale-95"
          >
            <span>Mulai Memesan Sekarang</span>
            <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
          
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Clock size={14} />
              <span className="text-[10px] font-bold uppercase tracking-tight">1 Jam Akses</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <MapPin size={14} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Outdoor Area</span>
            </div>
          </div>
        </div>

        {/* INFO FOOTER */}
        <footer className="mt-16 space-y-2">
          <div className="h-px w-12 bg-amber-200 mx-auto mb-6"></div>
          <p className="text-xs font-bold text-gray-800 uppercase tracking-tighter">
            Tersenyum Coffe Semarang
          </p>
          <p className="text-[10px] text-gray-400 leading-relaxed max-w-[250px] mx-auto">
            Jl. Pekojan, Purwodinatan, Semarang Tengah<br />
            Buka Setiap Hari: 19:30 - 23:59
          </p>
        </footer>
      </div>
    </div>
  );
}