'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function StartPage() {
  const router = useRouter();

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch('https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/auth/guest', { 
          method: 'POST',
          // TAMBAHKAN INI: Wajib agar browser mau menyimpan cookie dari backend Koyeb
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          // Berikan sedikit delay agar browser sempat mencatat cookie
          setTimeout(() => {
            router.replace('/');
          }, 500);
        } else {
          console.error("Respon server tidak oke");
        }
      } catch (error) {
        console.error("Gagal memulai sesi:", error);
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