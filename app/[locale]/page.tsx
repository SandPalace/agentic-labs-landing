import { getTranslations, setRequestLocale } from 'next-intl/server';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import ViewportReveal from '@/components/ViewportReveal';
import BookingForm from '@/components/BookingForm';
import HeroConsole, { HeroConsoleLabels } from '@/components/v2/HeroConsole';
import RouteStory, { RouteStep } from '@/components/v2/RouteStory';
import AutonomyLevels, { AutonomyLevel } from '@/components/v2/AutonomyLevels';
import Marquee from '@/components/v2/Marquee';

type TB = { title: string; body: string };
type ServiceItem = TB & { meta: string };

const TONES = ['blue', 'teal', 'purple', 'orange'] as const;

function SectionHead({ label, title, lead, id }: { label: string; title: string; lead?: string; id: string }) {
  return (
    <div className="sec-head">
      <ViewportReveal as="p" className="eyebrow">{label}</ViewportReveal>
      <ViewportReveal as="h2" delay={0.05} className="h-section" id={id}>{title}</ViewportReveal>
      {lead ? (
        <ViewportReveal as="p" delay={0.1} className="lead" style={{ marginTop: 20, maxWidth: '62ch' }}>{lead}</ViewportReveal>
      ) : null}
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const raw = <T,>(key: string) => t.raw(key) as T;

  const consoleLabels = raw<HeroConsoleLabels>('hero.console');
  const shiftItems = raw<TB[]>('shift.items');
  const problems = raw<Array<TB & { id: string }>>('problems.items');
  const steps = raw<RouteStep[]>('route.steps');
  const groups = raw<Array<{ name: string; items: ServiceItem[] }>>('services.groups');
  const models = raw<TB[]>('services.models');
  const levels = raw<AutonomyLevel[]>('governance.levels');
  const principles = raw<TB[]>('governance.principles');
  const teams = raw<Array<{ name: string; body: string }>>('agentos.teams');
  const board = raw<{ label: string; cols: string[]; task1: string; task2: string; task3: string; rule: string }>('agentos.board');
  const aosPrinciples = raw<string[]>('agentos.principles');
  const work = raw<Array<{ sector: string; body: string; tag: string }>>('work.items');
  const stack = raw<string[]>('stack.items');
  const faq = raw<Array<{ q: string; a: string }>>('faq.items');
  const formLabels = raw<Parameters<typeof BookingForm>[0]['labels']>('booking.form');

  return (
    <div id="top" className="relative bg-base text-fg">
      <Topbar />

      <main id="contenido" className="curtain-main">
        <div className="frame">
          {/* ── HERO ── */}
          <section className="sec hero" aria-labelledby="hero-title">
            <div className="hero__copy">
              <p className="eyebrow hero__status fade-in-up">
                <span>{t('hero.eyebrowLocation')}</span>
                <span className="pulse" aria-hidden="true" />
                <span style={{ color: 'var(--color-teal-ink)' }}>{t('hero.eyebrowStatus')}</span>
              </p>
              <h1 id="hero-title" className="h-display hero__title">
                <span className="mask-line"><span>{t('hero.headline1')}</span></span>
                <span className="mask-line"><span className="text-brand">{t('hero.headline2')}</span></span>
                <span className="spectrum-rule" aria-hidden="true" />
              </h1>
              <p className="hero__kicker fade-in-up" style={{ animationDelay: '350ms' }}>{t('hero.kicker')}</p>
              <p className="lead hero__sub fade-in-up" style={{ animationDelay: '420ms' }}>{t('hero.sub')}</p>
              <div className="hero__actions fade-in-up" style={{ animationDelay: '500ms' }}>
                <a className="btn btn-primary" href="#contacto">
                  {t('hero.ctaPrimary')} <span className="arrow" aria-hidden="true">→</span>
                </a>
                <a className="btn btn-ghost" href="#ruta">{t('hero.ctaSecondary')}</a>
              </div>
              <dl className="proof fade-in-up" style={{ animationDelay: '580ms' }}>
                <div style={{ ['--c' as string]: 'var(--color-blue)' }}>
                  <dt className="sr-only">{t('hero.proof.aLabel')}</dt>
                  <dd>
                    <b>{t('hero.proof.a')}</b>
                    <span>{t('hero.proof.aLabel')}</span>
                  </dd>
                </div>
                <div style={{ ['--c' as string]: 'var(--color-teal)' }}>
                  <dt className="sr-only">{t('hero.proof.bLabel')}</dt>
                  <dd>
                    <b>{t('hero.proof.b')}</b>
                    <span>{t('hero.proof.bLabel')}</span>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="hero__visual fade-in-up" style={{ animationDelay: '300ms' }}>
              <HeroConsole labels={consoleLabels} />
            </div>
          </section>

          {/* ── EL CAMBIO ── */}
          <section className="sec" aria-labelledby="shift-title" style={{ background: 'var(--color-white)' }}>
            <ViewportReveal as="p" className="eyebrow">{t('shift.label')}</ViewportReveal>
            <ViewportReveal as="h2" delay={0.05} id="shift-title" className="h-section shift__title">{t('shift.title')}</ViewportReveal>
            <ViewportReveal as="p" delay={0.1} className="lead" style={{ marginTop: 24, maxWidth: '58ch' }}>{t('shift.lead')}</ViewportReveal>
            <ViewportReveal selector=".shift__item" variant="stagger-up" stagger={0.08} className="shift__grid">
              {shiftItems.map((it, i) => (
                <div key={it.title} className="shift__item" style={{ ['--c' as string]: `var(--color-${TONES[i]})` }}>
                  <span className="shift__cube" aria-hidden="true" />
                  <h3>{it.title}</h3>
                  <p>{it.body}</p>
                </div>
              ))}
            </ViewportReveal>
          </section>

          {/* ── PUNTO DE PARTIDA ── */}
          <section className="sec" id="problemas" aria-labelledby="problems-title">
            <SectionHead label={t('problems.label')} title={t('problems.title')} id="problems-title" />
            <ViewportReveal as="ol" selector=".problem" variant="stagger-up" stagger={0.08} className="problems">
              {problems.map((p) => (
                <li key={p.id} className="problem">
                  <div className="problem__q">
                    <span className="eyebrow">{p.id}</span>
                    <h3>{p.title}</h3>
                  </div>
                  <span className="problem__link" aria-hidden="true"><i /></span>
                  <p className="problem__a">{p.body}</p>
                </li>
              ))}
            </ViewportReveal>
          </section>

          {/* ── LA RUTA ── */}
          <section className="sec" id="ruta" aria-labelledby="route-title" style={{ background: 'var(--color-white)' }}>
            <SectionHead label={t('route.label')} title={t('route.title')} lead={t('route.lead')} id="route-title" />
            <RouteStory steps={steps} caption={t('route.caption')} />
          </section>

          {/* ── SERVICIOS ── */}
          <section className="sec" id="servicios" aria-labelledby="services-title">
            <SectionHead label={t('services.label')} title={t('services.title')} id="services-title" />
            <div className="svc">
              {groups.map((g, gi) => (
                <div key={g.name} className="svc__group" data-group={gi}>
                  <ViewportReveal as="h3" className="svc__group-name">
                    <span aria-hidden="true" className="svc__group-cube" style={{ background: gi === 0 ? 'var(--color-teal)' : 'var(--color-orange)' }} />
                    {g.name}
                  </ViewportReveal>
                  <ViewportReveal selector=".svc__card" variant="stagger-up" stagger={0.06} className={`svc__cards svc__cards--${gi}`}>
                    {g.items.map((s) => (
                      <article key={s.title} className="svc__card">
                        <h4>{s.title}</h4>
                        <p>{s.body}</p>
                        {s.meta ? <p className="svc__meta">{s.meta}</p> : null}
                      </article>
                    ))}
                  </ViewportReveal>
                </div>
              ))}
            </div>
            <div className="models">
              <p className="eyebrow">{t('services.modelsLabel')}</p>
              <div className="models__grid">
                {models.map((m) => (
                  <div key={m.title} className="models__item">
                    <h4>{m.title}</h4>
                    <p>{m.body}</p>
                  </div>
                ))}
              </div>
              <p className="models__note">{t('services.note')}</p>
            </div>
          </section>

          {/* ── GOBERNANZA ── */}
          <section className="sec" id="gobernanza" aria-labelledby="gov-title" style={{ background: 'var(--color-white)' }}>
            <SectionHead label={t('governance.label')} title={t('governance.title')} lead={t('governance.lead')} id="gov-title" />
            <AutonomyLevels levels={levels} humanLabel={t('governance.humanLabel')} />
            <ViewportReveal selector=".principle" variant="stagger-up" stagger={0.06} className="principles">
              {principles.map((p, i) => (
                <div key={p.title} className="principle" style={{ ['--c' as string]: `var(--color-${TONES[i]})` }}>
                  <span className="principle__cube" aria-hidden="true" />
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </ViewportReveal>
          </section>

          {/* ── AGENTOS ── */}
          <section className="sec" id="agentos" aria-labelledby="aos-title">
            <div className="aos">
              <div>
                <SectionHead label={t('agentos.label')} title={t('agentos.title')} lead={t('agentos.lead')} id="aos-title" />
                <p className="aos__status eyebrow"><span className="pulse" aria-hidden="true" />{t('agentos.status')}</p>
                <ul className="aos__principles">
                  {aosPrinciples.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <ViewportReveal className="board" delay={0.1}>
                <div className="board__bar">
                  <span className="eyebrow">{board.label}</span>
                  <span className="board__dots" aria-hidden="true"><i /><i /><i /><i /></span>
                </div>
                <div className="board__cols">
                  {board.cols.map((c, ci) => (
                    <div key={c} className="board__col" data-col={ci}>
                      <p className="board__col-name">{c}</p>
                      {ci === 0 ? <div className="board__task" style={{ ['--c' as string]: 'var(--color-orange)' }}>{board.task3}</div> : null}
                      {ci === 1 ? (
                        <>
                          <div className="board__task" style={{ ['--c' as string]: 'var(--color-teal)' }}>{board.task1}</div>
                          <div className="board__task board__task--moving" style={{ ['--c' as string]: 'var(--color-blue)' }}>{board.task2}</div>
                        </>
                      ) : null}
                      {ci === 2 ? <div className="board__slot" aria-hidden="true" /> : null}
                    </div>
                  ))}
                </div>
                <p className="board__rule">{board.rule}</p>
              </ViewportReveal>
            </div>
            <p className="eyebrow" style={{ marginTop: 56 }}>{t('agentos.teamsLabel')}</p>
            <ViewportReveal as="ul" selector=".team" variant="stagger-up" stagger={0.05} className="teams">
              {teams.map((tm, i) => (
                <li key={tm.name} className="team" style={{ ['--c' as string]: `var(--color-${TONES[i % 4]})` }}>
                  <span className="team__cube" aria-hidden="true" />
                  <h3>{tm.name}</h3>
                  <p>{tm.body}</p>
                </li>
              ))}
            </ViewportReveal>
          </section>

          {/* ── CASOS ── */}
          <section className="sec" id="casos" aria-labelledby="work-title" style={{ background: 'var(--color-white)' }}>
            <SectionHead label={t('work.label')} title={t('work.title')} lead={t('work.lead')} id="work-title" />
            <ViewportReveal as="ul" selector=".case" variant="stagger-up" stagger={0.06} className="cases">
              {work.map((w, i) => (
                <li key={w.sector} className="case" style={{ ['--c' as string]: `var(--color-${TONES[i % 4]})`, ['--soft' as string]: `var(--color-${TONES[i % 4]}-soft)`, ['--ink' as string]: `var(--color-${TONES[i % 4]}-ink)` }}>
                  <span className="case__tag">{w.tag}</span>
                  <h3>{w.sector}</h3>
                  <p>{w.body}</p>
                </li>
              ))}
            </ViewportReveal>
            <p className="speaking"><span className="speaking__mark" aria-hidden="true" />{t('work.speaking')}</p>
          </section>

          {/* ── ECOSISTEMA ── */}
          <section className="sec" id="stack" aria-labelledby="stack-title" style={{ paddingTop: 'clamp(48px, 7vw, 72px)', paddingBottom: 'clamp(48px, 7vw, 72px)' }}>
            <p className="eyebrow" id="stack-title">{t('stack.label')}</p>
            <p className="lead" style={{ margin: '14px 0 28px', maxWidth: '60ch' }}>{t('stack.lead')}</p>
            <Marquee items={stack} pause={t('stack.pause')} resume={t('stack.resume')} label={t('stack.aria')} />
          </section>

          {/* ── PREGUNTAS ── */}
          <section className="sec" id="preguntas" aria-labelledby="faq-title" style={{ background: 'var(--color-white)' }}>
            <div className="faq">
              <SectionHead label={t('faq.label')} title={t('faq.title')} id="faq-title" />
              <div className="faq__list">
                {faq.map((f, i) => (
                  <details key={f.q} className="faq__item" open={i === 0}>
                    <summary>
                      <span>{f.q}</span>
                      <span className="faq__icon" aria-hidden="true" />
                    </summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* ── CONTACTO ── */}
          <section className="sec" id="contacto" aria-labelledby="booking-title">
            <div className="booking">
              <div className="booking__copy">
                <span className="booking__tag">{t('booking.tag')}</span>
                <h2 id="booking-title" className="h-section" style={{ fontSize: 'clamp(34px, 5vw, 64px)' }}>{t('booking.title')}</h2>
                <p className="lead" style={{ marginTop: 20 }}>{t('booking.sub')}</p>
                <p className="text-steel" style={{ fontSize: 15, marginTop: 28 }}>
                  {t('booking.emailLabel')}{' '}
                  <a href={`mailto:${t('booking.email')}`} className="text-brand font-semibold no-underline border-b border-brand/30 hover:border-brand transition-colors">
                    {t('booking.email')}
                  </a>
                </p>
              </div>
              <div className="booking__form">
                <BookingForm labels={formLabels} />
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
