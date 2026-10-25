'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * "La ruta": the 4-cube logo is the four stages. A sticky mark (desktop) lights the cube of the
 * stage being read; on mobile each row carries its own mini mark. Pure state (no scroll hijack),
 * driven by IntersectionObserver, so it works identically with reduced motion.
 */
export interface RouteStep {
  code: string;
  title: string;
  body: string;
  points: string[];
}

// Logo geometry (26×26) and the stage each cube represents.
const CUBES = [
  { x: 0, y: 2, w: 13, fill: 'var(--color-blue)' },   // 01 blue
  { x: 3, y: 17, w: 8, fill: 'var(--color-teal)' },   // 02 teal
  { x: 13, y: 14, w: 12, fill: 'var(--color-purple)' }, // 03 purple
  { x: 16, y: 0, w: 10, fill: 'var(--color-orange)' },  // 04 orange
];
const TONES = [
  { ink: 'var(--color-blue-ink)', soft: 'var(--color-blue-soft)' },
  { ink: 'var(--color-teal-ink)', soft: 'var(--color-teal-soft)' },
  { ink: 'var(--color-purple-ink)', soft: 'var(--color-purple-soft)' },
  { ink: 'var(--color-orange-ink)', soft: 'var(--color-orange-soft)' },
];

function Mark({ active, rx = 0, className }: { active: number | null; rx?: number; className?: string }) {
  return (
    <svg viewBox="0 0 26 26" className={className} aria-hidden="true" style={{ overflow: 'visible' }}>
      {CUBES.map((c, i) => (
        <rect
          key={i}
          x={c.x}
          y={c.y}
          width={c.w}
          height={c.w}
          rx={rx}
          fill={c.fill}
          className="route-cube"
          data-on={active === null ? 'all' : active === i ? 'on' : 'off'}
        />
      ))}
    </svg>
  );
}

export default function RouteStory({ steps, caption }: { steps: RouteStep[]; caption: string }) {
  const [active, setActive] = useState<number | null>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best: number | null = null;
      let bestDist = Infinity;
      rows.current.forEach((r, i) => {
        if (!r) return;
        const b = r.getBoundingClientRect();
        if (b.bottom < 0 || b.top > window.innerHeight) return;
        const d = b.top <= mid && b.bottom >= mid ? 0 : Math.min(Math.abs(b.top - mid), Math.abs(b.bottom - mid));
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="route">
      <div className="route__mark-col" aria-hidden="true">
        <div className="route__sticky">
          <div className="route__bigmark">
            <span className="route__cap">{caption}</span>
            <Mark active={active} />
            <span className="route__code">{active === null ? `${steps[0].code} → ${steps[steps.length - 1].code}` : steps[active].code}</span>
          </div>
        </div>
      </div>
      <ol className="route__list">
        {steps.map((s, i) => (
          <li
            key={s.code}
            data-i={i}
            ref={(el) => {
              rows.current[i] = el;
            }}
            className="route__row"
            data-active={active === i}
            style={{ ['--ink' as string]: TONES[i].ink, ['--soft' as string]: TONES[i].soft }}
          >
            <Mark active={i} className="route__mini" />
            <div>
              <span className="route__pill">{s.code}</span>
              <h3 className="route__title">{s.title}</h3>
              <p className="route__body">{s.body}</p>
              <ul className="route__points">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
