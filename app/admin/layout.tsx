'use client';

import { useAdmin } from '../AdminContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Hindari hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || loading) return;

    // Jika belum login dan bukan di halaman login → redirect
    if (!isAdmin && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isAdmin, loading, pathname, router, isMounted]);

  if (!isMounted || loading) return null;

  return <>{children}</>;
}
