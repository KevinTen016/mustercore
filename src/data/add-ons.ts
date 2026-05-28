// ============================================================
// ADD-ONS — alle Preise netto (zzgl. 19 % USt)
// ============================================================

export type AddOnBilling = 'monatlich' | 'einmalig';

export interface AddOn {
  id: string;
  name: string;
  note?: string;
  price: number;
  billing: AddOnBilling;
}

export interface SeoService {
  priceFrom: number;       // Einstiegspreis netto, monatlich
  tagline: string;
  included: string[];      // Was ist immer enthalten
  pricingFactors: { label: string; desc: string }[];  // Wovon hängt der Preis ab
}

export const ADD_ONS: AddOn[] = [
  { id: 'extra-meister',   name: 'Zusätzlicher Meister (über Paketlimit)', price: 5,   billing: 'monatlich' },
  { id: 'extra-standort',  name: 'Zusätzlicher Standort',                  price: 49,  billing: 'monatlich' },
  { id: 'sms-200',         name: 'SMS-Paket (200 SMS)',                     price: 15,  billing: 'monatlich' },
  { id: 'whatsapp-api',    name: 'WhatsApp Business API für Kundenkontakt', price: 29,  billing: 'monatlich', note: 'Eigener WhatsApp-Business-Account beim Salon erforderlich' },
  { id: 'newsletter',      name: 'Newsletter (Mailchimp, DSGVO-konform)',   price: 19,  billing: 'monatlich' },
  { id: 'domain-transfer', name: 'Bestehende Domain übertragen',            price: 49,  billing: 'einmalig' },
  { id: 'foto-shooting',   name: 'Profifoto-Shooting Ihres Salons (Braunschweig)', price: 199, billing: 'einmalig' },
  { id: 'design-extra',    name: 'Designanpassung (außer Jahreskontingent)', price: 79, billing: 'einmalig' },
  { id: 'support-eilfall', name: 'Notfall-Support außerhalb Geschäftszeiten', price: 49, billing: 'einmalig', note: 'Pro Vorfall' },
  { id: 'logo',            name: 'Logo / Anpassung des Corporate Designs',  price: 99,  billing: 'einmalig' },
];

export const SEO_SERVICE: SeoService = {
  priceFrom: 399,
  tagline: 'Lokale Sichtbarkeit — kontinuierlich, messbar, ohne Agenturaufwand.',
  included: [
    'Keyword-Recherche (lokal + branchenspezifisch)',
    'On-Page Optimierung (Title, Meta, Headings, Bilder)',
    'Google Business Profile — aktive Pflege (Posts, Fotos, Q&A)',
    'Technisches SEO-Audit + Fehlerbehebung',
    'Aufbau lokaler Verlinkungen & Einträge (Branchenbücher, NAP)',
    '1–2 SEO-Artikel / Ratgeber pro Monat',
    'Monatlicher Report: Rankings, Klicks, Impressionen',
  ],
  pricingFactors: [
    {
      label: 'Wettbewerb im Ort',
      desc: 'Ein Friseursalon in einer Kleinstadt kostet weniger als eine Zahnarztpraxis in einer Großstadt — der Aufwand, Seite 1 zu erreichen, variiert stark.',
    },
    {
      label: 'Anzahl der Zielseiten',
      desc: 'Wer 3 Dienstleistungsseiten ranken lassen möchte, zahlt weniger als wer 10 Seiten + Blog optimiert haben möchte.',
    },
    {
      label: 'Content-Erstellung',
      desc: 'Reine technische Optimierung ist günstiger. Wenn Ratgeber-Artikel oder Servicetexte erstellt werden sollen, erhöht sich der Preis.',
    },
    {
      label: 'Anzahl der Standorte',
      desc: 'Jeder Standort braucht eigene lokale Optimierung — Google Business, Einträge, ggf. eigene Unterseite.',
    },
  ],
};
