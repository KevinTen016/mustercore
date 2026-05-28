import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { FIRMA } from '@/data/firma';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Kontakt',
  description:
    'MusterCore kontaktieren — per E-Mail oder Demo-Anfrage. Kein Autoresponder, kein Ticket-System. Reaktion innerhalb eines Werktages.',
  path: '/kontakt',
});

const CHANNELS = [
  {
    label: 'E-Mail',
    value: FIRMA.emailKontakt,
    note: 'Reaktion innerhalb eines Werktages',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="16" height="13" rx="2" />
        <polyline points="2 4 10 12 18 4" />
      </svg>
    ),
  },
  {
    label: 'Telefon',
    value: FIRMA.telefon,
    note: 'Mo–Fr 09:00–18:00 Uhr',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 3a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 .75l1 3.5a1 1 0 0 1-.29 1L8 8.5s1 2 3.5 3.5l1.25-1.25a1 1 0 0 1 1-.29l3.5 1a1 1 0 0 1 .75 1V15a1 1 0 0 1-1 1C6 16 4 7 4 4v-1z" />
      </svg>
    ),
  },
  {
    label: 'Standort',
    value: `${FIRMA.ort}, ${FIRMA.bundesland}`,
    note: 'Kein Ladenlokal — Remote und vor Ort im Raum Braunschweig',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 2a6 6 0 0 1 6 6c0 4-6 10-6 10S4 12 4 8a6 6 0 0 1 6-6z" />
        <circle cx="10" cy="8" r="2" />
      </svg>
    ),
  },
];

export default function KontaktPage() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
          Kontakt
        </p>
        <TypewriterH1 style={{ marginBottom: '0.75rem' }}>
          Wir freuen uns auf Ihre Nachricht.
        </TypewriterH1>
        <p style={{ maxWidth: '58ch', marginBottom: '3rem' }}>
          Kein Autoresponder, kein Ticket-System. Sie schreiben uns direkt — und erhalten eine persönliche Antwort, in der Regel innerhalb eines Werktages.
        </p>

        {/* Primary CTA */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-xl)', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem' }}>
            Schnellster Einstieg
          </div>
          <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', marginBottom: '0.5rem' }}>
            Demo anfragen — 20 Minuten, kostenlos
          </h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Wir zeigen Ihnen das Admin-Panel live und klären alle Fragen im Gespräch — ohne Vorab-Aufwand Ihrerseits.
          </p>
          <Link href="/demo" className="btn btn-primary">
            Jetzt Demo anfragen
          </Link>
        </div>

        {/* Contact details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {CHANNELS.map(ch => (
            <div
              key={ch.label}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ color: 'var(--accent)' }}>{ch.icon}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-sub)' }}>
                {ch.label}
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                {ch.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', lineHeight: 1.4 }}>
                {ch.note}
              </div>
            </div>
          ))}
        </div>

        {/* Impressum/Adresse hint */}
        <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', fontSize: '0.82rem', color: 'var(--text-sub)' }}>
          <strong style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Vollständige Angaben</strong> finden Sie im{' '}
          <Link href="/impressum" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Impressum</Link>.
          {' '}MusterCore ist ein Einzelunternehmen aus {FIRMA.ort}, {FIRMA.bundesland}.
        </div>
      </div>
    </div>
  );
}
