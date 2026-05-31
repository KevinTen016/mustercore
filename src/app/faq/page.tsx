import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'FAQ — Häufige Fragen',
  description:
    'Häufig gestellte Fragen zu MusterCore: Preise, DSGVO, Kündigung, Datensicherheit und mehr.',
  path: '/faq',
});

const CATEGORIES = [
  {
    id: 'allgemein',
    title: 'Allgemein',
    items: [
      {
        q: 'Was ist MusterCore?',
        a: 'MusterCore ist ein Abo-Dienst für lokale Unternehmen in Deutschland. Sie erhalten eine professionelle Website, ein Online-Buchungssystem und ein Admin-Panel — eingerichtet in 5–7 Werktagen, ohne Agentur-Aufwand.',
      },
      {
        q: 'Für wen eignet sich MusterCore?',
        a: 'MusterCore richtet sich an lokale Dienstleister, die Termine vergeben: Friseursalons, Arztpraxen, Physiotherapiepraxen, Autowerkstätten, Fitnessstudios, Tattoostudios und ähnliche Betriebe.',
      },
      {
        q: 'Wie schnell bin ich nach Vertragsabschluss online?',
        a: 'In der Regel innerhalb von 5–7 Werktagen. Wir richten Ihre Website, den Buchungskalender, alle Benachrichtigungen und das Admin-Panel ein. Sie erhalten Zugangsdaten und eine persönliche Einführung per Video-Call.',
      },
      {
        q: 'Benötige ich technisches Wissen?',
        a: 'Nein. Das Admin-Panel ist so gestaltet, dass Sie ohne jede Vorkenntnisse Termine verwalten, die Preisliste aktualisieren oder Urlaub eintragen können. Wenn Sie eine Frage haben, können Sie uns direkt kontaktieren.',
      },
    ],
  },
  {
    id: 'preise',
    title: 'Preise & Laufzeit',
    items: [
      {
        q: 'Was kostet MusterCore?',
        a: 'BASIS ab 99 €/Monat (netto), STANDARD ab 129 €/Monat (netto), PREMIUM ab 199 €/Monat (netto). Dazu kommt eine einmalige Setup-Gebühr je nach Paket. Alle Preise netto zzgl. 19 % USt.',
      },
      {
        q: 'Wie lange ist die Mindestlaufzeit?',
        a: 'Die Mindestlaufzeit beträgt 3 Monate. Danach ist der Vertrag monatlich mit 4 Wochen Frist kündbar.',
      },
      {
        q: 'Kann ich das Paket wechseln?',
        a: 'Upgrades sind jederzeit möglich und werden zum nächsten Monatsanfang aktiviert. Downgrades werden zum Ende der Mindestlaufzeit wirksam.',
      },
      {
        q: 'Was passiert nach der Kündigung?',
        a: 'Nach Kündigung erhalten Sie einen vollständigen Datenexport (alle Buchungen, Kundendaten) und haben noch 30 Tage Lesezugang. Danach werden alle Ihre Daten vollständig gelöscht.',
      },
      {
        q: 'Gibt es versteckte Kosten?',
        a: 'Nein. Im Paketpreis sind Hosting, Backups, Updates, SSL-Zertifikat und Support enthalten. Für optionale Extras gibt es transparente Add-on-Preise auf der Preisseite.',
      },
    ],
  },
  {
    id: 'buchungssystem',
    title: 'Funktionen & Admin-Panel',
    items: [
      {
        q: 'Wie buchen meine Kunden einen Termin?',
        a: 'Ihre Kunden besuchen Ihre Website und wählen Dienstleistung, Mitarbeiter, Datum und Uhrzeit. Keine App, kein Account nötig. Sie erhalten eine automatische Bestätigung per E-Mail.',
      },
      {
        q: 'Werden Kunden an ihren Termin erinnert?',
        a: 'Ja. Jeder Kunde erhält 24 Stunden vor dem Termin eine automatische E-Mail-Erinnerung. Ab PREMIUM zusätzlich per SMS.',
      },
      {
        q: 'Kann ich Telegram-Benachrichtigungen aktivieren?',
        a: 'Ja, ab dem STANDARD-Paket. Sie und Ihre Mitarbeiter erhalten bei jeder neuen Buchung oder Stornierung eine sofortige Telegram-Nachricht.',
      },
      {
        q: 'Wie viele Mitarbeiter kann ich anlegen?',
        a: 'BASIS: bis zu 2, STANDARD: bis zu 5, PREMIUM: unbegrenzt. Für jeden Mitarbeiter können Sie eigene Arbeitszeiten, Urlaub und Dienstleistungen definieren.',
      },
      {
        q: 'Kann ich meine Preisliste selbst aktualisieren?',
        a: 'Ja, sofort und ohne Rückfrage. Im Admin-Panel pflegen Sie Dienstleistungen, Preise und Dauer direkt. Die Buchungsseite Ihrer Kunden zeigt immer den aktuellen Stand.',
      },
      {
        q: 'Kann ich meine eigene Domain verwenden?',
        a: 'Ja, ab STANDARD. Wir übernehmen die Registrierung und Verlängerung Ihrer Wunschdomain. Im BASIS-Paket erhalten Sie eine Subdomain auf mustercore.de.',
      },
    ],
  },
  {
    id: 'datenschutz',
    title: 'Datenschutz & Sicherheit',
    items: [
      {
        q: 'Sind meine Kundendaten sicher?',
        a: 'Ja. Alle Daten werden ausschließlich in der EU gehostet, in einem Rechenzentrum in Deutschland. Jeder Kunde erhält einen eigenen, isolierten Container — Ihre Daten werden niemals mit anderen Betrieben vermischt.',
      },
      {
        q: 'Ist MusterCore DSGVO-konform?',
        a: 'Ja. Im Paket enthalten sind: Impressum, Datenschutzerklärung, Cookie-Banner nach TTDSG sowie ein AV-Vertrag nach Art. 28 DSGVO.',
      },
      {
        q: 'Was passiert, wenn ein Kunde seine Daten löschen lassen möchte?',
        a: 'Im Admin-Panel können Sie Kundendatensätze jederzeit vollständig löschen. Bei einem Antrag nach Art. 17 DSGVO (Recht auf Löschung) können Sie dem ohne Zusatzaufwand nachkommen.',
      },
      {
        q: 'Werden Backups erstellt?',
        a: 'Ja. Täglich automatisch, 30 Tage Aufbewahrung, verschlüsselt auf EU-Servern. Bei Datenverlust stellen wir Ihren Stand innerhalb von 24 Stunden wieder her.',
      },
    ],
  },
  {
    id: 'support',
    title: 'Einrichtung & Support',
    items: [
      {
        q: 'Wie läuft die Einrichtung ab?',
        a: 'Nach Vertragsabschluss vereinbaren wir ein kurzes Onboarding-Gespräch. Wir benötigen Ihre Dienstleistungen, Mitarbeiter, Öffnungszeiten und ein Logo oder Foto — den Rest übernehmen wir.',
      },
      {
        q: 'Wie erreiche ich den Support?',
        a: 'Per E-Mail, WhatsApp oder Telegram — je nach Paket. BASIS: E-Mail, Reaktion in 48 h. STANDARD: E-Mail + WhatsApp/Telegram, Reaktion in 24 h. PREMIUM: Priorität-Support in 8 h, Telefon in dringenden Fällen.',
      },
      {
        q: 'Kann ich das Design meiner Website anpassen?',
        a: 'Ab STANDARD ist eine Designanpassung pro Jahr inklusive (Farbpalette, Schrift, Fotos). Zusätzliche Anpassungen sind als Add-on buchbar.',
      },
      {
        q: 'Kann ich MusterCore vor dem Kauf testen?',
        a: 'Ja. Fordern Sie eine kostenlose Demo an — wir zeigen Ihnen das Admin-Panel live in einem 20-minütigen Video-Call, ohne Verkaufsdruck und ohne Verpflichtung.',
      },
    ],
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: CATEGORIES.flatMap(cat =>
    cat.items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
          Häufige Fragen
        </p>
        <TypewriterH1 style={{ marginBottom: '0.75rem' }}>
          Was andere gefragt haben
        </TypewriterH1>
        <p style={{ marginBottom: '3rem' }}>
          Antworten auf die Fragen, die am häufigsten gestellt werden. Haben Sie eine weitere Frage?{' '}
          <Link href="/kontakt" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
            Schreiben Sie uns.
          </Link>
        </p>

        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '3rem' }}>
          {CATEGORIES.map(cat => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              style={{
                fontSize: '0.8rem',
                fontWeight: 500,
                padding: '0.35rem 0.85rem',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                color: 'var(--text-dim)',
                textDecoration: 'none',
                background: 'var(--bg-card)',
                transition: 'color 0.2s',
              }}
            >
              {cat.title}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {CATEGORIES.map(cat => (
            <section key={cat.id} id={cat.id}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem', fontFamily: 'var(--font-body)' }}>
                {cat.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {cat.items.map((item, i) => (
                  <details
                    key={i}
                    style={{
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--bg-card)',
                      overflow: 'hidden',
                    }}
                  >
                    <summary
                      style={{
                        listStyle: 'none',
                        cursor: 'pointer',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        color: 'var(--text)',
                        userSelect: 'none',
                      }}
                    >
                      {item.q}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0, color: 'var(--accent)' }}>
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </summary>
                    <p style={{ padding: '0 1.25rem 1rem', margin: 0, fontSize: '0.925rem', lineHeight: 1.72, color: 'var(--text-dim)', borderTop: '1px solid var(--line)', paddingTop: '0.75rem' }}>
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div style={{ marginTop: '3.5rem', padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--text)' }}>
            Noch offene Fragen? Wir antworten persönlich — kein Bot, kein Ticket-System.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/demo" className="btn btn-primary">Demo anfragen</Link>
            <Link href="/kontakt" className="btn btn-secondary">Nachricht schreiben</Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
