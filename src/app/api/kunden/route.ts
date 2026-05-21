import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/session';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(db.kunden.list());
}

export async function POST(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) return NextResponse.json({ error: 'Name erforderlich' }, { status: 400 });

  const PAKETE = ['BASIS', 'STANDARD', 'PREMIUM'] as const;
  const paket = PAKETE.includes(body.paket as typeof PAKETE[number]) ? body.paket as typeof PAKETE[number] : 'BASIS';

  const kunde = db.kunden.add({
    name,
    branche: typeof body.branche === 'string' ? body.branche : '',
    paket,
    email: typeof body.email === 'string' ? body.email.trim() : '',
    status: 'trial',
    since: new Date().toISOString().slice(0, 10),
  });

  return NextResponse.json(kunde, { status: 201 });
}
