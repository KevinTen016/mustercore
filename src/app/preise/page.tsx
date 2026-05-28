import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { PLANS } from '@/data/pricing';
import { ADD_ONS, SEO_SERVICE } from '@/data/add-ons';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Preise — MusterCore BASIS, STANDARD, PREMIUM',
  description:
    'Transparente Preise für MusterCore: BASIS ab 99 €/Monat, STANDARD ab 129 €, PREMIUM ab 199 €. Alle Beträge netto zzgl. 19 % USt.',
  path: '/preise',
});

export default function PreisePage() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
            Transparente Preise
          </p>
          <TypewriterH1 style={{ marginBottom: '0.75rem' }}>
            Drei Pakete. Keine versteckten Kosten.
          </TypewriterH1>
          <p style={{ margin: '0 auto' }}>
            Alle Preise netto, zzgl. 19&nbsp;% USt. Monatlich kündbar nach 3 Monaten Mindestlaufzeit.
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
          {PLANS.map(plan => (
            <div
              key={plan.id}
              style={{
                position: 'relative',
                background: plan.recommended ? 'var(--bg-card-2)' : 'var(--bg-card)',
                border: plan.recommended ? '1px solid var(--accent)' : '1px solid var(--line)',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {plan.recommended && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>
                  <span style={{ background: 'var(--accent)', color: 'var(--bg)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.3rem 0.9rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                    Empfohlen
                  </span>
                </div>
              )}

              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                {plan.name}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.5 }}>
                {plan.tagline}
              </p>

              <div style={{ marginBlock: '0.25rem' }}>
                <span style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '-0.03em' }}>
                  {plan.price}&nbsp;€
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>&nbsp;/ Monat</span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '0.2rem' }}>
                  zzgl. 19&nbsp;% USt · Setup einmalig {plan.setupFee}&nbsp;€
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', paddingBottom: '0.75rem', borderBottom: '1px solid var(--line)' }}>
                {plan.targetCustomer}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
                {plan.features.map((feat, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      fontSize: '0.83rem',
                      color: feat.included ? 'var(--text-dim)' : 'var(--text-sub)',
                      lineHeight: 1.45,
                    }}
                  >
                    <span style={{ flexShrink: 0, marginTop: '0.1em', color: feat.included ? 'var(--green)' : 'var(--text-sub)' }}>
                      {feat.included ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="1 7 5 11 13 3" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <line x1="3" y1="7" x2="11" y2="7" />
                        </svg>
                      )}
                    </span>
                    <span>{feat.text}{feat.note && <em style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-sub)' }}>{feat.note}</em>}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginBottom: '0.75rem' }}>
                  Support: {plan.support}
                </div>
                {plan.recommended ? (
                  <Link href="/demo" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Demo anfragen
                  </Link>
                ) : (
                  <Link href="/demo" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    Demo anfragen
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Feature comparison note */}
        <div style={{ marginBottom: '4rem', padding: '1.5rem 2rem', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
              Sie sind sich unsicher, welches Paket passt?
            </p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              Im Demo-Gespräch empfehlen wir das richtige Paket für Ihren Betrieb.
            </p>
          </div>
          <Link href="/demo" className="btn btn-primary" style={{ flexShrink: 0 }}>
            Kostenloses Demo anfragen
          </Link>
        </div>

        {/* Add-Ons */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '0.5rem', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
            Add-ons & Extras
          </h2>
          <p style={{ marginBottom: '2rem' }}>
            Optionale Erweiterungen, die Sie zu jedem Zeitpunkt dazu buchen können.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {ADD_ONS.map(addon => (
              <div
                key={addon.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.2rem' }}>
                    {addon.name}
                  </div>
                  {addon.note && (
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-sub)', lineHeight: 1.4 }}>{addon.note}</div>
                  )}
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                    {addon.price}&nbsp;€
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-sub)' }}>{addon.billing}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-sub)' }}>
            Alle Preise netto zzgl. 19&nbsp;% USt.
          </p>
        </div>

        {/* SEO-Service */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '0.5rem', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
            Managed SEO
          </h2>
          <p style={{ marginBottom: '2rem' }}>
            Lokale Suchmaschinenoptimierung als monatlicher Service — kein Einmal-Projekt, sondern kontinuierliche Arbeit mit messbaren Ergebnissen.
          </p>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.4rem' }}>
                  SEO-Service
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: 0, maxWidth: '52ch' }}>
                  {SEO_SERVICE.tagline}
                </p>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)', marginBottom: '0.15rem' }}>ab</div>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {SEO_SERVICE.priceFrom}&nbsp;€
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', marginTop: '0.2rem' }}>/ Monat · netto</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 0 }}>
              {/* Leistungsumfang */}
              <div style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)', borderRight: '1px solid var(--line)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '1rem' }}>
                  Was enthalten ist
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {SEO_SERVICE.included.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', fontSize: '0.855rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: '0.15em', color: 'var(--green)' }}>
                        <polyline points="1 7 5 11 13 3" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preisfaktoren */}
              <div style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '1rem' }}>
                  Wovon der Preis abhängt
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {SEO_SERVICE.pricingFactors.map((f, i) => (
                    <div key={i}>
                      <div style={{ fontSize: '0.855rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem' }}>
                        {f.label}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.55 }}>
                        {f.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{ padding: '1.25rem clamp(1.25rem, 3vw, 1.75rem)', borderTop: '1px solid var(--line)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '0.845rem', color: 'var(--text-sub)', margin: 0 }}>
                Exaktes Angebot nach einem kurzen Gespräch — keine Pauschalen ohne Analyse.
              </p>
              <Link href="/demo" className="btn btn-primary" style={{ flexShrink: 0 }}>
                SEO-Gespräch anfragen
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ teaser */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
              Fragen zu Laufzeit, Kündigung oder DSGVO?
            </p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              In unserem FAQ finden Sie Antworten auf alle häufigen Fragen.
            </p>
          </div>
          <Link href="/faq" className="btn btn-secondary" style={{ flexShrink: 0 }}>
            Zum FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
