'use client';

import { useEffect, useState } from 'react';
import s from './DemoBanner.module.css';

const KEY = 'demo-banner-dismissed';
const BAR_H = '40px';

export function DemoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) {
      setVisible(true);
      document.documentElement.style.setProperty('--demo-bar-h', BAR_H);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(KEY, '1');
    document.documentElement.style.setProperty('--demo-bar-h', '0px');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className={s.bar} role="status" aria-live="polite">
      <span className={s.text}>
        <span className={s.badge}>Demo</span>
        <span className={s.long}>Portfolioprojekt · Alle Angaben sind Beispieldaten · Keine realen Leistungen</span>
        <span className={s.short}>Demo-Projekt · Keine echten Leistungen</span>
      </span>
      <button className={s.close} onClick={dismiss} aria-label="Demo-Hinweis schließen">
        ×
      </button>
    </div>
  );
}
