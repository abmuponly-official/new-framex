import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function PainSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const pains = [
    { title: t('pain_1_title'), desc: t('pain_1_desc') },
    { title: t('pain_2_title'), desc: t('pain_2_desc') },
    { title: t('pain_3_title'), desc: t('pain_3_desc') },
    { title: t('pain_4_title'), desc: t('pain_4_desc') },
  ];

  return (
    <section
      className="relative section-screen overflow-hidden"
      aria-labelledby="pain-heading"
      style={{ background: 'var(--gradient-section)' }}
    >
      <style>{`.pain-card:hover { background: rgba(60,60,60,0.7) !important; }`}</style>
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 container-base w-full py-24">

        {/* ── Section header ── */}
        <div className="max-w-2xl mb-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-6 reveal">
            <span className="divider-accent" aria-hidden="true" />
            <span className="text-eyebrow">{t('pain_eyebrow')}</span>
          </div>

          {/* Headline */}
          <h2
            id="pain-heading"
            className="font-display font-bold text-balance reveal reveal-delay-1"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            {t('pain_headline')}
          </h2>

          {/* Sub */}
          <p
            className="mt-4 text-base reveal reveal-delay-2"
            style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '52ch', lineHeight: '1.7' }}
          >
            {t('pain_sub')}
          </p>
        </div>

        {/* ── Pain cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px reveal reveal-delay-2"
          style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}
        >
          {pains.map((pain, i) => (
            <div
              key={i}
              className="pain-card p-8 transition-all duration-400"
              style={{
                background: 'rgba(44,44,44,0.6)',
                backdropFilter: 'blur(2px)',
              }}
            >
              {/* Number */}
              <span
                className="block text-xs font-mono mb-5"
                style={{ color: 'rgba(255,107,53,0.7)', letterSpacing: '0.1em' }}
              >
                0{i + 1}
              </span>
              {/* Orange micro-line */}
              <div
                className="mb-6"
                style={{ width: '1.5rem', height: '2px', background: '#FF6B35', opacity: 0.7 }}
                aria-hidden="true"
              />
              <h3
                className="font-display font-semibold mb-3"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.9375rem',
                  color: '#FFFFFF',
                  lineHeight: '1.3',
                }}
              >
                {pain.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.65' }}
              >
                {pain.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Closing line ── */}
        <p
          className="mt-12 text-sm reveal reveal-delay-3"
          style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.02em' }}
        >
          {t('pain_closing')}
        </p>
      </div>
    </section>
  );
}
