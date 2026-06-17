'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const toggleLanguage = (newLocale: 'en' | 'es') => {
    if (newLocale !== currentLocale) {
      router.push(pathname, { locale: newLocale });
    }
  };

  return (
    <div
      className="flex items-center font-mono flex-shrink-0"
      style={{ gap: 2, fontSize: 13, letterSpacing: '0.06em', marginRight: 8 }}
    >
      <button
        onClick={() => toggleLanguage('es')}
        className={`rounded-sm transition-colors ${
          currentLocale === 'es'
            ? 'text-white bg-white/10'
            : 'text-white/40 hover:text-white/80'
        }`}
        style={{ padding: '8px 10px' }}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
      <span className="text-white/20">/</span>
      <button
        onClick={() => toggleLanguage('en')}
        className={`rounded-sm transition-colors ${
          currentLocale === 'en'
            ? 'text-white bg-white/10'
            : 'text-white/40 hover:text-white/80'
        }`}
        style={{ padding: '8px 10px' }}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
