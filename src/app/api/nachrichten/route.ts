import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/session';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return NextResponse.json(await db.nachrichten.list());
  } catch (err) {
    logger.error('[nachrichten] list error', { err: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}
