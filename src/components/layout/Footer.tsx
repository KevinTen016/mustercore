import Link from 'next/link';
import { FIRMA } from '@/data/firma';
import { BRANCHEN } from '@/data/branchen';
import s from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.grid}>

          {/* Brand Column */}
          <div className={s.brand}>
            <div className={s.brandLogo}>{FIRMA.marke}</div>
            <p className={s.brandTagline}>
              Website, Online-Buchung und Admin-Panel für lokale Unternehmen in Deutschland.
              Aus Braunschweig, für den deutschen Markt.
            </p>
            <div className={s.brandBadges}>
              <span className={s.brandBadge}>EU-Hosting</span>
              <span className={s.brandBadge}>DSGVO-konform</span>
              <span className={s.brandBadge}>Made in Germany</span>
            </div>
          </div>

          {/* Produkt */}
          <div className={s.col}>
            <div className={s.colTitle}>Produkt</div>
            <div className={s.colLinks}>
              <Link href="/leistungen" className={s.colLink}>Leistungen</Link>
              <Link href="/preise" className={s.colLink}>Preise</Link>
              <Link href="/branchen" className={s.colLink}>Branchen</Link>
              <Link href="/referenzen" className={s.colLink}>Referenzen</Link>
              <Link href="/demo" className={s.colLink}>Demo anfragen</Link>
            </div>
          </div>

          {/* Branchen */}
          <div className={s.col}>
            <div className={s.colTitle}>Branchen</div>
            <div className={s.colLinks}>
              {BRANCHEN.map(b => (
                <Link key={b.slug} href={`/branchen/${b.slug}`} className={s.colLink}>
                  {b.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Unternehmen */}
          <div className={s.col}>
            <div className={s.colTitle}>Unternehmen</div>
            <div className={s.colLinks}>
              <Link href="/ueber-uns" className={s.colLink}>Über uns</Link>
              <Link href="/kontakt" className={s.colLink}>Kontakt</Link>
              <Link href="/faq" className={s.colLink}>FAQ</Link>
              <Link href="/blog" className={s.colLink}>Ratgeber</Link>
            </div>
          </div>

          {/* Rechtliches */}
          <div className={s.col}>
            <div className={s.colTitle}>Rechtliches</div>
            <div className={s.colLinks}>
              <Link href="/impressum" className={s.colLink}>Impressum</Link>
              <Link href="/datenschutz" className={s.colLink}>Datenschutzerklärung</Link>
              <Link href="/agb" className={s.colLink}>AGB</Link>
              <Link href="/widerruf" className={s.colLink}>Widerrufsbelehrung</Link>
              <Link href="/barrierefreiheit" className={s.colLink}>Barrierefreiheit</Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={s.bottom}>
          <div className={s.bottomLeft}>
            © {year} {FIRMA.marke} · {FIRMA.rechtsform} · {FIRMA.ort}<br />
            Alle Preise netto zzgl. {FIRMA.ustSatz}&nbsp;% USt (Regelbesteuerung)
          </div>
          <div className={s.bottomRight}>
            <Link href="/impressum" className={s.bottomLink}>Impressum</Link>
            <Link href="/datenschutz" className={s.bottomLink}>Datenschutz</Link>
            <Link href="/agb" className={s.bottomLink}>AGB</Link>
            <Link href="/cookie-einstellungen" className={s.bottomLink}>Cookie-Einstellungen</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
