'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  refreshSession: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Sinkron status admin dari SERVER
   * Menambahkan cache: 'no-store' agar browser selalu meminta data terbaru
   */
  const refreshSession = async () => {
    try {
      const res = await fetch('https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/admin/session', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store', // Sangat penting agar status login tidak tersangkut cache browser
      });
      
      const data = await res.json();
      setIsAdmin(data.isAdmin === true);
    } catch (error) {
      console.error("Session Check Error:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout aman (hapus cookie di server)
   */
  const logoutAdmin = async () => {
    try {
      await fetch('https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setIsAdmin(false);
      // Menggunakan window.location agar seluruh state aplikasi ter-reset total
      window.location.href = 'https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/admin/login';
    }
  };

  /**
   * Cek session saat pertama kali aplikasi dimuat
   */
  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        loading,
        refreshSession,
        logoutAdmin,
      }}
    >
      {/* Opsional: Tampilkan skeleton/loading saat pengecekan session pertama kali */}
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-pulse text-amber-600 font-bold uppercase tracking-widest">
            Loading Session...
          </div>
        </div>
      )}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}