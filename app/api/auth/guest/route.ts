import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST() {
  // 1. Set Expiration JWT menjadi 5 menit ('5m')
  const token = await new SignJWT({ role: 'guest' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') 
    .sign(SECRET);

  const response = NextResponse.json({ success: true });

  // 2. Simpan di Cookie dengan maxAge 300 detik (5 menit * 60 detik)
  response.cookies.set('guest_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600, 
    path: '/',
  });

  return response;
}