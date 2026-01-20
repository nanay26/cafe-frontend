'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Tambahkan useParams
import { ArrowLeft, Upload, ChevronDown, Check, X } from 'lucide-react';

export default function EditMenu() {
  const [form, setForm] = useState({ name: '', price: '', category: 'coffee', description: '' });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const params = useParams(); // Mengambil ID dari URL (contoh: /admin/edit-menu/12)
  const menuId = params.id;

  const categories = [
    { id: 'coffee', name: 'COFFEE' },
    { id: 'non-coffee', name: 'NON-COFFEE' },
    { id: 'snack', name: 'SNACK' }
  ];

  // 1. Ambil data menu lama saat halaman dibuka
  useEffect(() => {
  const fetchMenuDetail = async () => {
    try {
      // Ganti dengan domain Koyeb Anda
      const API_URL = "https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app";
      const res = await fetch(`${API_URL}/api/menu/${menuId}`);
      
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name,
          price: data.price.toString(),
          category: data.category,
          description: data.description || ''
        });
        
        // FIX: Handle image path
        if (data.image) {
          // Jika image sudah full URL, gunakan langsung
          if (data.image.startsWith('http')) {
            setPreview(data.image);
          } 
          // Jika image path relatif
          else if (data.image.startsWith('/')) {
            setPreview(`${API_URL}${data.image}`);
          }
          // Jika hanya nama file
          else {
            setPreview(`${API_URL}/uploads/${data.image}`);
          }
        }
      }
    } catch (error) {
      console.error("Gagal memuat detail menu:", error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchMenuDetail();
}, [menuId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gunakan try-catch untuk menangkap error
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('description', form.description);
      
      if (image) {
        formData.append('image', image);
      }

      // Gunakan URL absolut atau relatif yang tepat ke proxy API Anda
      const res = await fetch(`https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/menu/${menuId}`, {
        method: 'PUT', // Pastikan backend Anda mendukung PUT untuk update
        body: formData,
        // Jangan set 'Content-Type' manual saat mengirim FormData, 
        // browser akan mengesetnya otomatis termasuk 'boundary'-nya.
      });

      if (res.ok) {
        router.push('/');
        router.refresh(); // Memaksa halaman kelola mengambil data terbaru
      } else {
        const errorData = await res.json();
        alert(`Gagal menyimpan: ${errorData.message || 'Error server'}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert('Terjadi kesalahan koneksi ke server.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-[10px] tracking-widest text-slate-400 uppercase">Loading Data...</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-12 font-sans antialiased text-slate-900">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-2 text-slate-400 hover:text-amber-600 transition-colors text-xs font-black uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
            <span>Kembali</span>
          </button>
        </div>
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">
            Edit <span className="text-amber-600">Menu</span>
          </h1>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] mt-3">
             ID Produk: #{menuId}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-md border border-slate-200 shadow-sm space-y-5">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Produk</label>
              <input 
                type="text" 
                value={form.name}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none transition-all font-medium"
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Harga</label>
                <input 
                  type="number" 
                  value={form.price}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none transition-all font-bold text-slate-700"
                  onChange={e => setForm({...form, price: e.target.value})} 
                  required 
                />
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Kategori</label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm flex justify-between items-center outline-none font-bold text-slate-700 uppercase"
                >
                  {categories.find(c => c.id === form.category)?.name}
                  <ChevronDown size={16} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-[50] mt-2 bg-white border border-slate-100 shadow-xl rounded-md overflow-hidden">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setForm({...form, category: cat.id});
                          setIsDropdownOpen(false);
                        }}
                        className="px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-amber-50 hover:text-amber-600 cursor-pointer flex justify-between items-center"
                      >
                        {cat.name}
                        {form.category === cat.id && <Check size={14} className="text-amber-600" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Deskripsi</label>
              <textarea 
                value={form.description}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm outline-none font-medium"
                rows={3}
                onChange={e => setForm({...form, description: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-md border border-slate-200 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Ubah Foto (Opsional)</label>
            <div className="relative rounded-md overflow-hidden border border-slate-200 bg-slate-50 p-3 flex items-center gap-4">
               <div className="w-14 h-14 rounded bg-slate-200 flex-shrink-0">
                 {preview && <img src={preview} className="w-full h-full object-cover rounded" alt="thumb" />}
               </div>
               <div className="flex-1 overflow-hidden">
                 <input type="file" onChange={handleImageChange} className="hidden" id="editFileInput" accept="image/*" />
                 <label htmlFor="editFileInput" className="cursor-pointer text-[10px] font-black text-amber-600 uppercase underline decoration-2 underline-offset-4">Ganti Gambar</label>
               </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-amber-600 text-white py-4 rounded-md font-black uppercase tracking-[0.2em] text-[11px] hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/20"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}