'use client';

import { useEffect, useRef, useState } from 'react';
import SonarGrid from './SonarGrid';
import { LogoMark } from '../Logo';
import { token, useTheme } from './theme';
import { rich } from './rich';
import './hero.css';

export interface TerminalHeroCopy {
  location: string; status: string; h1a: string; h1b: string; kicker: string; sub: string;
  ctaPrimary: string; ctaSecondary: string;
  proofB: string; proofBLabel: string;
}

const GLYPHS = '·:+x#█';
const FONT = 'var(--font-site)';

export default function TerminalHero({ copy, locale }: { copy: TerminalHeroCopy; locale: string }) {
  const es = locale === 'es';
  const theme = useTheme();
  const heroRef = useRef<HTMLElement | null>(null);
  const [palette, setPalette] = useState<{ colors: string[]; base: string } | null>(null);

  // Rebuild the (memoized via state) ring colours whenever the theme changes.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setPalette({
      colors: [token('--color-blue'), token('--color-purple'), token('--color-teal'), token('--color-orange')],
      base: token('--grid-base'),
    }));
    return () => cancelAnimationFrame(raf);
  }, [theme]);

  // Big ring from the top-right of the hero on every theme change.
  useEffect(() => {
    let timer = 0;
    const onTheme = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const hero = heroRef.current;
        if (!hero) return;
        const r = hero.getBoundingClientRect();
        hero.dispatchEvent(new PointerEvent('pointerdown', {
          bubbles: true, clientX: r.right - r.width * 0.1, clientY: r.top + Math.min(160, r.height * 0.2), pointerType: 'mouse',
        }));
      }, 160);
    };
    window.addEventListener('mal:theme', onTheme);
    return () => { window.removeEventListener('mal:theme', onTheme); window.clearTimeout(timer); };
  }, []);

  const cmd = es ? './transformacion --agentica' : './agentic --transform';

  return (
    <section ref={heroRef} className="th-hero" aria-labelledby="hero-title">
      {palette && (
        <SonarGrid
          glyphs={GLYPHS}
          fontFamily={FONT}
          spacing={22}
          speed={300}
          ringWidth={110}
          pingEvery={2.6}
          lensRadius={150}
          baseColor={palette.base}
          baseOpacity={0.3}
          colors={palette.colors}
        />
      )}

      <div className="th-bar">
        <p className="th-badge">
          <span className="th-seg th-seg-a"><span className="th-mark" aria-hidden="true"><LogoMark size={14} /></span>{copy.location}</span>
          <span className="th-seg th-seg-b"><span className="th-dot" aria-hidden="true">●</span>{copy.status}</span>
        </p>
      </div>

      <div className="th-copy">
        <p className="th-prompt" aria-hidden="true">
          <span className="th-user">hello@mty</span> <span className="th-dim">~</span> <span className="th-ok">❯</span>{' '}
          <span className="th-typed" style={{ ['--n' as string]: cmd.length }}>{cmd}</span>
        </p>
        <h1 id="hero-title" className="th-h1">
          <span className="th-l">{copy.h1a}</span>
          <span className="th-l th-accent">{copy.h1b}<span className="th-cursor" aria-hidden="true" /></span>
        </h1>
        <p className="th-kicker"><span className="th-dim" aria-hidden="true"># </span>{rich(copy.kicker)}</p>
        <p className="th-sub">{rich(copy.sub)}</p>
        <div className="th-actions">
          <a className="th-btn th-btn-p" href={`/${locale}#contacto`}>
            <span aria-hidden="true">[ </span>{copy.ctaPrimary}<span aria-hidden="true"> ↵ ]</span>
          </a>
          <a className="th-btn" href={`/${locale}#ruta`}>
            <span aria-hidden="true">[ </span>{copy.ctaSecondary}<span aria-hidden="true"> ]</span>
          </a>
        </div>
        <dl className="th-proof">
          <div><dt>{es ? 'practica' : 'hands_on'}</dt><dd><b>{copy.proofB}</b> <span className="th-dim"># {copy.proofBLabel}</span></dd></div>
        </dl>
      </div>
    </section>
  );
}
