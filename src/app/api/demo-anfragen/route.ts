import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

// Field length limits
const LIMITS = { short: 120, medium: 300, long: 1000 } as const;

// Max body size for this endpoint (~10 KB is generous for all valid inputs)
const MAX_BODY_BYTES = 10_000;

// Rate limit: max 3 submissions per IP per hour.
// NOTE: X-Forwarded-For can be spoofed without a trusted reverse proxy.
// Configure nginx/Caddy to overwrite this header with the real client IP.
const rateMap = new Map<string, { count: number; reset: number }>();

// Prevent unbounded Map growth — clean up expired entries every 30 minutes.
const _globalForDemo = globalThis as unknown as { _demoCleanup?: ReturnType<typeof setInterval> };
if (!_globalForDemo._demoCleanup) {
  _globalForDemo._demoCleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateMap) {
      if (now > entry.reset) rateMap.delete(ip);
    }
  }, 30 * 60 * 1000);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function brancheLabel(branche: string, custom: string): string {
  if (branche === '__andere__') return custom || 'Sonstiges';
  return branche;
}

function stilLabel(stil: string, custom: string): string {
  const map: Record<string, string> = {
    modern: 'Modern & Minimalistisch',
    klassisch: 'Klassisch & Seriös',
    lebendig: 'Frisch & Lebendig',
    __andere__: custom || 'Sonstiges',
  };
  return map[stil] ?? stil;
}

function statusLabel(sw: string, custom: string): string {
  const map: Record<string, string> = {
    kein: 'Noch keine Website',
    selbst: 'Selbst erstellt',
    agentur: 'Von einer Agentur',
    __andere__: custom || 'Sonstiges',
  };
  return map[sw] ?? sw;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' }, { status: 429 });
  }

  // Read body as text to enforce the size limit on actual bytes received.
  // Content-Length is absent in chunked requests and can be spoofed, so checking
  // it alone is insufficient.
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload zu groß.' }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  // Validate required fields
  const name    = typeof body.name    === 'string' ? body.name.trim()    : '';
  const firma   = typeof body.firma   === 'string' ? body.firma.trim()   : '';
  const email   = typeof body.email   === 'string' ? body.email.trim()   : '';
  const telefon = typeof body.telefon === 'string' ? body.telefon.trim() : '';
  const branche = typeof body.branche === 'string' ? body.branche        : '';

  if (!name || !firma || !email || !telefon || !branche) {
    return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
  }

  // Length limits
  if (
    name.length    > LIMITS.short ||
    firma.length   > LIMITS.short ||
    email.length   > LIMITS.short ||
    telefon.length > LIMITS.short
  ) {
    return NextResponse.json({ error: 'Eingabe zu lang.' }, { status: 400 });
  }

  const brancheCustom        = typeof body.brancheCustom        === 'string' ? body.brancheCustom.slice(0, LIMITS.short)   : '';
  const stil                 = typeof body.stil                 === 'string' ? body.stil                                    : '';
  const stilCustom           = typeof body.stilCustom           === 'string' ? body.stilCustom.slice(0, LIMITS.short)       : '';
  const features             = Array.isArray(body.features)
    ? (body.features as unknown[])
        .filter((f): f is string => typeof f === 'string' && f.length <= LIMITS.short)
        .slice(0, 20)
    : [];
  const featuresCustom       = typeof body.featuresCustom       === 'string' ? body.featuresCustom.slice(0, LIMITS.medium)  : '';
  const statusWebsite        = typeof body.statusWebsite        === 'string' ? body.statusWebsite                            : '';
  const statusWebsiteCustom  = typeof body.statusWebsiteCustom  === 'string' ? body.statusWebsiteCustom.slice(0, LIMITS.short) : '';

  // Idempotency: same email on the same day → silent success (prevents duplicate leads)
  try {
    const isDuplicate = await db.demos.existsByEmailToday(email);
    if (isDuplicate) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
  } catch (err) {
    console.error('[demo-anfragen] dedup check error:', err);
    // Non-fatal: proceed with insert rather than blocking the user
  }

  // Persist
  let demo: Awaited<ReturnType<typeof db.demos.add>>;
  try {
    demo = await db.demos.add({
      name,
      firma,
      email,
      telefon,
      branche:       brancheLabel(branche, brancheCustom),
      stil:          stilLabel(stil, stilCustom),
      features:      features.filter(f => f !== '__andere__').concat(
                       features.includes('__andere__') && featuresCustom ? [featuresCustom] : []
                     ),
      statusWebsite: statusLabel(statusWebsite, statusWebsiteCustom),
      eingegangen:   new Date(),
      status:        'neu',
    });
  } catch (err) {
    console.error('[demo-anfragen] DB error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: 'Interner Fehler. Bitte versuchen Sie es erneut.' }, { status: 500 });
  }

  // Send emails if Resend is configured
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend    = new Resend(apiKey);
    const from      = process.env.RESEND_FROM ?? 'WebCore <onboarding@resend.dev>';
    const adminMail = process.env.ADMIN_EMAIL  ?? 'admin@example.com';

    const brancheSafe  = escHtml(brancheLabel(branche, brancheCustom));
    const stilSafe     = escHtml(stilLabel(stil, stilCustom));
    const statusSafe   = escHtml(statusLabel(statusWebsite, statusWebsiteCustom));
    const featuresSafe = demo.features?.map(escHtml).join(', ') || '—';

    const [clientResult, adminResult] = await Promise.allSettled([
      resend.emails.send({
        from,
        to:      email,
        subject: `Ihre Demo wird erstellt – ${escHtml(firma)}`,
        html: `
          <p>Hallo ${escHtml(name)},</p>
          <p>vielen Dank für Ihre Anfrage! Wir haben Ihre Angaben erhalten und beginnen sofort mit der Erstellung Ihrer persönlichen Demo-Website.</p>
          <p><strong>Sie erhalten Ihre Demo innerhalb von 24 Stunden.</strong></p>
          <p>Bei Fragen melden Sie sich gerne direkt bei uns.</p>
          <p>Viele Grüße,<br>Das WebCore-Team</p>
        `,
      }),
      resend.emails.send({
        from,
        to:      adminMail,
        subject: `Neue Demo-Anfrage: ${escHtml(firma)} (${brancheSafe})`,
        html: `
          <h2>Neue Demo-Anfrage</h2>
          <table>
            <tr><td><b>Name</b></td><td>${escHtml(name)}</td></tr>
            <tr><td><b>Firma</b></td><td>${escHtml(firma)}</td></tr>
            <tr><td><b>E-Mail</b></td><td>${escHtml(email)}</td></tr>
            <tr><td><b>Telefon</b></td><td>${escHtml(telefon)}</td></tr>
            <tr><td><b>Branche</b></td><td>${brancheSafe}</td></tr>
            <tr><td><b>Stil</b></td><td>${stilSafe}</td></tr>
            <tr><td><b>Features</b></td><td>${featuresSafe}</td></tr>
            <tr><td><b>Website-Status</b></td><td>${statusSafe}</td></tr>
          </table>
        `,
      }),
    ]);
    if (clientResult.status === 'rejected')
      logger.error('[demo-anfragen] client confirmation email failed', { email, err: String(clientResult.reason) });
    if (adminResult.status === 'rejected')
      logger.error('[demo-anfragen] admin notification email failed', { err: String(adminResult.reason) });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
