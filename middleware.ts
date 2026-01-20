import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  const token = req.cookies.get('admin_token')?.value;
  const guestToken = req.cookies.get('guest_session')?.value;

  // 1. Tambahkan '/favicon.ico' dan '/public' ke daftar pengecualian statis
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') ||
    pathname === '/start' || 
    pathname === '/qr' ||
    pathname === '/scan-expired' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Proteksi Sesi Tamu
  if (pathname === '/' || pathname.startsWith('/menu')) {
    if (token) return NextResponse.next();

    // PENTING: Jika kamu baru saja pindah ke Koyeb, 
    // pastikan cookie 'guest_session' sudah dikirim dengan domain yang benar.
    if (!guestToken) {
      // Gunakan redirect alih-alih rewrite untuk tes awal agar terlihat perubahannya di URL
      return NextResponse.redirect(new URL('/scan-expired', req.url));
    }
    return NextResponse.next();
  }

  // 3. Proteksi folder /admin
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';

    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    if (token && isLoginPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/', '/menu/:path*'],
};