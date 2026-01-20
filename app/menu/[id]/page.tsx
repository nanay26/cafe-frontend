'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Minus, Plus, MessageSquare, IceCream, Flame, Clock, ShoppingCart} from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

// Interface untuk tipe data Menu
interface Menu {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export default function DetailMenu() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [item, setItem] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState('Ice');
  const [note, setNote] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // 1. Fetch Data dari Backend (Proxy)
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/menu/${params.id}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (res.ok) {
          const data = await res.json();
          setItem(data);
        }
      } catch (error) {
        console.error("Gagal mengambil detail menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [params.id]);

  // 2. Helper URL Gambar (Sama dengan MenuItem)
  // 2. Helper URL Gambar - FIXED untuk Koyeb
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "/placeholder.png";
  
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
  
  // Jika path relatif (uploads/filename.jpg atau /uploads/filename.jpg)
  const filename = imagePath
    .replace(/^.*[\\\/]/, '') // Ambil filename terakhir
    .replace(/^(public|uploads)[\\\/]/, '');
  
  return `${KOYEB_URL}/uploads/${filename}`;
};
  if (loading) return <div className="p-20 text-center font-medium text-gray-600">Memuat detail menu...</div>;
  if (!item) return <div className="p-20 text-center font-medium text-gray-600">Menu tidak ditemukan...</div>;

  const totalPrice = item.price * quantity;

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: quantity,
      variant: variant,
      note: note
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Komponen konten untuk menghindari duplikasi kode antara Mobile & Desktop
  const ProductContent = () => (
    <>
      <div className="flex justify-between items-start">
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black text-gray-900 uppercase leading-tight tracking-tight`}>
          {item.name}
        </h1>
        <span className={`${isMobile ? 'text-lg' : 'text-xl'} font-black text-amber-700 ml-2`}>
          Rp {item.price.toLocaleString('id-ID')}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-2 leading-relaxed">{item.description}</p>
    </>
  );

  // 3. UI RENDER (Mobile & Desktop menggunakan logic yang sama)
  return (
    <div className={`max-w-3xl mx-auto min-h-screen bg-white ${isMobile ? '' : 'flex flex-col'}`}>
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-30 px-4 py-3 flex items-center justify-between border-b border-gray-50">
        <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft size={isMobile ? 20 : 22} className="text-gray-700" />
        </button>
        <span className="font-bold text-gray-800 text-sm">Detail Produk</span>
        <div className="bg-amber-50 px-2 py-1 rounded-lg flex items-center gap-1 border border-amber-100">
          <Clock size={11} className="text-amber-600" />
          <span className="text-[9px] font-bold text-amber-700">5-10m</span>
        </div>
      </div>

      <div className={`p-5 ${isMobile ? '' : 'grid grid-cols-2 gap-6'}`}>
        {/* Gambar Produk - DIPERBAIKI: Menggunakan object-cover dan menghapus padding agar foto penuh */}
        <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-inner mb-6 md:mb-0">
          <Image 
            src={getImageUrl(item.image)} 
            alt={item.name} 
            fill 
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Informasi & Pilihan */}
        <div className="flex flex-col gap-y-6">
          <ProductContent />

          {/* Varian */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Pilih Penyajian</h3>
            <div className="flex gap-2">
              {[
                { id: 'Ice', label: 'Dingin', icon: <IceCream size={14} /> },
                { id: 'Hot', label: 'Panas', icon: <Flame size={14} /> }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setVariant(opt.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md border-2 font-bold text-xs transition-all ${
                    variant === opt.id 
                    ? 'border-gray-900 bg-gray-900 text-white shadow-lg' 
                    : 'border-gray-100 text-gray-400 bg-white hover:border-gray-200'
                  }`}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Jumlah Pesanan</span>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="w-9 h-9 flex items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm active:scale-90"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="text-lg font-black w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm active:scale-90"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Note & Button */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={13} className="text-gray-400" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Catatan Khusus</h3>
            </div>
            <textarea 
              className="w-full border border-gray-100 bg-gray-50 rounded-md p-4 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none italic"
              placeholder="Contoh: Es batu sedikit saja..."
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <button 
              className={`w-full mt-4 py-4 rounded-md font-bold flex items-center justify-between px-6 transition-all active:scale-95 shadow-lg ${
                isAdded ? 'bg-green-600' : 'bg-amber-600 hover:bg-amber-700'
              } text-white`}
              onClick={handleAddToCart}
            >
              <span className="uppercase tracking-widest text-xs">
                {isAdded ? 'Berhasil Ditambah' : 'Tambah Pesanan'}
              </span>
              <div className="flex items-center gap-3 border-l border-white/20 pl-4">
                <span className="text-sm font-black">Rp {totalPrice.toLocaleString('id-ID')}</span>
                <ShoppingCart size={18} />
              </div>
            </button>
          </div>

          <p className="text-center text-[10px] text-gray-400 pb-10">
            Pesanan akan diproses setelah konfirmasi pembayaran di kasir.
          </p>
        </div>
      </div>
    </div>
  );
}