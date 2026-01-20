'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import CartButtonComponent from '@/components/CartButton';
import { useAdmin } from '@/app/AdminContext';
import { Coffee } from 'lucide-react';

function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAdmin } = useAdmin();

  const config = useMemo(() => {
    const isLoginPage = pathname === '/admin/login';
    const customerRoutes = ['/qr', '/'];
    const isCustomerRoute =
      customerRoutes.includes(pathname) || pathname.startsWith('/menu');

    return {
      isCustomerRoute,

      // Sidebar logic TETAP sama (UX tidak berubah)
      showSidebar: isAdmin
        ? !isLoginPage
        : !isCustomerRoute && !isLoginPage,

      // Cart hanya untuk customer
      showCart: !isAdmin && isCustomerRoute,
    };
  }, [isAdmin, pathname]);

  return (
    <>
      {isAdmin && (
        <div className="fixed top-0 right-0 bg-amber-600 text-white px-3 py-1 z-[50] text-[10px] font-bold rounded-bl-lg shadow-md uppercase tracking-wider">
          Admin Mode
        </div>
      )}

      {config.showSidebar &&
        (isAdmin ? (
          <Sidebar />
        ) : (
          <aside className="w-16 lg:w-20 fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-100 flex flex-col items-center py-8 z-40">
            <div className="mb-8">
              <div className="bg-amber-600/10 text-amber-600 p-2 rounded-xl">
                <Coffee size={24} />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="w-8 h-1 bg-gray-100 rounded-full animate-pulse" />
              <div className="w-8 h-1 bg-gray-100 rounded-full animate-pulse" />
            </div>
          </aside>
        ))}

      <main
        className={`flex-1 transition-all duration-300 ${
          !config.showSidebar ? 'w-full' : ''
        }`}
      >
        {config.showCart && <CartButtonComponent />}
        {children}
      </main>
    </>
  );
}

export default ClientLayout;
