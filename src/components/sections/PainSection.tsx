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
      className="section-padding bg-brand-white"
      aria-labelledby="pain-heading"
    >
      <div className="container-base">
        {/* Eyebrow */}
        <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
          {t('pain_eyebrow')}
        </p>

        {/* Headline */}
        <h2
          id="pain-heading"
          className="text-display-md font-semibold text-brand-black mb-4 max-w-2xl"
        >
          {t('pain_headline')}
        </h2>
        <p className="text-brand-gray-500 text-base mb-14 max-w-xl">
          {t('pain_sub')}
        </p>

        {/* Pain cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-gray-100">
          {pains.map((pain, i) => (
            <div
              key={i}
              className="bg-brand-white p-8 hover:bg-brand-gray-50 transition-colors"
            >
              <div className="w-8 h-px bg-brand-accent mb-6" />
              <h3 className="text-base font-semibold text-brand-black mb-3">
                {pain.title}
              </h3>
              <p className="text-sm text-brand-gray-500 leading-relaxed">
                {pain.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
