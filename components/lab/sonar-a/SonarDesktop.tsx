'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import SonarGrid from '@/components/terminal/SonarGrid';
import Terminal, { type TerminalLabels } from './Terminal';
import Screensaver from './Screensaver';

export interface DesktopCopy {
  locale: string;
  eyebrowLocation: string; eyebrowStatus: string;
  headline1: string; headline2: string; kicker: string; sub: string;
  ctaPrimary: string; ctaSecondary: string;
  proofA: string; proofALabel: string; proofB: string; proofBLabel: string;
  terminal: TerminalLabels;
  ui: { saver: string; saverHint: string; workspace: string; screensaverLabel: string };
}

// Module-level ring palettes (a new array each render would restart the grid).
const RINGS = [
  ['#2D6BFF', '#8B5CF6', '#14B8A6'],
  ['#14B8A6', '#2D6BFF', '#8B5CF6'],
  ['#8B5CF6', '#FF7A2F', '#2D6BFF'],
  ['#FF7A2F', '#8B5CF6', '#14B8A6'],
];
const WS = [
  { text: '#7aa2f7', accent: '#2D6BFF', grad: 'linear-gradient(135deg,#2D6BFF,#8B5CF6 55%,#14B8A6)' },
  { text: '#2ac3de', accent: '#14B8A6', grad: 'linear-gradient(135deg,#14B8A6,#2D6BFF 60%,#8B5CF6)' },
  { text: '#bb9af7', accent: '#8B5CF6', grad: 'linear-gradient(135deg,#8B5CF6,#FF7A2F 60%,#2D6BFF)' },
  { text: '#ff9e64', accent: '#FF7A2F', grad: 'linear-gradient(135deg,#FF7A2F,#8B5CF6 60%,#14B8A6)' },
] as const;
const GLYPHS = '·:+×#';
const IDLE_MS = 25000;

type TileId = 'main' | 'term' | 'info';

export default function SonarDesktop({ copy }: { copy: DesktopCopy }) {
  const [ws, setWs] = useState(0);
  const [active, setActive] = useState<TileId>('main');
  const [saver, setSaver] = useState(false);
  const [clock, setClock] = useState('--:--');
  const [day, setDay] = useState('');
  const [fontKey, setFontKey] = useState(0);
  const idle = useRef<number | undefined>(undefined);
  const es = copy.locale === 'es';

  // Canvas picks its font at mount: remount it when the lab font switcher changes data-font.
  useEffect(() => {
    const lab = document.querySelector('.lab');
    if (!lab) return;
    const mo = new MutationObserver(() => setFontKey((k) => k + 1));
    mo.observe(lab, { attributes: true, attributeFilter: ['data-font'] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const loc = es ? 'es-MX' : 'en-US';
      setClock(d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Monterrey' }));
      setDay(d.toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'America/Monterrey' }).replace(/\./g, ''));
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [es]);

  const openSaver = useCallback(() => setSaver(true), []);
  const closeSaver = useCallback(() => setSaver(false), []);

  // Keyboard shortcut: Alt+S.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.code === 'KeyS' && !e.repeat) { e.preventDefault(); setSaver(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Idle screensaver (desktop pointers only).
  useEffect(() => {
    if (saver || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const arm = () => {
      window.clearTimeout(idle.current);
      idle.current = window.setTimeout(() => setSaver(true), IDLE_MS);
    };
    const evs = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'scroll'] as const;
    evs.forEach((n) => window.addEventListener(n, arm, { passive: true }));
    arm();
    return () => { window.clearTimeout(idle.current); evs.forEach((n) => window.removeEventListener(n, arm)); };
  }, [saver]);

  const theme = WS[ws];
  const vars = { ['--sa-accent' as string]: theme.accent, ['--sa-text' as string]: theme.text, ['--sa-grad' as string]: theme.grad } as CSSProperties;
  const tile = (id: TileId) => ({
    className: `sa-tile sa-t-${id}`,
    'data-active': active === id ? 'true' : 'false',
    onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType === 'mouse') setActive(id); },
    onFocusCapture: () => setActive(id),
  });

  return (
    <div className="sa-root" style={vars}>
      <SonarGrid
        key={`${fontKey}-${ws}`}
        className="sa-wall"
        spacing={28}
        glyphs={GLYPHS}
        baseColor="#7a84b8"
        baseOpacity={0.42}
        colors={RINGS[ws]}
        speed={300}
        ringWidth={110}
        lensRadius={150}
        pingEvery={2.8}
      />

      <header className="sa-bar">
        <div className="sa-bar__l">
          <span className="sa-logo" aria-hidden="true">
            <span className="sa-nf">{''}</span>
            <span className="sa-nf-fb">▲</span>
          </span>
          <span className="sa-nf sa-arrow" aria-hidden="true">{''}</span>
          <div className="sa-ws" role="group" aria-label={copy.ui.workspace}>
            {WS.map((w, i) => (
              <button
                key={i}
                type="button"
                className="sa-ws__btn"
                aria-pressed={ws === i}
                aria-label={`${copy.ui.workspace} ${i + 1}`}
                style={{ ['--w' as string]: w.accent } as CSSProperties}
                onClick={() => setWs(i)}
              >{i + 1}</button>
            ))}
          </div>
        </div>
        <div className="sa-bar__c" aria-hidden="true">
          <span className="sa-day">{day}</span>
          <span className="sa-clock">{clock}</span>
        </div>
        <div className="sa-bar__r">
          <span className="sa-seg sa-seg--loc"><span className="sa-nf" aria-hidden="true">{''}</span><span className="sa-nf-fb" aria-hidden="true">◉</span> MTY · NL</span>
          <span className="sa-seg sa-seg--ok"><span className="sa-dot" aria-hidden="true" />{copy.eyebrowStatus}</span>
          <button type="button" className="sa-saverbtn" onClick={openSaver} aria-label={copy.ui.saver} title={`${copy.ui.saver} (Alt+S)`}>
            <span aria-hidden="true">⏻</span><span className="sa-saverbtn__t"> {copy.ui.saver}</span><kbd className="sa-kbd" aria-hidden="true">Alt+S</kbd>
          </button>
        </div>
      </header>

      <main id="contenido" className="sa-desk">
        <section {...tile('main')} aria-labelledby="sa-title">
          <span className="sa-tag" aria-hidden="true">main — ~/mty-agentic-labs</span>
          <div className="sa-cq">
            <p className="sa-eyebrow">
              <span>{copy.eyebrowLocation}</span><span className="sa-dot" aria-hidden="true" /><span className="sa-c-teal">{copy.eyebrowStatus}</span>
            </p>
            <h1 id="sa-title" className="sa-h1">
              <span className="sa-prompt" aria-hidden="true">❯ </span>
              <span className="sa-h1__a">{copy.headline1}</span>
              <span className="sa-h1__b">{copy.headline2}<span className="sa-cursor sa-cursor--lg" aria-hidden="true" /></span>
            </h1>
            <p className="sa-kicker">{copy.kicker}</p>
            <p className="sa-sub">{copy.sub}</p>
            <div className="sa-cta">
              <a className="sa-btn sa-btn--primary" href="#contacto">{copy.ctaPrimary} <span aria-hidden="true">→</span></a>
              <a className="sa-btn sa-btn--ghost" href="#ruta">{copy.ctaSecondary}</a>
            </div>
            <dl className="sa-proof">
              <div style={{ ['--c' as string]: '#2ac3de' } as CSSProperties}>
                <dt className="sr-only">{copy.proofBLabel}</dt>
                <dd><b>{copy.proofB}</b><span>{copy.proofBLabel}</span></dd>
              </div>
            </dl>
          </div>
        </section>

        <section {...tile('term')} aria-label="terminal" role="group">
          <span className="sa-tag" aria-hidden="true">kitty — zsh</span>
          <Terminal labels={copy.terminal} />
        </section>

        <section {...tile('info')} aria-label="fastfetch" role="group">
          <span className="sa-tag" aria-hidden="true">fastfetch</span>
          <div className="sa-info">
            <div className="sa-info__logo" aria-hidden="true">
              <span className="sa-nf">{''}</span>
              <span className="sa-nf-fb">▲</span>
            </div>
            <dl className="sa-info__kv">
              <div className="sa-info__head"><dt className="sr-only">user</dt><dd><span className="sa-c-blue">labs</span>@<span className="sa-c-blue">mty</span></dd></div>
              <div><dt>loc</dt><dd>{copy.eyebrowLocation}</dd></div>
              <div><dt>status</dt><dd className="sa-c-teal">{copy.eyebrowStatus}</dd></div>
              <div><dt>wm</dt><dd>Hyprland · tokyo-night</dd></div>
              <div><dt>mail</dt><dd>hello@agenticlabs.site</dd></div>
            </dl>
          </div>
          <div className="sa-swatch" aria-hidden="true">
            {['#2D6BFF', '#8B5CF6', '#14B8A6', '#FF7A2F', '#f7768e', '#9ece6a', '#e0af68', '#c0caf5'].map((c) => <i key={c} style={{ background: c }} />)}
          </div>
        </section>
      </main>

      {saver ? (
        <Screensaver
          onExit={closeSaver}
          hint={copy.ui.saverHint}
          tagline={`${copy.headline1} ${copy.headline2}`}
          label={copy.ui.screensaverLabel}
        />
      ) : null}
    </div>
  );
}
