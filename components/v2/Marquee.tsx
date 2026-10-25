'use client';

import { useState } from 'react';

/**
 * Edge-to-edge marquee (CSS linear loop). Pauses on hover/focus and with an explicit button;
 * under prefers-reduced-motion it becomes a static wrapped list (see globals.css).
 */
export default function Marquee({ items, pause, resume, label }: { items: string[]; pause: string; resume: string; label: string }) {
  const [paused, setPaused] = useState(false);
  const pill = (name: string, i: number) => (
    <span key={`${name}-${i}`} className="stack-pill">
      <span aria-hidden="true" className="stack-dot" style={{ background: ['#2D6BFF', '#FF7A2F', '#8B5CF6', '#14B8A6'][i % 4] }} />
      {name}
    </span>
  );
  return (
    <div>
      <div className="marquee" data-paused={paused}>
        <div className="marquee__track">
          <ul className="marquee__group" aria-label={label}>
            {items.map((n, i) => (
              <li key={n}>{pill(n, i)}</li>
            ))}
          </ul>
          <ul className="marquee__group marquee__dup" aria-hidden="true">
            {items.map((n, i) => (
              <li key={n}>{pill(n, i)}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-end" style={{ marginTop: 14 }}>
        <button type="button" className="console__toggle marquee__btn" aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
          {paused ? resume : pause}
        </button>
      </div>
    </div>
  );
}
