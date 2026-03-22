import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function SolutionSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const pillars = [
    {
      num:     t('pillar_1_num'),
      title:   t('pillar_1_title'),
      desc:    t('pillar_1_desc'),
      outcome: t('pillar_1_outcome'),
    },
    {
      num:     t('pillar_2_num'),
      title:   t('pillar_2_title'),
      desc:    t('pillar_2_desc'),
      outcome: t('pillar_2_outcome'),
    },
    {
      num:     t('pillar_3_num'),
      title:   t('pillar_3_title'),
      desc:    t('pillar_3_desc'),
      outcome: t('pillar_3_outcome'),
    },
  ];

  return (
    <section
      className="section-padding bg-brand-black text-brand-white"
      aria-labelledby="solution-heading"
    >
      <div className="container-base">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-xs uppercase tracking-widest text-brand-gray-400 font-medium">
                {t('solution_eyebrow')}
              </p>
              <span className="text-xs px-2 py-1 border border-brand-accent/40 text-brand-accent rounded-sm">
                {t('solution_tag')}
              </span>
            </div>
            <h2
              id="solution-heading"
              className="text-display-md font-semibold text-brand-white max-w-xl"
            >
              {t('solution_headline')}
            </h2>
          </div>
          <Link
            href={`/${locale}/giai-phap-3-trong-1`}
            className="text-sm text-brand-gray-400 hover:text-brand-white transition-colors shrink-0"
          >
            {locale === 'vi' ? 'Xem chi tiết' : 'Learn more'} →
          </Link>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-gray-700">
          {pillars.map((pillar, i) => (
            <article
              key={i}
              className="bg-brand-black p-8 md:p-10 hover:bg-brand-gray-900 transition-colors"
            >
              <span className="text-brand-gray-600 text-sm font-mono mb-6 block">
                {pillar.num}
              </span>
              <h3 className="text-xl font-semibold text-brand-white mb-4">
                {pillar.title}
              </h3>
              <p className="text-brand-gray-400 text-sm leading-relaxed mb-8">
                {pillar.desc}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-px bg-brand-accent" />
                <span className="text-brand-accent text-sm font-medium">
                  {pillar.outcome}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
