'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import s from './HeroBlobWidget.module.css';

type Phase = 'idle' | 'exiting' | 'revealed';
type Tab = 0 | 1 | 2 | 3;

const NAV = [
  { icon: '◈', label: 'Kalender' },
  { icon: '◎', label: 'Statistik' },
  { icon: '◇', label: 'Kunden' },
  { icon: '⚙', label: 'Einstellungen' },
] as const;

export function HeroBlobWidget() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [tab, setTab]   = useState<Tab>(0);
  const containerRef    = useRef<HTMLDivElement>(null);
  const blobRef         = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || !blobRef.current || phase !== 'idle') return;
    const r = containerRef.current.getBoundingClientRect();
    blobRef.current.style.setProperty('--mx', ((e.clientX - r.left) / r.width  - 0.5).toFixed(3));
    blobRef.current.style.setProperty('--my', ((e.clientY - r.top)  / r.height - 0.5).toFixed(3));
  }, [phase]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('mousemove', onMouseMove);
    return () => el.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  function handleClick() {
    if (phase !== 'idle') return;
    setPhase('exiting');
    setTimeout(() => setPhase('revealed'), 580);
  }

  return (
    <div
      ref={containerRef}
      className={`${s.container} ${phase === 'idle' ? s.clickable : ''}`}
      onClick={phase === 'idle' ? handleClick : undefined}
    >
      {/* ── Blob ── */}
      {phase !== 'revealed' && (
        <div
          ref={blobRef}
          className={`${s.blobWrap} ${phase === 'exiting' ? s.blobExit : ''}`}
          style={{ '--mx': '0', '--my': '0' } as React.CSSProperties}
        >
          <div className={s.blobShape} />
          <div className={s.blobGloss} />
          <div className={s.blobRing} />
        </div>
      )}

      {phase === 'idle' && (
        <div className={s.hint} aria-hidden="true">
          <span className={s.hintRipple} />
          <span className={s.hintLabel}>klicken</span>
        </div>
      )}

      {/* ── Admin panel ── */}
      {phase === 'revealed' && (
        <div className={s.card}>
          {/* Browser chrome */}
          <div className={s.browserBar}>
            <span className={s.bdot} style={{ background: '#ff5f57' }} />
            <span className={s.bdot} style={{ background: '#febc2e' }} />
            <span className={s.bdot} style={{ background: '#28c840' }} />
            <span className={s.burl}>admin.webcore.de</span>
          </div>

          <div className={s.adminLayout}>
            {/* Sidebar */}
            <nav className={s.adminSidebar} aria-label="Admin-Navigation">
              <div className={s.sidebarBrand}>W</div>
              {NAV.map((item, i) => (
                <button
                  key={i}
                  title={item.label}
                  aria-label={item.label}
                  aria-pressed={tab === i}
                  className={`${s.navBtn}${tab === i ? ` ${s.navActive}` : ''}`}
                  onClick={e => { e.stopPropagation(); setTab(i as Tab); }}
                >
                  {item.icon}
                </button>
              ))}
            </nav>

            {/* Tab content — key forces re-mount → plays entrance animation */}
            <div className={s.adminMain} key={tab}>
              {tab === 0 && <TabKalender />}
              {tab === 1 && <TabStatistik />}
              {tab === 2 && <TabKunden />}
              {tab === 3 && <TabSetup />}
            </div>
          </div>

          {/* CTA — update href once deployed */}
          <a
            href="http://localhost:8080"
            target="_blank"
            rel="noopener noreferrer"
            className={s.demoBtn}
            onClick={e => e.stopPropagation()}
          >
            Live-Demo öffnen
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 6h8M6 2l4 4-4 4" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

function TabKalender() {
  return (
    <div className={s.tabContent}>
      <div className={s.adminHead}>
        <span className={s.adminTitle}>Heute</span>
        <span className={s.adminDate}>Do, 21. Mai</span>
      </div>
      <div className={s.stats}>
        <div className={s.stat}>
          <div className={`${s.statVal} ${s.colAccent}`}>12</div>
          <div className={s.statLabel}>Termine</div>
        </div>
        <div className={s.stat}>
          <div className={`${s.statVal} ${s.colGreen}`}>1.340 €</div>
          <div className={s.statLabel}>Umsatz</div>
        </div>
      </div>
      <div className={s.appointments}>
        {([
          ['09:00', 'Sarah M.', '#00ed64'],
          ['10:30', 'Tom K.',   '#4a9eff'],
          ['12:00', 'Jana L.',  '#a855f7'],
        ] as [string, string, string][]).map(([time, name, color], i) => (
          <div key={i} className={s.apptRow} style={{ '--ri': i } as React.CSSProperties}>
            <span className={s.apptDot} style={{ background: color }} />
            <span className={s.apptTime}>{time}</span>
            <span className={s.apptName}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabStatistik() {
  const bars = [6, 9, 7, 13, 11, 8, 3];
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const max  = Math.max(...bars);
  return (
    <div className={s.tabContent}>
      <div className={s.adminHead}>
        <span className={s.adminTitle}>Diese Woche</span>
        <span className={s.adminDateGreen}>↑ +18 %</span>
      </div>
      <div className={s.barChart}>
        {bars.map((v, i) => (
          <div key={i} className={s.barCol}>
            <div
              className={`${s.bar}${i === 3 ? ` ${s.barToday}` : ''}`}
              style={{ '--h': `${(v / max) * 100}%`, '--bi': i } as React.CSSProperties}
            />
            <span className={s.barDay}>{days[i]}</span>
          </div>
        ))}
      </div>
      <div className={s.revRow}>
        <span className={s.revLabel}>Monatsumsatz</span>
        <span className={s.revVal}>5.840 €</span>
      </div>
    </div>
  );
}

function TabKunden() {
  const clients = [
    { name: 'Sarah M.', sub: 'Letzter Besuch: 14. Mai', color: '#00ed64' },
    { name: 'Tom K.',   sub: '3 Termine · Stammkunde',  color: '#4a9eff' },
    { name: 'Jana L.',  sub: 'Letzter Besuch: 08. Mai', color: '#a855f7' },
  ];
  return (
    <div className={s.tabContent}>
      <div className={s.adminHead}>
        <span className={s.adminTitle}>Kunden</span>
        <span className={s.adminDate}>24 gesamt</span>
      </div>
      <div className={s.clientList}>
        {clients.map((c, i) => (
          <div key={i} className={s.clientRow} style={{ '--ri': i } as React.CSSProperties}>
            <div className={s.clientAvatar} style={{ background: `${c.color}22`, color: c.color }}>
              {c.name[0]}
            </div>
            <div>
              <div className={s.clientName}>{c.name}</div>
              <div className={s.clientSub}>{c.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabSetup() {
  const items = [
    { label: 'Online-Buchung',      on: true  },
    { label: 'E-Mail-Bestätigung',  on: true  },
    { label: 'Telegram-Notify',     on: false },
    { label: 'Wartungsmodus',       on: false },
  ];
  return (
    <div className={s.tabContent}>
      <div className={s.adminHead}>
        <span className={s.adminTitle}>Einstellungen</span>
      </div>
      <div className={s.toggleList}>
        {items.map((t, i) => (
          <div key={i} className={s.toggleRow} style={{ '--ri': i } as React.CSSProperties}>
            <span className={s.toggleLabel}>{t.label}</span>
            <span className={`${s.pill}${t.on ? ` ${s.pillOn}` : ''}`}>
              <span className={s.pillThumb} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
