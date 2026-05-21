'use client';
import { useState, useEffect } from 'react';
import s from './HeroBookingWidget.module.css';

const SLOTS = [
  { time: '09:00', service: 'Haarschnitt', duration: '45 min' },
  { time: '11:30', service: 'Coloration', duration: '90 min' },
  { time: '14:00', service: 'Pflege & Styling', duration: '60 min' },
];

export function HeroBookingWidget() {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString('de-DE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    );
  }, []);

  function handleBook(time: string) {
    if (confirmed || selected) return;
    setSelected(time);
    setTimeout(() => setConfirmed(true), 380);
  }

  return (
    <div className={s.widget}>
      <div className={s.header}>
        <span className={s.dot} aria-hidden="true" />
        Online-Buchung
      </div>

      {dateStr && <div className={s.date}>{dateStr}</div>}

      {!confirmed ? (
        <div className={s.slots}>
          {SLOTS.map((slot, i) => (
            <button
              key={slot.time}
              className={`${s.slot}${selected === slot.time ? ` ${s.slotPending}` : ''}`}
              onClick={() => handleBook(slot.time)}
              disabled={!!selected}
              style={{ '--delay': `${i * 110}ms` } as React.CSSProperties}
            >
              <span className={s.slotTime}>{slot.time}</span>
              <span className={s.slotInfo}>
                <span className={s.slotService}>{slot.service}</span>
                <span className={s.slotDuration}>{slot.duration}</span>
              </span>
              <span className={s.slotArrow} aria-hidden="true">→</span>
            </button>
          ))}
          <p className={s.hint}>Termin auswählen</p>
        </div>
      ) : (
        <div className={s.success}>
          <div className={s.checkCircle} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className={s.successTitle}>Termin bestätigt!</div>
          <div className={s.successSub}>{selected} Uhr · Bestätigung per E-Mail</div>
        </div>
      )}

      <div className={s.footer}>
        <span className={s.footerItem}>
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="1 6 4.5 9.5 11 3" />
          </svg>
          Keine App nötig
        </span>
        <span className={s.footerItem}>
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="1 6 4.5 9.5 11 3" />
          </svg>
          24/7 buchbar
        </span>
      </div>
    </div>
  );
}
