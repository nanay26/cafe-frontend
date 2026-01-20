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
    // Panggil Next.js API route (relative path)
    const res = await fetch('/api/admin/session', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
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

const logoutAdmin = async () => {
  try {
    // Panggil Next.js API route
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } finally {
    setIsAdmin(false);
    window.location.href = '/admin/login'; // Frontend route
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