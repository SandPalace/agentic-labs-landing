'use client';

import { useEffect, useState } from 'react';

const FONTS = [
  { id: 'jetbrains', label: 'JetBrainsMono NF' },
  { id: 'plex', label: 'IBM Plex Mono' },
  { id: 'vera', label: 'Vera Mono' },
] as const;

type FontId = (typeof FONTS)[number]['id'];

/** Lab-only toggle: flips data-font on the .lab wrapper so every variant can be judged in each mono. */
export default function FontSwitcher() {
  const [font, setFont] = useState<FontId>(() => {
    if (typeof window === 'undefined') return 'jetbrains';
    let saved: string | null = null;
    try { saved = localStorage.getItem('lab-font'); } catch {}
    return FONTS.some((f) => f.id === saved) ? (saved as FontId) : 'jetbrains';
  });

  useEffect(() => {
    document.querySelector('.lab')?.setAttribute('data-font', font);
    try { localStorage.setItem('lab-font', font); } catch {}
  }, [font]);

  return (
    <div className="lab-fontswitch" role="group" aria-label="Font">
      {FONTS.map((f) => (
        <button key={f.id} type="button" suppressHydrationWarning aria-pressed={font === f.id} onClick={() => setFont(f.id)}>
          {f.label}
        </button>
      ))}
    </div>
  );
}
