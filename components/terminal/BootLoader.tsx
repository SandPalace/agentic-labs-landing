'use client';

import { useEffect, useRef, useState } from 'react';
import { LogoMark } from '../Logo';
import { buildLogo } from './boot-logo';
import './loader.css';

const KEY = 'mal-boot-seen';
/** false: the intro plays on every full page load. true: only once per browser tab session. */
const ONCE_PER_SESSION = false;
// Runs inline in the SSR HTML, before first paint: hide the overlay if this session already saw it.
const BOOT = ONCE_PER_SESSION
  ? `try{if(sessionStorage.getItem('${KEY}'))document.currentScript.parentElement.hidden=true}catch(e){}`
  : '';

const STOPS: Array<readonly [number, number, number]> = [
  [45, 107, 255], [139, 92, 246], [20, 184, 166], [255, 122, 47],
];
const SCRAMBLE = Array.from('01<>/\\{}[]#$%&*+=:;~^|░▒▓');
const colorAt = (u: number) => {
  const p = Math.min(0.999, Math.max(0, u)) * (STOPS.length - 1);
  const i = Math.floor(p);
  const f = p - i;
  return STOPS[i].map((v, k) => v + (STOPS[i + 1][k] - v) * f) as [number, number, number];
};
interface Cell { c: number; r: number; reveal: number; settle: number; rgb: [number, number, number]; seed: number }

// Timeline (s): logo assembles 0–2.0 · "Starting agentic.service…" with a spinner from 1.6 · flips to [ OK ] at OK_AT ·
// the finished logo holds to LEAVE_AT · 0.9s cross-fade into the landing (≈4.4s total, skippable with any key/click/tap).
const BOOT_AT = 1.6;
const OK_AT = 2.6;
const LEAVE_AT = 3.5;
const SPINNER = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
const FADE_MS = 900; // keep in sync with .bl.bl-out transition in loader.css

export default function BootLoader({ tagline }: { locale: string; tagline: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;
    let seen = false;
    if (ONCE_PER_SESSION) { try { seen = !!sessionStorage.getItem(KEY); } catch {} }
    if (seen) { el.hidden = true; return; }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.classList.add('bl-js');
    let leaving = false, raf = 0, leaveTimer = 0;
    const leave = () => {
      if (leaving) return;
      leaving = true;
      if (ONCE_PER_SESSION) { try { sessionStorage.setItem(KEY, '1'); } catch {} }
      window.clearTimeout(leaveTimer);
      el.classList.add('bl-out');
      // Cross-fade: the landing rises in underneath while the intro dissolves (see .bl-reveal in loader.css).
      document.documentElement.classList.add('bl-reveal');
      window.setTimeout(() => setGone(true), reduce ? 200 : FADE_MS);
    };
    const onKey = (e: KeyboardEvent) => { e.stopPropagation(); leave(); };
    window.addEventListener('keydown', onKey, true);
    el.addEventListener('pointerdown', leave);
    leaveTimer = window.setTimeout(leave, (reduce ? 0.5 : LEAVE_AT) * 1000);

    const ctx = canvas.getContext('2d');
    const cleanup = () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(leaveTimer);
      window.removeEventListener('keydown', onKey, true);
    };
    if (!ctx) return cleanup;
    const family = getComputedStyle(canvas).fontFamily;
    let W = 0, H = 0, dpr = 1, cols = 1, rows = 1, cw = 10, ch = 10, ox = 0, oy = 0;
    let cells: Cell[] = [];
    const start = performance.now();

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      const logo = buildLogo(W >= 900);
      cols = logo.cols; rows = logo.rows;
      cw = Math.max(4, Math.min(Math.floor((W * 0.88) / cols), 24, Math.floor((H * 0.5) / (rows * 1.12))));
      ch = cw * 1.12;
      ox = Math.round((W - cols * cw) / 2);
      oy = Math.round((H - rows * ch) / 2 - 24);
      cells = logo.px.map((p, i) => {
        const reveal = 0.1 + (p.c / cols) * 0.75 + (p.r / rows) * 0.25 + (((i * 7919) % 100) / 100) * 0.25;
        return { ...p, reveal, settle: reveal + 0.3 + (((i * 104729) % 100) / 100) * 0.35, rgb: colorAt(p.c / cols), seed: i };
      });
    };

    const draw = (now: number) => {
      const t = reduce ? 99 : (now - start) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${Math.round(cw * 1.5)}px ${family}`;
      const frame = Math.floor(t * 18);
      for (const k of cells) {
        if (t < k.reveal) continue;
        const x = ox + k.c * cw, y = oy + k.r * ch;
        if (t < k.settle) {
          ctx.fillStyle = (frame + k.seed) % 5 === 0 ? '#8B5CF6' : '#2D6BFF';
          ctx.globalAlpha = 0.75;
          ctx.fillText(SCRAMBLE[(frame * 31 + k.seed * 17) % SCRAMBLE.length], x + cw / 2, y + ch / 2);
          ctx.globalAlpha = 1;
        } else {
          ctx.fillStyle = `rgb(${k.rgb[0] | 0},${k.rgb[1] | 0},${k.rgb[2] | 0})`;
          ctx.fillRect(x + 0.5, y + 0.5, cw - 1, ch - 1);
        }
      }
      if (t > 0.1 && t < 1.3) {
        ctx.fillStyle = 'rgba(45,107,255,0.5)';
        ctx.fillRect(ox + ((t - 0.1) / 1.1) * cols * cw, oy - 8, 2, rows * ch + 16);
      }
      const below = oy + rows * ch;
      const a = Math.min(1, Math.max(0, (t - 1.0) / 0.4));
      if (a > 0) {
        ctx.globalAlpha = a;
        ctx.fillStyle = '#4B5563';
        ctx.font = `${Math.max(12, Math.min(16, cw * 0.9))}px ${family}`;
        ctx.fillText(tagline, W / 2, below + Math.max(28, ch * 1.6));
        ctx.globalAlpha = 1;
      }
      const b = Math.min(1, Math.max(0, (t - BOOT_AT) / 0.25));
      if (b > 0) {
        ctx.globalAlpha = b;
        ctx.font = `${Math.max(11, Math.min(13, cw * 0.7))}px ${family}`;
        const ok = t >= OK_AT;
        const spin = SPINNER[Math.floor(t * 12) % SPINNER.length];
        const dots = '.'.repeat(1 + (Math.floor(t * 3) % 3)).padEnd(3, ' ');
        const line1 = ok ? '[  OK  ] ' : `[  ${spin}   ] `;
        const line2 = ok ? 'Started agentic.service' : `Starting agentic.service${dots}`;
        const w1 = ctx.measureText(line1).width, w2 = ctx.measureText(line2).width;
        const x0 = W / 2 - (w1 + w2) / 2, yy = below + Math.max(28, ch * 1.6) + 30;
        ctx.textAlign = 'left';
        ctx.fillStyle = ok ? '#0B6B61' : '#2D6BFF'; ctx.fillText(line1, x0, yy);
        ctx.fillStyle = '#4B5563'; ctx.fillText(line2, x0 + w1, yy);
        ctx.textAlign = 'center';
        ctx.globalAlpha = 1;
      }
    };
    const loop = (now: number) => { draw(now); raf = requestAnimationFrame(loop); };
    const onResize = () => { layout(); if (reduce) draw(performance.now()); };
    layout();
    if (reduce) draw(performance.now()); else raf = requestAnimationFrame(loop);
    window.addEventListener('resize', onResize);
    return () => { cleanup(); window.removeEventListener('resize', onResize); };
  }, [tagline]);

  if (gone) return null;
  return (
    <div ref={ref} className="bl" aria-hidden="true" suppressHydrationWarning>
      {BOOT ? <script dangerouslySetInnerHTML={{ __html: BOOT }} /> : null}
      <div className="bl-fallback"><LogoMark size={56} /></div>
      <canvas ref={canvasRef} />
    </div>
  );
}
