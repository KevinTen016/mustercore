// ============================================================
// FIRMENDATEN — vor Veröffentlichung VOLLSTÄNDIG ausfüllen!
// TODO: Alle [PLATZHALTER] durch reale Daten ersetzen,
//       danach Anwalt Impressum + Datenschutz prüfen lassen.
// ============================================================

export const FIRMA = {
  marke:            'WebCore',
  rechtsform:       'Einzelunternehmen',
  inhaber:          '[Nachname, Vorname]',           // TODO
  strasse:          '[Straße und Hausnummer]',        // TODO
  plz:              '[PLZ]',                          // TODO
  ort:              'Braunschweig',
  bundesland:       'Niedersachsen',
  land:             'Deutschland',
  email:            '[email@webcore.de]',             // TODO
  emailKontakt:     '[kontakt@webcore.de]',           // TODO
  telefon:          '[+49 ...]',                      // TODO
  ust_id:           '[DE-Nummer nach Anmeldung]',     // TODO — nach ELSTER-Fragebogen
  steuernummer:     '[Steuernummer]',                 // TODO — nach ELSTER-Fragebogen
  gewerbeamt:       'Stadt Braunschweig',
  besteuerung:      'Regelbesteuerung',               // Nicht Kleinunternehmer
  ustSatz:          19,                               // %
  verantwortlich_mstv: '[Name — §18 MStV]',          // TODO
  gruendungsjahr:   2025,
  // Hosting-Provider (EU, für Datenschutzerklärung)
  hoster:           '[z.B. Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen]', // TODO
} as const;

export type Firma = typeof FIRMA;
