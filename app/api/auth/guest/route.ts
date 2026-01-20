import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

// Pastikan variabel JWT_SECRET ada di .env Vercel agar tidak error (!)
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-123');

export async function POST() {
  try {
    // 1. Buat Token Guest (Masa aktif 1 jam sesuai setExpirationTime)
    const token = await new SignJWT({ role: 'guest' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h') 
      .sign(SECRET);

    const response = NextResponse.json({ 
      success: true,
      message: 'Guest session created' 
    });

    // 2. Simpan di Cookie (3600 detik = 1 jam)
    response.cookies.set('guest_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Diubah ke 'lax' agar redirect dari QR code eksternal lebih mulus
      maxAge: 3600, 
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Guest Session Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}