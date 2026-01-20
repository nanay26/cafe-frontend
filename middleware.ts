import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // Perbaikan: diubah dari 'next/request' ke 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Mengambil token dari cookie browser
  const token = req.cookies.get('admin_token')?.value;
  const guestToken = req.cookies.get('guest_session')?.value;

  // 1. Izinkan akses ke file statis, API, dan halaman publik utama agar tidak redirect loop
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') ||
    pathname === '/start' || 
    pathname === '/qr' ||
    pathname === '/scan-expired'
  ) {
    return NextResponse.next();
  }

  // 2. Proteksi Sesi Tamu (Customer QR)
  // Memastikan pembeli punya guest_session sebelum bisa melihat menu
  if (pathname === '/' || pathname.startsWith('/menu')) {
    // Jika dia admin (punya admin_token), izinkan langsung akses home
    if (token) {
      return NextResponse.next();
    }

    // Jika bukan admin dan tidak punya sesi tamu, arahkan ke halaman expired
    if (!guestToken) {
      return NextResponse.rewrite(new URL('/scan-expired', req.url));
    }
    return NextResponse.next();
  }

  // 3. Proteksi folder /admin (Dashboard Management)
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';

    // Jika tidak ada token dan mencoba masuk ke halaman selain login, tendang balik ke login
    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Jika sudah punya token admin dan mencoba buka halaman login, lempar ke dashboard
    if (token && isLoginPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Menentukan rute mana saja yang diproses oleh middleware ini
  matcher: ['/admin/:path*', '/', '/menu/:path*'],
};