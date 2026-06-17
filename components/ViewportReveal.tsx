'use client';

import { useRef, ReactNode, CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ViewportRevealProps {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: CSSProperties;
  /** CSS selector relative to the wrapper to animate. When provided, children with this selector are animated with stagger. */
  selector?: string;
  /** Animation type. */
  variant?: 'fade-up' | 'fade-in' | 'stagger-up';
  /** Delay (s) before animating after entering viewport. */
  delay?: number;
  /** Stagger between children (s). */
  stagger?: number;
  /** Trigger only once (default) or every time. */
  once?: boolean;
}

export default function ViewportReveal({
  children,
  as = 'div',
  className = '',
  style,
  selector,
  variant = 'fade-up',
  delay = 0,
  stagger = 0.08,
  once = true,
}: ViewportRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets: gsap.DOMTarget | null = selector
        ? el.querySelectorAll(selector)
        : el;

      if (!targets) return;

      const fromVars: gsap.TweenVars =
        variant === 'fade-in'
          ? { opacity: 0 }
          : { opacity: 0, y: 24 };

      const toVars: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        delay,
        stagger: variant === 'stagger-up' ? stagger : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once,
        },
      };

      // Respect prefers-reduced-motion: skip the tween and render the final state.
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          allowMotion: '(prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { reduceMotion } = ctx.conditions ?? {};
          if (reduceMotion) {
            gsap.set(targets, { opacity: 1, y: 0, clearProps: 'opacity,transform' });
            return;
          }
          gsap.fromTo(targets, fromVars, toVars);
        }
      );
    },
    { scope: ref, dependencies: [variant, delay, stagger, once, selector] }
  );

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
