import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/session';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
  }

  const ALLOWED = ['neu', 'gelesen'] as const;
  if (typeof body.status !== 'string' || !ALLOWED.includes(body.status as typeof ALLOWED[number])) {
    return NextResponse.json({ error: 'Ungültiger Status' }, { status: 400 });
  }

  try {
    const updated = await db.nachrichten.update(id, { status: body.status as typeof ALLOWED[number] });
    if (!updated) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    logger.error('[nachrichten/id] update error', { id, err: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const ok = await db.nachrichten.remove(id);
    if (!ok) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error('[nachrichten/id] delete error', { id, err: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}
