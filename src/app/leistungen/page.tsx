import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Leistungen — Website, Buchungssystem & Admin-Panel',
  description:
    'Was WebCore bietet: professionelle Website, Online-Buchungssystem und Admin-Panel für lokale Unternehmen in Deutschland. DSGVO-konform, EU-Hosting.',
  path: '/leistungen',
});

const LEISTUNGEN = [
  {
    num: '01',
    title: 'Professionelle Website',
    sub: 'Ihr Aushängeschild im Netz — ohne Agenturaufwand.',
    items: [
      'Moderne, mobiloptimierte Website auf bewährter Vorlage',
      'Eigene Domain (ab STANDARD) oder Subdomain auf webcore.de (BASIS)',
      'HTTPS, schnelle Ladezeiten, Google-Lighthouse-Score über 90',
      'Dienstleistungsübersicht, Preisliste, Team-Vorstellung',
      'Impressum, Datenschutzerklärung und Cookie-Banner (DSGVO/TTDSG)',
      'Google Business Profil Einrichtung (ab STANDARD)',
      'Basis-SEO: Title-Tags, Meta-Descriptions, Sitemap, schema.org (ab STANDARD)',
    ],
  },
  {
    num: '02',
    title: 'Online-Buchungssystem',
    sub: 'Termine rund um die Uhr — ohne Telefonanruf.',
    items: [
      'Buchungsseite direkt in Ihre Website integriert',
      'Keine App, kein Kunden-Account nötig',
      'Kunden wählen Dienstleistung, Mitarbeiter, Datum und Uhrzeit',
      'Automatische E-Mail-Bestätigung nach jeder Buchung',
      'Automatische Erinnerung 24 h vor dem Termin (E-Mail)',
      'SMS-Erinnerungen (ab PREMIUM)',
      'Telegram-Benachrichtigung für Sie und Ihr Team (ab STANDARD)',
      'Buchungen, Stornierungen und Umbuchungen ohne Ihren Eingriff',
    ],
  },
  {
    num: '03',
    title: 'Admin-Panel',
    sub: 'Ihr Betrieb — vollständig im Überblick, immer im Browser.',
    items: [
      'Terminübersicht für alle Mitarbeiter (Tages-, Wochen-, Monatsansicht)',
      'Mitarbeiterverwaltung: Arbeitszeiten, Urlaub, Dienstleistungen',
      'Preisliste und Dienstleistungen direkt bearbeiten',
      'Kundenkartei mit Buchungshistorie',
      'Statistik: Auslastung, Umsatz, No-Show-Rate (ab STANDARD)',
      'Erweiterte Statistik: Mitarbeiter-Dynamik, MoM-Vergleich (PREMIUM)',
      'CSV/Excel-Export für die Buchhaltung',
      'Mobil nutzbar — kein App-Download nötig',
    ],
  },
  {
    num: '04',
    title: 'DSGVO-Paket & Sicherheit',
    sub: 'Rechtssicher von Anfang an — kein Nachgedanke.',
    items: [
      'Impressum und Datenschutzerklärung inklusive',
      'Cookie-Banner mit echtem Auswahlrecht nach TTDSG',
      'AV-Vertrag nach Art. 28 DSGVO',
      'EU-Hosting: Rechenzentrum in Deutschland',
      'Eigener, isolierter Container pro Kunde — keine Datenvermischung',
      'Tägliche verschlüsselte Backups, 30 Tage Aufbewahrung',
      'HTTPS und aktuelle Sicherheitsheader',
    ],
  },
];

export default function LeistungenPage() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Header */}
        <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
          Leistungsumfang
        </p>
        <TypewriterH1 style={{ marginBottom: '0.75rem' }}>
          Alles, was Ihr Betrieb braucht.
        </TypewriterH1>
        <p style={{ maxWidth: '58ch', marginBottom: '3.5rem' }}>
          WebCore ist kein Baukasten — es ist ein vollständiges System: Website, Buchungssystem
          und Admin-Panel aus einer Hand, eingerichtet, betrieben und gewartet von uns.
        </p>

        {/* Leistungs-Blöcke */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginBottom: '4rem' }}>
          {LEISTUNGEN.map(l => (
            <div
              key={l.num}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                  {l.num}
                </span>
                <h2 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)', margin: 0 }}>
                  {l.title}
                </h2>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '1.25rem', marginTop: '0.25rem' }}>
                {l.sub}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.5rem' }}>
                {l.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.855rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: '0.15em', color: 'var(--green)' }}>
                      <polyline points="1 7 5 11 13 3" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Inklusive im Abo */}
        <div style={{ marginBottom: '3rem', padding: '1.5rem 2rem', background: 'var(--accent-muted)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Im monatlichen Abo immer enthalten</h3>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            Hosting, Serverbetreuung, Updates, Sicherheitspatches, tägliche Backups, SSL-Zertifikat, technischer Support —
            kein Aufpreis, keine Überraschungen.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1.25rem', color: 'var(--text-dim)' }}>
            Neugierig, wie das in Ihrem Betrieb aussieht?
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/demo" className="btn btn-primary btn-lg">Demo anfragen — kostenlos</Link>
            <Link href="/preise" className="btn btn-secondary btn-lg">Alle Preise ansehen</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
