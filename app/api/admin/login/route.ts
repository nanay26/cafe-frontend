import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ===== KONFIGURASI RATE LIMIT =====
// Kita simpan data percobaan di Map (IP Address -> {count, lastAttempt})
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

const MAX_ATTEMPTS = 3;          // Maksimal 3 kali salah
const LOCK_TIME = 15 * 60 * 1000; // Kunci selama 15 menit jika melebihi batas

export async function POST(req: NextRequest) {
  try {
    // Ambil IP Address user
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();

    // 1. CEK RATE LIMIT
    const userAttempt = loginAttempts.get(ip);

    if (userAttempt) {
      // Jika masih dalam masa hukuman (LOCK_TIME)
      if (userAttempt.count >= MAX_ATTEMPTS && now - userAttempt.lastAttempt < LOCK_TIME) {
        const remainingTime = Math.ceil((LOCK_TIME - (now - userAttempt.lastAttempt)) / 60000);
        return NextResponse.json(
          { message: `Terlalu banyak percobaan. Coba lagi dalam ${remainingTime} menit.` },
          { status: 429 }
        );
      }
      
      // Jika masa hukuman sudah lewat, reset hitungan
      if (now - userAttempt.lastAttempt > LOCK_TIME) {
        loginAttempts.set(ip, { count: 0, lastAttempt: now });
      }
    }

    const { username, password } = await req.json();

    // 2. AMBIL HASH DARI ENV (DENGAN FALLBACK)
    const envHash = process.env.ADMIN_PASSWORD_HASH?.trim() || '';
    const finalHash = envHash.startsWith('$2b$') 
      ? envHash 
      : '$2b$10$ckMiA9703.q7sgzDSvDcfOfm.8ZbBi9Ewd558mOktl.W.SIYj1gMq';

    // 3. VALIDASI USERNAME & PASSWORD
    const isUserValid = username === process.env.ADMIN_USERNAME;
    const isPassValid = isUserValid ? bcrypt.compareSync(password, finalHash) : false;

    if (!isUserValid || !isPassValid) {
      // CATAT KEGAGALAN (Tambah hitungan rate limit)
      const currentCount = (loginAttempts.get(ip)?.count || 0) + 1;
      loginAttempts.set(ip, { count: currentCount, lastAttempt: now });

      return NextResponse.json(
        { message: `Login gagal. Sisa percobaan: ${MAX_ATTEMPTS - currentCount}` },
        { status: 401 }
      );
    }

    // 4. LOGIN BERHASIL (Reset rate limit untuk IP ini)
    loginAttempts.delete(ip);

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '8h' });
    const res = NextResponse.json({ success: true });

    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return res;
  } catch (err) {
    return NextResponse.json({ message: 'Error server' }, { status: 500 });
  }
}