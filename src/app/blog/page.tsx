import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { BLOG_POSTS } from '@/data/blog';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Ratgeber — Tipps für lokale Unternehmen',
  description:
    'Der MusterCore Ratgeber: Praxisnahe Tipps zu Online-Buchung, DSGVO und Google Business für lokale Betriebe in Deutschland.',
  path: '/blog',
});

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogPage() {
  const sorted = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
          Ratgeber
        </p>
        <TypewriterH1 style={{ marginBottom: '0.75rem' }}>
          Praxiswissen für lokale Betriebe
        </TypewriterH1>
        <p style={{ marginBottom: '3rem', maxWidth: '56ch' }}>
          Artikel zu Online-Buchung, DSGVO und Google Business — für Friseursalons, Praxen, Werkstätten und mehr.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {sorted.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                textDecoration: 'none',
                display: 'block',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                  {post.category}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-sub)' }}>·</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-sub)' }}>{formatDate(post.date)}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-sub)' }}>·</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-sub)' }}>{post.readingMinutes} Min.</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', marginBottom: '0.5rem', color: 'var(--text)' }}>
                {post.title}
              </h2>
              <p style={{ fontSize: '0.875rem', margin: '0 0 1rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                {post.teaser}
              </p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)' }}>
                Artikel lesen
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M2 6h8M6 2l4 4-4 4" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
