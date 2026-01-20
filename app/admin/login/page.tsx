'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Coffee, Lock } from 'lucide-react';
import { useAdmin } from '@/app/AdminContext'; // Import context

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { refreshSession } = useAdmin(); // Ambil fungsi refresh

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal login');

      // 1. Update status di AdminContext agar Sidebar muncul
      await refreshSession();

      // 2. Pindah ke dashboard admin
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 text-slate-900 relative overflow-hidden">
      {/* Dekorasi Artistik Latar Belakang */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-50 rounded-md blur-[120px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/50 rounded-md blur-[120px] opacity-60" />

      <div className="w-full max-w-md relative">
        {/* Logo/Icon Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-amber-600 text-white p-4 rounded-md shadow-xl shadow-amber-200 mb-4 transform hover:rotate-6 transition-transform">
            <Coffee size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black tracking-[0.2em] uppercase text-slate-800">TS Kopi</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Management Portal</p>
        </div>

        <form 
          onSubmit={handleLogin} 
          className="bg-white/80 backdrop-blur-xl p-10 rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white space-y-6"
        >
          <div className="space-y-4">
            {/* Field Username */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full bg-slate-50 border border-slate-100 p-3.5 pl-4 rounded-md outline-none focus:border-amber-600 focus:bg-white focus:ring-4 focus:ring-amber-500/5 transition-all text-sm font-medium"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Field Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 p-3.5 pl-4 rounded-md outline-none focus:border-amber-600 focus:bg-white focus:ring-4 focus:ring-amber-500/5 transition-all text-sm font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-[11px] font-bold bg-red-50/50 backdrop-blur-sm p-4 border border-red-100 rounded-xl flex items-center gap-3 animate-shake">
              <AlertCircle size={16} /> <span>{error}</span>
            </div>
          )}

          <button 
            disabled={isLoading} 
            className="w-full bg-slate-900 hover:bg-amber-600 text-white py-4 rounded-md font-black text-xs tracking-[0.2em] transition-all duration-300 shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 uppercase"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                <span>Authenticating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Lock size={14} />
                <span>Sign In</span>
              </div>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400 font-medium mt-8 tracking-widest uppercase italic">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}