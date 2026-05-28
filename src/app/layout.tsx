import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/ibm-plex-sans/300.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'MusterCore — Professionelle Website & Buchungssystem für lokale Unternehmen',
    template: '%s | MusterCore',
  },
  description:
    'MusterCore gibt lokalen Unternehmen eine professionelle Website mit Online-Buchung und eigenem Admin-Panel. DSGVO-konform, EU-Hosting, aus Braunschweig.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://mustercore.de'),
  robots: { index: true, follow: true },
  openGraph: {
    siteName: 'MusterCore',
    locale: 'de_DE',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Zum Hauptinhalt springen</a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
