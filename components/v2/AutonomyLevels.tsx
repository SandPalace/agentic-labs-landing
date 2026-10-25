'use client';

import { useId, useRef, useState, KeyboardEvent } from 'react';

/**
 * Autonomy levels 0–4 as an accessible tablist (arrow keys, Home/End). The meter fills to the
 * selected level; the panel explains who decides at that level. No scroll coupling.
 */
export interface AutonomyLevel {
  level: string;
  name: string;
  body: string;
  human: string;
}

export default function AutonomyLevels({ levels, humanLabel }: { levels: AutonomyLevel[]; humanLabel: string }) {
  const [sel, setSel] = useState(2);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = levels.length - 1;
    let next = sel;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = sel === last ? 0 : sel + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = sel === 0 ? last : sel - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    setSel(next);
    tabs.current[next]?.focus();
  };

  const cur = levels[sel];

  return (
    <div className="autonomy">
      <div className="autonomy__tabs" role="tablist" aria-orientation="horizontal" onKeyDown={onKey}>
        {levels.map((l, i) => (
          <button
            key={l.level}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`${id}-t${i}`}
            aria-selected={sel === i}
            aria-controls={`${id}-p`}
            tabIndex={sel === i ? 0 : -1}
            onClick={() => setSel(i)}
            className="autonomy__tab"
            data-filled={i <= sel}
          >
            <span className="autonomy__lvl">{l.level}</span>
            <span className="autonomy__name">{l.name}</span>
            <span className="autonomy__mini" aria-hidden="true">
              {'█'.repeat(i + 1)}
              <span className="off">{'░'.repeat(levels.length - 1 - i)}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="autonomy__meter" aria-hidden="true">
        <span className="autonomy__word">autonomy</span>
        <span>
          <b>{'█'.repeat((sel + 1) * 6)}</b>
          <span className="rest">{'░'.repeat((levels.length - 1 - sel) * 6)}</span>
        </span>
        <span className="lvl">{`L${cur.level}`}</span>
      </div>
      <div className="autonomy__panel" role="tabpanel" id={`${id}-p`} aria-labelledby={`${id}-t${sel}`}>
        <p className="autonomy__body">{cur.body}</p>
        <p className="autonomy__human">
          <span className="eyebrow" style={{ color: 'var(--color-fg)' }}><span className="eyebrow__p">$ </span>{humanLabel}</span>
          <span>{cur.human}</span>
        </p>
      </div>
    </div>
  );
}
