'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getConsent, setConsent, hasConsent } from '@/lib/consent';
import s from './CookieBanner.module.css';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Kurze Verzögerung, damit Hydration abgeschlossen ist
    const t = setTimeout(() => setVisible(!hasConsent()), 200);
    return () => clearTimeout(t);
  }, []);

  function acceptAll() {
    setConsent('all');
    setVisible(false);
  }

  function acceptNecessary() {
    setConsent('necessary');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className={s.banner}
      role="dialog"
      aria-modal="false"
      aria-label="Cookie-Einstellungen"
    >
      <div className={s.inner}>
        <div className={s.text}>
          <div className={s.title}>Wir verwenden Cookies</div>
          <p className={s.desc}>
            Für den Betrieb dieser Website setzen wir technisch notwendige Cookies ein.
            Mit Ihrer Zustimmung nutzen wir zusätzlich anonyme Besucherstatistiken
            (kein Google Analytics). Mehr dazu in unserer{' '}
            <Link href="/datenschutz">Datenschutzerklärung</Link>.
          </p>
        </div>
        <div className={s.actions}>
          <button className={s.btnAll} onClick={acceptAll}>
            Alle akzeptieren
          </button>
          <button className={s.btnNec} onClick={acceptNecessary}>
            Nur notwendige
          </button>
          <Link href="/cookie-einstellungen" className={s.btnSettings}>
            Einstellungen
          </Link>
        </div>
      </div>
    </div>
  );
}
