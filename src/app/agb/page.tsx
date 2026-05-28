import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { FIRMA } from '@/data/firma';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Allgemeine Geschäftsbedingungen',
  description: 'AGB von WebCore — Dienstleistungsvertrag, Laufzeit, Kündigung, Haftung.',
  path: '/agb',
  noindex: true,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', marginBottom: '0.75rem' }}>{title}</h2>
      {children}
    </section>
  );
}

const p = { fontSize: '0.875rem', lineHeight: 1.75, margin: '0 0 0.75rem' };

export default function AgbPage() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <TypewriterH1 style={{ marginBottom: '0.5rem' }}>Allgemeine Geschäftsbedingungen</TypewriterH1>
        <p style={{ fontSize: '0.875rem', marginBottom: '3rem' }}>
          {FIRMA.marke} · {FIRMA.inhaber} · Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
        </p>

        <Section title="§ 1 Geltungsbereich">
          <p style={p}>
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen {FIRMA.marke}
            ({FIRMA.inhaber}, {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort}) und dem Auftraggeber (nachfolgend
            &bdquo;Kunde&ldquo;) über die Nutzung der von {FIRMA.marke} angebotenen Software-as-a-Service-Dienste.
          </p>
          <p style={p}>
            Abweichende, entgegenstehende oder ergänzende AGB des Kunden werden nicht Vertragsbestandteil,
            es sei denn, ihrer Geltung wird ausdrücklich schriftlich zugestimmt.
          </p>
          <p style={p}>
            Diese AGB richten sich ausschließlich an Unternehmen im Sinne des § 14 BGB (B2B).
            Verbraucher im Sinne des § 13 BGB werden nicht als Vertragspartner akzeptiert.
          </p>
        </Section>

        <Section title="§ 2 Leistungsgegenstand">
          <p style={p}>
            {FIRMA.marke} stellt dem Kunden gegen Entgelt folgende Leistungen als Abonnement zur Verfügung:
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            <li>Bereitstellung und Betrieb einer professionellen Website</li>
            <li>Online-Buchungssystem mit Kalender und Benachrichtigungen</li>
            <li>Admin-Panel zur Verwaltung von Terminen, Mitarbeitern und Preisen</li>
            <li>Hosting auf EU-Servern, tägliche Backups, SSL-Zertifikat</li>
            <li>DSGVO-Paket: Impressum, Datenschutzerklärung, Cookie-Banner, AV-Vertrag</li>
          </ul>
          <p style={p}>
            Der genaue Leistungsumfang ergibt sich aus dem jeweils gewählten Paket (BASIS, STANDARD, PREMIUM)
            gemäß der aktuellen Preisübersicht auf der Website von {FIRMA.marke}.
          </p>
        </Section>

        <Section title="§ 3 Vertragsschluss und Onboarding">
          <p style={p}>
            Der Vertrag kommt durch schriftliche Auftragsbestätigung von {FIRMA.marke} per E-Mail zustande.
            Nach Vertragsschluss richtet {FIRMA.marke} die gebuchten Dienste innerhalb von 5–7 Werktagen ein.
            Der Kunde erhält Zugangsdaten und eine Einführung per Video-Call.
          </p>
        </Section>

        <Section title="§ 4 Entgelt und Zahlung">
          <p style={p}>
            Das monatliche Nutzungsentgelt sowie die einmalige Setup-Gebühr sind in der aktuellen
            Preisübersicht auf der Website ausgewiesen. Alle Preise verstehen sich netto zzgl.
            der gesetzlichen Umsatzsteuer ({FIRMA.ustSatz}&nbsp;%).
          </p>
          <p style={p}>
            Die monatliche Rechnung ist innerhalb von 14 Tagen nach Rechnungsdatum fällig.
            Bei Zahlungsverzug ist {FIRMA.marke} berechtigt, den Zugang zum Admin-Panel vorübergehend zu sperren.
          </p>
          <p style={p}>
            Die einmalige Setup-Gebühr ist mit Vertragsschluss fällig.
          </p>
        </Section>

        <Section title="§ 5 Laufzeit und Kündigung">
          <p style={p}>
            Der Vertrag hat eine Mindestlaufzeit von 3 Monaten. Nach Ablauf der Mindestlaufzeit
            verlängert sich der Vertrag automatisch um jeweils einen Monat und kann von beiden
            Seiten mit einer Frist von 4 Wochen zum Monatsende gekündigt werden.
          </p>
          <p style={p}>
            Kündigungen sind schriftlich per E-Mail einzureichen.
          </p>
          <p style={p}>
            Nach Kündigung erhält der Kunde innerhalb von 30 Tagen einen vollständigen Datenexport
            (CSV/JSON). Mit Ablauf der Datenhaltungsfrist werden alle Kundendaten unwiderruflich gelöscht.
          </p>
          <p style={p}>
            Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
          </p>
        </Section>

        <Section title="§ 6 Pflichten des Kunden">
          <p style={p}>Der Kunde verpflichtet sich:</p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            <li>Zugangsdaten vertraulich zu behandeln und nicht an Dritte weiterzugeben</li>
            <li>Die bereitgestellten Dienste ausschließlich für rechtmäßige Zwecke zu nutzen</li>
            <li>Für den rechtmäßigen Umgang mit personenbezogenen Daten seiner eigenen Kunden (Endkunden) verantwortlich zu sein</li>
            <li>Änderungen an Kontakt- und Rechnungsdaten unverzüglich mitzuteilen</li>
          </ul>
        </Section>

        <Section title="§ 7 Verfügbarkeit und Wartung">
          <p style={p}>
            {FIRMA.marke} bemüht sich um eine Verfügbarkeit der Dienste von mindestens 99&nbsp;% im
            Jahresdurchschnitt, ausgenommen geplante Wartungsfenster, die nach Möglichkeit vorab
            angekündigt werden. Eine Garantie einer bestimmten Verfügbarkeit wird nicht übernommen.
          </p>
        </Section>

        <Section title="§ 8 Haftung">
          <p style={p}>
            {FIRMA.marke} haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für
            Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.
          </p>
          <p style={p}>
            Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten (Kardinalpflichten)
            ist die Haftung auf den typischerweise vorhersehbaren Schaden begrenzt.
          </p>
          <p style={p}>
            Im Übrigen ist die Haftung für leicht fahrlässig verursachte Sach- und Vermögensschäden
            ausgeschlossen.
          </p>
        </Section>

        <Section title="§ 9 Auftragsverarbeitung (DSGVO)">
          <p style={p}>
            Soweit {FIRMA.marke} im Rahmen der Dienstleistung personenbezogene Daten im Auftrag des
            Kunden verarbeitet, schließen die Parteien einen gesonderten Auftragsverarbeitungsvertrag
            (AVV) nach Art. 28 DSGVO. Der AVV ist Bestandteil des Vertragsverhältnisses und wird dem
            Kunden mit der Auftragsbestätigung übermittelt.
          </p>
        </Section>

        <Section title="§ 10 Änderungen der AGB">
          <p style={p}>
            {FIRMA.marke} behält sich vor, diese AGB mit einer Frist von 6 Wochen zu ändern. Der Kunde
            wird per E-Mail über Änderungen informiert. Widerspricht der Kunde nicht innerhalb von
            4 Wochen nach Zugang der Änderungsmitteilung, gelten die neuen AGB als akzeptiert.
          </p>
        </Section>

        <Section title="§ 11 Anwendbares Recht und Gerichtsstand">
          <p style={p}>
            Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand für alle Streitigkeiten
            aus diesem Vertragsverhältnis ist {FIRMA.ort}, soweit der Kunde Kaufmann ist.
          </p>
        </Section>
      </div>
    </div>
  );
}
