'use client';

import { useState, FormEvent } from 'react';

/**
 * Office hours for booking: 09:00–14:00 and 15:00–19:00, 30-minute slots.
 * 14:00 and 15:00 are excluded (lunch break).
 */
const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 9; h < 14; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  // 14:00 is the end of the morning block (not a slot) and 15:00 is the start of the afternoon block.
  for (let h = 15; h < 19; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
})();

interface BookingFormLabels {
  title: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  date: string;
  time: string;
  reason: string;
  reasonPlaceholder: string;
  submit: string;
  submitting: string;
  success: string;
  successSub: string;
  errorGeneric: string;
  errorUpstream: string;
  errorName: string;
  errorEmail: string;
  errorDate: string;
  errorTime: string;
}

interface BookingFormProps {
  labels: BookingFormLabels;
  /** Minimum date for the date input (ISO yyyy-mm-dd). Defaults to today. */
  minDate?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function BookingForm({ labels, minDate }: BookingFormProps) {
  const min = minDate ?? todayIso();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMsg, setServerMsg] = useState<string>('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerMsg('');

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const mailId = String(data.get('mailId') ?? '').trim();
    const dateRaw = String(data.get('date') ?? '').trim(); // yyyy-MM-dd from <input type="date">
    const time = String(data.get('time') ?? '').trim();
    const reason = String(data.get('reason') ?? '').trim();

    // Convert yyyy-MM-dd → MM/dd/yyyy before sending, so the payload is correct
    // even if the server-side normalizer is bypassed.
    const m = dateRaw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const date = m ? `${m[2]}/${m[3]}/${m[1]}` : dateRaw;

    // Client-side validation
    const next: Record<string, string> = {};
    if (!name) next.name = labels.errorName;
    if (!mailId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailId)) next.mailId = labels.errorEmail;
    if (!dateRaw) next.date = labels.errorDate;
    if (!time) next.time = labels.errorTime;
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus('submitting');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mailId, date, time, reason }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setServerMsg(json.error === 'upstream_rejected' ? labels.errorUpstream : labels.errorGeneric);
        setStatus('error');
        return;
      }
      setStatus('success');
      form.reset();
    } catch {
      setServerMsg(labels.errorGeneric);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div
        className="bg-white border border-line text-center"
        style={{ maxWidth: 480, margin: '0 auto', borderRadius: 6, padding: '40px 24px' }}
      >
        <div
          className="font-mono text-operations font-semibold mb-3"
          style={{ fontSize: 11, letterSpacing: '0.16em' }}
        >
          ✓ {labels.success.toUpperCase()}
        </div>
        <p
          className="text-steel m-0"
          style={{ fontSize: 15, lineHeight: 1.6 }}
        >
          {labels.successSub}
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'white',
    border: '1px solid var(--color-line)',
    borderRadius: 2,
    padding: '10px 12px',
    /* 16px prevents iOS Safari from auto-zooming on focus */
    fontSize: 16,
    fontFamily: 'inherit',
    color: 'var(--color-fg)',
    outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-plex-mono), monospace',
    fontSize: 11,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--color-steel)',
    marginBottom: 6,
  };
  const fieldWrap: React.CSSProperties = { display: 'flex', flexDirection: 'column' };
  const errorStyle: React.CSSProperties = {
    color: '#C42B2B',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'var(--font-plex-mono), monospace',
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-white border border-white/10"
      style={{ maxWidth: 480, margin: '0 auto', borderRadius: 6, padding: '24px 20px', textAlign: 'left', position: 'relative' }}
      onInput={() => {
        if (status === 'error') {
          setStatus('idle');
          setServerMsg('');
        }
      }}
    >
      <div className="font-mono text-fg font-semibold text-center mb-5"
        style={{ fontSize: 12, letterSpacing: '0.12em' }}>
        {labels.title}
      </div>

      <div className="flex flex-col gap-4">
        {/* Honeypot — hidden from real users, visible to most bots. Must remain empty. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
          <label htmlFor="bk-website">Website</label>
          <input
            id="bk-website" name="hp" type="text" tabIndex={-1} autoComplete="off"
            defaultValue=""
          />
        </div>

        <div style={fieldWrap}>
          <label htmlFor="bk-name" style={labelStyle}>{labels.name}</label>
          <input
            id="bk-name" name="name" type="text" required
            autoComplete="name"
            placeholder={labels.namePlaceholder}
            style={inputStyle}
            disabled={status === 'submitting'}
          />
          {errors.name && <span style={errorStyle}>{errors.name}</span>}
        </div>

        <div style={fieldWrap}>
          <label htmlFor="bk-email" style={labelStyle}>{labels.email}</label>
          <input
            id="bk-email" name="mailId" type="email" required
            autoComplete="email"
            placeholder={labels.emailPlaceholder}
            style={inputStyle}
            disabled={status === 'submitting'}
          />
          {errors.mailId && <span style={errorStyle}>{errors.mailId}</span>}
        </div>

        {/* Date / time stack on very small screens, sit side-by-side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div style={fieldWrap}>
            <label htmlFor="bk-date" style={labelStyle}>{labels.date}</label>
            <input
              id="bk-date" name="date" type="date" required
              min={min}
              style={inputStyle}
              disabled={status === 'submitting'}
            />
            {errors.date && <span style={errorStyle}>{errors.date}</span>}
          </div>
          <div style={fieldWrap}>
            <label htmlFor="bk-time" style={labelStyle}>{labels.time}</label>
            <select
              id="bk-time" name="time" required
              defaultValue=""
              style={inputStyle}
              disabled={status === 'submitting'}
            >
              <option value="" disabled>
                —
              </option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.time && <span style={errorStyle}>{errors.time}</span>}
          </div>
        </div>

        <div style={fieldWrap}>
          <label htmlFor="bk-reason" style={labelStyle}>{labels.reason}</label>
          <textarea
            id="bk-reason" name="reason" rows={3}
            placeholder={labels.reasonPlaceholder}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
            disabled={status === 'submitting'}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-accent text-fg font-mono font-semibold no-underline transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{
            fontSize: 14,
            letterSpacing: '0.04em',
            padding: '14px 24px',
            borderRadius: 2,
            border: 'none',
            cursor: status === 'submitting' ? 'wait' : 'pointer',
            minHeight: 48,
            marginTop: 4,
          }}
        >
          {status === 'submitting' ? labels.submitting : labels.submit}
        </button>

        {status === 'error' && serverMsg && (
          <div style={errorStyle} className="text-center">{serverMsg}</div>
        )}
      </div>
    </form>
  );
}
