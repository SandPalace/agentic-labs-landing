import { NextRequest, NextResponse } from 'next/server';

const ZOHO_BASE =
  'https://calendar.zoho.com/eventreq/zz0801123039bc0c73ba4fb59b5c6ff2d85f8a7c0cd276aae34ca3b59e079bc2eb196cba34a97dd4b2bd6017f32b4f1b72d94d5f15';

const ALLOWED_TIME_SLOTS = new Set<string>(
  (() => {
    const slots: string[] = [];
    for (let h = 9; h < 14; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
      slots.push(`${String(h).padStart(2, '0')}:30`);
    }
    for (let h = 15; h < 19; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
      slots.push(`${String(h).padStart(2, '0')}:30`);
    }
    return slots;
  })()
);

const MAX_PAYLOAD_BYTES = 4 * 1022; // 4 KB is plenty for this form
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP
const RATE_BUCKET = new Map<string, number[]>();

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
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host =
    req.headers.get('x-forwarded-host') ??
    req.headers.get('host') ??
    '';
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }
  return true;
}

function log(level: 'info' | 'warn' | 'error', msg: string, meta: Record<string, unknown> = {}) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), level, route: '/api/booking', msg, ...meta }));
}

/**
 * Normalize an incoming date string to Zoho's expected `MM/dd/yyyy` format.
 * Accepts `yyyy-MM-dd` (HTML <input type="date">) and `MM/dd/yyyy` (already correct).
 * Returns null if the input is unparseable.
 */
function toZohoDate(input: string): string | null {
  const s = input.trim();
  if (!s) return null;

  // yyyy-MM-dd
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    return `${iso[2]}/${iso[3]}/${iso[1]}`;
  }

  // MM/dd/yyyy
  const us = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (us) {
    const mm = us[1].padStart(2, '0');
    const dd = us[2].padStart(2, '0');
    return `${mm}/${dd}/${us[3]}`;
  }

  return null;
}

/**
 * Returns true if the given MM/dd/yyyy string is today or in the future
 * (interpreted in the server's local timezone, which is fine for a coarse check).
 */
function isFutureOrToday(zohoDate: string): boolean {
  const m = zohoDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return false;
  const [, mm, dd, yyyy] = m;
  const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed.getTime() >= today.getTime();
}

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
    log('warn', 'payload_too_large', { ip, size: raw.length });
    return NextResponse.json({ ok: false, error: 'payload_too_large' }, { status: 413 });
  }

  let body: Record<string, string>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const { name, mailId, date, time, reason, hp } = body;

  if (typeof hp === 'string' && hp.trim().length > 0) {
    log('warn', 'honeypot_triggered', { ip });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Field-level validation
  const errors: Record<string, string> = {};
  if (!name?.trim()) errors.name = 'name_required';
  if (!mailId?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailId)) errors.mailId = 'mailId_invalid';
  if (!date?.trim()) errors.date = 'date_required';
  if (!time?.trim()) errors.time = 'time_required';
  if (time && !ALLOWED_TIME_SLOTS.has(time)) errors.time = 'time_out_of_range';

  // Normalize the date
  const zohoDate = date ? toZohoDate(date) : null;
  if (date && !zohoDate) {
    errors.date = 'date_invalid';
  } else if (zohoDate && !isFutureOrToday(zohoDate)) {
    errors.date = 'date_past';
  }

  if (Object.keys(errors).length) {
    log('info', 'validation_failed', { ip, fields: Object.keys(errors) });
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const url = new URL(ZOHO_BASE);
  url.searchParams.set('name', name.trim());
  url.searchParams.set('mailId', mailId.trim());
  url.searchParams.set('date', zohoDate!);
  url.searchParams.set('time', time.trim());
  url.searchParams.set('reason', (reason ?? '').trim());

  try {
    const zohoRes = await fetch(url.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json,text/plain,*/*' },
      cache: 'no-store',
    });

    const text = await zohoRes.text();
    let payload: unknown = null;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text.slice(0, 500) };
    }

    // Detect Zoho's structured error response (e.g. { status: "failure", errorcode: "INTERNAL_ERROR" })
    const isStructuredError =
      typeof payload === 'object' &&
      payload !== null &&
      (payload as { status?: string }).status === 'failure';

    if (zohoRes.ok) {
      log('info', 'zoho_ok', { ip, status: zohoRes.status });
      return NextResponse.json(
        { ok: true, status: zohoRes.status, data: payload },
        { status: 200 }
      );
    }

    // Upstream returned a non-2xx. Log the full body so future failures are diagnosable.
    log('error', 'zoho_error', {
      ip,
      status: zohoRes.status,
      upstream: payload,
      sent: { date: zohoDate, time, mailDomain: mailId.split('@')[1] },
    });

    if (isStructuredError) {
      const code = (payload as { errorcode?: string }).errorcode ?? 'unknown';
      return NextResponse.json(
        {
          ok: false,
          error: 'upstream_rejected',
          upstreamCode: code,
          upstreamMessage:
            (payload as { message?: string }).message ?? null,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { ok: false, error: 'upstream_error', status: zohoRes.status },
      { status: 502 }
    );
  } catch (err) {
    log('error', 'zoho_threw', { ip, message: err instanceof Error ? err.message : 'unknown' });
    return NextResponse.json(
      { ok: false, error: 'upstream_unreachable' },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
}
