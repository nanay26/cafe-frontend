'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, X, Trash2, CheckCircle2, UserCircle } from 'lucide-react';

export default function CartButton() {
  const { cart, removeFromCart, confirmOrder } = useCart();
  
  const [showCart, setShowCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasSession, setHasSession] = useState(true); // Deklarasi cukup satu kali
  const [customerName, setCustomerName] = useState(''); 

  // Efek untuk deteksi Mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Efek untuk verifikasi Sesi
  // Cari bagian useEffect verifikasi Sesi di CartButton.tsx
useEffect(() => {
  const verifySession = async () => {
    try {
      // PERBAIKAN: Ganti rute dari /api/auth/check menjadi /api/admin/session
      const res = await fetch('https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/admin/session');
      const data = await res.json();
      
      // Jika backend NestJS mengirim { isAdmin: true }, berarti sesi aktif
      if (data.isAdmin === true) {
        setHasSession(true);
      } else {
        // Cek juga apakah ada guest_session jika bukan admin
        // Untuk sementara, jika bukan admin kita set true agar tombol muncul untuk customer
        setHasSession(true); 
      }
    } catch {
      setHasSession(false);
    }
  };

  verifySession();
  const interval = setInterval(verifySession, 60000); 
  return () => clearInterval(interval);
}, []);

  // Guard return diletakkan setelah semua Hook (useState/useEffect) terpanggil
  if (!hasSession) return null;

  const handleConfirm = async () => {
    if (!customerName.trim()) {
      alert("Silakan masukkan nama Anda atau nomor meja!");
      return;
    }

    await confirmOrder(customerName); 
    
    setShowCart(false);
    setCustomerName(''); 
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
    }, 1000);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <>
      {/* NOTIFIKASI SUKSES */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-md p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Pesanan Terkirim!</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Silahkan ke kasir untuk melakukan pembayaran dan konfirmasi pesanan Anda.
            </p>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setShowCart(!showCart)}
        className="fixed bottom-6 right-6 bg-amber-600 text-white p-4 rounded-full shadow-lg hover:bg-amber-700 transition-all active:scale-90 z-[1000]"
      >
        <div className="relative flex items-center">
          <ShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
              {totalItems}
            </span>
          )}
        </div>
      </button>

      {/* PANEL KERANJANG */}
      {showCart && (
        <div className={`fixed flex flex-col bg-white rounded-2xl shadow-2xl z-[99999] border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200 ${
          isMobile 
            ? 'inset-x-4 bottom-20 top-auto max-h-[85vh]' 
            : 'bottom-24 right-6 w-80 max-h-[600px]'
        }`}>
          <div className="p-5 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50 shrink-0">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Pesanan Saya</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{totalItems} Items</p>
              </div>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>

            {cart.length > 0 && (
              <div className="mb-4 shrink-0">
                <label className="text-[10px] font-black uppercase text-amber-600 mb-1 block tracking-tighter">
                  Nama / No. Meja
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="text"
                    placeholder="Contoh: Budi - Meja 05"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium text-black"
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 text-sm italic">Keranjang kosong</p>
                </div>
              ) : (
                <div className="space-y-4 text-black">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-start gap-2 border-b border-gray-50 pb-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm leading-tight">{item.name}</p>
                        <p className="text-[10px] text-amber-600 font-bold uppercase">{item.variant} x{item.qty}</p>
                        {item.note && <p className="text-[10px] text-gray-400 italic mt-1">Note: {item.note}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                        <button onClick={() => removeFromCart(index)} className="text-red-300 hover:text-red-500 transition-colors mt-1">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-100 shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">Total Estimasi</span>
                  <span className="text-xl font-black text-amber-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <button 
                  disabled={!customerName.trim()}
                  className={`w-full py-4 font-black rounded-md text-xs shadow-lg transition-all uppercase tracking-widest ${
                    customerName.trim() 
                      ? 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={handleConfirm}
                >
                  KIRIM PESANAN KE KASIR
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}