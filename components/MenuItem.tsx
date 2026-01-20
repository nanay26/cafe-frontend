'use client';

import { Plus, PencilLine, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAdmin } from '@/app/AdminContext';

interface MenuItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
  };
  category: string;
}

export default function MenuItem({ item }: MenuItemProps) {
  const { isAdmin } = useAdmin();

  const getFullImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  
  const KOYEB_URL = "https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app";
  
  // Jika sudah full URL Koyeb, return langsung
  if (imagePath.includes('koyeb.app')) {
    return imagePath;
  }
  
  // Jika masih localhost, replace dengan Koyeb
  if (imagePath.includes('localhost')) {
    const filename = imagePath.split('/').pop() || '';
    return `${KOYEB_URL}/uploads/${filename}`;
  }
  
  // Jika path relatif, tambahkan domain Koyeb
  const filename = imagePath
    .replace(/^.*[\\\/]/, '') // Ambil filename terakhir
    .replace(/^(public|uploads)[\\\/]/, '');
  
  return `${KOYEB_URL}/uploads/${filename}`;
};

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm(`Hapus ${item.name} dari daftar menu?`)) {
      try {
        const res = await fetch(`/api/menu/${item.id}`, {
          method: 'DELETE',
        });
        if (res.ok) window.location.reload();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="group relative flex flex-col h-full w-full bg-white transition-all duration-300">
      
      {/* ADMIN CONTROLS */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-30 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Link
            href={`/admin/edit-menu/${item.id}`}
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <PencilLine size={16} strokeWidth={1.2} />
          </Link>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} strokeWidth={1.2} />
          </button>
        </div>
      )}

      {/* IMAGE AREA - Diperbaiki agar foto memenuhi frame tanpa terpotong */}
      <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-md bg-gray-50 flex items-center justify-center border border-gray-100">
        {item.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={getFullImageUrl(item.image)} 
            alt={item.name}
            crossOrigin="anonymous" 
            className="w-full h-full object-cover" // Menggunakan object-cover agar foto penuh ke frame
            onError={(e) => {
              console.error("Gambar gagal dimuat:", (e.target as HTMLImageElement).src);
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-200">
            <Plus size={32} strokeWidth={1} />
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="flex flex-col flex-grow px-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm md:text-base font-bold text-gray-900 uppercase tracking-tight leading-tight max-w-[70%]">
            {item.name}
          </h3>
          <span className="text-sm font-black text-amber-700 whitespace-nowrap">
            {item.price.toLocaleString('id-ID')}
          </span>
        </div>

        <p className="text-[10px] md:text-[11px] text-gray-400 line-clamp-2 mb-4 font-normal leading-relaxed">
          {item.description}
        </p>

        <Link
          href={`/menu/${item.id}`}
          className="mt-auto flex items-center justify-center gap-2 border border-gray-900 py-2.5 rounded-md text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all duration-300"
        >
          Add to Order
        </Link>
      </div>
    </div>
  );
}