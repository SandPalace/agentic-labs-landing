'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  const toggleLanguage = (newLocale: 'en' | 'es') => {
    if (newLocale !== currentLocale) {
      router.push(pathname, { locale: newLocale });
    }
  };

  return (
    <div
      className="flex items-center font-label font-semibold flex-shrink-0"
      style={{ gap: 2, fontSize: 12, letterSpacing: '0.12em', marginRight: 8 }}
    >
      <button
        onClick={() => toggleLanguage('es')}
        className={`rounded-full transition-colors ${
          currentLocale === 'es'
            ? 'text-blue-ink bg-blue-soft'
            : 'text-steel hover:text-fg'
        }`}
        style={{ padding: '8px 10px' }}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
      <span className="text-line-strong">/</span>
      <button
        onClick={() => toggleLanguage('en')}
        className={`rounded-full transition-colors ${
          currentLocale === 'en'
            ? 'text-blue-ink bg-blue-soft'
            : 'text-steel hover:text-fg'
        }`}
        style={{ padding: '8px 10px' }}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
