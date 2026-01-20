'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, ChevronDown, Check, X, Image as ImageIcon } from 'lucide-react';

export default function AddMenu() {
  const [form, setForm] = useState({ name: '', price: '', category: 'coffee', description: '' });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const router = useRouter();

  const categories = [
    { id: 'coffee', name: 'COFFEE' },
    { id: 'non-coffee', name: 'NON-COFFEE' },
    { id: 'snack', name: 'SNACK' }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('description', form.description);
    if (image) formData.append('image', image);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/api/menu/upload`, {
    method: 'POST',
    body: formData,
  });

    if (res.ok) {
      alert('Menu berhasil ditambah!');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-12 font-sans antialiased text-slate-900">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-2 text-slate-400 hover:text-amber-600 transition-colors text-xs font-black uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
            <span className="hidden md:inline">Kembali</span>
          </button>
          <div className="md:hidden">
            <h1 className="text-lg font-black tracking-tighter text-slate-900 uppercase">
              Tambah <span className="text-amber-600">Menu</span>
            </h1>
          </div>
          <div className="w-8"></div>
        </div>
        
        {/* Header Desktop */}
        <div className="mb-10 hidden md:block">
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">
            Tambah <span className="text-amber-600">Menu Baru</span>
          </h1>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] mt-3">
             TS Kopi Digital Management
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          
          <div className="bg-white p-5 md:p-8 rounded-md border border-slate-200 shadow-sm space-y-5">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Produk</label>
              <input 
                type="text" 
                placeholder="Contoh: Caramel Macchiato" 
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none transition-all font-medium"
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Harga</label>
                <input 
                  type="number" 
                  placeholder="25000" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none transition-all font-bold text-slate-700"
                  onChange={e => setForm({...form, price: e.target.value})} 
                  required 
                />
              </div>

              {/* CUSTOM CATEGORY DROPDOWN */}
              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Kategori</label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm flex justify-between items-center focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none transition-all font-bold text-slate-700 uppercase"
                >
                  {categories.find(c => c.id === form.category)?.name}
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <>
                    {/* Background Overlay: Fixed (Mobile) / Invisible (Desktop) */}
                    <div 
                      className="fixed inset-0 z-[40] bg-black/40 md:bg-transparent" 
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    
                    {/* Dropdown Menu Container */}
                    {/* Menggunakan fixed di mobile agar jadi bottom-sheet, absolute di desktop agar melayang */}
                    <div className="fixed md:absolute bottom-0 md:bottom-auto md:top-full left-0 right-0 z-[50] w-full mt-2 bg-white md:border border-slate-100 shadow-2xl md:shadow-xl rounded-t-2xl md:rounded-md overflow-hidden animate-in slide-in-from-bottom md:slide-in-from-top-2 duration-300 md:duration-150">
                      
                      {/* Header Dropdown khusus Mobile */}
                      <div className="flex items-center justify-between p-4 border-b border-slate-100 md:hidden">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Pilih Kategori</span>
                        <X size={18} onClick={() => setIsDropdownOpen(false)} className="text-slate-400" />
                      </div>

                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setForm({...form, category: cat.id});
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center justify-between px-6 md:px-4 py-4 md:py-3 text-[11px] md:text-[10px] font-black uppercase tracking-widest hover:bg-amber-50 hover:text-amber-600 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                        >
                          {cat.name}
                          {form.category === cat.id && <Check size={14} className="text-amber-600" />}
                        </div>
                      ))}
                      
                      {/* Padding bawah untuk mobile agar tidak tertutup area navigasi HP */}
                      <div className="h-4 md:hidden bg-white"></div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Deskripsi Singkat</label>
              <textarea 
                placeholder="Jelaskan rasa atau komposisi menu..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none transition-all font-medium"
                rows={3}
                onChange={e => setForm({...form, description: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Section: Image Upload */}
          <div className="bg-white p-5 md:p-8 rounded-md border border-slate-200 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Foto Produk</label>
            
            {!preview ? (
              <div className="border-2 border-dashed border-slate-200 p-8 md:p-10 text-center rounded-md hover:border-amber-400 transition-colors group">
                <input type="file" onChange={handleImageChange} className="hidden" id="fileInput" accept="image/*" />
                <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-3 bg-slate-50 rounded-full text-slate-400 group-hover:text-amber-600 group-hover:bg-amber-50 transition-all">
                    <Upload size={20} />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">Upload Foto</span>
                </label>
              </div>
            ) : (
              <div className="relative rounded-md overflow-hidden border border-slate-200 bg-slate-50 p-3 flex items-center gap-4">
                <div className="w-14 h-14 rounded bg-slate-200 flex-shrink-0">
                  <img src={preview} className="w-full h-full object-cover rounded" alt="thumb" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] font-black text-slate-700 truncate uppercase tracking-tighter">{image?.name}</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">Siap diunggah</p>
                </div>
                <button 
                  type="button"
                  onClick={() => {setImage(null); setPreview(null);}}
                  className="p-2 bg-red-50 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full bg-amber-600 text-white py-4 rounded-md font-black uppercase tracking-[0.2em] text-[11px] hover:bg-amber-700 shadow-xl shadow-amber-600/20 active:scale-[0.98] transition-all"
          >
            Simpan Menu
          </button>

        </form>

        {/* Footer Brand */}
        <div className="mt-16 py-8 border-t border-slate-100 flex justify-center">
           <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.5em]">
             Tersenyum Coffee
           </p>
        </div>
      </div>
    </div>
  );
}