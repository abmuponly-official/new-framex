import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function SolutionSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const pillars = [
    { num: t('pillar_1_num'), title: t('pillar_1_title'), desc: t('pillar_1_desc'), outcome: t('pillar_1_outcome') },
    { num: t('pillar_2_num'), title: t('pillar_2_title'), desc: t('pillar_2_desc'), outcome: t('pillar_2_outcome') },
    { num: t('pillar_3_num'), title: t('pillar_3_title'), desc: t('pillar_3_desc'), outcome: t('pillar_3_outcome') },
  ];

  return (
    <section
      className="relative section-padding overflow-hidden"
      aria-labelledby="solution-heading"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <style>{`.solution-pillar:hover { background: rgba(44,44,44,0.9) !important; }`}</style>
      <div className="container-base">

        {/* ── Header row ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-5 reveal">
              <span className="divider-accent" aria-hidden="true" />
              <span className="text-eyebrow">{t('solution_eyebrow')}</span>
              <span
                className="text-xs px-2 py-0.5 rounded-sm border font-semibold"
                style={{ borderColor: 'rgba(255,107,53,0.35)', color: '#FF6B35', fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' }}
              >
                {t('solution_tag')}
              </span>
            </div>
            <h2
              id="solution-heading"
              className="font-display font-bold text-balance reveal reveal-delay-1"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: '1.2',
              }}
            >
              {t('solution_headline')}
            </h2>
          </div>
          <Link
            href={`/${locale}/giai-phap-3-trong-1`}
            className="text-sm font-medium shrink-0 transition-opacity duration-200 opacity-40 hover:opacity-80 reveal"
            style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.01em' }}
          >
            {locale === 'vi' ? 'Xem chi tiết' : 'Learn more'} →
          </Link>
        </div>

        {/* ── Three pillars ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 reveal reveal-delay-2"
          style={{
            gap: '1px',
            background: 'rgba(255,255,255,0.07)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          {pillars.map((pillar, i) => (
            <article
              key={i}
              className="solution-pillar p-8 md:p-10 transition-colors duration-300"
              style={{ background: 'rgba(26,26,26,0.95)' }}
            >
              <span
                className="block text-xs font-mono mb-6"
                style={{ color: 'rgba(255,107,53,0.6)', letterSpacing: '0.1em' }}
              >
                {pillar.num}
              </span>
              <h3
                className="font-display font-bold mb-4"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.0625rem', color: '#FFFFFF', lineHeight: '1.3' }}
              >
                {pillar.title}
              </h3>
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.65' }}
              >
                {pillar.desc}
              </p>
              <div className="flex items-center gap-2">
                <div style={{ width: '1.5rem', height: '2px', background: '#FF6B35' }} aria-hidden="true" />
                <span className="text-sm font-semibold" style={{ color: '#FF6B35', fontFamily: 'Inter, sans-serif' }}>
                  {pillar.outcome}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* ── Signature line ── */}
        <p
          className="mt-12 text-sm reveal reveal-delay-3"
          style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}
        >
          {t('solution_signature')}
        </p>
      </div>
    </section>
  );
}
