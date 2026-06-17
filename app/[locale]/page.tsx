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

  return (
    <div id="top" className="relative bg-base text-fg">
      <Topbar />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden bg-fg text-white"
        style={{ padding: 'clamp(56px, 12vw, 96px) 0 clamp(56px, 10vw, 80px)' }}
      >
        <div className="bg-grid" />
        <div className="relative z-10 mx-auto container-px" style={{ maxWidth: 1280 }}>
          <ViewportReveal className="flex items-center gap-2.5 mb-7">
            <span className="font-mono text-[10px] tracking-[0.14em] text-white/35">
              {t('hero.eyebrowLocation')}
            </span>
            <span className="font-mono text-[10px] text-operations">●</span>
            <span className="font-mono text-[10px] tracking-[0.14em] text-white/35">
              {t('hero.eyebrowStatus')}
            </span>
          </ViewportReveal>
          <ViewportReveal as="h1" delay={0.05} className="font-display font-bold text-white m-0 mb-6"
            style={{ fontSize: 'clamp(34px, 7vw, 88px)', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
            {t('hero.headline1')}
            <br />
            <span className="text-accent">{t('hero.headline2')}</span>
          </ViewportReveal>
          <ViewportReveal as="p" delay={0.12} className="text-white/65 m-0 mb-12"
            style={{ fontSize: 'clamp(17px, 2.2vw, 22px)', lineHeight: 1.55, maxWidth: '56ch' }}>
            {t('hero.sub')}
          </ViewportReveal>
          <ViewportReveal delay={0.2} className="flex flex-col sm:flex-row w-full sm:w-fit border border-white/10 overflow-hidden" style={{ borderRadius: 4 }}>
            {[
              { v: proof.gpu, l: proof.gpuLabel },
              { v: proof.production, l: proof.productionLabel },
            ].map((p, i) => (
              <div
                key={i}
                className={`flex flex-col gap-0.5 ${i < 1 ? 'stat-divider' : ''}`}
                style={{ padding: '16px 28px' }}
              >
                <span className="font-display font-bold text-white" style={{ fontSize: 22 }}>
                  {p.v}
                </span>
                <span className="font-mono text-white/35" style={{ fontSize: 10, letterSpacing: '0.1em' }}>
                  {p.l}
                </span>
              </div>
            ))}
          </ViewportReveal>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section id="servicios" className="bg-white" style={{ padding: 'clamp(56px, 10vw, 80px) 0' }}>
        <div className="mx-auto container-px" style={{ maxWidth: 1280 }}>
          <ViewportReveal className="font-mono text-brand font-semibold mb-3"
            style={{ fontSize: 10, letterSpacing: '0.18em' }}>
            {t('services.label')}
          </ViewportReveal>
          <ViewportReveal as="h2" delay={0.05} className="font-display font-bold text-fg m-0 mb-10"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em' }}>
            {t('services.title')}
          </ViewportReveal>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line overflow-hidden"
            style={{ borderRadius: 4 }}
          >
            <ViewportReveal selector=".service-card" variant="stagger-up" stagger={0.08} className="contents">
              {services.map((s, i) => {
                const colorMap: Record<string, string> = {
                  'S-01': 'var(--color-research)',
                  'S-02': 'var(--color-operations)',
                  'S-03': 'var(--color-data)',
                  'S-04': 'var(--color-infrastructure)',
                };
                const color = colorMap[s.code] ?? 'var(--color-brand)';
                return (
                  <div
                    key={i}
                    className="service-card bg-white flex flex-col"
                    style={{ padding: '28px 24px', gap: 12 }}
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className="font-mono font-semibold"
                        style={{ fontSize: 11, letterSpacing: '0.1em', color }}
                      >
                        {s.code}
                      </div>
                      <div
                        className="rounded-sm"
                        style={{ width: 20, height: 3, background: color, marginTop: 5 }}
                      />
                    </div>
                    <h3
                      className="font-display font-bold text-fg m-0"
                      style={{ fontSize: 19, letterSpacing: '-0.01em' }}
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
      <section id="problemas" className="bg-base" style={{ padding: 'clamp(56px, 10vw, 80px) 0' }}>
        <div className="mx-auto container-px" style={{ maxWidth: 1280 }}>
          <ViewportReveal className="font-mono text-brand font-semibold mb-3"
            style={{ fontSize: 10, letterSpacing: '0.18em' }}>
            {t('problems.label')}
          </ViewportReveal>
          <ViewportReveal as="h2" delay={0.05} className="font-display font-bold text-fg m-0 mb-10"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em' }}>
            {t('problems.title')}
          </ViewportReveal>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line overflow-hidden"
            style={{ borderRadius: 4 }}
          >
            <ViewportReveal selector=".problem-card" variant="stagger-up" stagger={0.1} className="contents">
              {problems.map((p, i) => (
                <div
                  key={i}
                  className="problem-card bg-white flex flex-col"
                  style={{ padding: 32, gap: 12 }}
                >
                  <div
                    className="font-mono text-steel-light"
                    style={{ fontSize: 11, letterSpacing: '0.12em' }}
                  >
                    {p.id}
                  </div>
                  <h3
                    className="font-display font-bold text-fg m-0"
                    style={{ fontSize: 20, letterSpacing: '-0.01em' }}
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
      <section id="metodo" className="bg-fg text-white" style={{ padding: 'clamp(56px, 10vw, 80px) 0' }}>
        <div className="mx-auto container-px" style={{ maxWidth: 1280 }}>
          <ViewportReveal className="font-mono text-white/35 font-semibold mb-3"
            style={{ fontSize: 10, letterSpacing: '0.18em' }}>
            {t('method.label')}
          </ViewportReveal>
          <ViewportReveal as="h2" delay={0.05} className="font-display font-bold text-white m-0 mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em' }}>
            {t('method.title')}
          </ViewportReveal>
          <ViewportReveal as="p" delay={0.12} className="text-white/60 m-0"
            style={{ fontSize: 18, lineHeight: 1.65, maxWidth: '60ch', marginTop: -16 }}>
            {t('method.lead')}
          </ViewportReveal>
        </div>
      </section>

      {/* ── DIFFERENTIATORS ── */}
      <section id="diferencias" className="bg-white" style={{ padding: 'clamp(56px, 10vw, 80px) 0' }}>
        <div className="mx-auto container-px" style={{ maxWidth: 1280 }}>
          <ViewportReveal className="font-mono text-brand font-semibold mb-3"
            style={{ fontSize: 10, letterSpacing: '0.18em' }}>
            {t('differentiators.label')}
          </ViewportReveal>
          <ViewportReveal as="h2" delay={0.05} className="font-display font-bold text-fg m-0 mb-10"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em' }}>
            {t('differentiators.title')}
          </ViewportReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ViewportReveal selector=".diff-card" variant="stagger-up" stagger={0.1} className="contents">
              {differentiators.map((d, i) => (
                <div
                  key={i}
                  className="diff-card bg-white border border-line"
                  style={{ padding: 32, borderRadius: 4 }}
                >
                  <div
                    className="font-mono text-steel-light mb-3"
                    style={{ fontSize: 10, letterSpacing: '0.14em' }}
                  >
                    {d.code}
                  </div>
                  <h3
                    className="font-display font-bold text-fg m-0 mb-3"
                    style={{ fontSize: 20, letterSpacing: '-0.01em' }}
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
              ))}
            </ViewportReveal>
          </div>
        </div>
      </section>

      {/* ── STACK ── */}
      <section id="stack" className="bg-fg text-white" style={{ padding: 'clamp(40px, 7vw, 56px) 0' }}>
        <div className="mx-auto container-px" style={{ maxWidth: 1280 }}>
          <ViewportReveal className="font-mono text-white/35 font-semibold mb-3"
            style={{ fontSize: 10, letterSpacing: '0.18em' }}>
            {t('stack.label')}
          </ViewportReveal>
          <ViewportReveal as="p" delay={0.05} className="text-white/50 m-0 mb-8 italic"
            style={{ fontSize: 16, marginTop: -8 }}>
            {t('stack.lead')}
          </ViewportReveal>
          <div className="flex flex-wrap gap-2">
            <ViewportReveal selector=".stack-item" variant="stagger-up" stagger={0.04} className="contents">
              {stack.map((s, i) => (
                <div
                  key={i}
                  className="stack-item flex items-center gap-2 bg-white/[0.05] border border-white/[0.08]"
                  style={{ borderRadius: 2, padding: '8px 16px' }}
                >
                  <span
                    className="font-mono text-white/80 font-semibold"
                    style={{ fontSize: 12, letterSpacing: '0.04em' }}
                  >
                    {s.name}
                  </span>
                  <span
                    className="font-mono text-white/25"
                    style={{ fontSize: 10 }}
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
      <section id="contacto" className="bg-fg text-white text-center" style={{ padding: 'clamp(64px, 12vw, 96px) 0' }}>
        <div className="mx-auto booking-section-px" style={{ maxWidth: 520 }}>
          <ViewportReveal className="inline-block font-mono text-operations border border-operations mb-6"
            style={{ fontSize: 10, letterSpacing: '0.16em', padding: '4px 12px', borderRadius: 2 }}>
            {t('booking.tag')}
          </ViewportReveal>
          <ViewportReveal as="h2" delay={0.05} className="font-display font-bold text-white m-0 mb-5"
            style={{ fontSize: 'clamp(30px, 5vw, 52px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            {t('booking.title')}
          </ViewportReveal>
          <ViewportReveal as="p" delay={0.12} className="text-white/55 m-0 mb-10"
            style={{ fontSize: 18, lineHeight: 1.6 }}>
            {t('booking.sub')}
          </ViewportReveal>
          <ViewportReveal delay={0.2} className="flex justify-center">
            <BookingForm labels={formLabels} />
          </ViewportReveal>
          <ViewportReveal delay={0.28} className="mt-8">
            <p className="font-mono text-white/40 m-0" style={{ fontSize: 13, letterSpacing: '0.04em' }}>
              {t('booking.emailLabel')}{' '}
              <a
                href={`mailto:${t('booking.email')}`}
                className="text-white/80 hover:text-white no-underline border-b border-white/20 hover:border-white/60 transition-colors"
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
