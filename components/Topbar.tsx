import { getTranslations } from 'next-intl/server';
import LanguageToggle from '@/components/LanguageToggle';
import MobileNav from '@/components/MobileNav';
import Logo from '@/components/Logo';

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
      className="sticky top-0 z-50 border-b border-line"
      style={{ height: 64, background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'saturate(180%) blur(12px)', WebkitBackdropFilter: 'saturate(180%) blur(12px)' }}
    >
      <div
        className="mx-auto flex items-center container-px"
        style={{ maxWidth: 1280, height: 64, gap: 32 }}
      >
        <a href="#top" className="flex items-center no-underline flex-shrink-0" aria-label="Mty Agentic Labs">
          <Logo size={26} fontSize={17} />
        </a>

        {/* Desktop nav (md and up) */}
        <nav className="hidden md:flex gap-1 flex-1" style={{ marginLeft: 16 }}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`font-body font-medium no-underline rounded-full transition-colors hover:text-fg hover:bg-base ${
                item.label === t('lab') ? 'text-steel-light' : 'text-steel'
              }`}
              style={{ fontSize: 14, padding: '8px 14px' }}
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
            className="font-body font-semibold text-white no-underline bg-brand transition-colors hover:bg-brand-hover flex-shrink-0 rounded-full"
            style={{ fontSize: 14, padding: '10px 20px' }}
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