import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function HeroSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center
        bg-brand-black text-brand-white overflow-hidden"
      aria-label="Hero"
    >
      {/* Minimal background texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg, #fff 0px, #fff 1px, transparent 1px, transparent 80px
          ), repeating-linear-gradient(
            180deg, #fff 0px, #fff 1px, transparent 1px, transparent 80px
          )`,
        }}
      />

      {/* FrameX small mark — top left, fades in after hero */}
      <div className="absolute top-6 left-6">
        <span className="text-brand-gray-600 text-sm font-medium tracking-tight">FrameX</span>
      </div>

      {/* Skip button — top right */}
      <div className="absolute top-6 right-6">
        <a
          href="#guided-question"
          className="text-brand-gray-500 text-sm hover:text-brand-gray-300 transition-colors"
        >
          {locale === 'vi' ? 'Bỏ qua' : 'Skip'} →
        </a>
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto animate-fade-up">
        <h1 className="text-display-lg md:text-display-xl font-semibold text-brand-white mb-6 leading-[1.1]">
          {t('hero_headline')}
        </h1>
        <p className="text-xl md:text-2xl text-brand-gray-400 mb-12 font-light">
          {t('hero_sub')}
        </p>
        <a
          href="#guided-question"
          className="inline-flex items-center gap-2 px-8 py-3.5
            border border-brand-gray-600 text-brand-gray-200 text-sm font-medium
            hover:border-brand-white hover:text-brand-white transition-all rounded-sm"
        >
          {t('hero_cta')}
        </a>
        <p className="mt-8 text-brand-gray-600 text-xs tracking-widest uppercase">
          {t('hero_scroll')}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-brand-gray-600 animate-pulse" />
      </div>
    </section>
  );
}
