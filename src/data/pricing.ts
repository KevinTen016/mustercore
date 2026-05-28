// ============================================================
// PREISE — Single Source of Truth
// Alle Preise NETTO (zzgl. 19 % USt) — Regelbesteuerung
// Änderung hier → wirkt auf /preise UND Teaser auf Startseite
// ============================================================

export type PlanId = 'basis' | 'standard' | 'premium';

export interface Feature {
  text: string;
  included: boolean;
  note?: string;
}

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  price: number;           // monatlich, netto
  setupFee: number;        // einmalig, netto
  recommended: boolean;
  maxMeister: number | 'unbegrenzt';
  features: Feature[];
  support: string;
  targetCustomer: string;
}

export const PLANS: Plan[] = [
  {
    id: 'basis',
    name: 'WebCore BASIS',
    tagline: 'Schnell online. Alles Wichtige inklusive.',
    price: 99,
    setupFee: 199,
    recommended: false,
    maxMeister: 2,
    targetCustomer: 'Kleiner Betrieb mit 1–2 Mitarbeiter/innen, der unkompliziert starten möchte.',
    support: 'E-Mail, Reaktion innerhalb 48 Wertstunden',
    features: [
      { text: 'Professionelle Website auf Vorlage', included: true },
      { text: 'Subdomain betrieb.webcore.de', included: true },
      { text: 'Online-Buchung mit Kalender', included: true },
      { text: 'Admin-Panel (Buchungen, Preisliste, Urlaub, Mitarbeiter, Statistik)', included: true },
      { text: 'E-Mail-Bestätigung + Erinnerung 24 h vorher', included: true },
      { text: 'Datenexport für die Buchhaltung (CSV/Excel)', included: true },
      { text: 'DSGVO-Paket (Impressum, Datenschutz, Cookie-Banner, AV-Vertrag)', included: true },
      { text: 'HTTPS + tägliche Backups (30 Tage, EU-Hosting)', included: true },
      { text: 'Bis zu 2 Mitarbeiter im Admin-Panel', included: true },
      { text: 'Eigener Domain-Name', included: false },
      { text: 'Telegram-Benachrichtigungen', included: false },
      { text: 'Google Business Profile Einrichtung', included: false },
      { text: 'Basis-SEO (Title, Meta, Sitemap)', included: false },
      { text: 'SMS-Erinnerungen', included: false },
      { text: 'Erweiterte Statistik', included: false },
    ],
  },
  {
    id: 'standard',
    name: 'WebCore STANDARD',
    tagline: 'Professionell wachsen. Mit allem, was zählt.',
    price: 129,
    setupFee: 299,
    recommended: true,
    maxMeister: 5,
    targetCustomer: 'Betrieb mit 3–5 Mitarbeiter/innen, der online sichtbar und gut aufgestellt sein möchte.',
    support: 'E-Mail + WhatsApp/Telegram, Reaktion innerhalb 24 Wertstunden',
    features: [
      { text: 'Alles aus BASIS', included: true },
      { text: 'Eigener Domain-Name (Registrierung + Verlängerung inklusive)', included: true },
      { text: 'Telegram-Benachrichtigungen für Betrieb (Mitarbeiter + Inhaber)', included: true },
      { text: 'Bis zu 5 Mitarbeiter im Admin-Panel', included: true },
      { text: 'Google Business Profile Einrichtung (einmalig beim Onboarding)', included: true },
      { text: 'Basis-SEO (Title, Meta, Sitemap, schema.org LocalBusiness)', included: true },
      { text: '1 Designanpassung pro Jahr (Farbpalette, Schrift, Fotos)', included: true },
      { text: 'SMS-Erinnerungen', included: false },
      { text: 'Unbegrenzt Mitarbeiter', included: false },
      { text: 'Erweiterte Statistik', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'WebCore PREMIUM',
    tagline: 'Alles inklusive. Für Betriebe, die keine Kompromisse machen.',
    price: 199,
    setupFee: 599,
    recommended: false,
    maxMeister: 'unbegrenzt',
    targetCustomer: 'Etablierter Betrieb mit mehreren Mitarbeiter/innen, hohem Buchungsvolumen oder mehreren Standorten.',
    support: 'Persönlicher Ansprechpartner · Reaktion innerhalb 4 h · Telefon auch am Wochenende bei Ausfall',
    features: [
      { text: 'Alles aus STANDARD', included: true },
      { text: 'Unbegrenzt Mitarbeiter im Admin-Panel', included: true },
      { text: 'SMS-Erinnerungen für Kunden (200 SMS/Monat inklusive)', included: true },
      { text: 'WhatsApp Business API inklusive — kein Add-on', included: true },
      { text: 'Online-Vorauszahlung / Anzahlung bei der Buchung', included: true },
      { text: 'Gutschein-Verkauf direkt auf Ihrer Website', included: true },
      { text: 'Bis zu 2 Standorte inklusive', included: true },
      { text: 'Vollständig individuelles Design (kein Template — nach Ihrem Briefing)', included: true },
      { text: 'Bewertungsblock (Google Reviews oder Trustpilot)', included: true },
      { text: 'Erweiterte Statistik (Auslastung, No-Show, MoM, Mitarbeiter-Dynamik)', included: true },
      { text: 'Monatliches Strategie-Gespräch (30 Min. — Buchungen, SEO, Wachstum)', included: true },
      { text: 'Persönlicher Ansprechpartner — kein Ticket-System', included: true },
    ],
  },
];

export const UST_SATZ = 19; // %

export function formatPrice(netto: number, showUSt = false): string {
  const str = `${netto} €`;
  if (showUSt) return `${str} zzgl. ${UST_SATZ} % USt`;
  return str;
}
