import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    await db.ping();
    return NextResponse.json({ ok: true });
  } catch (e) {
    logger.error('[health] DB unreachable', { err: e instanceof Error ? e.message : String(e) });
    return NextResponse.json({ ok: false, error: 'db_unreachable' }, { status: 503 });
  }
}
