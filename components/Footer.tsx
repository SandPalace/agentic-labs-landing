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
    { href: '#casos', label: nav('work') },
    { href: '#preguntas', label: nav('faq') },
  ];

  return (
    <footer className="curtain-footer bg-white border-t border-line">
      <div className="mx-auto container-px" style={{ maxWidth: 1280, paddingTop: 'clamp(48px, 8vw, 88px)', paddingBottom: 28 }}>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-end">
          <div>
            <LogoMark size={56} />
            <p className="font-display font-extrabold text-fg m-0" style={{ fontSize: 'clamp(26px, 3.4vw, 40px)', letterSpacing: '-0.035em', lineHeight: 1.1, marginTop: 24, maxWidth: '20ch' }}>
              {t('tagline')}
            </p>
            <a
              href={`mailto:${booking('email')}`}
              className="inline-block font-semibold text-brand no-underline border-b border-brand/30 hover:border-brand transition-colors"
              style={{ marginTop: 20, fontSize: 17 }}
            >
              {booking('email')}
            </a>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: 4 }}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-body text-steel no-underline rounded-full transition-colors hover:text-fg hover:bg-base"
                style={{ fontSize: 15, padding: '8px 12px', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-line" style={{ gap: 12, marginTop: 48, paddingTop: 20 }}>
          <Logo size={20} fontSize={14} />
          <div className="eyebrow">{t('loc')}</div>
          <div className="eyebrow">{t('rights')}</div>
        </div>
      </div>
    </footer>
  );
}
