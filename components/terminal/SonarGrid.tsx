'use client';

import { useEffect, useRef } from 'react';

/**
 * Canvas sonar grid (own implementation, inspired by 21st.dev "sonar-grid").
 * A lattice of cells; rings expand from ping origins and swell the cells they cross.
 * - Ambient pings every `pingEvery` s at random spots; one ring is already mid-flight on first paint.
 * - Desktop (fine pointer): hover lights a lens around the cursor and leaves a soft trail of pings; click pings.
 * - Touch: tap pings.
 * - `glyphs` switches cells from dots to a terminal character ramp (low → high intensity).
 * Pauses offscreen, scales for DPR, and renders a single static frame under prefers-reduced-motion.
 * Listens on its parent element, so put it as the first child of a `position: relative` hero.
 */
export interface SonarGridProps {
  /** Cell pitch in CSS px. */
  spacing?: number;
  /** Ring speed in px/s. */
  speed?: number;
  /** Width of the ring band in px. */
  ringWidth?: number;
  /** Max extra size a cell gets at full intensity (multiplier on its base size). */
  amplitude?: number;
  /** Seconds between ambient pings; 0 disables them. */
  pingEvery?: number;
  /** Opacity of a cell at rest. */
  baseOpacity?: number;
  /** Rest colour of the lattice. */
  baseColor?: string;
  /** Ring colours, cycled per ping. Pass a module-level constant: a new array each render restarts the grid. */
  colors?: string[];
  /** Character ramp from low to high intensity; omit for dots. */
  glyphs?: string;
  /** CSS font-family used for glyph mode (defaults to the element's computed font). */
  fontFamily?: string;
  /** Radius of the hover lens in px (fine pointers only). */
  lensRadius?: number;
  interactive?: boolean;
  className?: string;
}

interface Ring { x: number; y: number; born: number; color: string; max: number }

const hexToRgb = (hex: string) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
};

export default function SonarGrid({
  spacing = 26,
  speed = 260,
  ringWidth = 90,
  amplitude = 2.2,
  pingEvery = 2.4,
  baseOpacity = 0.28,
  baseColor = '#7A8494',
  colors = ['#2D6BFF'],
  glyphs,
  fontFamily,
  lensRadius = 140,
  interactive = true,
  className,
}: SonarGridProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !host || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const base = hexToRgb(baseColor);
    const palette = colors.map(hexToRgb);
    const ramp = glyphs ? Array.from(glyphs) : null;
    const font = fontFamily ?? getComputedStyle(canvas).fontFamily;

    let w = 0, h = 0, dpr = 1, raf = 0, running = false, visible = true;
    let rings: Ring[] = [];
    let colorIdx = 0, lastAmbient = 0, lastTrail = 0;
    const lens = { x: -9999, y: -9999, a: 0, target: 0 };

    const ping = (x: number, y: number, now: number) => {
      const max = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + ringWidth;
      rings.push({ x, y, born: now, color: String(colorIdx++ % palette.length), max });
      if (rings.length > 12) rings.shift();
    };

    const resize = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      if (!running) draw(performance.now());
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      lens.a += (lens.target - lens.a) * 0.12;

      const live = rings.map((r) => {
        const radius = ((now - r.born) / 1000) * speed;
        return { ...r, radius, fade: Math.max(0, 1 - radius / r.max) };
      }).filter((r) => r.fade > 0);
      rings = rings.filter((_, i) => i >= rings.length - live.length);

      const ox = (w % spacing) / 2 + spacing / 2;
      const oy = (h % spacing) / 2 + spacing / 2;
      const dot = Math.max(1, spacing / 22);
      if (ramp) {
        ctx.font = `${Math.round(spacing * 0.62)}px ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
      }

      for (let y = oy; y < h; y += spacing) {
        for (let x = ox; x < w; x += spacing) {
          let k = 0;
          let rgb = base;
          for (const r of live) {
            const d = Math.abs(Math.hypot(x - r.x, y - r.y) - r.radius);
            if (d > ringWidth) continue;
            const v = Math.exp(-((d / (ringWidth * 0.42)) ** 2)) * r.fade;
            if (v > k) { k = v; rgb = palette[Number(r.color)]; }
          }
          if (lens.a > 0.01) {
            const ld = Math.hypot(x - lens.x, y - lens.y);
            if (ld < lensRadius) {
              const v = (1 - ld / lensRadius) ** 2 * lens.a * 0.9;
              if (v > k) { k = v; rgb = palette[0]; }
            }
          }
          const alpha = baseOpacity + (1 - baseOpacity) * k;
          const mix = (i: 0 | 1 | 2) => Math.round(base[i] + (rgb[i] - base[i]) * Math.min(1, k * 1.6));
          ctx.fillStyle = `rgba(${mix(0)},${mix(1)},${mix(2)},${alpha})`;
          if (ramp) {
            const ch = ramp[Math.min(ramp.length - 1, Math.floor(k * ramp.length))];
            if (ch !== ' ') ctx.fillText(ch, x, y);
          } else {
            ctx.beginPath();
            ctx.arc(x, y, dot * (1 + amplitude * k), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    const loop = (now: number) => {
      if (pingEvery > 0 && now - lastAmbient > pingEvery * 1000) {
        lastAmbient = now;
        ping(w * (0.15 + Math.random() * 0.7), h * (0.15 + Math.random() * 0.7), now);
      }
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduce || !visible) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const onDown = (e: PointerEvent) => {
      const [x, y] = local(e);
      ping(x, y, performance.now());
      if (reduce) draw(performance.now() + (ringWidth / speed) * 1000);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const [x, y] = local(e);
      lens.x = x; lens.y = y; lens.target = 1;
      const now = performance.now();
      if (now - lastTrail > 650) { lastTrail = now; ping(x, y, now); }
    };
    const onLeave = () => { lens.target = 0; };

    // First paint: one ring already in flight.
    const t0 = performance.now();
    resize();
    ping(w * 0.62, h * 0.42, t0 - 900);
    lastAmbient = t0;
    draw(reduce ? t0 + 600 : t0);

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    io.observe(host);
    if (interactive) {
      host.addEventListener('pointerdown', onDown);
      if (fine) {
        host.addEventListener('pointermove', onMove);
        host.addEventListener('pointerleave', onLeave);
      }
    }
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointerdown', onDown);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, [spacing, speed, ringWidth, amplitude, pingEvery, baseOpacity, baseColor, colors, glyphs, fontFamily, lensRadius, interactive]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'block' }}
    />
  );
}
