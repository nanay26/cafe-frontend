import crypto from 'crypto';
import { cookies } from 'next/headers';

const CSRF_COOKIE = 'csrf_token';

export async function validateCsrf(tokenFromHeader?: string | null) {
  if (!tokenFromHeader) return false;

  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get(CSRF_COOKIE)?.value;

  if (!tokenFromCookie) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(tokenFromHeader),
      Buffer.from(tokenFromCookie)
    );
  } catch {
    return false;
  }
}
