import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Samakan dengan yang ada di .env
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;

  if (!token) {
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }

  try {
    // Gunakan jose agar sinkron dengan Middleware saat pindah halaman
    await jwtVerify(token, SECRET);
    return NextResponse.json({ isAdmin: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }
}