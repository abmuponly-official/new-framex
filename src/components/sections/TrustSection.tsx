import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function TrustSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const trustItems = [
    { label: t('trust_1'), icon: '✓' },
    { label: t('trust_2'), icon: '⏸' },
    { label: t('trust_3'), icon: '💧' },
    { label: t('trust_4'), icon: '=' },
    { label: t('trust_5'), icon: '◎' },
    { label: t('trust_6'), icon: '📋' },
  ];

  return (
    <section
      className="section-padding bg-brand-gray-50 border-y border-brand-gray-100"
      aria-labelledby="trust-heading"
    >
      <div className="container-base">
        <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
          {t('trust_eyebrow')}
        </p>
        <h2
          id="trust-heading"
          className="text-display-md font-semibold text-brand-black mb-12 max-w-xl"
        >
          {t('trust_headline')}
        </h2>

        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-start gap-3 p-6 bg-brand-white border border-brand-gray-100 rounded-sm"
            >
              <div className="w-8 h-8 flex items-center justify-center
                bg-brand-black text-brand-white text-sm rounded-sm">
                {item.icon}
              </div>
              <dt className="text-sm font-medium text-brand-black leading-snug">
                {item.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
