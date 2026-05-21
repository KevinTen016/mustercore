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

  // Only allow patching safe fields
  const ALLOWED_STATUS = ['aktiv', 'trial', 'inaktiv'] as const;
  const patch: Parameters<typeof db.kunden.update>[1] = {};
  if (typeof body.status === 'string' && ALLOWED_STATUS.includes(body.status as typeof ALLOWED_STATUS[number])) {
    patch.status = body.status as typeof ALLOWED_STATUS[number];
  }
  if (typeof body.name === 'string') patch.name = body.name.trim();
  if (typeof body.email === 'string') patch.email = body.email.trim();
  if (typeof body.branche === 'string') patch.branche = body.branche;
  const PAKETE = ['BASIS', 'STANDARD', 'PREMIUM'] as const;
  if (typeof body.paket === 'string' && PAKETE.includes(body.paket as typeof PAKETE[number])) {
    patch.paket = body.paket as typeof PAKETE[number];
  }

  const updated = db.kunden.update(params.id, patch);
  if (!updated) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const ok = db.kunden.remove(params.id);
  if (!ok) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
