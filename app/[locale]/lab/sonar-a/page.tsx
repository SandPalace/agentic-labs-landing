import { getTranslations, setRequestLocale } from 'next-intl/server';
import SonarDesktop, { type DesktopCopy } from '@/components/lab/sonar-a/SonarDesktop';
import type { TerminalLabels } from '@/components/lab/sonar-a/Terminal';
import FontSwitcher from '@/components/lab/FontSwitcher';
import './sonar-a.css';

export const metadata = { title: 'Lab · sonar-a (Tokyo Night tiling desktop)' };

export default async function SonarA({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const c = t.raw('hero.console') as { sources: string[]; teams: string[]; inputs: string; hub: string; outputs: string; human: string; status: string };
  const es = locale === 'es';

  const terminal: TerminalLabels = {
    inputs: c.inputs, hub: c.hub, outputs: c.outputs, human: c.human, status: c.status, sources: c.sources, teams: c.teams,
  };
  const copy: DesktopCopy = {
    locale,
    eyebrowLocation: t('hero.eyebrowLocation'),
    eyebrowStatus: t('hero.eyebrowStatus'),
    headline1: t('hero.headline1'),
    headline2: t('hero.headline2'),
    kicker: t('hero.kicker'),
    sub: t('hero.sub'),
    ctaPrimary: t('hero.ctaPrimary'),
    ctaSecondary: t('hero.ctaSecondary'),
    proofA: '',
    proofALabel: '',
    proofB: t('hero.proof.b'),
    proofBLabel: t('hero.proof.bLabel'),
    terminal,
    ui: {
      saver: 'screensaver',
      saverHint: es ? 'cualquier tecla, clic o toque para volver' : 'press any key, click or tap to wake',
      workspace: es ? 'Espacio de trabajo' : 'Workspace',
      screensaverLabel: es ? 'Protector de pantalla de Mty Agentic Labs. Cualquier tecla lo cierra.' : 'Mty Agentic Labs screensaver. Any key closes it.',
    },
  };

  return (
    <>
      <SonarDesktop copy={copy} />
      <FontSwitcher />
    </>
  );
}
