export interface Branche {
  slug: string;
  name: string;
  namePlural: string;
  icon: string;           // inline SVG path data
  teaser: string;         // 1 Satz für Branchen-Grid auf Startseite
  heroLine: string;       // Headline auf Branchen-Unterseite
  painPoints: string[];   // Was nervt? (3–4 Punkte)
  gains: string[];        // Was bringt MusterCore? (3–4 Punkte)
  cta: string;
}

export const BRANCHEN: Branche[] = [
  {
    slug: 'friseur',
    name: 'Friseursalon',
    namePlural: 'Friseursalons',
    icon: 'M8 2a4 4 0 1 1 0 8A4 4 0 0 1 8 2zm0 10c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z',
    teaser: 'Online-Buchung, die Ihre Stammkunden begeistert — und Neukunden überzeugt.',
    heroLine: 'Ihr Salon. Immer ausgebucht.',
    painPoints: [
      'Telefon klingelt während Sie schneiden',
      'Keine Übersicht über freie Termine aller Meister',
      'Kunden erscheinen nicht — kein System für Erinnerungen',
      'Preise manuell aktualisieren ist zeitraubend',
    ],
    gains: [
      'Kunden buchen online, rund um die Uhr',
      'Automatische Erinnerung reduziert No-Shows',
      'Übersicht aller Meister und Termine in der Admin-Panel',
      'Preisliste in Sekunden aktualisiert',
    ],
    cta: 'Friseursalon-Demo ansehen',
  },
  {
    slug: 'praxis',
    name: 'Arztpraxis',
    namePlural: 'Arztpraxen',
    icon: 'M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm1 10H7V7h2v4zm0-6H7V3h2v2z',
    teaser: 'Terminbuchung DSGVO-konform — für Praxen, die Vertrauen zählen.',
    heroLine: 'Mehr Zeit für Patienten, weniger Zeit am Telefon.',
    painPoints: [
      'Telefonische Terminvergabe bindet Helferinnen stundenlang',
      'Keine Erinnerungen für Patienten — Ausfälle kosten Geld',
      'Bestehende Software zu komplex für den Alltag',
      'Datenschutz unklar bei externen Buchungslösungen',
    ],
    gains: [
      'Patienten buchen online, auch nach Sprechstunde',
      'DSGVO-konform: EU-Hosting, AV-Vertrag inklusive',
      'Einfaches Admin-Panel — keine Schulung notwendig',
      'E-Mail-Erinnerungen reduzieren Ausfälle',
    ],
    cta: 'Praxis-Demo ansehen',
  },
  {
    slug: 'autowerkstatt',
    name: 'Autowerkstatt',
    namePlural: 'Autowerkstätten',
    icon: 'M14 6H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zM3 12V8h10v4H3z',
    teaser: 'Werkstatt-Termine online — von der Inspektion bis zum Reifenwechsel.',
    heroLine: 'Volle Werkstatt. Voller Kalender.',
    painPoints: [
      'Terminannahme nur telefonisch, oft verpasst',
      'Kein Überblick über Fahrzeug-Wartungen',
      'Kundenkommunikation ineffizient',
      'Kein professioneller Webauftritt',
    ],
    gains: [
      'Online-Buchung für alle Leistungen',
      'Kategorisierung nach Fahrzeugtyp und Dienstleistung',
      'Erinnerungen senken No-Show-Rate',
      'Seriöser Webauftritt stärkt Vertrauen',
    ],
    cta: 'Werkstatt-Demo ansehen',
  },
  {
    slug: 'physiotherapie',
    name: 'Physiotherapiepraxis',
    namePlural: 'Physiotherapiepraxen',
    icon: 'M8 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm1 6H7L5 14h2l1-3 1 3h2l-2-6z',
    teaser: 'Therapietermine einfach buchen — für Patienten und Therapeuten.',
    heroLine: 'Weniger Verwaltung. Mehr Therapie.',
    painPoints: [
      'Serientermine manuell koordinieren',
      'Kasse und Privatpatienten getrennt verwalten',
      'Erinnerungen manuell verschicken',
      'Keine übersichtliche Tagesplanung',
    ],
    gains: [
      'Klare Tages- und Wochenübersicht im Admin-Panel',
      'Online-Buchung für Erst- und Folgetermine',
      'Automatische Erinnerungen für Patienten',
      'Datenexport für die Buchhaltung',
    ],
    cta: 'Physio-Demo ansehen',
  },
  {
    slug: 'fitness',
    name: 'Fitnessstudio / Yogastudio',
    namePlural: 'Fitnessstudios',
    icon: 'M3 8a5 5 0 0 1 10 0M1 8h2m10 0h2M8 3V1M8 15v-2',
    teaser: 'Kursanmeldung und Einzeltermine — nahtlos online.',
    heroLine: 'Ihr Studio. Vollständig gebucht.',
    painPoints: [
      'Kurse manuell pflegen und kommunizieren',
      'Teilnehmerlisten per Hand führen',
      'Keine automatischen Erinnerungen',
      'Kein professioneller Onlineauftritt',
    ],
    gains: [
      'Kursübersicht und Buchung online',
      'Teilnehmer-Limit und Warteliste im Admin-Panel',
      'Automatische Kurserinnerungen',
      'Statistik über Auslastung und Buchungsverhalten',
    ],
    cta: 'Studio-Demo ansehen',
  },
  {
    slug: 'tattoo',
    name: 'Tattoostudio',
    namePlural: 'Tattoostudios',
    icon: 'M4 8l4-6 4 6-4 6-4-6zm4-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
    teaser: 'Konsultationstermine und Sessions bequem online vereinbaren.',
    heroLine: 'Von der Anfrage zur Session — ohne Aufwand.',
    painPoints: [
      'Anfragen kommen über Instagram, E-Mail und Telefon — keine Übersicht',
      'Konsultation und Session separat koordinieren',
      'Depositverwaltung manuell und fehleranfällig',
      'Kein professioneller Webauftritt mit Portfolio-Anbindung',
    ],
    gains: [
      'Einheitliches Buchungsformular für Anfragen',
      'Admin-Panel mit Statusübersicht pro Kunde',
      'Erinnerungen für Konsultation und Session',
      'Seriöser Auftritt stärkt Portfolio-Wahrnehmung',
    ],
    cta: 'Studio-Demo ansehen',
  },
];
