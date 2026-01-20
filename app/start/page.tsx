'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function StartPage() {
  const router = useRouter();

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch('https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/auth/guest', { method: 'POST' });
        if (res.ok) {
          router.replace('/'); // Jika sukses dapat tiket, masuk ke menu
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