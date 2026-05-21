import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seite nicht gefunden | WebCore',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div style={{ paddingBlock: 'clamp(5rem, 12vw, 8rem)', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '560px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 12vw, 8rem)', fontWeight: 700, color: 'var(--accent)', lineHeight: 1, marginBottom: '1rem' }}>
          404
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Diese Seite gibt es nicht
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '2rem' }}>
          Die gesuchte Seite wurde möglicherweise verschoben oder gelöscht.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">Zur Startseite</Link>
          <Link href="/kontakt" className="btn btn-secondary">Kontakt</Link>
        </div>
      </div>
    </div>
  );
}
