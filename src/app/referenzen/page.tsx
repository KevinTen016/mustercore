import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Referenzen',
  description:
    'Referenzen und Kundenprojekte von WebCore. Sprechen Sie uns direkt an — wir zeigen Ihnen gerne, wie das System in der Praxis aussieht.',
  path: '/referenzen',
});

export default function ReferenzenPage() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
          Referenzen
        </p>
        <TypewriterH1 style={{ marginBottom: '0.75rem' }}>
          Unsere ersten Kunden sind in Vorbereitung.
        </TypewriterH1>
        <p style={{ maxWidth: '58ch', marginBottom: '3rem', fontSize: '1.05rem' }}>
          WebCore befindet sich im Aufbau. Die ersten Kundenprojekte werden hier veröffentlicht,
          sobald wir die Erlaubnis dazu erhalten haben.
        </p>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', marginBottom: '0.75rem' }}>
            Demo statt Referenzliste
          </h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Anstatt Screenshots oder Teaser: Wir zeigen Ihnen das System live — Admin-Panel,
            Buchungsseite und alle Funktionen in einem 20-minütigen Video-Call. Sie sehen
            direkt, was Sie bekommen.
          </p>
          <Link href="/demo" className="btn btn-primary">
            Kostenlose Demo anfragen
          </Link>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem', fontSize: '0.9rem' }}>
              Fragen zu Projekten oder Preisen?
            </p>
            <p style={{ fontSize: '0.82rem', margin: 0 }}>
              Schreiben Sie uns — wir antworten persönlich.
            </p>
          </div>
          <Link href="/kontakt" className="btn btn-secondary" style={{ flexShrink: 0 }}>
            Kontakt aufnehmen
          </Link>
        </div>
      </div>
    </div>
  );
}
