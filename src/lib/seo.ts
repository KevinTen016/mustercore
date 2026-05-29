import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://mustercore.de';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
}

export function buildMetadata({ title, description, path = '', noindex = false }: SeoProps): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = title === 'MusterCore'
    ? 'MusterCore — Website & Online-Buchung für lokale Unternehmen'
    : `${title} | MusterCore`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'MusterCore',
      locale: 'de_DE',
      type: 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ['/opengraph-image'],
    },
  };
}
