import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';

// Simple in-memory rate limit: max 3 submissions per IP per hour
const rateMap = new Map<string, { count: number; reset: number }>();

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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
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

  const brancheCustom     = typeof body.brancheCustom     === 'string' ? body.brancheCustom     : '';
  const stil              = typeof body.stil              === 'string' ? body.stil              : '';
  const stilCustom        = typeof body.stilCustom        === 'string' ? body.stilCustom        : '';
  const features          = Array.isArray(body.features)
    ? (body.features as unknown[]).filter((f): f is string => typeof f === 'string')
    : [];
  const featuresCustom    = typeof body.featuresCustom    === 'string' ? body.featuresCustom    : '';
  const statusWebsite     = typeof body.statusWebsite     === 'string' ? body.statusWebsite     : '';
  const statusWebsiteCustom = typeof body.statusWebsiteCustom === 'string' ? body.statusWebsiteCustom : '';

  // Persist
  const demo = db.demos.add({
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
    eingegangen:   new Date().toISOString().slice(0, 10),
    status:        'neu',
  });

  // Send emails if Resend is configured
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend    = new Resend(apiKey);
    const from      = process.env.RESEND_FROM ?? 'WebCore <onboarding@resend.dev>';
    const adminMail = process.env.ADMIN_EMAIL  ?? 'kevinten1602@gmail.com';

    await Promise.allSettled([
      // Confirmation to prospect
      resend.emails.send({
        from,
        to:      email,
        subject: `Ihre Demo wird erstellt – ${firma}`,
        html: `
          <p>Hallo ${name},</p>
          <p>vielen Dank für Ihre Anfrage! Wir haben Ihre Angaben erhalten und beginnen sofort mit der Erstellung Ihrer persönlichen Demo-Website.</p>
          <p><strong>Sie erhalten Ihre Demo innerhalb von 24 Stunden.</strong></p>
          <p>Bei Fragen melden Sie sich gerne direkt bei uns.</p>
          <p>Viele Grüße,<br>Das WebCore-Team</p>
        `,
      }),
      // Notification to admin
      resend.emails.send({
        from,
        to:      adminMail,
        subject: `Neue Demo-Anfrage: ${firma} (${brancheLabel(branche, brancheCustom)})`,
        html: `
          <h2>Neue Demo-Anfrage</h2>
          <table>
            <tr><td><b>Name</b></td><td>${name}</td></tr>
            <tr><td><b>Firma</b></td><td>${firma}</td></tr>
            <tr><td><b>E-Mail</b></td><td>${email}</td></tr>
            <tr><td><b>Telefon</b></td><td>${telefon}</td></tr>
            <tr><td><b>Branche</b></td><td>${brancheLabel(branche, brancheCustom)}</td></tr>
            <tr><td><b>Stil</b></td><td>${stilLabel(stil, stilCustom)}</td></tr>
            <tr><td><b>Features</b></td><td>${demo.features?.join(', ') || '—'}</td></tr>
            <tr><td><b>Website-Status</b></td><td>${statusLabel(statusWebsite, statusWebsiteCustom)}</td></tr>
          </table>
        `,
      }),
    ]);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
