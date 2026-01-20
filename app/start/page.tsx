'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function StartPage() {
  const router = useRouter();

  useEffect(() => {
    // Di app/start/page.tsx
const initSession = async () => {
  try {
    // Gunakan rute relatif jika API-nya ada di project yang sama (Frontend)
    const res = await fetch('/api/auth/guest', { method: 'POST' }); 
    
    if (res.ok) {
      router.replace('/'); 
    }
  } catch (error) {
    console.error("Gagal memulai sesi");
  }
};
    initSession();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-amber-600 mb-4" size={40} />
      <p className="text-gray-600 font-bold animate-pulse">Menyiapkan Menu...</p>
    </div>
  );
}