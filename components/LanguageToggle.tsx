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
    <div className="lang">
      <button
        type="button"
        onClick={() => toggleLanguage('es')}
        className="lang__btn"
        aria-current={currentLocale === 'es' ? 'true' : undefined}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
      <span className="lang__sep" aria-hidden="true">/</span>
      <button
        type="button"
        onClick={() => toggleLanguage('en')}
        className="lang__btn"
        aria-current={currentLocale === 'en' ? 'true' : undefined}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
