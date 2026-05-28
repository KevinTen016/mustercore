'use client';

import { useEffect, useState } from 'react';
import { getConsent, setConsent, revokeConsent, CONSENT_ALL, CONSENT_NECESSARY } from '@/lib/consent';
import s from './CookieSettingsPanel.module.css';

interface CategoryRowProps {
  name: string;
  desc: string;
  locked?: boolean;
  checked: boolean;
  onToggle?: () => void;
}

function CategoryRow({ name, desc, locked, checked, onToggle }: CategoryRowProps) {
  return (
    <div className={s.row}>
      <div className={s.rowLeft}>
        <span className={s.name}>{name}</span>
        <span className={s.desc}>{desc}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${name} ${checked ? 'deaktivieren' : 'aktivieren'}`}
        disabled={locked}
        onClick={onToggle}
        className={`${s.pill}${checked ? ` ${s.pillOn}` : ''}${locked ? ` ${s.pillLocked}` : ''}`}
      >
        <span className={s.pillThumb} />
      </button>
    </div>
  );
}

export function CookieSettingsPanel() {
  const [stats,     setStats]     = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [status,    setStatus]    = useState<'idle' | 'saved' | 'revoked'>('idle');

  useEffect(() => {
    const consent = getConsent();
    if (consent) {
      setStats(consent.statistics);
      setMarketing(consent.marketing);
    }
  }, []);

  function save() {
    setConsent({ necessary: true, statistics: stats, marketing: marketing });
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 3500);
  }

  function acceptAll() {
    setStats(true);
    setMarketing(true);
    setConsent(CONSENT_ALL);
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 3500);
  }

  function acceptNecessary() {
    setStats(false);
    setMarketing(false);
    setConsent(CONSENT_NECESSARY);
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 3500);
  }

  function revoke() {
    revokeConsent();
    setStats(false);
    setMarketing(false);
    setStatus('revoked');
    setTimeout(() => setStatus('idle'), 3500);
  }

  return (
    <div className={s.panel}>

      <div className={s.categories}>
        <CategoryRow
          name="Notwendig"
          desc="Technisch erforderlich für den Betrieb der Website: Consent-Speicher, Session-Verwaltung. Diese Cookies können nicht deaktiviert werden."
          locked
          checked
        />
        <CategoryRow
          name="Statistiken"
          desc="Anonyme Erfassung von Seitenaufrufen, um die Nutzung der Website zu verstehen. Kein Google Analytics, keine Weitergabe an Dritte, keine personenbezogenen Profile."
          checked={stats}
          onToggle={() => setStats(v => !v)}
        />
        <CategoryRow
          name="Marketing"
          desc="Aktuell nicht im Einsatz. Vorbehalten für zukünftige Kampagnen — wird nur aktiviert, wenn Sie ausdrücklich zustimmen."
          checked={marketing}
          onToggle={() => setMarketing(v => !v)}
        />
      </div>

      {/* Status feedback */}
      {status !== 'idle' && (
        <div className={s.feedback} role="status" aria-live="polite">
          {status === 'saved'   && '✓ Einstellungen gespeichert.'}
          {status === 'revoked' && '✓ Einwilligung widerrufen — nur notwendige Cookies aktiv.'}
        </div>
      )}

      {/* Action buttons */}
      <div className={s.actions}>
        <button type="button" className={`btn btn-primary ${s.btnSave}`} onClick={save}>
          Auswahl speichern
        </button>
        <button type="button" className={`btn btn-secondary`} onClick={acceptAll}>
          Alle akzeptieren
        </button>
        <button type="button" className={`btn btn-secondary`} onClick={acceptNecessary}>
          Nur notwendige
        </button>
      </div>

      <button type="button" className={s.revokeBtn} onClick={revoke}>
        Einwilligung vollständig widerrufen
      </button>

    </div>
  );
}
