'use client';

import { useState, FormEvent } from 'react';

interface ContactFormLabels {
  title: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  company: string;
  companyPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  success: string;
  successSub: string;
  errorGeneric: string;
  errorName: string;
  errorEmail: string;
  errorMessage: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

/** "Send us a message" form → POST /api/contact (emailed to hello@ via Resend). Falls back to mailto on any failure. */
export default function ContactForm({ labels, email, locale }: { labels: ContactFormLabels; email: string; locale: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const fields = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      company: String(data.get('company') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
      hp: String(data.get('hp') ?? ''),
      locale,
    };

    const next: Record<string, string> = {};
    if (!fields.name) next.name = labels.errorName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = labels.errorEmail;
    if (!fields.message) next.message = labels.errorMessage;
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setStatus('error');
        return;
      }
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bk bk__ok" role="status">
        <p className="bk__ok-title">✓ {labels.success}</p>
        <p>{labels.successSub}</p>
      </div>
    );
  }

  const busy = status === 'submitting';

  return (
    <form onSubmit={onSubmit} noValidate className="bk" onInput={() => status === 'error' && setStatus('idle')}>
      <div className="bk__title">{labels.title}</div>

      <div className="bk__body">
        {/* Honeypot — hidden from real users, visible to most bots. Must remain empty. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
          <label htmlFor="ct-website">Website</label>
          <input id="ct-website" name="hp" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bk__field">
            <label htmlFor="ct-name" className="bk__label">{labels.name}</label>
            <input id="ct-name" name="name" type="text" required autoComplete="name" placeholder={labels.namePlaceholder} className="bk__input" disabled={busy} />
            {errors.name && <span className="bk__err">{errors.name}</span>}
          </div>
          <div className="bk__field">
            <label htmlFor="ct-email" className="bk__label">{labels.email}</label>
            <input id="ct-email" name="email" type="email" required autoComplete="email" placeholder={labels.emailPlaceholder} className="bk__input" disabled={busy} />
            {errors.email && <span className="bk__err">{errors.email}</span>}
          </div>
        </div>

        <div className="bk__field">
          <label htmlFor="ct-company" className="bk__label">{labels.company}</label>
          <input id="ct-company" name="company" type="text" autoComplete="organization" placeholder={labels.companyPlaceholder} className="bk__input" disabled={busy} />
        </div>

        <div className="bk__field">
          <label htmlFor="ct-message" className="bk__label">{labels.message}</label>
          <textarea id="ct-message" name="message" rows={4} required placeholder={labels.messagePlaceholder} className="bk__input" disabled={busy} />
          {errors.message && <span className="bk__err">{errors.message}</span>}
        </div>

        <button type="submit" disabled={busy} className="btn btn-primary bk__submit" style={{ cursor: busy ? 'wait' : 'pointer' }}>
          {busy ? labels.submitting : labels.submit}
        </button>

        {status === 'error' && (
          <div className="bk__err" role="alert">
            {labels.errorGeneric} <a href={`mailto:${email}`}>{email}</a>
          </div>
        )}
      </div>
    </form>
  );
}
