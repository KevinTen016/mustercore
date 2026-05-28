import crypto from 'crypto';

export const SESSION_COOKIE = 'wc_session';
const TTL_MS = 8 * 60 * 60 * 1000; // 8 hours; extended on each validated request (sliding)

// In-memory store — valid for single-instance Docker deployment.
// Resets on process restart (user must log in again), which is acceptable.
const sessions = new Map<string, number>(); // token → expiry timestamp

// Prevent unbounded Map growth — evict expired sessions every 30 minutes.
const _globalForSession = globalThis as unknown as { _sessionCleanup?: ReturnType<typeof setInterval> };
if (!_globalForSession._sessionCleanup) {
  _globalForSession._sessionCleanup = setInterval(() => {
    const now = Date.now();
    for (const [token, expiry] of sessions) {
      if (now > expiry) sessions.delete(token);
    }
  }, 30 * 60 * 1000);
}

export function createSession(): string {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, Date.now() + TTL_MS);
  return token;
}

export function validateSession(token: string): boolean {
  const expiry = sessions.get(token);
  if (expiry == null) return false;
  if (Date.now() > expiry) {
    sessions.delete(token);
    return false;
  }
  // Sliding expiry: each valid access resets the clock.
  sessions.set(token, Date.now() + TTL_MS);
  return true;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}

export function tokenFromRequest(req: Request): string | undefined {
  const header = req.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === SESSION_COOKIE) return rest.join('=');
  }
  return undefined;
}

export function isAuthed(req: Request): boolean {
  const token = tokenFromRequest(req);
  return token != null && validateSession(token);
}
