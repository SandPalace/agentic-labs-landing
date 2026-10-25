'use client';

import { useSyncExternalStore } from 'react';
import { DARK_THEMES, DEFAULT_THEME, THEMES, THEME_KEY, type ThemeId } from './theme-config';

export { THEMES, type ThemeId } from './theme-config';

const read = (): ThemeId => {
  const t = document.documentElement.dataset.theme as ThemeId | undefined;
  return t && THEMES.includes(t) ? t : DEFAULT_THEME;
};

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => mo.disconnect();
};

/** Current theme id; re-renders whenever <html data-theme> changes (from any picker or the `t` key). */
export function useTheme(): ThemeId {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_THEME);
}

let switchTimer = 0;
export function setTheme(id: ThemeId) {
  const html = document.documentElement;
  html.classList.add('theme-switching');
  html.dataset.theme = id;
  try { localStorage.setItem(THEME_KEY, id); } catch {}
  window.clearTimeout(switchTimer);
  switchTimer = window.setTimeout(() => html.classList.remove('theme-switching'), 500);
  window.dispatchEvent(new CustomEvent('mal:theme', { detail: id }));
}

export function cycleTheme(step: 1 | -1) {
  const i = THEMES.indexOf(read());
  setTheme(THEMES[(i + step + THEMES.length) % THEMES.length]);
}

/** Reads a theme token as hex (themes.css keeps them all hex for SonarGrid). */
export function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export const isDark = (id: ThemeId) => DARK_THEMES.includes(id);

/** Light/dark switch: flips between brand-light and brand-dark. */
export function toggleMode() {
  setTheme(isDark(read()) ? 'brand-light' : 'brand-dark');
}
