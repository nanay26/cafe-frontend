import crypto from 'crypto';
import { cookies } from 'next/headers';

const CSRF_COOKIE = 'csrf_token';

export async function generateCsrfToken() {
  const token = crypto.randomBytes(32).toString('hex');

  const cookieStore = await cookies();

  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: false, // harus false agar dikirim via header
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return token;
}
