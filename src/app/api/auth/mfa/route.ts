import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import { getAdminSettings } from '@/lib/admin-settings';
import { createSession, SESSION_COOKIE } from '@/lib/session';
import { consumeMfaToken, recordMfaFailure, invalidateMfaToken } from '@/lib/mfa-state';

const MAX_AGE = 8 * 60 * 60;

// Per-IP rate limit for MFA attempts — separate from the login rate limiter.
const mfaAttempts = new Map<string, { count: number; resetAt: number }>();
const MFA_WINDOW_MS = 5 * 60 * 1000;
const MFA_MAX = 10;

const _gf = globalThis as unknown as { _mfaRlCleanup?: ReturnType<typeof setInterval> };
if (!_gf._mfaRlCleanup) {
  _gf._mfaRlCleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, e] of mfaAttempts) if (now > e.resetAt) mfaAttempts.delete(ip);
  }, 10 * 60 * 1000);
}

function isMfaRateLimited(ip: string): boolean {
  const now = Date.now();
  const e = mfaAttempts.get(ip);
  if (!e || now > e.resetAt) {
    mfaAttempts.set(ip, { count: 1, resetAt: now + MFA_WINDOW_MS });
    return false;
  }
  return ++e.count > MFA_MAX;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (isMfaRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Zu viele Versuche. Bitte neu anmelden.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const { mfaToken, code } = (body ?? {}) as Record<string, unknown>;
  if (typeof mfaToken !== 'string' || typeof code !== 'string') {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const tokenCheck = consumeMfaToken(mfaToken);
  if (!tokenCheck.valid) {
    const msg = tokenCheck.reason === 'expired'
      ? 'Sitzung abgelaufen. Bitte neu anmelden.'
      : 'Ungültiges Token. Bitte neu anmelden.';
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  const settings = await getAdminSettings();
  if (!settings.totpEnabled || !settings.totpSecret) {
    invalidateMfaToken(mfaToken);
    // TOTP was disabled between login and MFA step — allow through
    const token = createSession();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: MAX_AGE,
      path: '/',
    });
    return res;
  }

  authenticator.options = { window: 1 };
  const isValid = authenticator.check(code.replace(/\s/g, ''), settings.totpSecret);

  if (!isValid) {
    const tokenInvalidated = recordMfaFailure(mfaToken);
    if (tokenInvalidated) {
      return NextResponse.json(
        { error: 'Zu viele Fehlversuche. Bitte neu anmelden.' },
        { status: 401 },
      );
    }
    return NextResponse.json({ error: 'Ungültiger Code. Bitte erneut versuchen.' }, { status: 401 });
  }

  invalidateMfaToken(mfaToken);

  const token = createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  });
  return res;
}
