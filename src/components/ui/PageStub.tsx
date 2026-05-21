import Link from 'next/link';

interface PageStubProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageStub({ title, subtitle, children }: PageStubProps) {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
          Seite in Vorbereitung
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.85rem' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '1.05rem', color: 'var(--text-dim)', lineHeight: 1.65, marginBottom: '2rem' }}>
            {subtitle}
          </p>
        )}
        {children}
        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/" className="btn btn-secondary">← Zurück zur Startseite</Link>
        </div>
      </div>
    </div>
  );
}
