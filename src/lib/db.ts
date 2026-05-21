import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'data', 'db.json');

export interface Kunde {
  id: string;
  name: string;
  branche: string;
  paket: 'BASIS' | 'STANDARD' | 'PREMIUM';
  status: 'aktiv' | 'trial' | 'inaktiv';
  email: string;
  since: string;
}

export interface Demo {
  id: string;
  name: string;
  firma: string;
  email: string;
  telefon: string;
  branche: string;
  eingegangen: string;
  status: 'neu' | 'kontaktiert' | 'demo_gesendet' | 'abgesagt';
  // Quiz fields — optional for backward compat with seed data
  stil?: string;
  features?: string[];
  statusWebsite?: string;
}

export interface Nachricht {
  id: string;
  name: string;
  email: string;
  betreff: string;
  text: string;
  eingegangen: string;
  status: 'neu' | 'gelesen';
}

interface DbData {
  kunden: Kunde[];
  demos: Demo[];
  nachrichten: Nachricht[];
}

const SEED: DbData = {
  kunden: [
    { id: '1', name: 'Salon Harmonie',     branche: 'Friseursalon',   paket: 'STANDARD', status: 'aktiv',  email: 'info@salon-harmonie.de',   since: '2024-09-01' },
    { id: '2', name: 'Dr. med. Schmidt',   branche: 'Arztpraxis',     paket: 'PREMIUM',  status: 'aktiv',  email: 'praxis@dr-schmidt.de',     since: '2024-11-15' },
    { id: '3', name: 'AutoService Müller', branche: 'Autowerkstatt',  paket: 'BASIS',    status: 'aktiv',  email: 'kontakt@autoservice.de',   since: '2025-01-10' },
    { id: '4', name: 'Physio Aktiv GbR',   branche: 'Physiotherapie', paket: 'STANDARD', status: 'trial',  email: 'info@physio-aktiv.de',     since: '2025-04-01' },
    { id: '5', name: 'FitStyle Studio',    branche: 'Fitness / Yoga', paket: 'BASIS',    status: 'aktiv',  email: 'hello@fitstyle.de',        since: '2025-03-20' },
  ],
  demos: [
    { id: '1', name: 'Markus Weber',   firma: 'Friseursalon Weber',   email: 'weber@gmail.com',      telefon: '+49 151 12345678', branche: 'Friseursalon',    eingegangen: '2025-05-20', status: 'neu' },
    { id: '2', name: 'Lisa Hoffmann',  firma: 'Yoga Studio Balance',  email: 'lisa@yogabalance.de',  telefon: '+49 176 98765432', branche: 'Fitness / Yoga',  eingegangen: '2025-05-18', status: 'kontaktiert' },
    { id: '3', name: 'Bernd Schuster', firma: 'Tattoo Collective BS', email: 'info@tattoo-bs.de',    telefon: '+49 162 44556677', branche: 'Tattoostudio',    eingegangen: '2025-05-16', status: 'neu' },
  ],
  nachrichten: [
    { id: '1', name: 'Thomas B.', email: 'thomas@example.de', betreff: 'Frage zur DSGVO-Konformität',   text: 'Hallo, ich hätte eine Frage zum Datenschutz…', eingegangen: '2025-05-21', status: 'neu' },
    { id: '2', name: 'Anna K.',   email: 'anna@example.de',   betreff: 'Interesse an PREMIUM-Paket',    text: 'Wir sind ein größeres Studio und würden…',   eingegangen: '2025-05-19', status: 'gelesen' },
    { id: '3', name: 'Jonas M.',  email: 'jonas@example.de',  betreff: 'Technische Frage zum Kalender', text: 'Kann man mehrere Standorte verwalten?',       eingegangen: '2025-05-15', status: 'gelesen' },
  ],
};

function read(): DbData {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as DbData;
  } catch {
    return structuredClone(SEED);
  }
}

function write(data: DbData): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = DB_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmp, DB_PATH);
}

function newId(): string {
  return crypto.randomUUID();
}

export const db = {
  kunden: {
    list(): Kunde[] {
      return read().kunden;
    },
    add(input: Omit<Kunde, 'id'>): Kunde {
      const data = read();
      const item: Kunde = { id: newId(), ...input };
      data.kunden.push(item);
      write(data);
      return item;
    },
    update(id: string, patch: Partial<Omit<Kunde, 'id'>>): Kunde | null {
      const data = read();
      const idx = data.kunden.findIndex(x => x.id === id);
      if (idx === -1) return null;
      data.kunden[idx] = { ...data.kunden[idx], ...patch };
      write(data);
      return data.kunden[idx];
    },
    remove(id: string): boolean {
      const data = read();
      const before = data.kunden.length;
      data.kunden = data.kunden.filter(x => x.id !== id);
      if (data.kunden.length === before) return false;
      write(data);
      return true;
    },
  },

  demos: {
    list(): Demo[] {
      return read().demos;
    },
    add(input: Omit<Demo, 'id'>): Demo {
      const data = read();
      const item: Demo = { id: newId(), ...input };
      data.demos.push(item);
      write(data);
      return item;
    },
    update(id: string, patch: Partial<Omit<Demo, 'id'>>): Demo | null {
      const data = read();
      const idx = data.demos.findIndex(x => x.id === id);
      if (idx === -1) return null;
      data.demos[idx] = { ...data.demos[idx], ...patch };
      write(data);
      return data.demos[idx];
    },
    remove(id: string): boolean {
      const data = read();
      const before = data.demos.length;
      data.demos = data.demos.filter(x => x.id !== id);
      if (data.demos.length === before) return false;
      write(data);
      return true;
    },
  },

  nachrichten: {
    list(): Nachricht[] {
      return read().nachrichten;
    },
    update(id: string, patch: Partial<Omit<Nachricht, 'id'>>): Nachricht | null {
      const data = read();
      const idx = data.nachrichten.findIndex(x => x.id === id);
      if (idx === -1) return null;
      data.nachrichten[idx] = { ...data.nachrichten[idx], ...patch };
      write(data);
      return data.nachrichten[idx];
    },
    remove(id: string): boolean {
      const data = read();
      const before = data.nachrichten.length;
      data.nachrichten = data.nachrichten.filter(x => x.id !== id);
      if (data.nachrichten.length === before) return false;
      write(data);
      return true;
    },
  },
};
