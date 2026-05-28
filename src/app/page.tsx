import Link from 'next/link';
import type { Metadata } from 'next';
import { PLANS } from '@/data/pricing';
import { BRANCHEN } from '@/data/branchen';
import { buildMetadata } from '@/lib/seo';
import { HeroBlobWidget } from '@/components/ui/HeroBlobWidget';
import { HeroTypewriter } from '@/components/ui/HeroTypewriter';
import s from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'MusterCore',
  description:
    'MusterCore gibt lokalen Unternehmen — Friseursalons, Praxen, Werkstätten — eine professionelle Website mit Online-Buchung und eigenem Admin-Panel. DSGVO-konform, EU-Hosting, aus Braunschweig.',
  path: '/',
});

const FAQ_ITEMS = [
  {
    q: 'Wie schnell bin ich online?',
    a: 'Nach Vertragsabschluss richten wir Ihre Website und das Admin-Panel in der Regel innerhalb von 5–7 Werktagen ein. Sie erhalten Zugangsdaten und eine persönliche Einführung per Video-Call.',
  },
  {
    q: 'Wie funktioniert die Kündigung?',
    a: 'Die Mindestlaufzeit beträgt 3 Monate. Danach monatlich kündbar mit 4 Wochen Frist. Nach Kündigung erhalten Sie einen vollständigen Datenexport und noch 30 Tage Zugang.',
  },
  {
    q: 'Sind meine Daten sicher?',
    a: 'Alle Daten werden ausschließlich in der EU gehostet (Rechenzentrum in Deutschland). Jeder Kunde erhält einen eigenen, isolierten Container. Ein AV-Vertrag nach Art. 28 DSGVO ist im Paket enthalten.',
  },
  {
    q: 'Was bedeutet „Datenexport für die Buchhaltung"?',
    a: 'Sie können alle Buchungen als CSV oder Excel exportieren und diese Datei Ihrem Steuerberater übergeben. Es handelt sich nicht um ein TSE-zertifiziertes Kassensystem.',
  },
  {
    q: 'Kann ich das Paket später wechseln?',
    a: 'Upgrades sind jederzeit möglich und werden zum nächsten Monatsanfang aktiviert. Downgrades werden zum Ende der Mindestlaufzeit wirksam.',
  },
];

const BRANCHEN_ICONS: Record<string, string> = {
  friseur: '✂', praxis: '⊕', autowerkstatt: '⚙',
  physiotherapie: '◎', fitness: '◈', tattoo: '◇',
};

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className={s.hero} aria-labelledby="hero-h1">
        <div className="container">
          <div className={s.heroInner}>
            <div className={s.heroText}>
              <div className={s.heroEyebrow}>
                <span className={s.heroDot} aria-hidden="true" />
                Für lokale Unternehmen in Deutschland
              </div>

              <HeroTypewriter className={s.heroH1} accentClass={s.heroAccent} />

              <p className={s.heroSub}>
                MusterCore gibt Ihrem Salon, Ihrer Praxis oder Werkstatt eine professionelle
                Online-Präsenz mit eingebautem Buchungssystem — eingerichtet in einer Woche,
                ohne Agentur-Aufwand, mit voller DSGVO-Sicherheit.
              </p>

              <div className={s.heroCtas}>
                <Link href="/demo" className="btn btn-primary btn-lg">
                  Demo anfragen — kostenlos
                </Link>
                <Link href="/preise" className="btn btn-secondary btn-lg">
                  Preise ansehen
                </Link>
              </div>

              <div className={s.heroTrust} role="list">
                {['EU-Hosting', 'DSGVO-konform', 'Aus Braunschweig', 'Kein Lock-in'].map(item => (
                  <div key={item} className={s.heroTrustItem} role="listitem">
                    <svg className={s.heroTrustIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="2 8 6 12 14 4"/>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Blob Widget */}
            <div className={s.heroVisual}>
              <HeroBlobWidget />
            </div>
          </div>
        </div>
      </section>

      {/* ─── WIE ES FUNKTIONIERT ─── */}
      <section className={`section ${s.howSection}`} aria-labelledby="how-h2">
        <div className="container">
          <div className={s.sectionHead}>
            <span className={s.sectionEye}>Einfacher Einstieg</span>
            <h2 className={s.sectionH2} id="how-h2">Von Null auf Online in einer Woche</h2>
            <p className={s.sectionLead}>
              Wir übernehmen den technischen Teil. Sie konzentrieren sich auf Ihr Geschäft.
            </p>
          </div>

          <div className={s.howGrid}>
            {[
              { n: '01', t: 'Demo-Gespräch', d: 'Wir zeigen Ihnen das Admin-Panel live — ohne Vorbereitung, ohne Verkaufsdruck. 20 Minuten reichen.' },
              { n: '02', t: 'Setup & Launch', d: 'Wir richten Ihre Website, den Buchungskalender und alle Benachrichtigungen ein. In 5–7 Werktagen sind Sie online.' },
              { n: '03', t: 'Sie behalten die Kontrolle', d: 'Termine, Preisliste, Mitarbeiter, Statistik — alles über das Admin-Panel in Ihrem Browser. Kein technisches Wissen nötig.' },
              { n: '04', t: 'Wir bleiben dabei', d: 'Hosting, Backups, Updates, Sicherheit — das läuft im Hintergrund. Bei Fragen haben Sie einen direkten Ansprechpartner.' },
            ].map(step => (
              <div key={step.n} className={s.howStep}>
                <div className={s.howNum} aria-hidden="true">{step.n}</div>
                <h3 className={s.howTitle}>{step.t}</h3>
                <p className={s.howDesc}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WAS SIE BEKOMMEN ─── */}
      <section className={`section ${s.featSection}`} aria-labelledby="feat-h2">
        <div className="container">
          <div className={s.sectionHead}>
            <span className={s.sectionEye}>Leistungsumfang</span>
            <h2 className={s.sectionH2} id="feat-h2">Was Sie bekommen</h2>
            <p className={s.sectionLead}>
              Drei Bereiche, die zusammenspielen — und die Sie nach dem ersten Monat nicht mehr missen wollen.
            </p>
          </div>

          <div className={s.featGrid}>
            <div className={s.featCard}>
              <div className={s.featNum} aria-hidden="true">01</div>
              <h3 className={s.featTitle}>Mehr Termine</h3>
              <p className={s.featDesc}>Kunden buchen online — rund um die Uhr, auch wenn Sie im Gespräch oder in der Pause sind.</p>
              <ul className={s.featList} role="list">
                {[
                  'Online-Buchungsseite — keine App nötig',
                  'E-Mail-Bestätigung & Erinnerung 24 h vorher',
                  'Telegram-Benachrichtigung für Sie (ab STANDARD)',
                  'Google Business Profile Einrichtung (ab STANDARD)',
                ].map(f => (
                  <li key={f} className={s.featItem}>
                    <span className={s.featCheck} aria-hidden="true">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className={s.featCard}>
              <div className={s.featNum} aria-hidden="true">02</div>
              <h3 className={s.featTitle}>Weniger Aufwand</h3>
              <p className={s.featDesc}>Das Admin-Panel gibt Ihnen Überblick, ohne Zeit zu kosten.</p>
              <ul className={s.featList} role="list">
                {[
                  'Terminübersicht für alle Mitarbeiter',
                  'Preisliste direkt im Browser bearbeiten',
                  'Statistik: Auslastung, Umsatz, No-Show',
                  'Datenexport für die Buchhaltung (CSV/Excel)',
                ].map(f => (
                  <li key={f} className={s.featItem}>
                    <span className={s.featCheck} aria-hidden="true">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className={s.featCard}>
              <div className={s.featNum} aria-hidden="true">03</div>
              <h3 className={s.featTitle}>Rechtlich abgesichert</h3>
              <p className={s.featDesc}>DSGVO von Anfang an — nicht als Nachgedanke, sondern als Grundlage.</p>
              <ul className={s.featList} role="list">
                {[
                  'Impressum & Datenschutzerklärung inklusive',
                  'Cookie-Banner mit echtem Auswahlrecht (TTDSG)',
                  'AV-Vertrag nach Art. 28 DSGVO',
                  'EU-Hosting, tägliche Backups (30 Tage)',
                ].map(f => (
                  <li key={f} className={s.featItem}>
                    <span className={s.featCheck} aria-hidden="true">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BRANCHEN ─── */}
      <section className={`section ${s.branchenSection}`} aria-labelledby="branchen-h2">
        <div className="container">
          <div className={s.sectionHead}>
            <span className={s.sectionEye}>Für wen</span>
            <h2 className={s.sectionH2} id="branchen-h2">Für welche Branchen</h2>
            <p className={s.sectionLead}>
              MusterCore wurde für lokale Dienstleister entwickelt, die Termine vergeben und verwalten.
            </p>
          </div>

          <div className={s.branchenGrid}>
            {BRANCHEN.map(b => (
              <Link key={b.slug} href={`/branchen/${b.slug}`} className={s.brancheCard}>
                <div className={s.brancheIcon} aria-hidden="true">{BRANCHEN_ICONS[b.slug]}</div>
                <div className={s.brancheName}>{b.name}</div>
                <p className={s.brancheTeaser}>{b.teaser}</p>
                <div className={s.brancheArrow}>
                  Mehr erfahren
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                    <path d="M2 6h8M6 2l4 4-4 4"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PREISE TEASER ─── */}
      <section className={`section ${s.preiseSection}`} aria-labelledby="preise-h2">
        <div className="container">
          <div className={s.sectionHead}>
            <span className={s.sectionEye}>Transparente Preise</span>
            <h2 className={s.sectionH2} id="preise-h2">Drei Pakete. Keine versteckten Kosten.</h2>
            <p className={s.sectionLead}>
              Alle Preise netto, zzgl. 19&nbsp;% USt. Monatlich kündbar nach 3 Monaten Mindestlaufzeit.
            </p>
          </div>

          <div className={s.preiseGrid}>
            {PLANS.map(plan => (
              <div key={plan.id} className={`${s.preiseCard}${plan.recommended ? ` ${s.recommended}` : ''}`}>
                {plan.recommended && <span className={s.empfohlenBadge}>Empfohlen</span>}

                <div className={s.preiseName}>{plan.name}</div>
                <p className={s.preiseTagline}>{plan.tagline}</p>

                <div className={s.preiseAmount}>
                  <span className={s.preiseBig}>{plan.price} €</span>
                  <span className={s.preisePer}>/&nbsp;Monat</span>
                </div>
                <div className={s.preiseUSt}>zzgl. 19&nbsp;% USt</div>
                <div className={s.preiseSetup}>Einmalig: Setup {plan.setupFee}&nbsp;€ zzgl. USt</div>

                {plan.recommended ? (
                  <Link href="/demo" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Demo anfragen
                  </Link>
                ) : (
                  <Link href="/preise" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    Details ansehen
                  </Link>
                )}

                <Link href="/preise" className={s.preiseLink}>
                  Vollständiger Vergleich →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WARUM MUSTERCORE ─── */}
      <section className={`section ${s.warumSection}`} aria-labelledby="warum-h2">
        <div className="container">
          <div className={s.warumGrid}>
            <div className={s.warumText}>
              <span className={s.sectionEye} style={{ display: 'block', marginBottom: '0.75rem' }}>Warum MusterCore</span>
              <h2 className={s.sectionH2} id="warum-h2">Kein Baukastenweg. Kein Agentur-Vertrag.</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-dim)', lineHeight: 1.72, maxWidth: '52ch', marginTop: '0.75rem' }}>
                MusterCore ist ein Abonnement-Produkt für lokale Dienstleister —
                mit echter Buchungssoftware, klarer Datentrennung und einem direkten Ansprechpartner.
              </p>

              <div className={s.warumList}>
                {[
                  { title: 'Kein Lock-in', desc: 'Sie können jederzeit alle Ihre Daten exportieren. Kein Vendor-Lock, keine versteckten Abhängigkeiten.' },
                  { title: 'Eigener Container pro Kunde', desc: 'Jeder Kunde bekommt eine eigene Serverinstanz — Ihre Daten bleiben immer isoliert.' },
                  { title: 'Deutsches Recht, deutscher Standard', desc: 'Entwickelt für das deutsche Regelwerk: DSGVO, TTDSG, Impressumspflicht — kein Beiwerk, sondern Grundlage.' },
                  { title: 'Direkter Ansprechpartner', desc: 'Kein Ticket-System, kein Outsourcing. Eine Kontaktperson, die Ihr Setup kennt.' },
                ].map(item => (
                  <div key={item.title} className={s.warumItem}>
                    <div className={s.warumItemText}>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={s.warumVisual} aria-hidden="true">
              <div className={s.warumVisualTitle}>Direktvergleich</div>
              {[
                { left: 'Jimdo / Wix / Squarespace', right: 'Echtes Buchungssystem' },
                { left: 'Shared Hosting', right: 'Eigener Container' },
                { left: 'Agentur-Vertrag', right: 'Monatlich kündbar' },
                { left: 'Google-CDN Fonts', right: 'EU-konformes Hosting' },
                { left: 'Kein eigenes Admin-Panel', right: 'Volle Selbstverwaltung' },
              ].map(row => (
                <div key={row.left} className={s.warumCompareRow}>
                  <span className={s.warumCompLeft}>{row.left}</span>
                  <span className={s.warumCompVs}>vs.</span>
                  <span className={s.warumCompRight}>{row.right}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ TEASER ─── */}
      <section className={`section ${s.faqSection}`} aria-labelledby="faq-h2">
        <div className="container">
          <div className={s.sectionHead}>
            <span className={s.sectionEye}>Häufige Fragen</span>
            <h2 className={s.sectionH2} id="faq-h2">Was andere gefragt haben</h2>
          </div>

          <div className={s.faqList}>
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>

          <div className={s.faqMore}>
            <Link href="/faq" className="btn btn-secondary">
              Alle Fragen ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className={`section ${s.ctaSection}`} aria-labelledby="cta-h2">
        <div className="container">
          <div className={s.ctaInner}>
            <div className={s.ctaEye}>Jetzt starten</div>
            <h2 className={s.ctaH2} id="cta-h2">
              20 Minuten.<br />Kein Verkaufsdruck.
            </h2>
            <p className={s.ctaSub}>
              Wir zeigen Ihnen, wie das Admin-Panel in Ihrem Alltag aussieht —
              und ob MusterCore wirklich zu Ihrem Betrieb passt.
            </p>

            <div className={s.ctaButtons}>
              <Link href="/demo" className="btn btn-primary btn-lg">
                Demo anfragen — kostenlos
              </Link>
              <Link href="/preise" className="btn btn-secondary btn-lg">
                Preise ansehen
              </Link>
            </div>

            <div className={s.ctaTrust}>
              {['Keine Vorauszahlung', 'Kein Vertriebsdruck', 'Braunschweig & Remote'].map(t => (
                <span key={t} className={s.ctaTrustItem}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="1 6 4.5 9.5 11 3"/>
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className={s.faqItem}>
      <summary className={s.faqQ} style={{ listStyle: 'none', cursor: 'pointer' }}>
        {q}
        <svg className={s.faqChevron} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M4 6l4 4 4-4"/>
        </svg>
      </summary>
      <p className={s.faqA}>{a}</p>
    </details>
  );
}
