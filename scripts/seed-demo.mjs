/**
 * seed-demo.mjs — заполняет БД демо-данными для портфолио/тестирования.
 * Запуск: node scripts/seed-demo.mjs
 * Требует: DATABASE_URL в .env.local (или переменной окружения).
 *
 * Идемпотентен: повторный запуск не дублирует записи (проверяет по email/name).
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env.local if DATABASE_URL is not already set
if (!process.env.DATABASE_URL) {
  const envPath = resolve(dirname(fileURLToPath(import.meta.url)), '../.env.local');
  try {
    const lines = readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env.local not found — rely on environment variables
  }
}

const prisma = new PrismaClient();

const DEMO_KUNDEN = [
  { name: 'Friseursalon Bella', branche: 'Friseur', paket: 'PROFI', status: 'aktiv', email: 'bella@example.com', since: new Date('2025-03-01') },
  { name: 'Praxis Dr. Müller', branche: 'Arztpraxis', paket: 'BASIS', status: 'aktiv', email: 'praxis@example.com', since: new Date('2025-05-10') },
  { name: 'KFZ-Meisterbetrieb Kraft', branche: 'Autowerkstatt', paket: 'PROFI', status: 'aktiv', email: 'kraft@example.com', since: new Date('2025-01-15') },
  { name: 'Physiotherapie Körperwerk', branche: 'Physiotherapie', paket: 'BASIS', status: 'trial', email: 'koerperwerk@example.com', since: new Date('2026-04-20') },
  { name: 'Tattoo Studio Ink & Soul', branche: 'Tattoo', paket: 'BASIS', status: 'trial', email: 'ink@example.com', since: new Date('2026-05-01') },
];

const DEMO_DEMOS = [
  { name: 'Maria Schmidt', firma: 'Nagelstudio Eleganz', email: 'maria@example.com', telefon: '+49 151 00000001', branche: 'Kosmetik', eingegangen: new Date('2026-05-20'), status: 'neu', stil: 'Modern & Minimalistisch', features: ['Online-Buchung', 'Galerie'], statusWebsite: 'Noch keine Website' },
  { name: 'Thomas Bauer', firma: 'Fitnessstudio Power', email: 'thomas@example.com', telefon: '+49 160 00000002', branche: 'Fitness', eingegangen: new Date('2026-05-22'), status: 'in_bearbeitung', stil: 'Frisch & Lebendig', features: ['Online-Buchung', 'Kursplan'], statusWebsite: 'Selbst erstellt' },
  { name: 'Sabine Wolf', firma: 'Hundeschule Pfotenheld', email: 'sabine@example.com', telefon: '+49 170 00000003', branche: 'Tierpflege', eingegangen: new Date('2026-05-25'), status: 'neu', stil: 'Klassisch & Seriös', features: ['Kontaktformular'], statusWebsite: 'Noch keine Website' },
];

const DEMO_NACHRICHTEN = [
  { name: 'Klaus Fischer', email: 'k.fischer@example.com', betreff: 'Frage zu den Preisen', text: 'Hallo, ich interessiere mich für das BASIS-Paket. Gibt es einen Rabatt bei jährlicher Zahlung?', eingegangen: new Date('2026-05-18'), status: 'neu' },
  { name: 'Anna Meier', email: 'anna@example.com', betreff: 'Zusammenarbeit anfragen', text: 'Guten Tag, wir sind eine kleine Zahnarztpraxis und suchen eine neue Website. Können wir einen Termin vereinbaren?', eingegangen: new Date('2026-05-26'), status: 'gelesen' },
];

async function seed() {
  console.log('Seeding demo data...\n');

  for (const k of DEMO_KUNDEN) {
    const existing = await prisma.kunde.findFirst({ where: { email: k.email, deletedAt: null } });
    if (!existing) {
      await prisma.kunde.create({ data: k });
      console.log(`  + Kunde: ${k.name}`);
    } else {
      console.log(`  ~ Kunde already exists: ${k.name}`);
    }
  }

  for (const d of DEMO_DEMOS) {
    const existing = await prisma.demo.findFirst({ where: { email: d.email, deletedAt: null } });
    if (!existing) {
      await prisma.demo.create({ data: d });
      console.log(`  + Demo: ${d.firma}`);
    } else {
      console.log(`  ~ Demo already exists: ${d.firma}`);
    }
  }

  for (const n of DEMO_NACHRICHTEN) {
    const existing = await prisma.nachricht.findFirst({ where: { email: n.email, deletedAt: null } });
    if (!existing) {
      await prisma.nachricht.create({ data: n });
      console.log(`  + Nachricht: ${n.betreff}`);
    } else {
      console.log(`  ~ Nachricht already exists: ${n.betreff}`);
    }
  }

  console.log('\nDone.');
}

seed()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
