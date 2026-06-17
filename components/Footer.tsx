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
    <footer className="bg-fg border-t border-white/[0.06]" style={{ padding: '28px 0' }}>
      <div
        className="mx-auto flex flex-col md:flex-row md:items-center container-px"
        style={{ maxWidth: 1280, gap: 24 }}
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mark-white.svg" alt="MtyAgenticLabs" width={22} height={20} style={{ opacity: 0.4 }} />
          <span
            className="font-mono text-white/25"
            style={{ fontSize: 11, letterSpacing: '0.12em' }}
          >
            MTY AGENTIC LABS
          </span>
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
              className="font-mono text-white/25 no-underline rounded-sm transition-colors hover:text-white/60"
              style={{
                fontSize: 12,
                letterSpacing: '0.06em',
                padding: '5px 9px',
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
          className="font-mono text-white/20 md:text-right"
          style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'none' }}
        >
          {t('loc')}
        </div>
      </div>
    </footer>
  );
}