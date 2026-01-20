import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function GET(req: any) {
  const guestToken = req.cookies.get('guest_session')?.value;
  const adminToken = req.cookies.get('admin_token')?.value;

  // Jika tidak ada token sama sekali
  if (!guestToken && !adminToken) {
    return NextResponse.json({ active: false });
  }

  try {
    // Verifikasi token (utamakan admin jika ada)
    const token = adminToken || guestToken;
    await jwtVerify(token!, SECRET);
    
    return NextResponse.json({ active: true });
  } catch (err) {
    // Jika token expired atau rusak
    return NextResponse.json({ active: false });
  }
}