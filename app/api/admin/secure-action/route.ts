import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { validateCsrf } from '@/lib/validateCsrf';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const csrfHeader = req.headers.get('x-csrf-token');
  if (!validateCsrf(csrfHeader)) {
    return NextResponse.json({ message: 'CSRF invalid' }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
