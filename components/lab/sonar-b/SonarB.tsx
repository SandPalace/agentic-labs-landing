'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import SonarGrid from '@/components/terminal/SonarGrid';
import FontSwitcher from '../FontSwitcher';
import { THEMES } from './themes';

export interface SonarBCopy {
  location: string; status: string; h1a: string; h1b: string; kicker: string; sub: string;
  ctaPrimary: string; ctaSecondary: string;
  proofA: string; proofALabel: string; proofB: string; proofBLabel: string;
}

const GLYPHS = '·:+x#█';
const FONT = 'var(--lab-mono)';
const STORE = 'sonar-b-theme';

// Theme store backed by localStorage: server snapshot is 0, the client reads the saved choice.
const listeners = new Set<() => void>();
let memo = -1;
const readIdx = () => {
  if (memo >= 0) return memo;
  let saved: string | null = null;
  try { saved = localStorage.getItem(STORE); } catch {}
  return Math.max(0, THEMES.findIndex((t) => t.id === saved));
};
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
const writeIdx = (i: number) => {
  memo = i;
  try { localStorage.setItem(STORE, THEMES[i].id); } catch {}
  listeners.forEach((l) => l());
};

// Runs before first paint (inline in the SSR HTML): paints the saved theme's tokens on .sb.
const BOOT = `try{var m=${JSON.stringify(Object.fromEntries(THEMES.map((t) => [t.id, t.vars])))},s=localStorage.getItem('${STORE}'),e=document.currentScript.parentElement;if(m[s]){for(var k in m[s])e.style.setProperty(k,m[s][k])}}catch(x){}`;

export default function SonarB({ copy, locale }: { copy: SonarBCopy; locale: string }) {
  const es = locale === 'es';
  const idx = useSyncExternalStore(subscribe, readIdx, () => 0);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const pickerRef = useRef<HTMLButtonElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const toastTimer = useRef<number>(0);
  const pending = useRef(false);
  const theme = THEMES[idx];

  // Apply tokens on the whole .lab wrapper so the fixed FontSwitcher area and overscroll match too.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    for (const [k, v] of Object.entries(theme.vars)) el.style.setProperty(k, v);
    el.dataset.mode = theme.mode;
  }, [theme]);

  // After a user-initiated change, emit a big ring from the picker (the grid has remounted by now).
  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    const hero = heroRef.current;
    const btn = pickerRef.current;
    if (!hero || !btn) return;
    const r = btn.getBoundingClientRect();
    hero.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, pointerType: 'mouse',
    }));
  }, [idx]);

  const choose = useCallback((i: number) => {
    const next = ((i % THEMES.length) + THEMES.length) % THEMES.length;
    pending.current = true;
    writeIdx(next);
    setToast(THEMES[next].id);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const chord = e.metaKey && e.ctrlKey && e.shiftKey && e.code === 'Space';
      const plain = e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey && !e.altKey;
      if (chord || plain) { e.preventDefault(); choose(idx + (e.shiftKey && plain ? -1 : 1)); }
      else if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, choose]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('.sb-picker')) setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, [open]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const cmd = es ? './transformacion --agentica' : './agentic --transform';

  return (
    <div className="sb" ref={wrapRef} data-mode="light" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      <section ref={heroRef} className="sb-hero" aria-labelledby="sb-title">
        <SonarGrid
          glyphs={GLYPHS}
          fontFamily={FONT}
          spacing={22}
          speed={300}
          ringWidth={110}
          pingEvery={2.6}
          lensRadius={150}
          baseColor={theme.base}
          baseOpacity={theme.baseOpacity}
          colors={theme.rings}
        />

        <header className="sb-bar">
          <p className="sb-badge">
            <span className="sb-seg sb-seg-a"><span className="sb-arch" aria-hidden="true">{''}</span>{copy.location}</span>
            <span className="sb-seg sb-seg-b"><span className="sb-dot" aria-hidden="true">●</span>{copy.status}</span>
          </p>
          <div className="sb-picker" onPointerDown={(e) => e.stopPropagation()}>
            <button
              ref={pickerRef}
              type="button"
              className="sb-pick-btn"
              aria-haspopup="true"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sb-dim">theme:</span> {theme.id} <kbd aria-hidden="true">t</kbd>
            </button>
            {open && (
              <ul className="sb-menu" aria-label="Theme">
                {THEMES.map((t, i) => (
                  <li key={t.id}>
                    <button type="button" aria-pressed={i === idx} onClick={() => { choose(i); setOpen(false); }}>
                      <span aria-hidden="true">{i === idx ? '❯' : ' '}</span> {t.id}
                      <i aria-hidden="true" style={{ background: t.vars['--sb-bg'], borderColor: t.vars['--sb-accent'] }}>
                        <b style={{ background: t.vars['--sb-accent'] }} />
                      </i>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        <div className="sb-copy">
          <p className="sb-prompt" aria-hidden="true">
            <span className="sb-user">enrique@mty</span> <span className="sb-dim">~</span> <span className="sb-ok">❯</span>{' '}
            <span className="sb-typed" style={{ ['--n' as string]: cmd.length }}>{cmd}</span>
          </p>
          <h1 id="sb-title" className="sb-h1">
            <span className="sb-l">{copy.h1a}</span>
            <span className="sb-l sb-accent">{copy.h1b}<span className="sb-cursor" aria-hidden="true" /></span>
          </h1>
          <p className="sb-kicker"><span className="sb-dim" aria-hidden="true"># </span>{copy.kicker}</p>
          <p className="sb-sub">{copy.sub}</p>
          <div className="sb-actions">
            <a className="sb-btn sb-btn-p" href={`/${locale}#contacto`}>
              <span aria-hidden="true">[ </span>{copy.ctaPrimary}<span aria-hidden="true"> ↵ ]</span>
            </a>
            <a className="sb-btn" href={`/${locale}#ruta`}>
              <span aria-hidden="true">[ </span>{copy.ctaSecondary}<span aria-hidden="true"> ]</span>
            </a>
          </div>
          <dl className="sb-proof">
            <div><dt>{es ? 'practica' : 'hands_on'}</dt><dd><b>{copy.proofB}</b> <span className="sb-dim"># {copy.proofBLabel}</span></dd></div>
          </dl>
        </div>

        <p className="sb-hint" aria-hidden="true">⌘⌃⇧␣ / t → theme</p>
      </section>

      <div className="sb-toast" role="status" aria-live="polite">
        {toast ? <span><span className="sb-dim">$ </span>theme: {toast}</span> : null}
      </div>
      <FontSwitcher />
    </div>
  );
}
