import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { FIRMA } from '@/data/firma';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Barrierefreiheitserklärung',
  description: 'Barrierefreiheitserklärung der WebCore Website gemäß BFSG und WCAG 2.1.',
  path: '/barrierefreiheit',
});

const p = { fontSize: '0.875rem', lineHeight: 1.75, margin: '0 0 0.75rem' };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', marginBottom: '0.75rem' }}>{title}</h2>
      {children}
    </section>
  );
}

export default function BarrierefreiheitPage() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <TypewriterH1 style={{ marginBottom: '0.5rem' }}>Barrierefreiheitserklärung</TypewriterH1>
        <p style={{ fontSize: '0.875rem', marginBottom: '3rem' }}>
          Gemäß dem Barrierefreiheitsstärkungsgesetz (BFSG) und der EU-Richtlinie 2016/2102
        </p>

        <Section title="1. Stand der Vereinbarkeit mit den Anforderungen">
          <p style={p}>
            Die Website von {FIRMA.marke} ({FIRMA.email}) ist teilweise mit den Anforderungen der
            WCAG 2.1, Konformitätsstufe AA vereinbar. Die nachfolgend aufgeführten Inhalte sind noch
            nicht vollständig barrierefrei.
          </p>
        </Section>

        <Section title="2. Nicht barrierefreie Inhalte">
          <p style={p}>Die folgenden Inhalte sind aus den angegebenen Gründen nicht barrierefrei:</p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            <li>
              <strong style={{ color: 'var(--text)' }}>Interaktive Elemente im Admin-Panel:</strong> Einige
              komplexe Datumspicker und Kalenderansichten sind mit Screenreadern eingeschränkt nutzbar.
              Wir arbeiten an einer Verbesserung.
            </li>
            <li>
              <strong style={{ color: 'var(--text)' }}>Dark/Light-Mode-Toggle:</strong> Die Umschaltung
              erfolgt über ein Tastatur-zugängliches Element, kann jedoch bei bestimmten
              Hilfstechnologien zu Ankündigungslücken führen.
            </li>
            <li>
              <strong style={{ color: 'var(--text)' }}>Interaktive Charts in der Statistikansicht:</strong>{' '}
              Diagramme im PREMIUM-Paket sind derzeit nicht vollständig mit Screenreadern bedienbar.
              Tabellen-Alternativdarstellung ist in Planung.
            </li>
          </ul>
          <p style={p}>
            Diese Einschränkungen stellen eine unverhältnismäßige Belastung gemäß Art. 5 der
            Richtlinie (EU) 2016/2102 dar und werden schrittweise behoben.
          </p>
        </Section>

        <Section title="3. Was wir umgesetzt haben">
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--text-dim)' }}>
            <li>Semantisch korrekte HTML-Struktur (ARIA-Landmarks, Überschriftenhierarchie)</li>
            <li>Ausreichende Farbkontraste (mind. 4.5:1 für normalen Text)</li>
            <li>Tastatur-Navigation für alle wesentlichen Seitenfunktionen</li>
            <li>Skip-Link &bdquo;Zum Inhalt springen&ldquo; am Seitenanfang</li>
            <li>Fokus-Indikatoren für interaktive Elemente</li>
            <li>Alt-Texte für alle relevanten Grafiken</li>
            <li>ARIA-Labels auf SVG-Icons</li>
            <li>Responsives Design für mobile Nutzung</li>
          </ul>
        </Section>

        <Section title="4. Erstellung dieser Erklärung">
          <p style={p}>
            Diese Erklärung wurde am{' '}
            {new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}{' '}
            erstellt und basiert auf einer Selbstbewertung durch {FIRMA.inhaber}.
          </p>
        </Section>

        <Section title="5. Feedback und Kontakt">
          <p style={p}>
            Wenn Sie auf Barrierefreiheitsprobleme stoßen oder barrierefreien Zugang zu Inhalten
            benötigen, die Ihnen nicht zugänglich sind, kontaktieren Sie uns:
          </p>
          <p style={{ ...p, marginBottom: '0.25rem' }}>
            <strong style={{ color: 'var(--text)' }}>{FIRMA.inhaber}</strong><br />
            E-Mail: {FIRMA.email}<br />
            Telefon: {FIRMA.telefon}
          </p>
          <p style={p}>
            Wir bemühen uns, Ihren Kontaktwunsch innerhalb von 3 Werktagen zu beantworten.
          </p>
        </Section>

        <Section title="6. Durchsetzungsverfahren">
          <p style={p}>
            Wenn Sie nach Kontaktaufnahme mit uns keine zufriedenstellende Antwort erhalten haben,
            können Sie die zuständige Durchsetzungsstelle einschalten:
          </p>
          <p style={{ ...p, margin: 0 }}>
            <strong style={{ color: 'var(--text)' }}>
              Durchsetzungsstelle Barrierefreiheit (Niedersachsen)
            </strong><br />
            Niedersächsisches Ministerium für Soziales, Arbeit, Gesundheit und Gleichstellung<br />
            Hinrich-Wilhelm-Kopf-Platz 2, 30159 Hannover<br />
            E-Mail: barrierefrei@soziales.niedersachsen.de
          </p>
        </Section>
      </div>
    </div>
  );
}
