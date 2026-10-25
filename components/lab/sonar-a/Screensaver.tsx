'use client';

import { useEffect, useRef, useState } from 'react';
import { buildLogo } from './logo';

const STOPS: Array<readonly [number, number, number]> = [
  [45, 107, 255], // brand blue
  [139, 92, 246], // purple
  [20, 184, 166], // teal
  [255, 122, 47], // orange
];
const SCRAMBLE = Array.from('01<>/\\{}[]#$%&*+=:;~^|░▒▓');

const colorAt = (u: number) => {
  const p = Math.min(0.999, Math.max(0, u)) * (STOPS.length - 1);
  const i = Math.floor(p);
  const f = p - i;
  return STOPS[i].map((v, k) => v + (STOPS[i + 1][k] - v) * f) as [number, number, number];
};

interface Cell { c: number; r: number; reveal: number; settle: number; rgb: [number, number, number]; seed: number }

/** Omarchy-style screensaver: a ttfx "decrypt" assembling the ASCII logo on black. Any key / click / tap exits. */
export default function Screensaver({ onExit, hint, tagline, label }: { onExit: () => void; hint: string; tagline: string; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shown, setShown] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const closing = useRef(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    const t0 = performance.now();
    const exit = (e?: Event) => {
      if (performance.now() - t0 < 450) return;
      if (e && e.type === 'keydown') { e.preventDefault(); e.stopPropagation(); }
      if (closing.current) return;
      closing.current = true;
      setLeaving(true);
      window.setTimeout(onExit, 240);
    };
    window.addEventListener('keydown', exit, true);
    window.addEventListener('pointerdown', exit, true);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('keydown', exit, true);
      window.removeEventListener('pointerdown', exit, true);
    };
  }, [onExit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const family = getComputedStyle(canvas).fontFamily;

    let W = 0, H = 0, dpr = 1, raf = 0;
    let cells: Cell[] = [];
    let cols = 1, rows = 1, cw = 10, ch = 10, ox = 0, oy = 0;
    const start = performance.now();

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      const logo = buildLogo(W >= 900);
      cols = logo.cols; rows = logo.rows;
      cw = Math.max(4, Math.min(Math.floor((W * 0.88) / cols), 24, Math.floor((H * 0.55) / (rows * 1.12))));
      ch = cw * 1.12;
      ox = Math.round((W - cols * cw) / 2);
      oy = Math.round((H - rows * ch) / 2 - 18);
      cells = logo.px.map((p, i) => {
        const reveal = 0.5 + (p.c / cols) * 1.1 + (p.r / rows) * 0.5 + ((i * 7919) % 100) / 100 * 0.5;
        return { ...p, reveal, settle: reveal + 0.7 + (((i * 104729) % 100) / 100) * 0.6, rgb: colorAt(p.c / cols), seed: i };
      });
    };

    const draw = (now: number) => {
      const t = reduce ? 99 : (now - start) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${Math.round(cw * 1.5)}px ${family}`;
      const beam = t > 4 ? ((t - 4) * 26) % (cols + 70) - 20 : -99;
      const frame = Math.floor(t * 18);

      for (const k of cells) {
        if (t < k.reveal) continue;
        const x = ox + k.c * cw, y = oy + k.r * ch;
        if (t < k.settle) {
          const g = SCRAMBLE[(frame * 31 + k.seed * 17) % SCRAMBLE.length];
          ctx.fillStyle = (frame + k.seed) % 5 === 0 ? '#c0caf5' : '#7aa2f7';
          ctx.fillText(g, x + cw / 2, y + ch / 2);
        } else {
          const b = Math.exp(-(((k.c - beam) / 3.5) ** 2));
          const m = (v: number) => Math.round(v + (255 - v) * b * 0.75);
          ctx.fillStyle = `rgb(${m(k.rgb[0])},${m(k.rgb[1])},${m(k.rgb[2])})`;
          ctx.fillRect(x + 0.5, y + 0.5, cw - 1, ch - 1);
        }
      }

      if (t > 0.4 && t < 2.3) {
        const hx = ox + ((t - 0.5) / 1.1) * cols * cw;
        ctx.fillStyle = 'rgba(122,162,247,0.55)';
        ctx.fillRect(hx, oy - 8, 2, rows * ch + 16);
      }

      const a = Math.min(1, Math.max(0, (t - 3.2) / 0.8));
      if (a > 0) {
        ctx.globalAlpha = a;
        ctx.fillStyle = '#8089b3';
        ctx.font = `${Math.max(12, Math.min(16, cw * 0.9))}px ${family}`;
        ctx.fillText(tagline, W / 2, oy + rows * ch + Math.max(28, ch * 1.6));
        ctx.globalAlpha = 1;
      }
    };

    const loop = (now: number) => { draw(now); raf = requestAnimationFrame(loop); };
    const onResize = () => { layout(); if (reduce) draw(performance.now()); };
    layout();
    if (reduce) draw(performance.now()); else raf = requestAnimationFrame(loop);
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [tagline]);

  return (
    <div className={`sa-saver${shown && !leaving ? ' is-on' : ''}`} role="dialog" aria-label={label}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <p className="sa-saver__hint" aria-hidden="true">{hint}</p>
    </div>
  );
}
