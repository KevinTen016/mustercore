import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import { checkAccess, accessDenied } from '@/lib/access';
import { getAdminSettings, updateAdminSettings } from '@/lib/admin-settings';

// POST — confirm TOTP setup: verifies a live code against the pending secret,
//        then promotes it to the active secret and enables 2FA.
export async function POST(req: Request) {
  const access = await checkAccess(req);
  if (!access.ok) return accessDenied(access);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const code = typeof body.code === 'string' ? body.code.replace(/\s/g, '') : '';
  if (!code) return NextResponse.json({ error: 'Code erforderlich.' }, { status: 400 });

  const s = await getAdminSettings();
  if (!s.totpPendingSecret) {
    return NextResponse.json(
      { error: 'Kein aktiver Setup-Vorgang. Bitte erneut starten.' },
      { status: 400 },
    );
  }

  authenticator.options = { window: 1 };
  const isValid = authenticator.check(code, s.totpPendingSecret);
  if (!isValid) {
    return NextResponse.json(
      { error: 'Code ungültig oder abgelaufen. Bitte erneut eingeben.' },
      { status: 401 },
    );
  }

  await updateAdminSettings({
    totpEnabled: true,
    totpSecret: s.totpPendingSecret,
    totpPendingSecret: null,
  });

  return NextResponse.json({ ok: true });
}
