import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { FIRMA } from '@/data/firma';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Über MusterCore',
  description:
    'MusterCore ist ein Einzelunternehmen aus Braunschweig. Wir entwickeln und betreiben Websites mit Online-Buchung für lokale Unternehmen in Deutschland.',
  path: '/ueber-uns',
});

const WERTE = [
  {
    title: 'Kein Lock-in',
    desc: 'Ihre Daten gehören Ihnen. Jederzeit vollständiger Export, keine Abhängigkeiten — auch nach einer Kündigung.',
  },
  {
    title: 'EU-Standard',
    desc: 'Entwickelt für das deutsche Regelwerk: DSGVO, TTDSG, Impressumspflicht. Kein Beiwerk, sondern Grundlage.',
  },
  {
    title: 'Ehrliche Preise',
    desc: 'Drei Pakete, transparent und monatlich kündbar. Keine versteckten Kosten, keine Knebelverträge.',
  },
  {
    title: 'Direkter Kontakt',
    desc: 'Sie sprechen immer mit einer Person, die Ihr Setup kennt — kein Ticket-System, kein Outsourcing.',
  },
];

export default function UeberUnsPage() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
          Über uns
        </p>
        <TypewriterH1 style={{ marginBottom: '0.75rem' }}>
          MusterCore — aus Braunschweig, für lokale Betriebe.
        </TypewriterH1>
        <p style={{ maxWidth: '60ch', marginBottom: '3rem', fontSize: '1.05rem' }}>
          MusterCore ist ein Einzelunternehmen aus {FIRMA.ort}, {FIRMA.bundesland}. Wir entwickeln
          und betreiben Websites mit Online-Buchungssystem und Admin-Panel für lokale
          Dienstleister in Deutschland.
        </p>

        {/* Story */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', padding: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)', marginBottom: '1rem' }}>
            Warum MusterCore?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Lokale Betriebe — Friseursalons, Arztpraxen, Werkstätten — haben spezifische Anforderungen,
              die Baukastensysteme wie Jimdo oder Wix nicht erfüllen: echte Online-Buchung mit Kalenderanbindung,
              Mitarbeiterverwaltung, DSGVO-konforme Datenhaltung in der EU.
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Agenturen lösen das Problem — aber zu Agenturpreisen und mit Agenturverträgen. Wer nicht
              2.000–5.000 € für eine Einrichtung ausgeben möchte und trotzdem nicht auf halbfertige
              Vorlagen verzichten will, blieb bisher ohne gute Option.
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              MusterCore schließt diese Lücke: ein vollständiges System als monatliches Abonnement,
              eingerichtet in einer Woche, betrieben und aktuell gehalten von uns — damit Sie sich auf
              Ihren Betrieb konzentrieren können.
            </p>
          </div>
        </div>

        {/* Werte */}
        <h2 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)', marginBottom: '1.25rem' }}>
          Was uns ausmacht
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {WERTE.map(w => (
            <div
              key={w.title}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
              }}
            >
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text)' }}>
                {w.title}
              </h3>
              <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.62 }}>
                {w.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Daten */}
        <div style={{ padding: '1.5rem 2rem', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {[
            { label: 'Gegründet', value: String(FIRMA.gruendungsjahr) },
            { label: 'Standort', value: `${FIRMA.ort}, ${FIRMA.bundesland}` },
            { label: 'Rechtsform', value: FIRMA.rechtsform },
            { label: 'Hosting', value: 'Deutschland, EU' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.25rem' }}>
                {item.label}
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1.25rem' }}>
            Lernen Sie uns in einem 20-minütigen Demo-Gespräch kennen — unverbindlich.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/demo" className="btn btn-primary btn-lg">Demo anfragen</Link>
            <Link href="/kontakt" className="btn btn-secondary btn-lg">Kontakt aufnehmen</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
