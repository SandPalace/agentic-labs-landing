import { getTranslations, setRequestLocale } from 'next-intl/server';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import ViewportReveal from '@/components/ViewportReveal';
import BookingForm from '@/components/BookingForm';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const services = (await getTranslations('services')).raw('items') as Array<{
    code: string;
    title: string;
    body: string;
  }>;
  const problems = (await getTranslations('problems')).raw('items') as Array<{
    id: string;
    title: string;
    body: string;
  }>;
  const differentiators = (await getTranslations('differentiators')).raw('items') as Array<{
    code: string;
    title: string;
    body: string;
  }>;
  const stack = (await getTranslations('stack')).raw('items') as Array<{
    name: string;
    stars: string;
  }>;
  const proof = {
    gpu: t('hero.proof.gpu'),
    gpuLabel: t('hero.proof.gpuLabel'),
    production: t('hero.proof.production'),
    productionLabel: t('hero.proof.productionLabel'),
  };

  const formLabels = {
    title: t('booking.form.title'),
    name: t('booking.form.name'),
    namePlaceholder: t('booking.form.namePlaceholder'),
    email: t('booking.form.email'),
    emailPlaceholder: t('booking.form.emailPlaceholder'),
    date: t('booking.form.date'),
    time: t('booking.form.time'),
    reason: t('booking.form.reason'),
    reasonPlaceholder: t('booking.form.reasonPlaceholder'),
    submit: t('booking.form.submit'),
    submitting: t('booking.form.submitting'),
    success: t('booking.form.success'),
    successSub: t('booking.form.successSub'),
    errorGeneric: t('booking.form.errorGeneric'),
    errorUpstream: t('booking.form.errorUpstream'),
    errorName: t('booking.form.errorName'),
    errorEmail: t('booking.form.errorEmail'),
    errorDate: t('booking.form.errorDate'),
    errorTime: t('booking.form.errorTime'),
  };

  // Spectrum mapping for category codes: dot/bar color, soft tint and readable ink.
  const spectrum: Record<string, { c: string; soft: string; ink: string }> = {
    blue: { c: 'var(--color-blue)', soft: 'var(--color-blue-soft)', ink: 'var(--color-blue-ink)' },
    teal: { c: 'var(--color-teal)', soft: 'var(--color-teal-soft)', ink: 'var(--color-teal-ink)' },
    purple: { c: 'var(--color-purple)', soft: 'var(--color-purple-soft)', ink: 'var(--color-purple-ink)' },
    orange: { c: 'var(--color-orange)', soft: 'var(--color-orange-soft)', ink: 'var(--color-orange-ink)' },
  };
  const serviceTone: Record<string, keyof typeof spectrum> = {
    'S-01': 'blue',
    'S-02': 'teal',
    'S-03': 'purple',
    'S-04': 'orange',
  };
  const cycle: Array<keyof typeof spectrum> = ['blue', 'orange', 'purple', 'teal'];

  const eyebrow = 'font-label font-semibold text-steel uppercase';
  const eyebrowStyle = { fontSize: 11, letterSpacing: '0.16em' } as const;

  return (
    <div id="top" className="relative bg-base text-fg">
      <Topbar />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden bg-base text-fg"
        style={{ padding: 'clamp(56px, 12vw, 96px) 0 clamp(56px, 10vw, 80px)' }}
      >
        <div className="bg-grid" />
        <div className="relative z-10 mx-auto container-px" style={{ maxWidth: 1280 }}>
          <ViewportReveal className="flex items-center gap-2.5 mb-7">
            <span className="font-label font-semibold text-[11px] tracking-[0.14em] text-steel">
              {t('hero.eyebrowLocation')}
            </span>
            <span
              aria-hidden="true"
              className="inline-block rounded-full bg-teal"
              style={{ width: 7, height: 7 }}
            />
            <span className="font-label font-semibold text-[11px] tracking-[0.14em] text-teal-ink">
              {t('hero.eyebrowStatus')}
            </span>
          </ViewportReveal>
          <ViewportReveal as="h1" delay={0.05} className="font-display font-extrabold text-fg m-0 mb-6"
            style={{ fontSize: 'clamp(34px, 7vw, 88px)', lineHeight: 1.02, letterSpacing: '-0.04em' }}>
            {t('hero.headline1')}
            <br />
            <span className="text-brand">{t('hero.headline2')}</span>
          </ViewportReveal>
          <ViewportReveal as="p" delay={0.12} className="text-ink-soft m-0 mb-12"
            style={{ fontSize: 'clamp(17px, 2.2vw, 21px)', lineHeight: 1.6, maxWidth: '56ch' }}>
            {t('hero.sub')}
          </ViewportReveal>
          <ViewportReveal delay={0.2} className="flex flex-col sm:flex-row w-full sm:w-fit bg-white border border-line overflow-hidden" style={{ borderRadius: 2 }}>
            {[
              { v: proof.gpu, l: proof.gpuLabel, c: 'var(--color-blue)' },
              { v: proof.production, l: proof.productionLabel, c: 'var(--color-teal)' },
            ].map((p, i) => (
              <div
                key={i}
                className={`flex flex-col gap-1 ${i < 1 ? 'stat-divider' : ''}`}
                style={{ padding: '18px 28px', borderTop: `3px solid ${p.c}` }}
              >
                <span className="font-display font-bold text-fg" style={{ fontSize: 24, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {p.v}
                </span>
                <span className="font-label font-semibold text-steel" style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {p.l}
                </span>
              </div>
            ))}
          </ViewportReveal>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section id="servicios" className="bg-white border-t border-line" style={{ padding: 'clamp(56px, 10vw, 80px) 0' }}>
        <div className="mx-auto container-px" style={{ maxWidth: 1280 }}>
          <ViewportReveal className={`${eyebrow} mb-3`} style={eyebrowStyle}>
            {t('services.label')}
          </ViewportReveal>
          <ViewportReveal as="h2" delay={0.05} className="font-display font-extrabold text-fg m-0 mb-10"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {t('services.title')}
          </ViewportReveal>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line overflow-hidden"
            style={{ borderRadius: 2 }}
          >
            <ViewportReveal selector=".service-card" variant="stagger-up" stagger={0.08} className="contents">
              {services.map((s, i) => {
                const tone = spectrum[serviceTone[s.code] ?? 'blue'];
                return (
                  <div
                    key={i}
                    className="service-card bg-white flex flex-col"
                    style={{ padding: '28px 24px', gap: 12 }}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className="font-label font-bold rounded-full"
                        style={{ fontSize: 10.5, letterSpacing: '0.12em', color: tone.ink, background: tone.soft, padding: '4px 11px' }}
                      >
                        {s.code}
                      </span>
                      <span
                        aria-hidden="true"
                        style={{ width: 12, height: 12, borderRadius: 2, background: tone.c }}
                      />
                    </div>
                    <h3
                      className="font-display font-bold text-fg m-0"
                      style={{ fontSize: 19, letterSpacing: '-0.015em', lineHeight: 1.25 }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="text-steel m-0"
                      style={{ fontSize: 15, lineHeight: 1.6 }}
                    >
                      {s.body}
                    </p>
                  </div>
                );
              })}
            </ViewportReveal>
          </div>
        </div>
      </section>

      {/* ── PROBLEMS ── */}
      <section id="problemas" className="bg-base border-t border-line" style={{ padding: 'clamp(56px, 10vw, 80px) 0' }}>
        <div className="mx-auto container-px" style={{ maxWidth: 1280 }}>
          <ViewportReveal className={`${eyebrow} mb-3`} style={eyebrowStyle}>
            {t('problems.label')}
          </ViewportReveal>
          <ViewportReveal as="h2" delay={0.05} className="font-display font-extrabold text-fg m-0 mb-10"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {t('problems.title')}
          </ViewportReveal>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line overflow-hidden"
            style={{ borderRadius: 2 }}
          >
            <ViewportReveal selector=".problem-card" variant="stagger-up" stagger={0.1} className="contents">
              {problems.map((p, i) => (
                <div
                  key={i}
                  className="problem-card bg-white flex flex-col"
                  style={{ padding: 32, gap: 12 }}
                >
                  <div
                    className="font-label font-semibold text-steel"
                    style={{ fontSize: 11, letterSpacing: '0.14em' }}
                  >
                    {p.id}
                  </div>
                  <h3
                    className="font-display font-bold text-fg m-0"
                    style={{ fontSize: 20, letterSpacing: '-0.015em', lineHeight: 1.25 }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="text-steel m-0"
                    style={{ fontSize: 16, lineHeight: 1.65 }}
                  >
                    {p.body}
                  </p>
                </div>
              ))}
            </ViewportReveal>
          </div>
        </div>
      </section>

      {/* ── METHOD ── */}
      <section id="metodo" className="bg-blue-soft border-t border-line" style={{ padding: 'clamp(56px, 10vw, 80px) 0' }}>
        <div className="mx-auto container-px" style={{ maxWidth: 1280 }}>
          <ViewportReveal className="font-label font-semibold text-blue-ink uppercase mb-3" style={eyebrowStyle}>
            {t('method.label')}
          </ViewportReveal>
          <ViewportReveal as="h2" delay={0.05} className="font-display font-extrabold text-fg m-0 mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {t('method.title')}
          </ViewportReveal>
          <ViewportReveal as="p" delay={0.12} className="m-0"
            style={{ fontSize: 18, lineHeight: 1.65, maxWidth: '60ch', color: '#10367A' }}>
            {t('method.lead')}
          </ViewportReveal>
        </div>
      </section>

      {/* ── DIFFERENTIATORS ── */}
      <section id="diferencias" className="bg-base border-t border-line" style={{ padding: 'clamp(56px, 10vw, 80px) 0' }}>
        <div className="mx-auto container-px" style={{ maxWidth: 1280 }}>
          <ViewportReveal className={`${eyebrow} mb-3`} style={eyebrowStyle}>
            {t('differentiators.label')}
          </ViewportReveal>
          <ViewportReveal as="h2" delay={0.05} className="font-display font-extrabold text-fg m-0 mb-10"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {t('differentiators.title')}
          </ViewportReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ViewportReveal selector=".diff-card" variant="stagger-up" stagger={0.1} className="contents">
              {differentiators.map((d, i) => {
                const tone = spectrum[cycle[i % cycle.length]];
                return (
                  <div
                    key={i}
                    className="diff-card bg-white border border-line"
                    style={{ padding: 32, borderRadius: 2 }}
                  >
                    <div className="flex items-center gap-2.5 mb-4">
                      <span
                        aria-hidden="true"
                        style={{ width: 10, height: 10, borderRadius: 2, background: tone.c }}
                      />
                      <span
                        className="font-label font-semibold text-steel"
                        style={{ fontSize: 11, letterSpacing: '0.14em' }}
                      >
                        {d.code}
                      </span>
                    </div>
                    <h3
                      className="font-display font-bold text-fg m-0 mb-3"
                      style={{ fontSize: 20, letterSpacing: '-0.015em', lineHeight: 1.25 }}
                    >
                      {d.title}
                    </h3>
                    <p
                      className="text-steel m-0"
                      style={{ fontSize: 16, lineHeight: 1.65 }}
                    >
                      {d.body}
                    </p>
                  </div>
                );
              })}
            </ViewportReveal>
          </div>
        </div>
      </section>

      {/* ── STACK ── */}
      <section id="stack" className="bg-white border-t border-line" style={{ padding: 'clamp(40px, 7vw, 56px) 0' }}>
        <div className="mx-auto container-px" style={{ maxWidth: 1280 }}>
          <ViewportReveal className={`${eyebrow} mb-3`} style={eyebrowStyle}>
            {t('stack.label')}
          </ViewportReveal>
          <ViewportReveal as="p" delay={0.05} className="text-steel m-0 mb-8"
            style={{ fontSize: 16 }}>
            {t('stack.lead')}
          </ViewportReveal>
          <div className="flex flex-wrap gap-2">
            <ViewportReveal selector=".stack-item" variant="stagger-up" stagger={0.04} className="contents">
              {stack.map((s, i) => (
                <div
                  key={i}
                  className="stack-item flex items-center gap-2 bg-base border border-line rounded-full"
                  style={{ padding: '8px 16px' }}
                >
                  <span
                    aria-hidden="true"
                    style={{ width: 8, height: 8, borderRadius: 2, background: spectrum[cycle[i % cycle.length]].c }}
                  />
                  <span
                    className="font-body text-fg font-semibold"
                    style={{ fontSize: 14 }}
                  >
                    {s.name}
                  </span>
                  <span
                    className="font-label font-semibold text-steel"
                    style={{ fontSize: 11, letterSpacing: '0.04em' }}
                  >
                    ★ {s.stars}
                  </span>
                </div>
              ))}
            </ViewportReveal>
          </div>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="contacto" className="bg-base border-t border-line text-center" style={{ padding: 'clamp(64px, 12vw, 96px) 0' }}>
        <div className="mx-auto booking-section-px" style={{ maxWidth: 520 }}>
          <ViewportReveal className="inline-block font-label font-bold text-teal-ink bg-teal-soft rounded-full mb-6"
            style={{ fontSize: 10.5, letterSpacing: '0.14em', padding: '5px 13px' }}>
            {t('booking.tag')}
          </ViewportReveal>
          <ViewportReveal as="h2" delay={0.05} className="font-display font-extrabold text-fg m-0 mb-5"
            style={{ fontSize: 'clamp(30px, 5vw, 52px)', letterSpacing: '-0.035em', lineHeight: 1.08 }}>
            {t('booking.title')}
          </ViewportReveal>
          <ViewportReveal as="p" delay={0.12} className="text-steel m-0 mb-10"
            style={{ fontSize: 18, lineHeight: 1.6 }}>
            {t('booking.sub')}
          </ViewportReveal>
          <ViewportReveal delay={0.2} className="flex justify-center">
            <BookingForm labels={formLabels} />
          </ViewportReveal>
          <ViewportReveal delay={0.28} className="mt-8">
            <p className="text-steel m-0" style={{ fontSize: 15 }}>
              {t('booking.emailLabel')}{' '}
              <a
                href={`mailto:${t('booking.email')}`}
                className="text-brand font-semibold hover:text-brand-hover no-underline border-b border-brand/30 hover:border-brand transition-colors"
              >
                {t('booking.email')}
              </a>
            </p>
          </ViewportReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
