import Logo, { LogoMark } from '@/components/Logo';
import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('topbar');
  const booking = await getTranslations('booking');

  const navItems = [
    { href: '#ruta', label: nav('route') },
    { href: '#servicios', label: nav('services') },
    { href: '#gobernanza', label: nav('governance') },
    { href: '#agentos', label: nav('agentos') },
    { href: '#preguntas', label: nav('faq') },
  ];

  return (
    <footer className="curtain-footer foot">
      <div className="mx-auto container-px" style={{ maxWidth: 1280, paddingTop: 'clamp(48px, 8vw, 88px)', paddingBottom: 28 }}>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-end">
          <div>
            <LogoMark size={56} />
            <p className="foot__tag">
              {t('tagline')}
            </p>
            <a
              href={`mailto:${booking('email')}`}
              className="foot__mail"
            >
              {booking('email')}
            </a>
          </div>
          <nav aria-label="Footer" className="foot__nav grid grid-cols-2 sm:grid-cols-3" style={{ gap: 4 }}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="foot__bar">
          <Logo size={20} fontSize={13} />
          <div className="eyebrow">{t('loc')}</div>
          <div className="eyebrow">{t('rights')}</div>
        </div>
      </div>
    </footer>
  );
}
