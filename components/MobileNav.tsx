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
        className="burger xl:hidden"
      >
        {/* Hamburger / close icon — pure SVG, no external deps */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          {open ? (
            <path d="M4 4 L14 14 M14 4 L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="butt" />
          ) : (
            <>
              <path d="M2 5 L16 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="butt" />
              <path d="M2 9 L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="butt" />
              <path d="M2 13 L16 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="butt" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="mnav xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={menuLabel}
        >
          <nav className="flex flex-col" style={{ padding: '12px 20px 20px' }}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                className="mnav__link"
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
                className="btn btn-primary"
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