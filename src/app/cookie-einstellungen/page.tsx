import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { CookieSettingsPanel } from './CookieSettingsPanel';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Cookie-Einstellungen',
  description: 'Cookie-Einstellungen der MusterCore Website anpassen — notwendige und optionale Cookies jederzeit verwalten.',
  path: '/cookie-einstellungen',
});

export default function Page() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '720px' }}>

        <TypewriterH1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
          Cookie-Einstellungen
        </TypewriterH1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-dim)', lineHeight: 1.68, maxWidth: '62ch', marginBottom: '3rem' }}>
          Hier verwalten Sie Ihre Einwilligung jederzeit — und können sie jederzeit widerrufen.
          Ihre Auswahl gilt für diese Website und wird lokal auf Ihrem Gerät gespeichert.
        </p>

        <CookieSettingsPanel />

        <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', fontSize: '0.84rem', color: 'var(--text-dim)', lineHeight: 1.65 }}>
          <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Hinweis zum Widerruf:</strong>{' '}
          Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, indem Sie auf
          &bdquo;Nur notwendige&ldquo; klicken oder alle Kategorien manuell deaktivieren. Die bis zum Widerruf
          vorgenommene Verarbeitung bleibt rechtmäßig. Weitere Informationen finden Sie in unserer{' '}
          <a href="/datenschutz" style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
            Datenschutzerklärung
          </a>.
        </div>

      </div>
    </div>
  );
}
