import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function GuidedQuestion({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const choices = [
    { label: t('guided_c1'), href: `/${locale}/chu-dau-tu` },
    { label: t('guided_c2'), href: `/${locale}/kien-truc-su` },
    { label: t('guided_c3'), href: `/${locale}/chu-dau-tu` },
  ];

  return (
    <section
      id="guided-question"
      className="section-padding bg-brand-white"
      aria-label="Guided question"
    >
      <div className="container-base max-w-2xl">
        {/* Opening copy */}
        <div className="mb-12">
          <p className="text-lg text-brand-gray-600 mb-3">{t('guided_lead')}</p>
          <ul className="space-y-1 text-brand-gray-400 text-base">
            <li>{t('guided_s1')}</li>
            <li>{t('guided_s2')}</li>
            <li>{t('guided_s3')}</li>
          </ul>
        </div>

        {/* Question */}
        <h2 className="text-display-sm font-semibold text-brand-black mb-10">
          {t('guided_q')}
        </h2>

        {/* Choices */}
        <div className="flex flex-col gap-3">
          {choices.map((c, i) => (
            <Link
              key={i}
              href={c.href}
              className="group flex items-center justify-between
                px-6 py-5 border border-brand-gray-100
                hover:border-brand-black hover:bg-brand-gray-50
                transition-all rounded-sm"
            >
              <span className="text-base font-medium text-brand-gray-700 group-hover:text-brand-black transition-colors">
                {c.label}
              </span>
              <span className="text-brand-gray-300 group-hover:text-brand-black transition-colors text-lg">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
