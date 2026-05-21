import { buildMetadata } from '@/lib/seo';

export function generateMetadata({ params }: { params: { slug: string } }) {
  return buildMetadata({
    title: 'Ratgeber-Artikel',
    description: 'Ratgeber-Artikel von WebCore für lokale Unternehmen.',
    path: `/blog/${params.slug}`,
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
          Ratgeber
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '1rem' }}>
          Artikel: {params.slug}
        </h1>
        <div style={{ marginTop: '2rem', padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          Dieser Artikel befindet sich in Vorbereitung.
        </div>
      </div>
    </div>
  );
}
