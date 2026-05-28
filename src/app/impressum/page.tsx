import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { FIRMA } from '@/data/firma';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Impressum',
  description: 'Impressum der MusterCore Website gemäß § 5 TMG.',
  path: '/impressum',
  noindex: true,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={{ paddingRight: '2rem', paddingBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-sub)', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
        {label}
      </td>
      <td style={{ paddingBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-dim)', wordBreak: 'break-word' }}>
        {value}
      </td>
    </tr>
  );
}

export default function ImpressumPage() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <TypewriterH1 style={{ marginBottom: '0.5rem' }}>Impressum</TypewriterH1>
        <p style={{ marginBottom: '3rem', fontSize: '0.875rem' }}>Angaben gemäß § 5 TMG</p>

        {/* Anbieter */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
            Anbieter
          </h2>
          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <Row label="Inhaber" value={FIRMA.inhaber} />
              <Row label="Handelsname" value={FIRMA.marke} />
              <Row label="Rechtsform" value={FIRMA.rechtsform} />
              <Row label="Adresse" value={`${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}`} />
              <Row label="Bundesland" value={`${FIRMA.bundesland}, ${FIRMA.land}`} />
            </tbody>
          </table>
        </section>

        {/* Kontakt */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
            Kontakt
          </h2>
          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <Row label="E-Mail" value={FIRMA.email} />
              <Row label="Telefon" value={FIRMA.telefon} />
            </tbody>
          </table>
        </section>

        {/* Steuer */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
            Steuerliche Angaben
          </h2>
          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <Row label="USt-IdNr." value={FIRMA.ust_id} />
              <Row label="Steuernummer" value={FIRMA.steuernummer} />
              <Row label="Besteuerung" value={FIRMA.besteuerung} />
              <Row label="Gewerbeamt" value={FIRMA.gewerbeamt} />
            </tbody>
          </table>
        </section>

        {/* Verantwortlicher */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
            Verantwortlicher gemäß § 18 Abs. 2 MStV
          </h2>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            {FIRMA.verantwortlich_mstv}<br />
            {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort}
          </p>
        </section>

        {/* Haftungsausschluss */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>
            Haftung für Inhalte
          </h2>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach
            den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
            jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
            oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>
            Haftung für Links
          </h2>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss
            haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die
            Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
            verantwortlich.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>
            Urheberrecht
          </h2>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
            deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
            jeweiligen Autors bzw. Erstellers.
          </p>
        </section>
      </div>
    </div>
  );
}
