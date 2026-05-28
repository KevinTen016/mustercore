import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { FIRMA } from '@/data/firma';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Widerrufsbelehrung',
  description: 'Widerrufsbelehrung für MusterCore-Dienste. B2B-Kontext.',
  path: '/widerruf',
  noindex: true,
});

const p = { fontSize: '0.875rem', lineHeight: 1.75, margin: '0 0 0.75rem' };

export default function WiderrufPage() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <TypewriterH1 style={{ marginBottom: '0.5rem' }}>Widerrufsbelehrung</TypewriterH1>
        <p style={{ fontSize: '0.875rem', marginBottom: '3rem' }}>
          Informationen zum Widerrufsrecht gemäß §§ 355 ff. BGB
        </p>

        <section style={{ background: 'var(--bg-card)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Wichtiger Hinweis: B2B-Dienst</h2>
          <p style={p}>
            Die Dienste von {FIRMA.marke} richten sich ausschließlich an Unternehmer im Sinne des
            § 14 BGB. Verbrauchern im Sinne des § 13 BGB werden keine Verträge angeboten.
          </p>
          <p style={{ ...p, margin: 0 }}>
            Da kein Verbraucherverhältnis begründet wird, steht kein gesetzliches Widerrufsrecht
            nach § 312g BGB zu. Die Stornierung eines Auftrags vor Beginn der Leistungserbringung
            ist jedoch nach Maßgabe der AGB möglich.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', marginBottom: '0.75rem' }}>
            Kündigung und vorzeitige Vertragsbeendigung
          </h2>
          <p style={p}>
            Die Bedingungen für die ordentliche und außerordentliche Kündigung des Abonnements sind
            in § 5 der Allgemeinen Geschäftsbedingungen geregelt.
          </p>
          <p style={p}>
            Zusammenfassung der wesentlichen Punkte:
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--text-dim)' }}>
            <li>Mindestlaufzeit: 3 Monate</li>
            <li>Danach monatlich kündbar mit 4 Wochen Frist zum Monatsende</li>
            <li>Kündigung per E-Mail an {FIRMA.emailKontakt}</li>
            <li>Nach Kündigung: 30 Tage Datenhaltung und vollständiger Datenexport</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', marginBottom: '0.75rem' }}>
            Stornierung vor Leistungsbeginn
          </h2>
          <p style={p}>
            Wenn Sie nach Vertragsschluss, aber vor Abschluss des Onboardings (Einrichtung der Website
            und des Buchungssystems) vom Vertrag zurücktreten möchten, kontaktieren Sie uns
            umgehend per E-Mail an {FIRMA.emailKontakt}.
          </p>
          <p style={p}>
            Bei einer Stornierung vor Beginn der Einrichtung erstatten wir die Setup-Gebühr anteilig
            je nach erbrachtem Aufwand. Eine bereits vollständig abgeschlossene Einrichtung wird
            vollständig in Rechnung gestellt.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', marginBottom: '0.75rem' }}>
            Kontakt bei Fragen
          </h2>
          <p style={p}>
            Für Fragen zu Kündigung, Stornierung oder Vertragsänderungen wenden Sie sich an:
          </p>
          <p style={{ ...p, margin: 0 }}>
            <strong style={{ color: 'var(--text)' }}>{FIRMA.marke}</strong><br />
            {FIRMA.inhaber}<br />
            E-Mail: {FIRMA.emailKontakt}<br />
            Telefon: {FIRMA.telefon}
          </p>
        </section>
      </div>
    </div>
  );
}
