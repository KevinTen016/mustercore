import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Barrierefreiheitserklärung',
  description: 'Barrierefreiheitserklärung der WebCore Website gemäß BFSG.',
  path: '/barrierefreiheit\page.tsx',
});

export default function Page() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '1rem' }}>
          Barrierefreiheitserklärung
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-dim)', lineHeight: 1.68, maxWidth: '62ch' }}>
          Informationen zur Zugänglichkeit dieser Website gemäß BFSG
        </p>
        <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          Diese Seite befindet sich in Vorbereitung und wird in Kürze vollständig verfügbar sein.
        </div>
      </div>
    </div>
  );
}
