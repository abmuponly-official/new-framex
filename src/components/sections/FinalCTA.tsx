import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function FinalCTA({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section
      className="section-padding bg-brand-black text-brand-white"
      aria-labelledby="final-cta-heading"
    >
      <div className="container-base text-center max-w-2xl">
        <h2
          id="final-cta-heading"
          className="text-display-md font-semibold text-brand-white mb-4"
        >
          {t('final_headline')}
        </h2>
        <p className="text-brand-gray-400 text-base mb-10">
          {t('final_sub')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/${locale}/lien-he`}
            className="px-8 py-3.5 bg-brand-white text-brand-black text-sm font-medium
              hover:bg-brand-gray-100 transition-colors rounded-sm min-w-[160px]"
          >
            {t('final_cta_1')}
          </Link>
          <Link
            href={`/${locale}/lien-he?type=rfq`}
            className="px-8 py-3.5 border border-brand-gray-600 text-brand-gray-200 text-sm font-medium
              hover:border-brand-white hover:text-brand-white transition-colors rounded-sm min-w-[160px]"
          >
            {t('final_cta_2')}
          </Link>
        </div>

        {/* Footer micro-copy */}
        <div className="mt-16 pt-8 border-t border-brand-gray-800
          flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6
          text-brand-gray-600 text-sm">
          <span>{t('final_footer_1')}</span>
          <span className="hidden md:inline text-brand-gray-700">·</span>
          <span>{t('final_footer_2')}</span>
          <span className="hidden md:inline text-brand-gray-700">·</span>
          <span>{t('final_footer_3')}</span>
        </div>
      </div>
    </section>
  );
}
