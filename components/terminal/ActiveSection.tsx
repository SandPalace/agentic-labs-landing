'use client';

import { useEffect } from 'react';

/**
 * Scroll-spy for the top bar. Marks the nav link whose section crosses the middle of the viewport
 * (`aria-current` + `data-active`) and sets `<html data-section>`, so CSS moves the logo's blinking block cursor
 * to that link. Outside the linked sections (hero, contact…) the cursor goes back to the logo.
 */
export default function ActiveSection({ ids }: { ids: string[] }) {
  useEffect(() => {
    const html = document.documentElement;
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const visible = new Set<string>();

    const apply = () => {
      const current = ids.find((id) => visible.has(id)) ?? null;
      if (current) html.dataset.section = current;
      else delete html.dataset.section;
      document.querySelectorAll<HTMLAnchorElement>('.top__nav a, .mnav__link').forEach((a) => {
        const on = !!current && a.getAttribute('href') === `#${current}`;
        if (on) { a.setAttribute('aria-current', 'location'); a.dataset.active = 'true'; }
        else { a.removeAttribute('aria-current'); delete a.dataset.active; }
      });
    };

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      }
      apply();
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));

    return () => {
      io.disconnect();
      delete html.dataset.section;
    };
  }, [ids]);

  return null;
}
