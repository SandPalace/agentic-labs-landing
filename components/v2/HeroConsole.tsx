'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * Hero "system console": ERP → cerebro (logo hub) → equipos de agentes.
 * Draws the hero claim as a working system. Packets travel the wires in a loop that
 * pauses offscreen, honours prefers-reduced-motion and has an explicit pause button (WCAG 2.2.2).
 */
export interface HeroConsoleLabels {
  location: string;
  status: string;
  inputs: string;
  hub: string;
  outputs: string;
  sources: [string, string, string];
  teams: [string, string, string, string];
  human: string;
  pause: string;
  resume: string;
  aria: string;
}

const TEAM_TONES = [
  { fill: '#E3ECFF', ink: '#1747C9', stroke: '#2D6BFF' },
  { fill: '#D5F3EF', ink: '#0B6B61', stroke: '#14B8A6' },
  { fill: '#EFE7FE', ink: '#5B34C4', stroke: '#8B5CF6' },
  { fill: '#FFE7D6', ink: '#9E460B', stroke: '#FF7A2F' },
];

export default function HeroConsole({ labels }: { labels: HeroConsoleLabels }) {
  const root = useRef<HTMLElement | null>(null);
  const [paused, setPaused] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const onScreen = useRef(true);
  const userPaused = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const packets = Array.from(el.querySelectorAll<SVGPathElement>('.packet'));
      const tl = gsap.timeline({ repeat: -1, paused: true });
      packets.forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.set(p, { attr: { 'stroke-dasharray': `14 ${len + 20}`, 'stroke-dashoffset': 14 } });
        const isOut = i > 2;
        const at = isOut ? 0.9 + (i - 3) * 0.12 : i * 0.14;
        tl.to(p, { attr: { 'stroke-dashoffset': -len }, duration: isOut ? 0.9 : 0.85, ease: 'power1.inOut' }, at);
      });
      tl.to(el.querySelectorAll('.hc'), { scale: 1.12, transformOrigin: '50% 50%', duration: 0.18, ease: 'power2.out', stagger: 0.05, yoyo: true, repeat: 1 }, 0.78);
      tl.to({}, { duration: 1.1 });
      tlRef.current = tl;
    }, el);

    if (reduce) {
      userPaused.current = true;
      requestAnimationFrame(() => setPaused(true));
    } else {
      tlRef.current?.play();
    }

    const io = new IntersectionObserver(([entry]) => {
      onScreen.current = entry.isIntersecting;
      if (entry.isIntersecting && !userPaused.current) tlRef.current?.play();
      else tlRef.current?.pause();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  const toggle = () => {
    userPaused.current = !userPaused.current;
    setPaused(userPaused.current);
    if (userPaused.current || !onScreen.current) tlRef.current?.pause();
    else tlRef.current?.play();
  };

  const ys = [64, 148, 232, 316];

  return (
    <figure ref={root} className="console m-0" aria-label={labels.aria}>
      <div className="console__bar">
        <span className="eyebrow" style={{ fontSize: 10.5 }}>{labels.location}</span>
        <span className="eyebrow flex items-center" style={{ fontSize: 10.5, gap: 8, color: 'var(--color-teal-ink)' }}>
          <span className="pulse" aria-hidden="true" />
          {labels.status}
        </span>
      </div>
      <svg viewBox="0 0 560 380" aria-hidden="true" className="block w-full h-auto">
        <defs>
          <pattern id="hc-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#E7EBF1" />
          </pattern>
        </defs>
        <rect width="560" height="380" fill="url(#hc-dots)" />
        <text x="24" y="36" className="c-k">{labels.inputs}</text>
        <text x="300" y="132" textAnchor="middle" className="c-k">{labels.hub}</text>
        <text x="424" y="32" className="c-k">{labels.outputs}</text>

        <path id="hc-w1" className="wire" d="M152 82 C 210 82, 214 190, 262 190" />
        <path id="hc-w2" className="wire" d="M152 190 L 262 190" />
        <path id="hc-w3" className="wire" d="M152 298 C 210 298, 214 190, 262 190" />
        {ys.map((y, i) => (
          <path key={i} id={`hc-o${i}`} className="wire" d={`M338 190 C 380 190, 384 ${y}, 424 ${y}`} />
        ))}

        <g>
          <path className="packet" stroke="#2D6BFF" d="M152 82 C 210 82, 214 190, 262 190" />
          <path className="packet" stroke="#2D6BFF" d="M152 190 L 262 190" />
          <path className="packet" stroke="#2D6BFF" d="M152 298 C 210 298, 214 190, 262 190" />
          {ys.map((y, i) => (
            <path key={i} className="packet" stroke={TEAM_TONES[i].stroke} d={`M338 190 C 380 190, 384 ${y}, 424 ${y}`} />
          ))}
        </g>

        {labels.sources.map((s, i) => (
          <g key={s} className="node">
            <rect x="24" y={60 + i * 108} width="128" height="44" rx="2" />
            <text x="40" y={88 + i * 108}>{s}</text>
          </g>
        ))}

        <rect x="262" y="152" width="76" height="76" rx="2" fill="#fff" stroke="#D3DAE5" />
        <g transform="translate(274 164) scale(2)">
          <rect className="hc" x="0" y="2" width="13" height="13" rx="1.5" fill="#2D6BFF" />
          <rect className="hc" x="16" y="0" width="10" height="10" rx="1.5" fill="#FF7A2F" />
          <rect className="hc" x="13" y="14" width="12" height="12" rx="1.5" fill="#8B5CF6" />
          <rect className="hc" x="3" y="17" width="8" height="8" rx="1.5" fill="#14B8A6" />
        </g>
        <g>
          <rect x="250" y="246" width="100" height="24" rx="12" fill="#14161A" />
          <text x="300" y="262" textAnchor="middle" className="c-human">{labels.human}</text>
        </g>

        {labels.teams.map((t, i) => (
          <g key={t}>
            <rect x="424" y={ys[i] - 18} width="120" height="36" rx="18" fill={TEAM_TONES[i].fill} />
            <text x="440" y={ys[i] + 5} className="c-team" fill={TEAM_TONES[i].ink}>{t}</text>
          </g>
        ))}
      </svg>
      <figcaption className="console__foot">
        <span className="eyebrow" style={{ fontSize: 10.5 }}>{labels.aria}</span>
        <button type="button" className="console__toggle" aria-pressed={paused} onClick={toggle}>
          {paused ? labels.resume : labels.pause}
        </button>
      </figcaption>
    </figure>
  );
}
