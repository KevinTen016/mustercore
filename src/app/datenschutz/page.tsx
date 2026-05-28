import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { FIRMA } from '@/data/firma';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung von WebCore gemäß DSGVO und TTDSG.',
  path: '/datenschutz',
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

const textStyle = { fontSize: '0.875rem', lineHeight: 1.75, margin: '0 0 0.75rem' };

export default function DatenschutzPage() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <TypewriterH1 style={{ marginBottom: '0.5rem' }}>Datenschutzerklärung</TypewriterH1>
        <p style={{ fontSize: '0.875rem', marginBottom: '3rem' }}>
          Informationen nach Art. 13 und 14 DSGVO — Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
        </p>

        <Section title="1. Verantwortlicher">
          <p style={textStyle}>
            Verantwortlicher im Sinne der DSGVO ist:<br />
            <strong style={{ color: 'var(--text)' }}>{FIRMA.inhaber}</strong><br />
            {FIRMA.marke} ({FIRMA.rechtsform})<br />
            {FIRMA.strasse}<br />
            {FIRMA.plz} {FIRMA.ort}<br />
            E-Mail: {FIRMA.email}<br />
            Telefon: {FIRMA.telefon}
          </p>
        </Section>

        <Section title="2. Erhebung und Verarbeitung personenbezogener Daten">
          <p style={textStyle}>
            Wir erheben personenbezogene Daten nur, soweit dies für die Bereitstellung unserer Dienste
            erforderlich ist. Im Einzelnen verarbeiten wir folgende Daten:
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--text-dim)' }}>
            <li><strong style={{ color: 'var(--text)' }}>Kontaktdaten:</strong> Name, E-Mail-Adresse, Telefonnummer, sofern Sie uns kontaktieren oder eine Demo anfragen.</li>
            <li><strong style={{ color: 'var(--text)' }}>Buchungsdaten:</strong> Name, E-Mail-Adresse, gewählte Dienstleistung, Termin — beim Einsatz unseres Buchungssystems durch unsere Kunden (Betriebe).</li>
            <li><strong style={{ color: 'var(--text)' }}>Verbindungsdaten:</strong> IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene URL — technisch notwendig für den Betrieb des Webservers.</li>
            <li><strong style={{ color: 'var(--text)' }}>Cookies:</strong> Technisch notwendige Cookies (Session, CSRF-Schutz). Optionale Cookies nur nach Einwilligung (TTDSG).</li>
          </ul>
        </Section>

        <Section title="3. Rechtsgrundlagen">
          <p style={textStyle}>
            Die Verarbeitung Ihrer Daten erfolgt auf Grundlage folgender Rechtsgrundlagen:
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--text-dim)' }}>
            <li>Art. 6 Abs. 1 lit. b DSGVO: Vertragserfüllung (Buchungssystem, Kundenverwaltung)</li>
            <li>Art. 6 Abs. 1 lit. c DSGVO: Rechtliche Verpflichtung (Aufbewahrungspflichten)</li>
            <li>Art. 6 Abs. 1 lit. f DSGVO: Berechtigtes Interesse (Serverprotokollierung, IT-Sicherheit)</li>
            <li>Art. 6 Abs. 1 lit. a DSGVO: Einwilligung (optionale Cookies)</li>
          </ul>
        </Section>

        <Section title="4. Hosting und Auftragsverarbeitung">
          <p style={textStyle}>
            Unsere Website und das Buchungssystem werden auf Servern in Deutschland gehostet ({FIRMA.hoster}).
            Mit dem Hosting-Anbieter besteht ein Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO.
            Die Daten verlassen die EU nicht.
          </p>
        </Section>

        <Section title="5. Weitergabe an Dritte">
          <p style={textStyle}>
            Personenbezogene Daten werden nicht an Dritte weitergegeben, es sei denn:
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--text-dim)' }}>
            <li>Sie haben ausdrücklich eingewilligt.</li>
            <li>Die Weitergabe ist zur Vertragserfüllung erforderlich (z. B. E-Mail-Versand für Terminbestätigungen).</li>
            <li>Wir sind gesetzlich zur Weitergabe verpflichtet.</li>
          </ul>
          <p style={{ ...textStyle, marginTop: '0.5rem' }}>
            Alle eingesetzten Dienstleister (E-Mail-Versand, Monitoring) sind vertraglich zur
            Einhaltung der DSGVO verpflichtet und verarbeiten Daten ausschließlich in der EU.
          </p>
        </Section>

        <Section title="6. Speicherdauer">
          <p style={textStyle}>
            Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich
            ist:
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--text-dim)' }}>
            <li>Server-Logs: 7 Tage (automatische Löschung)</li>
            <li>Buchungsdaten: Für die Dauer des Vertragsverhältnisses, danach bis zum Ablauf gesetzlicher Aufbewahrungsfristen (in der Regel 10 Jahre für steuerrelevante Daten)</li>
            <li>Demo-Anfragen: 6 Monate nach Abschluss des Anfrageprozesses</li>
          </ul>
        </Section>

        <Section title="7. Ihre Rechte">
          <p style={textStyle}>Sie haben nach der DSGVO folgende Rechte:</p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--text-dim)' }}>
            <li><strong style={{ color: 'var(--text)' }}>Auskunft</strong> (Art. 15 DSGVO): Welche Daten wir über Sie gespeichert haben.</li>
            <li><strong style={{ color: 'var(--text)' }}>Berichtigung</strong> (Art. 16 DSGVO): Korrektur unrichtiger Daten.</li>
            <li><strong style={{ color: 'var(--text)' }}>Löschung</strong> (Art. 17 DSGVO): Löschung Ihrer Daten, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
            <li><strong style={{ color: 'var(--text)' }}>Einschränkung</strong> (Art. 18 DSGVO): Einschränkung der Verarbeitung.</li>
            <li><strong style={{ color: 'var(--text)' }}>Datenübertragbarkeit</strong> (Art. 20 DSGVO): Erhalt Ihrer Daten in maschinenlesbarem Format.</li>
            <li><strong style={{ color: 'var(--text)' }}>Widerspruch</strong> (Art. 21 DSGVO): Widerspruch gegen die Verarbeitung auf Grundlage berechtigter Interessen.</li>
            <li><strong style={{ color: 'var(--text)' }}>Widerruf</strong>: Widerruf einer erteilten Einwilligung jederzeit mit Wirkung für die Zukunft.</li>
          </ul>
          <p style={{ ...textStyle, marginTop: '0.75rem' }}>
            Zur Geltendmachung Ihrer Rechte wenden Sie sich an: {FIRMA.email}
          </p>
          <p style={textStyle}>
            Sie haben zudem das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren.
            In Niedersachsen: Landesbeauftragte für den Datenschutz Niedersachsen (LfD), Prinzenstraße 5,
            30159 Hannover, <a href="https://www.lfd.niedersachsen.de" style={{ color: 'var(--accent)' }}>www.lfd.niedersachsen.de</a>.
          </p>
        </Section>

        <Section title="8. Cookies und Einwilligung (TTDSG)">
          <p style={textStyle}>
            Wir setzen technisch notwendige Cookies ein, die keine Einwilligung erfordern. Dazu gehören
            Session-Cookies und CSRF-Schutz-Cookies.
          </p>
          <p style={textStyle}>
            Für optionale Cookies (z. B. Analyse, Marketing) holen wir Ihre Einwilligung über unseren
            Cookie-Banner ein. Sie können Ihre Einwilligung jederzeit auf der Seite{' '}
            <a href="/cookie-einstellungen" style={{ color: 'var(--accent)' }}>Cookie-Einstellungen</a>{' '}
            widerrufen oder anpassen.
          </p>
        </Section>

        <Section title="9. Datensicherheit">
          <p style={textStyle}>
            Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten vor Verlust, Manipulation
            und unberechtigtem Zugriff zu schützen. Dazu gehören verschlüsselte Übertragung per HTTPS
            (TLS), tägliche verschlüsselte Backups sowie Zugriffsbeschränkungen auf Datenbankebene.
          </p>
        </Section>

        <Section title="10. Änderungen dieser Datenschutzerklärung">
          <p style={textStyle}>
            Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Die jeweils aktuelle
            Version ist auf dieser Seite abrufbar.
          </p>
        </Section>
      </div>
    </div>
  );
}
