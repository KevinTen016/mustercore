import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { BRANCHEN } from '@/data/branchen';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

const DATA = BRANCHEN.find(b => b.slug === 'fitness')!;

export const metadata: Metadata = buildMetadata({
  title: 'WebCore für Fitnessstudios & Yogastudios',
  description:
    'Website mit Kursbuchung für Fitness- und Yogastudios. Teilnehmerverwaltung, Warteliste, automatische Erinnerungen — DSGVO-konform, aus Braunschweig.',
  path: '/branchen/fitness',
});

export default function FitnessPage() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
          Fitness- &amp; Yogastudios
        </p>
        <TypewriterH1 style={{ marginBottom: '0.75rem' }}>{DATA.heroLine}</TypewriterH1>
        <p style={{ maxWidth: '58ch', marginBottom: '2rem', fontSize: '1.05rem' }}>
          {DATA.teaser}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <Link href="/demo" className="btn btn-primary btn-lg">{DATA.cta}</Link>
          <Link href="/preise" className="btn btn-secondary btn-lg">Preise ansehen</Link>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', padding: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)', marginBottom: '1.25rem' }}>Was heute Nerven kostet</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {DATA.painPoints.map((point, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                <span style={{ flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%', background: 'var(--red-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.05em' }} aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round">
                    <line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-xl)', padding: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)', marginBottom: '1.25rem' }}>Was WebCore ändert</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {DATA.gains.map((gain, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                <span style={{ flexShrink: 0, marginTop: '0.1em', color: 'var(--green)' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2 8 6 12 14 4" />
                  </svg>
                </span>
                {gain}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '3rem' }}>
          {['EU-Hosting', 'DSGVO-konform', 'Kurs- & Einzelbuchung', 'Monatlich kündbar'].map(t => (
            <span key={t} style={{ fontSize: '0.8rem', fontWeight: 500, padding: '0.3rem 0.75rem', border: '1px solid var(--line)', borderRadius: '999px', color: 'var(--text-dim)', background: 'var(--bg-card)' }}>
              {t}
            </span>
          ))}
        </div>

        <div style={{ padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
          <p style={{ marginBottom: '1.25rem', color: 'var(--text)' }}>
            Vollständig gebuchte Kurse statt halberer Auslastung — zeigen wir Ihnen in 20 Minuten.
          </p>
          <Link href="/demo" className="btn btn-primary btn-lg">{DATA.cta}</Link>
        </div>
      </div>
    </div>
  );
}
