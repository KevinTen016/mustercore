import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { checkAccess, accessDenied } from '@/lib/access';
import { getAdminSettings, updateAdminSettings } from '@/lib/admin-settings';

// POST — begin TOTP setup: generates a new secret, stores it as pending,
//        returns the secret + QR code for the authenticator app to scan.
export async function POST(req: Request) {
  const access = await checkAccess(req);
  if (!access.ok) return accessDenied(access);

  authenticator.options = { window: 1 };
  const secret = authenticator.generateSecret(20);
  const otpauthUrl = authenticator.keyuri('admin', 'MusterCore Admin', secret);
  const qrDataUrl = await QRCode.toDataURL(otpauthUrl, { width: 200, margin: 2 });

  await updateAdminSettings({ totpPendingSecret: secret });

  return NextResponse.json({ secret, otpauthUrl, qrDataUrl });
}

// DELETE — disable TOTP. Requires the current valid TOTP code as confirmation
//          (prevents disabling 2FA via a stolen browser session alone).
export async function DELETE(req: Request) {
  const access = await checkAccess(req);
  if (!access.ok) return accessDenied(access);

  const s = await getAdminSettings();

  if (s.totpEnabled && s.totpSecret) {
    let body: Record<string, unknown> = {};
    try { body = await req.json(); } catch { /* no body — will fail code check */ }
    const code = typeof body.code === 'string' ? body.code.replace(/\s/g, '') : '';
    authenticator.options = { window: 1 };
    if (!authenticator.check(code, s.totpSecret)) {
      return NextResponse.json({ error: 'Ungültiger Code. 2FA nicht deaktiviert.' }, { status: 401 });
    }
  }

  await updateAdminSettings({ totpEnabled: false, totpSecret: null, totpPendingSecret: null });
  return NextResponse.json({ ok: true });
}
