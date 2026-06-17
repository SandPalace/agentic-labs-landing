import { getTranslations } from 'next-intl/server';
import LanguageToggle from '@/components/LanguageToggle';
import MobileNav from '@/components/MobileNav';

export default async function Topbar() {
  const t = await getTranslations('topbar');

  const navItems = [
    { href: '#servicios', label: t('catalog') },
    { href: '#problemas', label: t('agents') },
    { href: '#metodo', label: t('research') },
    { href: '#diferencias', label: t('about') },
    { href: '#stack', label: t('lab') },
  ];

  return (
    <header
      className="sticky top-0 z-50 bg-fg border-b border-white/[0.08]"
      style={{ height: 64 }}
    >
      <div
        className="mx-auto flex items-center container-px"
        style={{ maxWidth: 1280, height: 64, gap: 32 }}
      >
        <a href="#top" className="flex items-center gap-2.5 no-underline flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mark-white.svg" alt="MtyAgenticLabs" width={26} height={23} className="block" />
          <span
            className="font-mono text-white/90 font-semibold"
            style={{ fontSize: 12, letterSpacing: '0.12em' }}
          >
            MTY AGENTIC LABS
          </span>
        </a>

        {/* Desktop nav (md and up) */}
        <nav className="hidden md:flex gap-1 flex-1" style={{ marginLeft: 16 }}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`font-mono text-white/55 no-underline rounded-sm transition-colors hover:text-white/90 hover:bg-white/[0.06] ${
                item.label === t('lab') ? 'text-white/30' : ''
              }`}
              style={{ fontSize: 13, letterSpacing: '0.06em', padding: '8px 14px' }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right cluster — Language toggle + CTA (desktop) */}
        <div className="hidden md:flex items-center ml-auto">
          <LanguageToggle />
          <a
            href="#contacto"
            className="font-mono text-white no-underline bg-brand transition-colors hover:bg-brand-hover flex-shrink-0"
            style={{ fontSize: 12, letterSpacing: '0.06em', padding: '9px 18px', borderRadius: 2 }}
          >
            {t('cta')}
          </a>
        </div>

        {/* Mobile nav (below md) */}
        <div className="flex items-center ml-auto md:hidden">
          <MobileNav
            navItems={navItems}
            cta={t('cta')}
            menuLabel={t('menu')}
            menuOpenLabel={t('menuOpen')}
            menuCloseLabel={t('menuClose')}
          />
        </div>
      </div>
    </header>
  );
}