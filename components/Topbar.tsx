import { getLocale, getTranslations } from 'next-intl/server';
import LanguageToggle from '@/components/LanguageToggle';
import MobileNav from '@/components/MobileNav';
import Logo from '@/components/Logo';
import ThemePicker from '@/components/terminal/ThemePicker';
import ActiveSection from '@/components/terminal/ActiveSection';

export default async function Topbar() {
  const t = await getTranslations('topbar');
  const locale = await getLocale();

  const navItems = [
    { href: '#ruta', label: t('route') },
    { href: '#servicios', label: t('services') },
    { href: '#gobernanza', label: t('governance') },
    { href: '#agentos', label: t('agentos') },
    { href: '#preguntas', label: t('faq') },
  ];

  return (
    <>
    <a href="#contenido" className="skip-link">{t('skip')}</a>
    <header className="top">
      <ActiveSection ids={navItems.map((item) => item.href.slice(1))} />
      <div
        className="mx-auto flex items-center container-px"
        style={{ maxWidth: 1280, height: 64, gap: 24 }}
      >
        <a href="#top" className="flex items-center no-underline flex-shrink-0" style={{ minHeight: 44 }} aria-label="Mty Agentic Labs">
          <Logo size={26} fontSize={15} />
        </a>

        {/* Desktop nav (md and up) */}
        <nav className="top__nav hidden xl:flex gap-1 flex-1" aria-label="Principal">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right cluster — Language toggle + CTA (desktop) */}
        <div className="hidden xl:flex items-center ml-auto" style={{ gap: 12 }}>
          <ThemePicker locale={locale} />
          <LanguageToggle />
          <a
            href="#contacto"
            className="btn btn-primary btn-sm flex-shrink-0"
          >
            {t('cta')}
          </a>
        </div>

        {/* Mobile nav (below md) */}
        <div className="flex items-center ml-auto xl:hidden" style={{ gap: 8 }}>
          <ThemePicker compact locale={locale} />
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
    </>
  );
}