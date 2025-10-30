'use client';

import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function LanguageToggle() {
  const router = useRouter();
  const params = useParams();
  const currentLocale = params.locale as string;

  const toggleLanguage = (newLocale: 'en' | 'es') => {
    // Only change if different locale
    if (newLocale !== currentLocale) {
      // Always navigate to root path with new locale
      router.push('/', { locale: newLocale });
    }
  };

  return (
    <div className="fixed top-0 right-0 z-50 h-20 mr-4 flex items-center">
      <div className="flex items-center gap-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full p-1 shadow-lg">
        <button
          onClick={() => toggleLanguage('en')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            currentLocale === 'en'
              ? 'bg-white text-gray-900 shadow-md'
              : 'text-gray-300 hover:text-white'
          }`}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          onClick={() => toggleLanguage('es')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            currentLocale === 'es'
              ? 'bg-white text-gray-900 shadow-md'
              : 'text-gray-300 hover:text-white'
          }`}
          aria-label="Cambiar a Español"
        >
          ES
        </button>
      </div>
    </div>
  );
}
