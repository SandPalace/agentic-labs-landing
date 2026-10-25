import { getTranslations, setRequestLocale } from 'next-intl/server';
import SonarB from '@/components/lab/sonar-b/SonarB';
import './sonar-b.css';

export default async function SonarBPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <SonarB
      locale={locale}
      copy={{
        location: t('hero.eyebrowLocation'),
        status: t('hero.eyebrowStatus'),
        h1a: t('hero.headline1'),
        h1b: t('hero.headline2'),
        kicker: t('hero.kicker'),
        sub: t('hero.sub'),
        ctaPrimary: t('hero.ctaPrimary'),
        ctaSecondary: t('hero.ctaSecondary'),
        proofA: '',
        proofALabel: '',
        proofB: t('hero.proof.b'),
        proofBLabel: t('hero.proof.bLabel'),
      }}
    />
  );
}
