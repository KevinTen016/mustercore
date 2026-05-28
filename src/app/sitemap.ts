import type { MetadataRoute } from 'next';
import { BRANCHEN } from '@/data/branchen';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://mustercore.de';

export default function sitemap(): MetadataRoute.Sitemap {
  // Only include pages that are actually indexable (no noindex).
  // Stub pages (preise, kontakt, faq, branchen/*) are excluded until their content is ready.
  const staticRoutes = [
    { path: '/',            priority: 1.0,  freq: 'weekly'  },
    { path: '/demo',        priority: 0.9,  freq: 'monthly' },
    { path: '/leistungen',  priority: 0.8,  freq: 'monthly' },
    { path: '/ueber-uns',   priority: 0.6,  freq: 'monthly' },
    { path: '/blog',        priority: 0.6,  freq: 'weekly'  },
    { path: '/referenzen',  priority: 0.6,  freq: 'monthly' },
    { path: '/impressum',   priority: 0.3,  freq: 'yearly'  },
    { path: '/datenschutz', priority: 0.3,  freq: 'yearly'  },
    { path: '/agb',         priority: 0.3,  freq: 'yearly'  },
  ] as const;

  const allRoutes = [...staticRoutes];

  return allRoutes.map(r => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
