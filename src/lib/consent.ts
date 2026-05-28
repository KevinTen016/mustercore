'use client';

const COOKIE_KEY    = 'webcore_consent';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 12 Monate

export interface ConsentState {
  necessary:  true;
  statistics: boolean;
  marketing:  boolean;
}

const CONSENT_NECESSARY: ConsentState = { necessary: true, statistics: false, marketing: false };
const CONSENT_ALL:       ConsentState = { necessary: true, statistics: true,  marketing: true  };

export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    // New JSON format
    if (typeof parsed === 'object' && parsed !== null && (parsed as Record<string, unknown>).necessary === true) {
      const p = parsed as Record<string, unknown>;
      return {
        necessary:  true,
        statistics: p.statistics === true,
        marketing:  p.marketing  === true,
      };
    }

    // Legacy string format (before granular consent)
    if (parsed === 'all')       return CONSENT_ALL;
    if (parsed === 'necessary') return CONSENT_NECESSARY;
  } catch {}
  return null;
}

export function setConsent(state: ConsentState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(state));
    // Readable by server middleware for SSR-based gating
    document.cookie = `${COOKIE_KEY}=1;max-age=${COOKIE_MAX_AGE};path=/;SameSite=Lax;Secure`;
  } catch {}
}

export function hasConsent(): boolean {
  return getConsent() !== null;
}

export function hasConsentFor(category: 'statistics' | 'marketing'): boolean {
  const c = getConsent();
  return c !== null && c[category] === true;
}

export function revokeConsent(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(COOKIE_KEY);
    document.cookie = `${COOKIE_KEY}=;max-age=0;path=/;SameSite=Lax;Secure`;
  } catch {}
}

export { CONSENT_NECESSARY, CONSENT_ALL };
