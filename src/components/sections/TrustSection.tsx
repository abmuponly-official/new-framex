import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function TrustSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const trustItems = [
    { label: t('trust_1'), desc: t('trust_1_desc'), icon: '✓' },
    { label: t('trust_2'), desc: t('trust_2_desc'), icon: '⏸' },
    { label: t('trust_3'), desc: t('trust_3_desc'), icon: '💧' },
    { label: t('trust_4'), desc: t('trust_4_desc'), icon: '=' },
    { label: t('trust_5'), desc: t('trust_5_desc'), icon: '◎' },
    { label: t('trust_6'), desc: t('trust_6_desc'), icon: '📋' },
  ];

  return (
    <section
      className="section-padding bg-brand-gray-50 border-y border-brand-gray-100"
      aria-labelledby="trust-heading"
    >
      <div className="container-base">
        {/* Eyebrow + headline */}
        <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
          {t('trust_eyebrow')}
        </p>
        <h2
          id="trust-heading"
          className="text-display-md font-semibold text-brand-black mb-4 max-w-xl"
        >
          {t('trust_headline')}
        </h2>
        <p className="text-brand-gray-500 text-base mb-14 max-w-2xl">
          {t('trust_body')}
        </p>

        {/* Trust cards — 2 cols on mobile, 3 on sm, 6 on lg */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-6 bg-brand-white border border-brand-gray-100 rounded-sm"
            >
              <div className="w-8 h-8 flex items-center justify-center
                bg-brand-black text-brand-white text-sm rounded-sm shrink-0">
                {item.icon}
              </div>
              <dt className="text-sm font-semibold text-brand-black leading-snug">
                {item.label}
              </dt>
              <dd className="text-sm text-brand-gray-500 leading-relaxed">
                {item.desc}
              </dd>
            </div>
          ))}
        </dl>

        {/* Closing trust statement */}
        <p className="mt-12 text-center text-sm font-medium text-brand-gray-400 tracking-wide">
          {t('trust_closing')}
        </p>
      </div>
    </section>
  );
}
