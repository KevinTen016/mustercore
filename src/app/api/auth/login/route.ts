import { NextResponse } from 'next/server';
import { createSession, SESSION_COOKIE } from '@/lib/session';

const MAX_AGE = 8 * 60 * 60; // seconds

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
  }

  const { username, password } = body as Record<string, unknown>;

  const validUser = process.env.ADMIN_USER ?? 'admin';
  const validPass = process.env.ADMIN_PASSWORD ?? 'webcore2025';

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ error: 'Benutzername oder Passwort falsch.' }, { status: 401 });
  }

  const token = createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });
  return res;
}
