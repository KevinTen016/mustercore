import { NextResponse } from 'next/server';
import { checkAccess, accessDenied } from '@/lib/access';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await checkAccess(req);
  if (!access.ok) return accessDenied(access);

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
  }

  const ALLOWED_STATUS = ['aktiv', 'trial', 'inaktiv'] as const;
  const PAKETE         = ['BASIS', 'STANDARD', 'PREMIUM'] as const;
  const patch: Partial<{ status: string; name: string; email: string; branche: string; paket: string }> = {};

  if (typeof body.status === 'string' && ALLOWED_STATUS.includes(body.status as typeof ALLOWED_STATUS[number]))
    patch.status = body.status as typeof ALLOWED_STATUS[number];

  if (typeof body.name === 'string') {
    const trimmed = body.name.trim();
    if (!trimmed) return NextResponse.json({ error: 'Name darf nicht leer sein' }, { status: 400 });
    if (trimmed.length > 120) return NextResponse.json({ error: 'Name zu lang (max. 120 Zeichen)' }, { status: 400 });
    patch.name = trimmed;
  }

  if (typeof body.email === 'string') {
    if (body.email.trim().length > 120)
      return NextResponse.json({ error: 'E-Mail zu lang (max. 120 Zeichen)' }, { status: 400 });
    patch.email = body.email.trim();
  }

  if (typeof body.branche === 'string') {
    if (body.branche.length > 120)
      return NextResponse.json({ error: 'Branche zu lang (max. 120 Zeichen)' }, { status: 400 });
    patch.branche = body.branche;
  }

  if (typeof body.paket === 'string' && PAKETE.includes(body.paket as typeof PAKETE[number]))
    patch.paket = body.paket as typeof PAKETE[number];

  try {
    const updated = await db.kunden.update(id, patch);
    if (!updated) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    logger.error('[kunden/id] update error', { id, err: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await checkAccess(req);
  if (!access.ok) return accessDenied(access);
  const { id } = await params;
  try {
    const ok = await db.kunden.remove(id);
    if (!ok) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error('[kunden/id] delete error', { id, err: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}
