import { getTranslations, setRequestLocale } from 'next-intl/server';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import ViewportReveal from '@/components/ViewportReveal';
import ContactForm from '@/components/ContactForm';
import TerminalHero from '@/components/terminal/TerminalHero';
import BootLoader from '@/components/terminal/BootLoader';
import RouteStory, { RouteStep } from '@/components/v2/RouteStory';
import AutonomyLevels, { AutonomyLevel } from '@/components/v2/AutonomyLevels';
import Marquee from '@/components/v2/Marquee';
import { rich } from '@/components/terminal/rich';
import TeamAvatar from '@/components/terminal/TeamAvatar';
import AgenticStages from '@/components/terminal/AgenticStages';

type TB = { title: string; body: string };
type ServiceItem = TB & { meta: string };

const TONES = ['blue', 'teal', 'purple', 'orange'] as const;

/** `## 02 — label` section label (hash and number are decoration; the translated label is untouched). */
function Eyebrow({ n, children }: { n: string; children: string }) {
  return (
    <>
      <span className="eyebrow__p" aria-hidden="true">{`## ${n} — `}</span>
      {children}
    </>
  );
}

/** `$ label` sub-label. */
function Cmd({ children }: { children: string }) {
  return (
    <>
      <span className="eyebrow__p" aria-hidden="true">$ </span>
      {children}
    </>
  );
}

function SectionHead({ n, label, title, lead, id }: { n: string; label: string; title: string; lead?: string; id: string }) {
  return (
    <div className="sec-head">
      <ViewportReveal as="p" className="eyebrow"><Eyebrow n={n}>{label}</Eyebrow></ViewportReveal>
      <ViewportReveal as="h2" delay={0.05} className="h-section" id={id}>{rich(title)}</ViewportReveal>
      {lead ? (
        <ViewportReveal as="p" delay={0.1} className="lead" style={{ marginTop: 20, maxWidth: '62ch' }}>{rich(lead)}</ViewportReveal>
      ) : null}
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const raw = <T,>(key: string) => t.raw(key) as T;

  const shiftItems = raw<TB[]>('shift.items');
  const problems = raw<Array<TB & { id: string }>>('problems.items');
  const steps = raw<RouteStep[]>('route.steps');
  const groups = raw<Array<{ name: string; items: ServiceItem[] }>>('services.groups');
  const models = raw<TB[]>('services.models');
  const levels = raw<AutonomyLevel[]>('governance.levels');
  const principles = raw<TB[]>('governance.principles');
  const teams = raw<Array<{ id: string; name: string; body: string }>>('agentos.teams');
  const board = raw<{ label: string; cols: string[]; task1: string; task2: string; task3: string; rule: string }>('agentos.board');
  const aosPrinciples = raw<string[]>('agentos.principles');
  const stack = raw<string[]>('stack.items');
  const faq = raw<Array<{ q: string; a: string }>>('faq.items');
  const formLabels = raw<Parameters<typeof ContactForm>[0]['labels']>('booking.form');
  // Google Calendar appointment schedule "Diagnóstico · Mty Agentic Labs" (30 min, Meet). Override with NEXT_PUBLIC_BOOKING_URL.
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || 'https://calendar.app.google/ukwpncvbEMDMsxmv7';

  return (
    <div id="top" className="relative bg-base text-fg">
      <BootLoader locale={locale} tagline={t('hero.headline1') + ' ' + t('hero.headline2')} />
      <Topbar />

      <main id="contenido" className="curtain-main">
        <div className="frame">
          {/* ── HERO ── */}
          <TerminalHero
            locale={locale}
            copy={{
              location: t('hero.eyebrowLocation'),
              status: t('hero.eyebrowStatus'),
              h1a: t('hero.headline1'),
              h1b: t('hero.headline2'),
              kicker: t('hero.kicker'),
              sub: t('hero.sub'),
              ctaPrimary: t('hero.ctaPrimary'),
              ctaSecondary: t('hero.ctaSecondary'),
              proofB: t('hero.proof.b'),
              proofBLabel: t('hero.proof.bLabel'),
            }}
          />

          {/* ── EL CAMBIO ── */}
          <section className="sec sec--alt" aria-labelledby="shift-title">
            <ViewportReveal as="p" className="eyebrow"><Eyebrow n="01">{t('shift.label')}</Eyebrow></ViewportReveal>
            <ViewportReveal as="h2" delay={0.05} id="shift-title" className="h-section shift__title">{rich(t('shift.title'))}</ViewportReveal>
            <ViewportReveal as="p" delay={0.1} className="lead" style={{ marginTop: 24, maxWidth: '58ch' }}>{rich(t('shift.lead'))}</ViewportReveal>
            <ViewportReveal selector=".shift__item" variant="stagger-up" stagger={0.08} className="shift__grid">
              {shiftItems.map((it, i) => (
                <div key={it.title} className="shift__item" style={{ ['--c' as string]: `var(--color-${TONES[i]})` }}>
                  <span className="shift__cube" aria-hidden="true" />
                  <h3>{it.title}</h3>
                  <p>{rich(it.body)}</p>
                </div>
              ))}
            </ViewportReveal>
          </section>

          {/* ── PUNTO DE PARTIDA ── */}
          <section className="sec" id="problemas" aria-labelledby="problems-title">
            <SectionHead n="02" label={t('problems.label')} title={t('problems.title')} id="problems-title" />
            <ViewportReveal as="ol" selector=".problem" variant="stagger-up" stagger={0.08} className="problems">
              {problems.map((p) => (
                <li key={p.id} className="problem">
                  <div className="problem__q">
                    <span className="eyebrow">{p.id}</span>
                    <h3>{p.title}</h3>
                  </div>
                  <span className="problem__link" aria-hidden="true"><i /></span>
                  <div className="problem__a">
                    <p className="problem__tag"><span aria-hidden="true">❯ </span>{t('problems.answerLabel')}</p>
                    <p>{rich(p.body)}</p>
                  </div>
                </li>
              ))}
            </ViewportReveal>
          </section>

          {/* ── LA RUTA ── */}
          <section className="sec sec--alt" id="ruta" aria-labelledby="route-title">
            <SectionHead n="03" label={t('route.label')} title={t('route.title')} id="route-title" />
            <AgenticStages stages={raw<Array<{ label: string; text: string }>>('route.stages')} ariaLabel={t('route.stagesAria')} />
            <RouteStory steps={steps} caption={t('route.caption')} />
          </section>

          {/* ── SERVICIOS ── */}
          <section className="sec" id="servicios" aria-labelledby="services-title">
            <SectionHead n="04" label={t('services.label')} title={t('services.title')} id="services-title" />
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
              <p className="eyebrow"><Cmd>{t('services.modelsLabel')}</Cmd></p>
              <div className="models__grid">
                {models.map((m) => (
                  <div key={m.title} className="models__item">
                    <h4>{m.title}</h4>
                    <p>{m.body}</p>
                  </div>
                ))}
              </div>
              <p className="models__note">{rich(t('services.note'))}</p>
            </div>
          </section>

          {/* ── GOBERNANZA ── */}
          <section className="sec sec--alt" id="gobernanza" aria-labelledby="gov-title">
            <SectionHead n="05" label={t('governance.label')} title={t('governance.title')} lead={t('governance.lead')} id="gov-title" />
            <AutonomyLevels levels={levels} humanLabel={t('governance.humanLabel')} />
            <ViewportReveal selector=".principle" variant="stagger-up" stagger={0.06} className="principles">
              {principles.map((p, i) => (
                <div key={p.title} className="principle" style={{ ['--c' as string]: `var(--color-${TONES[i]})` }}>
                  <span className="principle__cube" aria-hidden="true" />
                  <h3>{p.title}</h3>
                  <p>{rich(p.body)}</p>
                </div>
              ))}
            </ViewportReveal>
          </section>

          {/* ── AGENTOS ── */}
          <section className="sec" id="agentos" aria-labelledby="aos-title">
            <div className="aos">
              <div>
                <SectionHead n="06" label={t('agentos.label')} title={t('agentos.title')} lead={t('agentos.lead')} id="aos-title" />
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
                      <p className="board__col-name">{c}<span aria-hidden="true">{ci === 1 ? 2 : ci === 0 ? 1 : 0}</span></p>
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
            <p className="eyebrow" style={{ marginTop: 56 }}><Cmd>{t('agentos.teamsLabel')}</Cmd></p>
            <ViewportReveal as="ul" selector=".team" variant="stagger-up" stagger={0.05} className="teams">
              {teams.map((tm, i) => (
                <li key={tm.name} className="team" style={{ ['--c' as string]: `var(--color-${TONES[i % 4]})` }}>
                  <TeamAvatar team={tm.id} />
                  <h3>{tm.name}</h3>
                  <p>{tm.body}</p>
                </li>
              ))}
            </ViewportReveal>
          </section>

          {/* ── ECOSISTEMA ── */}
          <section className="sec" id="stack" aria-labelledby="stack-title" style={{ paddingTop: 'clamp(48px, 7vw, 72px)', paddingBottom: 'clamp(48px, 7vw, 72px)' }}>
            <p className="eyebrow" id="stack-title"><Eyebrow n="07">{t('stack.label')}</Eyebrow></p>
            <p className="lead" style={{ margin: '14px 0 28px', maxWidth: '60ch' }}>{rich(t('stack.lead'))}</p>
            <Marquee items={stack} pause={t('stack.pause')} resume={t('stack.resume')} label={t('stack.aria')} />
          </section>

          {/* ── PREGUNTAS ── */}
          <section className="sec sec--alt" id="preguntas" aria-labelledby="faq-title">
            <div className="faq">
              <SectionHead n="08" label={t('faq.label')} title={t('faq.title')} id="faq-title" />
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
                <h2 id="booking-title" className="h-section" style={{ fontSize: 'clamp(24px, 6.4vw, 52px)' }}>{rich(t('booking.title'))}</h2>
                <p className="lead" style={{ marginTop: 20 }}>{rich(t('booking.sub'))}</p>
                <p className="booking__mail">
                  {t('booking.emailLabel')}{' '}
                  <a href={`mailto:${t('booking.email')}`}>
                    {t('booking.email')}
                  </a>
                </p>
              </div>
              <div className="booking__form">
                <div className="bk cal">
                  <div className="bk__title">{t('booking.calendarTitle')}</div>
                  <div className="bk__body">
                    <p className="cal__meta"><span aria-hidden="true">└─ </span>{t('booking.calendarMeta')}</p>
                    <a className="btn btn-primary cal__cta" href={bookingUrl} target={bookingUrl.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                      {t('booking.calendarCta')}
                    </a>
                    <p className="cal__text">{t('booking.calendarBody')}</p>
                  </div>
                </div>
                <p className="booking__or"><span>{t('booking.or')}</span></p>
                <ContactForm labels={formLabels} email={t('booking.email')} locale={locale} />
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
