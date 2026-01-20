import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Pastikan SECRET ini sama dengan yang ada di .env
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('admin_token')?.value;
  const guestToken = req.cookies.get('guest_session')?.value;

  // 1. Izinkan akses ke file statis dan API agar tidak kena redirect loop
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') ||
    pathname === '/start' ||      // Izinkan akses ke halaman aktivasi
    pathname === '/qr'            // Izinkan akses ke halaman QR
  ) {
    return NextResponse.next();
  }

  // --- TAMBAHAN: Proteksi Sesi Tamu (QR) ---
  // Jika akses halaman utama atau detail menu
  if (pathname === '/' || pathname.startsWith('/menu')) {
    // Jika dia admin, izinkan langsung tanpa cek guest_session
    if (token) {
      try {
        await jwtVerify(token, SECRET);
        return NextResponse.next();
      } catch (err) {
        // Jika token admin rusak saat di home, biarkan lanjut ke pengecekan guest
      }
    }

    // Cek sesi tamu
    if (!guestToken) {
      return NextResponse.rewrite(new URL('/scan-expired', req.url));
    }

    try {
      await jwtVerify(guestToken, SECRET);
      return NextResponse.next();
    } catch (err) {
      const res = NextResponse.rewrite(new URL('/scan-expired', req.url));
      res.cookies.delete('guest_session');
      return res;
    }
  }
  // --- AKHIR TAMBAHAN ---

  // 2. Proteksi folder /admin (Kode Asli Kamu)
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';

    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    if (token) {
      try {
        await jwtVerify(token, SECRET);
        
        if (isLoginPage) {
          return NextResponse.redirect(new URL('/', req.url));
        }
        
        return NextResponse.next();
      } catch (err) {
        const res = NextResponse.redirect(new URL('/admin/login', req.url));
        res.cookies.delete('admin_token');
        return res;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Update Matcher agar mencakup admin, home (/), dan menu
  matcher: ['/admin/:path*', '/', '/menu/:path*'],
};