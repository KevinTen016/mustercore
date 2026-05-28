/**
 * Einmaliges Skript: überträgt bestehende Daten aus data/db.json nach PostgreSQL.
 *
 * Ausführen (nach prisma migrate deploy):
 *   npx ts-node --skip-project scripts/migrate-json.ts
 *   npx tsx scripts/migrate-json.ts
 */

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface OldKunde {
  id: string; name: string; branche: string; paket: string;
  status: string; email: string; since: string;
}
interface OldDemo {
  id: string; name: string; firma: string; email: string; telefon: string;
  branche: string; eingegangen: string; status: string;
  stil?: string; features?: string[]; statusWebsite?: string;
}
interface OldNachricht {
  id: string; name: string; email: string; betreff: string;
  text: string; eingegangen: string; status: string;
}
interface DbJson {
  kunden: OldKunde[];
  demos: OldDemo[];
  nachrichten: OldNachricht[];
}

async function main() {
  const jsonPath = path.resolve(process.cwd(), 'data', 'db.json');

  if (!existsSync(jsonPath)) {
    console.log('Keine data/db.json gefunden – nichts zu migrieren.');
    return;
  }

  const raw = await readFile(jsonPath, 'utf-8');
  const data = JSON.parse(raw) as DbJson;

  const kunden     = data.kunden     ?? [];
  const demos      = data.demos      ?? [];
  const nachrichten = data.nachrichten ?? [];

  console.log(`Migriere: ${kunden.length} Kunden, ${demos.length} Demos, ${nachrichten.length} Nachrichten`);

  // Upsert statt create → Skript kann mehrfach sicher ausgeführt werden
  await prisma.$transaction([
    ...kunden.map(k =>
      prisma.kunde.upsert({
        where:  { id: k.id },
        update: k,
        create: k,
      })
    ),
    ...demos.map(d =>
      prisma.demo.upsert({
        where:  { id: d.id },
        update: { ...d, features: d.features ?? [] },
        create: { ...d, features: d.features ?? [] },
      })
    ),
    ...nachrichten.map(n =>
      prisma.nachricht.upsert({
        where:  { id: n.id },
        update: n,
        create: n,
      })
    ),
  ]);

  console.log('Migration abgeschlossen.');
}

main()
  .catch(err => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
