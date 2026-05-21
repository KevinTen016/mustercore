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
