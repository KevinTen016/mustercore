import { NextResponse } from 'next/server';
import { checkAccess, accessDenied } from '@/lib/access';
import { getAdminSettings, updateAdminSettings } from '@/lib/admin-settings';

export async function GET(req: Request) {
  const access = await checkAccess(req);
  if (!access.ok) return accessDenied(access);

  const s = await getAdminSettings();
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';

  return NextResponse.json({
    totpEnabled: s.totpEnabled,
    totpConfigured: !!s.totpSecret,
    ipWhitelistEnabled: s.ipWhitelistEnabled,
    ipWhitelist: s.ipWhitelist,
    myIp: ip,
  });
}

export async function PATCH(req: Request) {
  const access = await checkAccess(req);
  if (!access.ok) return accessDenied(access);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (typeof body.ipWhitelistEnabled === 'boolean') {
    updates.ipWhitelistEnabled = body.ipWhitelistEnabled;
  }

  if (Array.isArray(body.ipWhitelist)) {
    // Validate each entry: max 50 chars, reasonable IP/CIDR format
    const list = (body.ipWhitelist as unknown[])
      .filter((e): e is string => typeof e === 'string' && e.length > 0 && e.length <= 50)
      .slice(0, 100);
    updates.ipWhitelist = list;
  }

  const s = await updateAdminSettings(updates);
  return NextResponse.json({
    totpEnabled: s.totpEnabled,
    totpConfigured: !!s.totpSecret,
    ipWhitelistEnabled: s.ipWhitelistEnabled,
    ipWhitelist: s.ipWhitelist,
  });
}
