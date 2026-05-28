import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { BLOG_POSTS, getBlogPost } from '@/data/blog';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.teaser,
    path: `/blog/${slug}`,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const paragraphs = post.body
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        {/* Back */}
        <Link
          href="/blog"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-dim)', textDecoration: 'none', marginBottom: '2rem' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M10 6H2M6 10 2 6l4-4" />
          </svg>
          Zum Ratgeber
        </Link>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            {post.category}
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-sub)' }}>·</span>
          <time dateTime={post.date} style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
            {formatDate(post.date)}
          </time>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-sub)' }}>·</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>{post.readingMinutes} Min. Lesezeit</span>
        </div>

        <TypewriterH1 style={{ marginBottom: '2.5rem' }}>{post.title}</TypewriterH1>

        {/* Body */}
        <article style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {paragraphs.map((para, i) => {
            if (para.startsWith('**') && para.endsWith('**')) {
              return (
                <h3 key={i} style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', marginTop: '0.5rem', marginBottom: 0 }}>
                  {para.slice(2, -2)}
                </h3>
              );
            }
            return (
              <p key={i} style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.78 }}>
                {para}
              </p>
            );
          })}
        </article>

        {/* CTA */}
        <div style={{ marginTop: '3.5rem', padding: '1.75rem 2rem', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)' }}>
          <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
            Neugierig, wie WebCore für Ihren Betrieb aussieht?
          </p>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Fordern Sie eine kostenlose Demo an — 20 Minuten, kein Verkaufsdruck.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/demo" className="btn btn-primary">Demo anfragen</Link>
            <Link href="/blog" className="btn btn-secondary">Weitere Artikel</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
