'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Bot, TrendingUp, MessageCircle, Settings, Sparkles, MonitorSmartphone } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import LanguageToggle from '@/components/LanguageToggle';
import { GradientBackground } from '@/components/gradient-background';
import ViewportAnimation from '@/components/ViewportAnimation';

export default function Home() {
  const t = useTranslations();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.debugLogs = window.debugLogs || [];
      window.debugLogs.push('[Home] Component mounted at ' + new Date().toISOString());
      console.log('[Home] Component mounted');
    }
    return () => console.log('[Home] Component unmounted');
  }, []);

  const styles = {
    section_container: "flex flex-col",
    section_header: "text-2xl font-semibold mb-3 text-white inline-flex items-start gap-3 font-primary",
    section_description: "flex-1 text-gray-200 text-sm flex items-start font-secondary",
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Language Toggle */}
      <LanguageToggle />

      {/* Fixed Gradient Background */}
      <GradientBackground />

      {/* Top Logo/Brand */}
      <div className="relative z-20 h-32 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-5xl text-white tracking-tight font-primary">
            Monterrey Agentic Labs
          </h1>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="pt-20 max-w-6xl mx-auto text-center">
            <ViewportAnimation animation="fade-up">
              <h1 className="font-primary whitespace-pre-wrap text-5xl md:text-7xl lg:text-8xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-200 leading-tight px-4">
                {t('hero.headline')}
              </h1>
            </ViewportAnimation>
            <ViewportAnimation animation="fade-up" delay={100}>
              <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto px-4 font-secondary">
                {t('hero.subheadline')}
              </p>
            </ViewportAnimation>
            <ViewportAnimation animation="scale-up" delay={200}>
              <GlassCard className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
                <div className="p-4">
                  <p className="text-3xl font-bold text-white mb-2 font-primary font-primary">78%</p>
                  <p className="text-sm text-gray-300 font-secondary">{t('hero.stats.adoption')}</p>
                </div>
                <div className="p-4">
                  <p className="text-3xl font-bold text-white mb-2 font-primary">10-25%</p>
                  <p className="text-sm text-gray-300 font-secondary">{t('hero.stats.ebitda')}</p>
                </div>
                <div className="p-4">
                  <p className="text-3xl font-bold text-white mb-2 font-primary">203</p>
                  <p className="text-sm text-gray-300 font-secondary">{t('hero.stats.speed')}</p>
                </div>
                <div className="p-4">
                  <p className="text-3xl font-bold text-white mb-2 font-primary">44%</p>
                  <p className="text-sm text-gray-300 font-secondary">{t('hero.stats.growth')}</p>
                </div>
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-white/90 to-gray-100/90 text-gray-900 rounded-full font-semibold text-lg hover:scale-105 hover:from-white hover:to-gray-200 transition-all duration-200 shadow-lg hover:shadow-white/30 backdrop-blur-sm border border-white/20 font-primary">
                {t('hero.cta')}
              </button>
            </GlassCard>
            </ViewportAnimation>
          </div>
        </section>

      {/* Services Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-7xl mx-auto">
              <ViewportAnimation animation="fade-up">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 font-primary">
                  {t('services.headline')}
                </h2>
              </ViewportAnimation>
              <ViewportAnimation animation="fade-up" delay={100}>
                <p className="text-center text-gray-200 mb-16 max-w-3xl mx-auto font-secondary">
                  {t('services.subheadline')}
                </p>
              </ViewportAnimation>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ViewportAnimation animation="fade-up" delay={0}>
                  <GlassCard className={styles.section_container}>
                  <h3 className={styles.section_header}>
                    <Bot className="w-8 h-8" />
                    {t('services.aiAgents.title')}
                  </h3>
                  <p className={styles.section_description}>
                    {t('services.aiAgents.description')}
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-200 font-semibold">{t('services.aiAgents.stat1')}</p>
                  </div>
                </GlassCard>
                </ViewportAnimation>

                <ViewportAnimation animation="fade-up" delay={100}>
                  <GlassCard className={styles.section_container}>
                    <h3 className={styles.section_header}>
                      <TrendingUp className="w-8 h-8" />
                      {t('services.sales.title')}
                    </h3>
                    <p className={styles.section_description}>
                      {t('services.sales.description')}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-200 font-semibold">{t('services.sales.impact')}</p>
                    </div>
                  </GlassCard>
                </ViewportAnimation>

                <ViewportAnimation animation="fade-up" delay={200}>
                  <GlassCard className={styles.section_container}>
                    <h3 className={styles.section_header}>
                      <MessageCircle className="w-8 h-8" />
                      {t('services.customerService.title')}
                    </h3>
                    <p className={styles.section_description}>
                      {t('services.customerService.description')}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-200 font-semibold">{t('services.customerService.caseStudy')}</p>
                    </div>
                  </GlassCard>
                </ViewportAnimation>

                <ViewportAnimation animation="fade-up" delay={0}>
                  <GlassCard>
                    <h3 className={styles.section_header}>
                      <MonitorSmartphone className="w-8 h-8" />
                      {t('services.development.title')}
                    </h3>
                    <p className={styles.section_description}>
                      {t('services.development.description')}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-200 font-semibold">{t('services.development.impact')}</p>
                    </div>
                  </GlassCard>
                </ViewportAnimation>

                <ViewportAnimation animation="fade-up" delay={100}>
                  <GlassCard className={styles.section_container}>
                    <h3 className={styles.section_header}>
                      <Sparkles className="w-8 h-8" />
                      {t('services.marketing.title')}
                    </h3>
                    <p className={styles.section_description}>
                      {t('services.marketing.description')}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-200 font-semibold">{t('services.marketing.stat')}</p>
                    </div>
                  </GlassCard>
                </ViewportAnimation>

                <ViewportAnimation animation="fade-up" delay={200}>
                  <GlassCard className={styles.section_container}>
                    <h3 className={styles.section_header}>
                      <Settings className="w-8 h-8" />
                      {t('services.operations.title')}
                    </h3>
                    <p className={styles.section_description}>
                      {t('services.operations.description')}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-200 font-semibold">{t('services.operations.caseStudy')}</p>
                    </div>
                  </GlassCard>
                </ViewportAnimation>
              </div>
            </div>
        </section>

      {/* Problem Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto">
              <ViewportAnimation animation="fade-up">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 font-primary">
                  {t('problem.headline')}
                </h2>
              </ViewportAnimation>
              <div className="grid md:grid-cols-3 gap-6">
                <ViewportAnimation animation="fade-up" delay={0}>
                  <GlassCard className="bg-gray-900/10 backdrop-blur-md">
                    <h3 className="text-xl font-semibold mb-4 text-white font-primary">
                      {t('problem.layering.title')}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 font-secondary">
                      {t('problem.layering.description')}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-400/20">
                      <p className="text-2xl font-bold text-white">72%</p>
                      <p className="text-xs text-gray-300 font-secondary">{t('common.useAI')}</p>
                    </div>
                  </GlassCard>
                </ViewportAnimation>

                <ViewportAnimation animation="fade-up" delay={100}>
                  <GlassCard className="bg-gray-900/10 backdrop-blur-md">
                    <h3 className="text-xl font-semibold mb-4 text-white font-primary">
                      {t('problem.leadership.title')}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 font-secondary">
                      {t('problem.leadership.description')}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-400/20">
                      <p className="text-2xl font-bold text-white">1%</p>
                      <p className="text-xs text-gray-300 font-secondary">{t('problem.leadership.stat')}</p>
                    </div>
                  </GlassCard>
                </ViewportAnimation>

                <ViewportAnimation animation="fade-up" delay={200}>
                  <GlassCard className="bg-gray-900/10 backdrop-blur-md">
                    <h3 className="text-xl font-semibold mb-4 text-white font-primary">
                      {t('problem.speed.title')}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 font-secondary">
                      {t('problem.speed.description')}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-400/20">
                      <p className="text-2xl font-bold text-white">47%</p>
                      <p className="text-xs text-gray-300 font-secondary">{t('problem.speed.stat')}</p>
                    </div>
                  </GlassCard>
                </ViewportAnimation>
              </div>
            </div>
        </section>

      {/* CTA Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
              <ViewportAnimation animation="fade-up">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-300 font-primary">
                  {t('cta.headline')}
                </h2>
              </ViewportAnimation>
              <ViewportAnimation animation="fade-up" delay={100}>
                <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto font-secondary">
                  {t('cta.subheadline')}
                </p>
              </ViewportAnimation>
              <ViewportAnimation animation="scale-up" delay={200}>
                <GlassCard>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4">
                    <p className="text-3xl font-bold text-white mb-2 font-primary">$9T</p>
                    <p className="text-sm text-gray-300 font-secondary">{t('cta.stats.industry')}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-3xl font-bold text-white mb-2 font-primary">44%</p>
                    <p className="text-sm text-gray-300 font-secondary">{t('cta.stats.adoption')}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-3xl font-bold text-white mb-2 font-primary">1.5x</p>
                    <p className="text-sm text-gray-300 font-secondary">{t('cta.stats.growth')}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full font-semibold text-lg hover:scale-105 hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-white/20 font-primary">
                    {t('cta.primary')}
                  </button>
                  <button className="px-8 py-4 border-2 border-gray-400/50 rounded-full font-semibold text-lg hover:scale-105 hover:border-gray-300 transition-all duration-200 font-primary">
                    {t('cta.secondary')}
                  </button>
                </div>
              </GlassCard>
              </ViewportAnimation>
            </div>
        </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <ViewportAnimation animation="fade-up">
              <GlassCard>
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white font-primary">Monterrey Agentic Labs</h3>
                  <p className="text-sm text-gray-300 font-secondary">Monterrey, Nuevo León, México</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-gray-200 font-primary">{t('footer.services')}</h4>
                  <ul className="text-sm text-gray-500 space-y-2 hover:*:text-gray-200 font-secondary">
                    <li className="transition-colors cursor-pointer">{t('services.aiAgents.title')}</li>
                    <li className="transition-colors cursor-pointer">{t('services.sales.title')}</li>
                    <li className="transition-colors cursor-pointer">{t('services.development.title')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-gray-200 font-primary">{t('footer.company')}</h4>
                  <ul className="text-sm text-gray-500 space-y-2 hover:*:text-gray-200 font-secondary">
                    <li className="transition-colors cursor-pointer">{t('footer.about')}</li>
                    <li className="transition-colors cursor-pointer">{t('footer.caseStudies')}</li>
                    <li className="transition-colors cursor-pointer">{t('footer.blog')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-gray-200 font-primary">{t('footer.contact')}</h4>
                  <ul className="text-sm text-gray-500 space-y-2 hover:*:text-gray-200 font-secondary">
                    <li className="transition-colors cursor-pointer">LinkedIn</li>
                    <li className="transition-colors cursor-pointer">Twitter/X</li>
                    <li className="transition-colors cursor-pointer">GitHub</li>
                  </ul>
                </div>
              </div>
              <div className="text-center text-gray-300 text-sm border-t border-white/10 pt-6 font-secondary">
                <p>© 2025 Monterrey Agentic Labs. {t('footer.rights')}</p>
              </div>
            </GlassCard>
            </ViewportAnimation>
          </div>
        </footer>
    </div>
  );
}
