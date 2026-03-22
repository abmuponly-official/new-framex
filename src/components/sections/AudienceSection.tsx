import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function AudienceSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const audiences = [
    {
      role: t('audience_1_role'),
      copy: t('audience_1_copy'),
      cta:  t('audience_1_cta'),
      href: `/${locale}/chu-dau-tu`,
    },
    {
      role: t('audience_2_role'),
      copy: t('audience_2_copy'),
      cta:  t('audience_2_cta'),
      href: `/${locale}/kien-truc-su`,
    },
    {
      role: t('audience_3_role'),
      copy: t('audience_3_copy'),
      cta:  t('audience_3_cta'),
      href: `/${locale}/chu-dau-tu`,
    },
  ];

  return (
    <section
      className="section-padding bg-brand-gray-50 border-y border-brand-gray-100"
      aria-labelledby="audience-heading"
    >
      <div className="container-base">
        {/* Headline */}
        <h2
          id="audience-heading"
          className="text-display-md font-semibold text-brand-black mb-4 max-w-3xl"
        >
          {t('audience_headline')}
        </h2>

        {/* Supporting paragraph */}
        <p className="text-brand-gray-500 text-base mb-12 max-w-2xl">
          {t('audience_sub')}
        </p>

        {/* Audience cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((a, i) => (
            <Link
              key={i}
              href={a.href}
              className="group block p-8 bg-brand-white border border-brand-gray-100
                hover:border-brand-black hover:shadow-sm transition-all rounded-sm"
            >
              <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-3 font-medium">
                {a.role}
              </p>
              <p className="text-base text-brand-gray-700 mb-6 leading-relaxed group-hover:text-brand-black transition-colors">
                {a.copy}
              </p>
              <span className="text-sm font-medium text-brand-black group-hover:underline">
                {a.cta} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
