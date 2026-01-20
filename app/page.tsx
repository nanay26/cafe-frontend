'use client';

import { useState, useEffect } from 'react';
import MenuItem from '@/components/MenuItem';
// Pastikan folder dan nama file sudah benar: /components/SmartChatbot.tsx
import SmartChatbot from '@/components/ChatBot'; 
import { Coffee, IceCream, Cookie, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAdmin } from '@/app/AdminContext';

interface Menu {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('coffee');
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, logoutAdmin } = useAdmin();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/menu');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setMenus(data);
        } else {
          console.error("Data menu bukan array:", data);
          setMenus([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data menu:", error);
        setMenus([]); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const categories = [
    { id: 'coffee', label: 'Coffee', icon: <Coffee size={18} /> },
    { id: 'non-coffee', label: 'Non-Coffee', icon: <IceCream size={18} /> },
    { id: 'snack', label: 'Snack', icon: <Cookie size={18} /> },
  ];

  const filteredMenu = Array.isArray(menus) 
    ? menus.filter((item) => item.category === activeCategory)
    : [];

  return (
    <div className="relative min-h-screen"> {/* Tambahkan relative agar chatbot bisa menempel */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-amber-900 rounded-[1rem] md:rounded-[1.5rem] p-8 md:p-16 mb-8 md:mb-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <Sparkles className="text-amber-300" size={16} />
              <span className="bg-white/20 backdrop-blur-md text-amber-50 text-[9px] md:text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                {isAdmin ? 'Admin Dashboard' : 'Premium Quality Coffee'}
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 leading-tight tracking-tighter">
              Tersenyum <br className="hidden md:block" /> <span className="text-amber-400 italic">Coffe</span>
            </h1>
            <p className="text-amber-100/90 text-sm md:text-xl font-light leading-relaxed mb-4">
              {isAdmin 
                ? 'Kelola menu dan operasional cafe Anda di sini.' 
                : 'Menghadirkan kebahagiaan di setiap tegukan. Pilih menu favorit Anda.'
              }
            </p>
            {isAdmin && (
              <Link href="/admin/add-menu" className="inline-block bg-white text-amber-900 px-6 py-3 rounded-md font-bold text-sm hover:bg-amber-50 transition-colors">
                + Tambah Menu Baru
              </Link>
            )}
          </div>
          <div className="absolute -right-10 -bottom-10 md:-right-16 md:-bottom-16 text-[12rem] md:text-[20rem] opacity-10 rotate-12 select-none">
            <Coffee size={300} className="md:w-[400px]" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-10 md:mb-16">
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-100 max-w-full overflow-x-auto no-scrollbar">
            <div className="flex space-x-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center space-x-2 px-5 md:px-8 py-2.5 md:py-3.5 rounded-full transition-all duration-300 font-bold text-xs md:text-sm whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-200'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : filteredMenu.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {filteredMenu.map((item) => (
              <div key={item.id} className="transition-all duration-500">
                <MenuItem
                  item={{
                    ...item,
                    image: `/public${item.image}` 
                  }}
                  category={activeCategory}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Search className="text-gray-300" size={30} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">Menu Belum Tersedia</h3>
            <p className="text-gray-500 mt-2">Coba pilih kategori lain atau tambah menu baru.</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 md:mt-24 py-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 text-center md:text-left">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-gray-800 tracking-tight">Tersenyum Coffe</span>
              {isAdmin && (
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Admin Mode</span>
              )}
            </div>
            <p className="text-[12px] md:text-sm text-gray-500 order-3 md:order-2">© 2026 Tersenyum Coffe powered by TWIZZ.</p>
            <div className="flex space-x-6 text-[12px] md:text-sm text-gray-400 order-2 md:order-3">
                {isAdmin ? (
                <>
                  <button onClick={logoutAdmin} className="hover:text-red-600 transition-colors">
                    Logout
                  </button>
                  <Link href="/qr" className="hover:text-amber-600 transition-colors">
                    QR Page
                  </Link>
                </>
              ) : (
                <>
                  <a href="#" className="hover:text-amber-600 transition-colors font-medium">Privacy</a>
                  <a href="#" className="hover:text-amber-600 transition-colors font-medium">Terms</a>
                </>
              )}
            </div>
          </div>
        </footer>
      </div>

      {/* 🚀 CHATBOT Diletakkan di sini, melayang di atas semua elemen */}
      <SmartChatbot />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}