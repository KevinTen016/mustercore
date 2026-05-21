import { NextResponse } from 'next/server';
import { destroySession, tokenFromRequest, SESSION_COOKIE } from '@/lib/session';

export async function POST(req: Request) {
  const token = tokenFromRequest(req);
  if (token) destroySession(token);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
  return res;
}
