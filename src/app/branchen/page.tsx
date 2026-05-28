import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { BRANCHEN } from '@/data/branchen';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Für welche Branchen',
  description:
    'MusterCore für Friseursalons, Arztpraxen, Autowerkstätten, Physiotherapeuten, Fitnessstudios und Tattoostudios — Online-Buchung und Admin-Panel für lokale Betriebe.',
  path: '/branchen',
});

const ICONS: Record<string, string> = {
  friseur: '✂',
  praxis: '⊕',
  autowerkstatt: '⚙',
  physiotherapie: '◎',
  fitness: '◈',
  tattoo: '◇',
};

export default function BranchenPage() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: '3.5rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
            Für wen
          </p>
          <TypewriterH1 style={{ marginBottom: '0.75rem' }}>
            Für welche Branchen
          </TypewriterH1>
          <p style={{ maxWidth: '56ch' }}>
            MusterCore wurde für lokale Dienstleister entwickelt, die Termine vergeben und verwalten —
            von der kleinen Einzelpraxis bis zum Salon mit mehreren Mitarbeitern.
          </p>
        </div>

        {/* Branchen Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
          {BRANCHEN.map(b => (
            <Link
              key={b.slug}
              href={`/branchen/${b.slug}`}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            >
              <div style={{ fontSize: '1.6rem', lineHeight: 1 }} aria-hidden="true">
                {ICONS[b.slug]}
              </div>
              <div>
                <h2 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>
                  {b.namePlural}
                </h2>
                <p style={{ fontSize: '0.855rem', margin: 0, lineHeight: 1.55 }}>
                  {b.teaser}
                </p>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)' }}>
                Mehr erfahren
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M2 6h8M6 2l4 4-4 4" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Nicht dabei? */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.3rem', fontSize: '0.95rem' }}>
              Ihre Branche ist nicht dabei?
            </p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              MusterCore funktioniert für jeden Betrieb, der Termine vergibt. Sprechen Sie uns an —
              wir prüfen gerne, ob es passt.
            </p>
          </div>
          <Link href="/kontakt" className="btn btn-secondary" style={{ flexShrink: 0 }}>
            Anfrage stellen
          </Link>
        </div>
      </div>
    </div>
  );
}
