'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coffee,
  ChevronRight,
  Menu,
  Home,
  Shield,
  ShoppingBag,
  FileText,
  BarChart3,
  History,
  LogOut,
} from 'lucide-react';
import { useAdmin } from '@/app/AdminContext';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, logoutAdmin } = useAdmin();

  const adminMenu = [
    { name: 'Menu Utama', href: '/', icon: <Home size={18} /> },
    { name: 'Orders', href: '/admin/orders', icon: <ShoppingBag size={18} /> },
    { name: 'Reports', href: '/admin/reports', icon: <FileText size={18} /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={18} /> },
    { name: 'History', href: '/admin/history', icon: <History size={18} /> },
  ];

  // Jika bukan admin, sidebar tidak dirender
  if (!isAdmin) return null;

  return (
    <>
      {/* Mobile Toggle */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed top-5 left-5 z-50 p-2.5 bg-amber-600 text-white rounded-md shadow-xl active:scale-95 transition-all"
        >
          <Menu size={20} />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-100 flex flex-col z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="px-8 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-600 text-white p-2 rounded-md shadow-lg shadow-amber-200">
              <Coffee size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-[0.15em] text-slate-900 leading-none">
                Tersenyum <span className="text-amber-600">Coffe</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">
                Admin
              </p>
            </div>
          </div>

          {/* Badge Admin */}
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider">
            <div className="flex items-center gap-2 truncate">
              <Shield size={12} />
              <span className="truncate">Administrator</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {adminMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
                    : 'text-slate-500 hover:bg-amber-50 hover:text-amber-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-amber-600'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-bold text-[11px] uppercase tracking-widest">
                    {item.name}
                  </span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-slate-50">
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-md transition-all font-bold text-[11px] uppercase tracking-widest"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
