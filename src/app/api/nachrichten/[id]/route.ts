import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/session';
import { db } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

  const updated = db.nachrichten.update(params.id, { status: body.status as typeof ALLOWED[number] });
  if (!updated) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const ok = db.nachrichten.remove(params.id);
  if (!ok) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
