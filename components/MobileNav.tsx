'use client';

import { useState, useEffect, useCallback } from 'react';
import LanguageToggle from '@/components/LanguageToggle';

interface NavItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  navItems: NavItem[];
  cta: string;
  menuLabel: string;
  menuOpenLabel: string;
  menuCloseLabel: string;
}

export default function MobileNav({
  navItems,
  cta,
  menuLabel,
  menuOpenLabel,
  menuCloseLabel,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Lock body scroll + close on Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('menu-open');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? menuCloseLabel : menuOpenLabel}
        aria-controls="mobile-nav-panel"
        className="md:hidden flex items-center justify-center text-white no-underline bg-transparent border border-white/15 hover:bg-white/[0.06] transition-colors"
        style={{ width: 40, height: 40, borderRadius: 2, gap: 4 }}
      >
        {/* Hamburger / close icon — pure SVG, no external deps */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          {open ? (
            <path d="M4 4 L14 14 M14 4 L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <>
              <path d="M2 5 L16 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M2 9 L16 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M2 13 L16 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="md:hidden absolute left-0 right-0 top-full bg-fg border-b border-white/10 z-40"
          role="dialog"
          aria-modal="true"
          aria-label={menuLabel}
          style={{ maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}
        >
          <nav className="flex flex-col" style={{ padding: '12px 20px 20px' }}>
            {navItems.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                className="font-mono text-white/80 no-underline border-b border-white/[0.06] last:border-b-0 hover:text-white hover:bg-white/[0.04]"
                style={{
                  fontSize: 14,
                  letterSpacing: '0.06em',
                  padding: '16px 4px',
                  paddingTop: i === 0 ? 12 : 16,
                }}
              >
                {item.label}
              </a>
            ))}

            <div
              className="flex items-center justify-between"
              style={{ paddingTop: 20, marginTop: 8 }}
            >
              <LanguageToggle />
              <a
                href="#contacto"
                onClick={close}
                className="font-mono text-white no-underline bg-brand hover:bg-brand-hover transition-colors"
                style={{
                  fontSize: 13,
                  letterSpacing: '0.06em',
                  padding: '12px 20px',
                  borderRadius: 2,
                  minHeight: 44,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {cta}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}