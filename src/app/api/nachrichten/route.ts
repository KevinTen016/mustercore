import { NextResponse } from 'next/server';
import { checkAccess, accessDenied } from '@/lib/access';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(req: Request) {
  const access = await checkAccess(req);
  if (!access.ok) return accessDenied(access);
  try {
    return NextResponse.json(await db.nachrichten.list());
  } catch (err) {
    logger.error('[nachrichten] list error', { err: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}
