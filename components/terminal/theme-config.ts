/** Site themes (light/dark). Tokens live in app/themes.css under html[data-theme]. Server-safe (no 'use client'). */
export const THEMES = ['brand-light', 'brand-dark'] as const;
export type ThemeId = (typeof THEMES)[number];
export const DEFAULT_THEME: ThemeId = 'brand-light';
export const DARK_THEMES: readonly ThemeId[] = ['brand-dark'];
export const THEME_KEY = 'mal-theme';

/** Inline in <head>: applies the saved theme before first paint so there is no flash. Default is brand-light. */
export const THEME_BOOT = `try{var t=localStorage.getItem('${THEME_KEY}');if(${JSON.stringify(THEMES)}.indexOf(t)>-1)document.documentElement.dataset.theme=t}catch(e){}`;
