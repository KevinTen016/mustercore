import { NextResponse } from 'next/server';
import { isAuthed } from './session';
import { getAdminSettings, isIPAllowed } from './admin-settings';

export type AccessResult = { ok: true } | { ok: false; status: 401 | 403 };

export async function checkAccess(req: Request): Promise<AccessResult> {
  if (!isAuthed(req)) return { ok: false, status: 401 };
  const settings = await getAdminSettings();
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!isIPAllowed(ip, settings)) return { ok: false, status: 403 };
  return { ok: true };
}

export function accessDenied(result: AccessResult & { ok: false }): ReturnType<typeof NextResponse.json> {
  const error = result.status === 403 ? 'Zugriff verweigert.' : 'Nicht autorisiert.';
  return NextResponse.json({ error }, { status: result.status });
}
