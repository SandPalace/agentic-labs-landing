'use client';

import { useEffect } from 'react';
import { isDark, toggleMode, useTheme } from './theme';

const Sun = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const Moon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

/**
 * Light/dark icon button for the top bar: shows the moon in light mode (click → dark) and the sun in dark mode.
 * Also owns the global shortcuts: `t` and ⌘⌃⇧Space (Omarchy's binding) toggle. Ignored while typing in a field.
 */
export default function ThemePicker({ locale = 'es' }: { compact?: boolean; locale?: string }) {
  const dark = isDark(useTheme());
  const es = locale === 'es';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const chord = e.metaKey && e.ctrlKey && e.shiftKey && e.code === 'Space';
      const plain = e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey && !e.altKey;
      if (chord || plain) { e.preventDefault(); toggleMode(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const label = dark ? (es ? 'Cambiar a tema claro' : 'Switch to light theme') : (es ? 'Cambiar a tema oscuro' : 'Switch to dark theme');

  return (
    <button type="button" className="ticon" onClick={toggleMode} aria-label={label} title={label} suppressHydrationWarning>
      {dark ? <Sun /> : <Moon />}
    </button>
  );
}
