import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/session';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return NextResponse.json(await db.kunden.list());
  } catch (err) {
    logger.error('[kunden] list error', { err: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
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
  if (name.length > 120) return NextResponse.json({ error: 'Name zu lang (max. 120 Zeichen)' }, { status: 400 });

  const branche = typeof body.branche === 'string' ? body.branche : '';
  if (branche.length > 120) return NextResponse.json({ error: 'Branche zu lang (max. 120 Zeichen)' }, { status: 400 });

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (email.length > 120) return NextResponse.json({ error: 'E-Mail zu lang (max. 120 Zeichen)' }, { status: 400 });

  const PAKETE = ['BASIS', 'STANDARD', 'PREMIUM'] as const;
  const paket = PAKETE.includes(body.paket as typeof PAKETE[number]) ? body.paket as typeof PAKETE[number] : 'BASIS';

  try {
    const kunde = await db.kunden.add({
      name,
      branche,
      paket,
      email,
      status: 'trial',
      since: new Date(),
    });
    return NextResponse.json(kunde, { status: 201 });
  } catch (err) {
    logger.error('[kunden] add error', { err: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}
