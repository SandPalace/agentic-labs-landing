import { NextRequest, NextResponse } from 'next/server';

/**
 * Contact form → email via Resend (https://resend.com/docs/api-reference/emails/send-email).
 * Env:
 *   RESEND_API_KEY  required; without it the route answers 503 `not_configured` and the form falls back to mailto.
 *   CONTACT_TO      inbox that receives the messages (default hello@agenticlabs.site).
 *   CONTACT_FROM    verified sender in Resend (default "Mty Agentic Labs <hello@agenticlabs.site>").
 */
const RESEND_URL = 'https://api.resend.com/emails';
const CONTACT_TO = process.env.CONTACT_TO ?? 'hello@agenticlabs.site';
const CONTACT_FROM = process.env.CONTACT_FROM ?? 'Mty Agentic Labs <hello@agenticlabs.site>';

const MAX_PAYLOAD_BYTES = 8 * 1024;
const MAX_MESSAGE_CHARS = 4000;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP
const RATE_BUCKET = new Map<string, number[]>();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (RATE_BUCKET.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  arr.push(now);
  RATE_BUCKET.set(ip, arr);
  return arr.length > RATE_LIMIT_MAX;
}

function isSameOrigin(req: NextRequest): boolean {
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  const source = req.headers.get('origin') ?? req.headers.get('referer');
  if (!source) return true;
  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
}

function log(level: 'info' | 'warn' | 'error', msg: string, meta: Record<string, unknown> = {}) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), level, route: '/api/contact', msg, ...meta }));
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  if (!isSameOrigin(req)) {
    log('warn', 'origin_rejected', { ip, origin: req.headers.get('origin') });
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }
  if (isRateLimited(ip)) {
    log('warn', 'rate_limited', { ip });
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  const raw = await req.text();
  if (raw.length > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ ok: false, error: 'payload_too_large' }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const str = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim() : '');
  const name = str('name');
  const email = str('email');
  const company = str('company');
  const message = str('message');
  const locale = str('locale') === 'en' ? 'en' : 'es';

  // Honeypot: pretend success so bots don't retry.
  if (str('hp')) {
    log('warn', 'honeypot', { ip });
    return NextResponse.json({ ok: true });
  }
  if (!name || name.length > 120 || !EMAIL_RE.test(email) || email.length > 200 || !message || message.length > MAX_MESSAGE_CHARS || company.length > 160) {
    return NextResponse.json({ ok: false, error: 'invalid_fields' }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    log('error', 'not_configured');
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const subject = `[web] ${name}${company ? ` · ${company}` : ''}`;
  const text = `Nombre: ${name}\nCorreo: ${email}\nEmpresa: ${company || '—'}\nIdioma: ${locale}\n\n${message}`;
  const html = `<p><b>Nombre:</b> ${escapeHtml(name)}<br><b>Correo:</b> ${escapeHtml(email)}<br><b>Empresa:</b> ${escapeHtml(company || '—')}<br><b>Idioma:</b> ${locale}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: CONTACT_FROM, to: [CONTACT_TO], reply_to: email, subject, text, html }),
    });
    if (!res.ok) {
      log('error', 'upstream_rejected', { ip, status: res.status, body: (await res.text()).slice(0, 300) });
      return NextResponse.json({ ok: false, error: 'upstream_rejected' }, { status: 502 });
    }
    log('info', 'sent', { ip });
    return NextResponse.json({ ok: true });
  } catch (err) {
    log('error', 'upstream_error', { ip, err: String(err) });
    return NextResponse.json({ ok: false, error: 'upstream_error' }, { status: 502 });
  }
}
