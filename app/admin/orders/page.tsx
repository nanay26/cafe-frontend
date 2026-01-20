'use client';

import { useState } from 'react';
import { useCart, Order } from '@/context/CartContext';
import { Package, CheckCircle, Trash2, User, MessageSquare, X, Banknote, CreditCard, History, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const { orders, markAsPaid, removeOrder } = useCart();
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  // Perbaikan: Fungsi format waktu yang menjamin pembacaan waktu lokal yang akurat
  const formatTime = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Jam tidak valid';
      // Memaksa penggunaan locale id-ID dengan timezone Jakarta untuk akurasi jam 3 pagi
      return date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta' 
      });
    } catch {
      return 'Waktu tidak tersedia';
    }
  };

  // LOGIKA SISTEM: Menyimpan Nota ke database/state sistem sebagai "Completed Order"
  const handleFinalConfirm = async (method: string) => {
    if (selectedOrder) {
      setPaymentMethod(method);
      
      // 1. Kirim instruksi ke sistem untuk memindahkan ke riwayat dengan detail nota lengkap
      await markAsPaid(selectedOrder.id); 
      
      // 2. Proses Cetak Struk Fisik
      setTimeout(() => {
        window.print(); 
        setShowModal(false);
        setSelectedOrder(null);
      }, 200);
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');

  const MobileOrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-50 text-blue-600">
              <User size={14} />
            </div>
            <div>
              <span className="text-sm font-bold text-blue-700 uppercase">
                {order.customerName || 'Pelanggan'}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock size={10} className="text-gray-400" />
                <span className="text-xs text-gray-500">{formatTime(order.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-[10px] font-medium rounded-full border ${
              order.status === 'completed' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {order.status === 'completed' ? 'Sudah Bayar' : 'Pending'}
            </span>
            <button 
              onClick={() => removeOrder(order.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-150"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs font-medium text-gray-600">ID: #{order.id}</span>
          <span className="text-sm font-bold text-gray-900">
            Rp {Number(order.total || 0).toLocaleString('id-ID')}
          </span>
        </div>
      </div>
      
      <div className="px-4 py-3">
        <div className="space-y-2 mb-3">
          {order.items && order.items.length > 0 ? (
            order.items.map((item: any, idx: number) => (
              <div 
                key={`${order.id}-${idx}`} 
                className="p-2.5 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-xs font-bold text-gray-800">{item.name}</p>
                        <p className="text-[10px] text-gray-500">{item.variant || 'Regular'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-600 bg-white px-1.5 py-0.5 rounded border">
                          x{item.qty || 0}
                        </span>
                      </div>
                    </div>
                    {item.note && (
                      <div className="mt-1.5 flex items-start gap-1 text-[10px] text-amber-600 bg-amber-50 p-1.5 rounded border border-amber-100 italic">
                        <MessageSquare size={10} className="mt-0.5" />
                        <span>Catatan: {item.note}</span>
                      </div>
                    )}
                    <div className="mt-2 flex justify-end">
                      <p className="text-xs font-semibold text-gray-900">
                        Rp {((item.price || 0) * (item.qty || 0)).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-center text-gray-400">Data item kosong</p>
          )}
        </div>

        {order.status === 'pending' && (
          <button 
            onClick={() => { setSelectedOrder(order); setShowModal(true); }}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <CheckCircle size={16} /> 
            Konfirmasi Pembayaran
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 md:mb-8 no-print flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Pesanan Masuk</h1>
            <p className="text-gray-500 text-xs md:text-sm mt-1">Kelola transaksi dan cetak nota riwayat</p>
          </div>
        </div>
        <Link href="/admin/history" className="flex items-center justify-center md:justify-start gap-2 bg-white border p-2 px-4 rounded-md text-sm font-semibold hover:bg-gray-50 shadow-sm w-full md:w-auto transition-all">
            <History size={16} /> Riwayat Nota
        </Link>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block space-y-4 no-print">
        {pendingOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-md border border-gray-100 text-center shadow-sm">
            <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
              <Package className="text-gray-300" size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">Belum ada pesanan</h3>
            <p className="text-gray-400 max-w-md mx-auto">Semua pesanan yang sudah dibayar tersimpan di Riwayat Nota</p>
          </div>
        ) : (
          pendingOrders.map((order: Order) => (
            <div key={order.id} className="bg-white rounded-md border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
                    <User size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-blue-700 uppercase">{order.customerName || 'Pelanggan'}</span>
                      <span className="text-gray-400 text-xs">|</span>
                      <span className="text-sm font-medium text-gray-600">#{order.id}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1.5 text-xs font-medium rounded-full border shadow-sm">
                    Menunggu Pembayaran
                  </span>
                  <button onClick={() => removeOrder(order.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="px-6 py-5">
                <div className="space-y-3 mb-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-gray-800">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.variant || 'Regular'}</p>
                            {item.note && (
                              <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-600 bg-amber-50 p-1.5 rounded border border-amber-100 italic">
                                <MessageSquare size={12} className="mt-0.5" />
                                <span>Catatan: {item.note}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-gray-600 bg-white px-2 py-1 rounded border">x{item.qty || 0}</span>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <p className="text-sm font-semibold text-gray-900">Rp {((item.price || 0) * (item.qty || 0)).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-5 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Waktu Pesan</p>
                      <p className="text-base font-medium text-gray-900">{formatTime(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Total Transaksi</p>
                      <p className="text-xl font-bold text-gray-900 mb-4">Rp {Number(order.total || 0).toLocaleString('id-ID')}</p>
                      <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2 shadow-sm">
                        <CheckCircle size={16} /> Konfirmasi Pembayaran
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile Version */}
      <div className="md:hidden space-y-3 no-print">
        {pendingOrders.map((order: Order) => (
          <MobileOrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* MODAL PEMBAYARAN */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 no-print px-4">
          <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-sm overflow-hidden animate-slideUp">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
               <div>
                  <h2 className="font-bold text-base text-gray-900">Validasi Nota</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Nota ID: #{selectedOrder.id}</p>
               </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <button onClick={() => handleFinalConfirm('Tunai')} className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-green-600 hover:bg-green-50 transition-all group">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-all">
                  <Banknote size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 leading-none">Pembayaran Tunai</p>
                  <p className="text-[10px] text-gray-500 mt-1">Simpan sebagai nota Cash</p>
                </div>
              </button>

              <button onClick={() => handleFinalConfirm('QRIS / Transfer')} className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all group">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <CreditCard size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 leading-none">QRIS / Digital</p>
                  <p className="text-[10px] text-gray-500 mt-1">Simpan sebagai nota E-Wallet</p>
                </div>
              </button>
            </div>
            <div className="p-4 bg-gray-900 text-white text-center">
               <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Tagihan Nota</p>
               <p className="text-xl font-black">Rp {Number(selectedOrder.total || 0).toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      )}

      {/* STRUK PRINT FISIK - Perbaikan Waktu Lokal */}
      <div className="hidden print:block p-8 text-black font-mono text-[12px] w-[75mm] mx-auto border bg-white">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold uppercase">Tersenyum Coffee</h1>
          <p className="text-[10px]">Jl. Pekojan, Purwodinatan, Semarang Tengah</p>
          <div className="border-b border-dashed my-2"></div>
        </div>
        
        <div className="space-y-1 mb-4 text-[11px]">
          <div className="flex justify-between"><span>NOTA:</span><span>#{selectedOrder?.id}</span></div>
          <div className="flex justify-between uppercase"><span>PELANGGAN:</span><span>{selectedOrder?.customerName}</span></div>
          {/* Perbaikan: Menggunakan timezone Jakarta agar tidak geser hari */}
          <div className="flex justify-between">
            <span>WAKTU:</span>
            <span>{new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</span>
          </div>
        </div>

        <div className="border-b border-dashed my-2"></div>
        <table className="w-full text-left">
          <tbody>
            {selectedOrder?.items.map((item: any, i: number) => (
              <tr key={i} className="align-top">
                <td className="py-1">
                  <div className="font-bold">{item.name}</div>
                  <div className="text-[10px]">{item.qty} x {item.price.toLocaleString('id-ID')} ({item.variant})</div>
                  {item.note && <div className="text-[9px] italic">*{item.note}</div>}
                </td>
                <td className="py-1 text-right">{(item.price * item.qty).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-b border-dashed my-2"></div>
        
        <div className="space-y-1">
          <div className="flex justify-between font-bold text-base">
            <span>TOTAL:</span>
            <span>Rp {Number(selectedOrder?.total || 0).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span>Metode:</span>
            <span className="font-bold uppercase">{paymentMethod}</span>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="font-bold">SUDAH DIBAYAR</p>
          <p className="text-[10px] mt-1">Terima Kasih Atas Kunjungan Anda</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
}