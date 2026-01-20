'use client';

import { useState } from 'react';
import { useCart, Order } from '@/context/CartContext';
import { X, Printer, Receipt, FileText } from 'lucide-react';

export default function AdminHistoryPage() {
  const { orders } = useCart();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getTodayDate = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  const [filterDate, setFilterDate] = useState(getTodayDate());

  const historyOrders = orders
    .filter(o => o.status === 'completed')
    .filter(o => (filterDate ? o.createdAt.startsWith(filterDate) : true))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Komponen Mobile Order Card (Sesuai Desain Anda)
  const MobileOrderCard = ({ order }: { order: any }) => (
    <div 
      onClick={() => setSelectedOrder(order)}
      className="bg-white rounded-lg border border-slate-200 p-4 mb-3 shadow-sm active:scale-[0.98] transition-transform"
    >
      <div className="flex justify-between items-start mb-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID #{order.id}</span>
          <p className="text-xs font-bold text-slate-900 leading-none mt-1">
            {new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
          <p className="text-[10px] font-medium text-slate-400 mt-0.5 italic">
            {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <FileText size={14} className="text-slate-300" />
      </div>

      <div className="mb-3">
        <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-1">Pelanggan</span>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
          {order.customerName || 'Customer'}
        </h3>
      </div>

      <div className="mb-4">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Items</span>
        <div className="flex flex-wrap gap-1.5">
          {order.items.map((item: any, idx: number) => (
            <div 
              key={idx} 
              className="flex items-center gap-2 bg-slate-100/50 px-2 py-1 rounded-md border border-slate-200/50"
            >
              <span className="text-[10px] font-black text-slate-900">{item.qty}x</span>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
        <div>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1 italic">Metode Bayar</span>
          <p className="text-[10px] font-black text-amber-700 uppercase px-2 py-0.5 bg-amber-50 border border-amber-100 rounded-sm inline-block">
            {order.paymentMethod || 'Tunai / Cash'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total</span>
          <p className="text-lg font-black text-slate-900 tracking-tighter">
            Rp {Number(order.total).toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-10 bg-[#fafafa] min-h-screen font-sans antialiased text-slate-900">
      <div className="max-w-4xl mx-auto no-print">
        
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Riwayat</h1>
            <p className="text-slate-400 text-sm mt-1 font-medium italic uppercase tracking-widest text-[10px]">
              Log Transaksi Selesai — {filterDate === getTodayDate() ? 'Hari Ini' : 'Arsip'}
            </p>
          </div>

          <div className="relative border-b-2 border-slate-200 focus-within:border-amber-600 transition-colors">
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent py-2 px-1 text-sm font-bold text-slate-800 outline-none cursor-pointer uppercase tracking-tighter"
            />
          </div>
        </div>

        {/* Desktop Version */}
        <div className="hidden md:block space-y-4">
          {historyOrders.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-slate-200 rounded-md">
              <p className="text-slate-300 text-xs font-bold uppercase tracking-[0.2em]">
                Tidak ada pesanan untuk tanggal ini
              </p>
            </div>
          ) : (
            historyOrders.map((order: any) => (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className="group bg-white rounded-md border border-slate-200 flex flex-col md:flex-row items-stretch transition-all hover:border-amber-400 cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center min-w-[160px] bg-slate-50/30">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ID #{order.id}</span>
                  <p className="text-sm font-bold text-slate-900 leading-none">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400 mt-1 italic">
                    {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-center">
                  <div className="mb-3">
                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-0.5">Pelanggan</span>
                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                      {order.customerName || 'Customer'}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {order.items.map((item: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2 bg-slate-100/50 px-2 py-1 rounded-md border border-slate-200/50"
                      >
                        <span className="text-[10px] font-black text-slate-900">{item.qty}x</span>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-center items-start md:items-end min-w-[180px] bg-white rounded-md">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Metode Bayar</span>
                  <p className="text-[10px] font-black text-amber-700 uppercase mb-3 px-2 py-0.5 bg-amber-50 border border-amber-100 rounded-sm">
                    {order.paymentMethod || 'Tunai / Cash'}
                  </p>
                  <p className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                    Rp {Number(order.total).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mobile Version */}
        <div className="md:hidden space-y-3">
          {historyOrders.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-slate-200 rounded-md">
              <p className="text-slate-300 text-xs font-bold uppercase tracking-[0.2em]">
                Tidak ada pesanan untuk tanggal ini
              </p>
            </div>
          ) : (
            historyOrders.map((order: any) => (
              <MobileOrderCard key={order.id} order={order} />
            ))
          )}
        </div>

        <div className="mt-20 py-8 border-t border-slate-100">
            <p className="text-center text-[9px] font-black text-slate-200 uppercase tracking-[0.5em]">
              Tersenyum Coffee 
            </p>
        </div>
      </div>

      {/* MODAL NOTA DIGITAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
          <div className="bg-white w-full max-w-md rounded-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-2">
                <span className="font-black text-[10px] uppercase tracking-[0.2em] text-amber-600">Nota Digital</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-400">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8 font-mono text-slate-800 text-sm">
              <div className="text-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900">Tersenyum Coffee</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Jl. Pekojan, Purwodinatan, Semarang Tengah</p>
                <div className="border-b border-dashed border-slate-200 my-4"></div>
              </div>

              <div className="space-y-1 text-[11px] mb-6">
                <div className="flex justify-between text-slate-500"><span>NOTA ID</span><span className="font-bold text-slate-900">#{selectedOrder.id}</span></div>
                <div className="flex justify-between text-slate-500"><span>TANGGAL</span><span className="text-slate-900">{new Date(selectedOrder.createdAt).toLocaleDateString('id-ID')}</span></div>
                <div className="flex justify-between text-slate-500"><span>CUSTOMER</span><span className="font-bold uppercase text-slate-900">{selectedOrder.customerName}</span></div>
              </div>

              <div className="space-y-3 mb-6">
                {selectedOrder.items.map((item: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{item.name}</span>
                      <span>{(item.price * item.qty).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.qty} x {item.price.toLocaleString('id-ID')} ({item.variant})
                    </div>
                    {item.note && <div className="text-[10px] italic text-amber-600 font-sans mt-0.5">*{item.note}</div>}
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between text-lg font-black text-slate-900">
                  <span>TOTAL</span>
                  <span className="tracking-tighter">Rp {Number(selectedOrder.total).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[11px] italic text-slate-500">
                  <span>METODE BAYAR</span>
                  <span className="font-bold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-100">
                    {(selectedOrder as any).paymentMethod || 'Tunai / Cash'}
                  </span>
                </div>
              </div>

              <div className="mt-10 text-center text-[10px] text-slate-300">
                <p className="font-bold text-slate-900 mb-1">TERIMA KASIH</p>
                <p className="uppercase tracking-widest text-[8px]">Transaksi telah  berhasil</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => window.print()}
                className="w-full bg-slate-900 text-white py-3 rounded-md font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <Printer size={14} /> Cetak Ulang Nota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRUK KHUSUS PRINT */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .font-mono { font-family: Courier, monospace !important; }
        }
      `}</style>
    </div>
  );
}