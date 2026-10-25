import Logo from '@/components/Logo';
import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('footer');

  const navItems = [
    { href: '#servicios', label: t('catalog') },
    { href: '#problemas', label: t('agents') },
    { href: '#metodo', label: t('research') },
    { href: '#stack', label: t('openSource') },
    { href: '#diferencias', label: t('about') },
    { href: '#contacto', label: t('lab') },
  ];

  return (
    <footer className="bg-white border-t border-line" style={{ padding: '28px 0' }}>
      <div
        className="mx-auto flex flex-col md:flex-row md:items-center container-px"
        style={{ maxWidth: 1280, gap: 24 }}
      >
        <div className="flex items-center flex-shrink-0">
          <Logo size={22} fontSize={15} />
        </div>

        {/* Mobile: 2-column grid; Desktop: inline flex */}
        <nav
          className="grid grid-cols-2 md:flex md:flex-1 md:flex-wrap"
          style={{ gap: 4 }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-body text-steel no-underline rounded-full transition-colors hover:text-fg hover:bg-base"
              style={{
                fontSize: 14,
                padding: '5px 12px',
                minHeight: 36,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div
          className="font-label font-semibold text-steel md:text-right"
          style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}
        >
          {t('loc')}
        </div>
      </div>
    </footer>
  );
}