import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSession, SESSION_COOKIE } from '@/lib/session';
import { getAdminSettings, isIPAllowed } from '@/lib/admin-settings';
import { createMfaToken } from '@/lib/mfa-state';
import { authenticator } from 'otplib';

const MAX_AGE = 8 * 60 * 60;

// ── Per-IP rate limit ──────────────────────────────────────────────────────
// NOTE: X-Forwarded-For can be spoofed if the app runs without a trusted
// reverse proxy (nginx/Caddy) that overwrites this header with the real
// client IP. Configure your proxy with:
//   nginx:  proxy_set_header X-Forwarded-For $remote_addr;
//   Caddy:  trusted_proxies private_ranges
// The global backstop below limits brute-force even without a proxy.
const loginAttempts = new Map<string, { count: number; resetAt: number; lockedUntil?: number }>();
const WINDOW_MS   = 15 * 60 * 1000;
const MAX_TRIES   = 10;
const LOCKOUT_MS  = 60 * 60 * 1000;

// Global backstop: caps total login attempts per minute regardless of spoofed IP.
let globalWindow = { count: 0, resetAt: 0 };
const GLOBAL_MAX_PER_MIN = 200;

// Prevent unbounded Map growth — clean up expired entries every 10 minutes.
const _globalForLogin = globalThis as unknown as { _loginCleanup?: ReturnType<typeof setInterval> };
if (!_globalForLogin._loginCleanup) {
  _globalForLogin._loginCleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of loginAttempts) {
      if (now > (entry.lockedUntil ?? entry.resetAt)) loginAttempts.delete(ip);
    }
  }, 10 * 60 * 1000);
}

function checkGlobalRateLimit(): boolean {
  const now = Date.now();
  if (now > globalWindow.resetAt) {
    globalWindow = { count: 1, resetAt: now + 60_000 };
    return false;
  }
  return ++globalWindow.count > GLOBAL_MAX_PER_MIN;
}

function checkLoginRateLimit(ip: string): { blocked: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (entry?.lockedUntil && now < entry.lockedUntil) {
    return { blocked: true, retryAfter: Math.ceil((entry.lockedUntil - now) / 1000) };
  }

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { blocked: false };
  }

  entry.count++;
  if (entry.count > MAX_TRIES) {
    entry.lockedUntil = now + LOCKOUT_MS;
    return { blocked: true, retryAfter: LOCKOUT_MS / 1000 };
  }
  return { blocked: false };
}

function recordFailedLogin(ip: string): void {
  const entry = loginAttempts.get(ip);
  if (entry) entry.count = Math.max(entry.count, MAX_TRIES + 1);
}

// ── Password verification ──────────────────────────────────────────────────
// Preferred: ADMIN_PASSWORD_HASH=<16-byte-saltHex>:<64-byte-derivedKeyHex>
//   Generate with: node scripts/gen-password-hash.mjs
// Fallback: ADMIN_PASSWORD=<plaintext>  (kept for migration; remove after hashing)
async function verifyAdminPassword(candidate: string): Promise<boolean> {
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (storedHash) {
    const [saltHex, hashHex] = storedHash.split(':');
    if (!saltHex || !hashHex) return false;
    return new Promise((resolve) => {
      crypto.scrypt(candidate, Buffer.from(saltHex, 'hex'), 64, (err, derivedKey) => {
        if (err) { resolve(false); return; }
        try {
          resolve(crypto.timingSafeEqual(derivedKey, Buffer.from(hashHex, 'hex')));
        } catch {
          resolve(false);
        }
      });
    });
  }
  // Plain-text fallback — migrate by running scripts/gen-password-hash.mjs
  const validPass = process.env.ADMIN_PASSWORD;
  if (!validPass) return false;
  const bufA = Buffer.from(candidate);
  const bufB = Buffer.from(validPass);
  const len  = Math.max(bufA.length, bufB.length);
  const padA = Buffer.concat([bufA, Buffer.alloc(len - bufA.length)]);
  const padB = Buffer.concat([bufB, Buffer.alloc(len - bufB.length)]);
  return crypto.timingSafeEqual(padA, padB) && bufA.length === bufB.length;
}

export async function POST(req: Request) {
  // Refuse to run if no credentials are configured — prevents silent insecurity.
  if (!process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_PASSWORD) {
    console.error('[auth/login] ADMIN_PASSWORD_HASH (or legacy ADMIN_PASSWORD) is not set');
    return NextResponse.json({ error: 'Server nicht konfiguriert.' }, { status: 503 });
  }
  if (!process.env.ADMIN_USER) {
    console.error('[auth/login] ADMIN_USER is not set');
    return NextResponse.json({ error: 'Server nicht konfiguriert.' }, { status: 503 });
  }
  if (process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) {
    console.warn('[auth/login] plaintext ADMIN_PASSWORD in use — run scripts/gen-password-hash.mjs to upgrade');
  }

  if (checkGlobalRateLimit()) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
      { status: 429 },
    );
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rl = checkLoginRateLimit(ip);
  if (rl.blocked) {
    return NextResponse.json(
      { error: 'Zu viele Fehlversuche. Bitte später erneut versuchen.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

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
  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
  }

  const validUser = process.env.ADMIN_USER as string;
  const userBufA  = Buffer.from(username);
  const userBufB  = Buffer.from(validUser);
  const userLen   = Math.max(userBufA.length, userBufB.length);
  const userOk    =
    crypto.timingSafeEqual(
      Buffer.concat([userBufA, Buffer.alloc(userLen - userBufA.length)]),
      Buffer.concat([userBufB, Buffer.alloc(userLen - userBufB.length)]),
    ) && userBufA.length === userBufB.length;
  const passOk = await verifyAdminPassword(password);

  if (!userOk || !passOk) {
    recordFailedLogin(ip);
    return NextResponse.json({ error: 'Benutzername oder Passwort falsch.' }, { status: 401 });
  }

  // ── IP whitelist check (post-auth, before session) ──────────────────────
  const settings = await getAdminSettings();
  if (!isIPAllowed(ip, settings)) {
    recordFailedLogin(ip);
    return NextResponse.json(
      { error: 'Zugriff von dieser IP-Adresse nicht erlaubt.' },
      { status: 403 },
    );
  }

  loginAttempts.delete(ip);

  // ── TOTP challenge if 2FA is active ────────────────────────────────────
  if (settings.totpEnabled && settings.totpSecret) {
    authenticator.options = { window: 1 };
    const mfaToken = createMfaToken(ip);
    return NextResponse.json({ requiresMfa: true, mfaToken }, { status: 200 });
  }

  // ── No 2FA — create session immediately ───────────────────────────────
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
