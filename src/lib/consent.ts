'use client';

const COOKIE_KEY = 'webcore_consent';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 12 Monate in Sekunden

export type ConsentLevel = 'necessary' | 'all' | null;

export function getConsent(): ConsentLevel {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    if (raw === 'all' || raw === 'necessary') return raw;
  } catch {}
  return null;
}

export function setConsent(level: 'necessary' | 'all'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COOKIE_KEY, level);
    // Auch als Cookie für Server-Lesbarkeit (kein Strict-Same-Site-Problem)
    document.cookie = `${COOKIE_KEY}=${level};max-age=${COOKIE_MAX_AGE};path=/;SameSite=Lax;Secure`;
  } catch {}
}

export function hasConsent(): boolean {
  return getConsent() !== null;
}
