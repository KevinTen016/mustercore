'use client';
import { useEffect, useRef, useState } from 'react';
import s from './HeroBlobWidget.module.css';

type Phase = 'idle' | 'revealed';
type Tab   = 0 | 1 | 2 | 3;

interface Dot { x: number; y: number; bx: number; by: number; }

const NAV = [
  { icon: '◈', label: 'Kalender'      },
  { icon: '◎', label: 'Statistik'     },
  { icon: '◇', label: 'Kunden'        },
  { icon: '⚙', label: 'Einstellungen' },
] as const;

export function HeroBlobWidget() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [tab,   setTab]   = useState<Tab>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const phaseRef     = useRef<Phase>('idle');
  const mouseRef     = useRef({ x: -9999, y: -9999 });
  const dotsRef      = useRef<Dot[]>([]);
  const sizeRef      = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d')!;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const GAP = 24;
    let rafId = 0;

    function resize() {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width)  || 460;
      const h = Math.round(rect.height) || 340;
      sizeRef.current = { w, h };

      canvas.width  = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width  = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const cols = Math.floor((w - GAP / 2) / GAP);
      const rows = Math.floor((h - GAP / 2) / GAP);
      const padX = (w - (cols - 1) * GAP) / 2;
      const padY = (h - (rows - 1) * GAP) / 2;

      dotsRef.current = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = padX + c * GAP;
          const y = padY + r * GAP;
          dotsRef.current.push({ x, y, bx: x, by: y });
        }
      }
    }

    function draw() {
      const { w, h } = sizeRef.current;
      if (phaseRef.current === 'revealed') return;

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(mx - dot.x, my - dot.y);
        const infl = Math.max(0, 1 - dist / 88) ** 2;

        let radius: number;
        let color:  string;

        if (infl > 0.005) {
          radius = 1.8 + infl * 4;
          color  = `rgba(0,237,100,${(0.2 + infl * 0.76).toFixed(2)})`;
        } else {
          radius = 1.8;
          color  = 'rgba(155,160,180,0.17)';
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    resize();
    rafId = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function handleClick() {
    if (phaseRef.current !== 'idle') return;
    phaseRef.current = 'revealed';
    setPhase('revealed');
  }

  return (
    <div ref={containerRef} className={s.container}>

      {phase !== 'revealed' && (
        <canvas
          ref={canvasRef}
          className={s.canvas}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { mouseRef.current = { x: -9999, y: -9999 }; }}
          onClick={handleClick}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
          tabIndex={0}
          role="button"
          aria-label="Admin-Panel-Demo anzeigen"
          style={{ cursor: 'pointer' }}
        />
      )}

      {phase === 'revealed' && (
        <div className={s.card}>
          <div className={s.browserBar}>
            <span className={s.bdot} style={{ background: '#ff5f57' }} />
            <span className={s.bdot} style={{ background: '#febc2e' }} />
            <span className={s.bdot} style={{ background: '#28c840' }} />
            <span className={s.burl}>admin.mustercore.de</span>
          </div>

          <div className={s.adminLayout}>
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

            <div className={s.adminMain} key={tab}>
              {tab === 0 && <TabKalender />}
              {tab === 1 && <TabStatistik />}
              {tab === 2 && <TabKunden />}
              {tab === 3 && <TabSetup />}
            </div>
          </div>

          <a
            href={process.env.NEXT_PUBLIC_DEMO_URL ?? '/demo'}
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

/* ── Tab: Kalender ── */
function TabKalender() {
  const appts = [
    { time: '09:00', name: 'Maria S.',  service: 'Haarschnitt',  color: '#00ed64' },
    { time: '10:30', name: 'Tom K.',    service: 'Bart trimmen', color: '#3b82f6' },
    { time: '12:00', name: 'Anna M.',   service: 'Färben',       color: '#a855f7' },
  ];
  return (
    <div className={s.tabContent}>
      <div className={s.adminHead}>
        <span className={s.adminTitle}>Heute</span>
        <span className={s.adminDateGreen}>7 Termine</span>
      </div>
      <div className={s.stats}>
        <div className={s.stat}>
          <div className={`${s.statVal} ${s.colAccent}`}>340 €</div>
          <div className={s.statLabel}>Tagesumsatz</div>
        </div>
        <div className={s.stat}>
          <div className={`${s.statVal} ${s.colGreen}`}>4 / 7</div>
          <div className={s.statLabel}>Erledigt</div>
        </div>
      </div>
      <div className={s.appointments}>
        {appts.map((a, i) => (
          <div key={i} className={s.apptRow} style={{ '--ri': i } as React.CSSProperties}>
            <span className={s.apptDot} style={{ background: a.color }} />
            <span className={s.apptTime}>{a.time}</span>
            <span className={s.apptName}>{a.name}</span>
            <span className={s.apptService}>{a.service}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tab: Statistik ── */
function TabStatistik() {
  const days = [
    { d: 'Mo', h: '52%' },
    { d: 'Di', h: '68%' },
    { d: 'Mi', h: '41%' },
    { d: 'Do', h: '79%' },
    { d: 'Fr', h: '88%' },
    { d: 'Sa', h: '60%', today: true },
    { d: 'So', h: '5%'  },
  ];
  return (
    <div className={s.tabContent}>
      <div className={s.adminHead}>
        <span className={s.adminTitle}>Diese Woche</span>
        <span className={s.adminDateGreen}>↑ 12 %</span>
      </div>
      <div className={s.barChart}>
        {days.map((d, i) => (
          <div key={i} className={s.barCol}>
            <div
              className={`${s.bar}${d.today ? ` ${s.barToday}` : ''}`}
              style={{ '--h': d.h, '--bi': i } as React.CSSProperties}
            />
            <span className={s.barDay}>{d.d}</span>
          </div>
        ))}
      </div>
      <div className={s.revRow}>
        <span className={s.revLabel}>Monatsumsatz</span>
        <span className={s.revVal}>2.840 €</span>
      </div>
    </div>
  );
}

/* ── Tab: Kunden ── */
function TabKunden() {
  const clients = [
    { initials: 'MS', name: 'Maria Schmidt', sub: 'Heute · Haarschnitt', color: '#00ed64' },
    { initials: 'TK', name: 'Tom Koch',      sub: '23. Mai · Bart',      color: '#3b82f6' },
    { initials: 'AM', name: 'Anna Mayer',    sub: '20. Mai · Färben',    color: '#a855f7' },
    { initials: 'LB', name: 'Lisa Berg',     sub: '18. Mai · Maniküre',  color: '#f59e0b' },
  ];
  return (
    <div className={s.tabContent}>
      <div className={s.adminHead}>
        <span className={s.adminTitle}>Kunden</span>
        <span className={s.adminDate}>47 gesamt</span>
      </div>
      <div className={s.clientList}>
        {clients.map((c, i) => (
          <div key={i} className={s.clientRow} style={{ '--ri': i } as React.CSSProperties}>
            <div
              className={s.clientAvatar}
              style={{ background: c.color + '22', color: c.color }}
            >
              {c.initials}
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

/* ── Tab: Einstellungen ── */
function TabSetup() {
  const items = [
    { label: 'Online-Buchung',     on: true  },
    { label: 'E-Mail-Bestätigung', on: true  },
    { label: 'Telegram-Notify',    on: false },
    { label: 'Wartungsmodus',      on: false },
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
