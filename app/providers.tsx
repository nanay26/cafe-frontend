// app/providers.tsx
'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { AdminProvider } from './AdminContext';
import ClientLayout from './ClientLayout';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <AdminProvider>
        <div className="flex min-h-screen">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </AdminProvider>
    </CartProvider>
  );
}