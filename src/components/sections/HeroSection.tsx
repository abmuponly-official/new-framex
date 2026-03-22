import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function HeroSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section
      id="hero"
      className="relative section-screen overflow-hidden"
      aria-label="Hero"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* ── Subtle grid texture overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px,
            transparent 1px, transparent 80px
          ), repeating-linear-gradient(
            180deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px,
            transparent 1px, transparent 80px
          )`,
        }}
        aria-hidden="true"
      />

      {/* ── Radial soft vignette glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 60%, rgba(255,107,53,0.04) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ── Top-left: FrameX small mark ── */}
      <div className="absolute top-7 left-7 z-20">
        <span
          className="text-sm font-bold tracking-[0.12em] uppercase"
          style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(255,255,255,0.45)' }}
        >
          Frame<span style={{ color: '#FF6B35' }}>X</span>
        </span>
      </div>

      {/* ── Top-right: Skip link ── */}
      <div className="absolute top-7 right-7 z-20">
        <a
          href="#guided-question"
          className="text-sm transition-colors duration-200 hover:opacity-80"
          style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}
        >
          {locale === 'vi' ? 'Bỏ qua' : 'Skip'} →
        </a>
      </div>

      {/* ── Center content ── */}
      <div className="relative z-10 container-base w-full">
        <div className="max-w-3xl mx-auto text-center animate-fade-up">

          {/* Orange accent line above headline */}
          <div className="flex justify-center mb-8">
            <span className="divider-accent" aria-hidden="true" />
          </div>

          {/* Headline — Montserrat bold */}
          <h1
            className="text-display-lg md:text-display-xl font-display font-bold text-balance mb-6 leading-[1.1]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
            }}
          >
            {t('hero_headline')}
          </h1>

          {/* Sub-headline */}
          <p
            className="text-lg md:text-xl mb-12 font-light"
            style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.01em', maxWidth: '44ch', margin: '0 auto 3rem' }}
          >
            {t('hero_sub')}
          </p>

          {/* Primary CTA */}
          <a
            href="#guided-question"
            className="btn-primary inline-flex gap-2"
            style={{ fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.75rem' }}
          >
            {t('hero_cta')}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1L13 7L7 13M13 7H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          {/* Scroll hint */}
          <p
            className="mt-10 text-xs tracking-[0.2em] uppercase"
            style={{ color: 'rgba(255,255,255,0.22)' }}
          >
            {t('hero_scroll')}
          </p>
        </div>
      </div>

      {/* ── Scroll indicator — thin animated line ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3" aria-hidden="true">
        <div
          className="w-px h-14 animate-pulse"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,107,53,0.6))' }}
        />
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="rgba(255,107,53,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
    </section>
  );
}
