import crypto from 'crypto';

// Short-lived tokens issued after successful password auth when TOTP is required.
// Token lives for 5 minutes — enough to scan QR + type the code.

interface MfaEntry {
  expiresAt: number;
  ip: string;
}

const _gf = globalThis as unknown as { _mfaPending?: Map<string, MfaEntry>; _mfaCleanup?: ReturnType<typeof setInterval> };

if (!_gf._mfaPending) _gf._mfaPending = new Map();

// Rate-limit MFA attempts per token: max 5 wrong codes → token invalidated
const _attempts = new Map<string, number>();

if (!_gf._mfaCleanup) {
  _gf._mfaCleanup = setInterval(() => {
    const now = Date.now();
    for (const [token, entry] of _gf._mfaPending!) {
      if (now > entry.expiresAt) {
        _gf._mfaPending!.delete(token);
        _attempts.delete(token);
      }
    }
  }, 60_000);
}

export function createMfaToken(ip: string): string {
  const token = crypto.randomBytes(16).toString('hex');
  _gf._mfaPending!.set(token, { expiresAt: Date.now() + 5 * 60 * 1000, ip });
  return token;
}

export function consumeMfaToken(token: string): { valid: boolean; reason?: string } {
  const entry = _gf._mfaPending!.get(token);
  if (!entry) return { valid: false, reason: 'not_found' };
  if (Date.now() > entry.expiresAt) {
    _gf._mfaPending!.delete(token);
    _attempts.delete(token);
    return { valid: false, reason: 'expired' };
  }
  return { valid: true };
}

export function recordMfaFailure(token: string): boolean {
  const count = (_attempts.get(token) ?? 0) + 1;
  _attempts.set(token, count);
  if (count >= 5) {
    _gf._mfaPending!.delete(token);
    _attempts.delete(token);
    return true; // token invalidated
  }
  return false;
}

export function invalidateMfaToken(token: string): void {
  _gf._mfaPending!.delete(token);
  _attempts.delete(token);
}
