import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contractor' });
  return { title: t('headline'), description: t('sub') };
}

export default async function ContractorPage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contractor' });

  const flowSteps = [t('flow_1'), t('flow_2'), t('flow_3'), t('flow_4'), t('flow_5')];

  return (
    <>
      <section className="pt-32 pb-20 bg-brand-white border-b border-brand-gray-100">
        <div className="container-base max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
            {locale === 'vi' ? 'Nhà thầu' : 'Contractor'}
          </p>
          <h1 className="text-display-lg font-semibold text-brand-black mb-6">{t('headline')}</h1>
          <p className="text-lg text-brand-gray-500 max-w-2xl">{t('sub')}</p>
        </div>
      </section>

      <section className="section-padding bg-brand-white">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Pain */}
            <div>
              <h2 className="text-display-sm font-semibold text-brand-black mb-8">
                {locale === 'vi' ? 'Điểm ma sát thường gặp' : 'Common friction points'}
              </h2>
              <ul className="space-y-3">
                {[t('pain_1'), t('pain_2'), t('pain_3'), t('pain_4')].map((p, i) => (
                  <li key={i} className="flex items-start gap-4 p-5 border border-brand-gray-100 rounded-sm">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-brand-gray-300 shrink-0" />
                    <span className="text-brand-gray-700">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collaboration flow */}
            <div>
              <h2 className="text-display-sm font-semibold text-brand-black mb-8">
                {locale === 'vi' ? 'Quy trình phối hợp' : 'Collaboration flow'}
              </h2>
              <ol className="space-y-0">
                {flowSteps.map((step, i) => (
                  <li key={i} className="flex items-stretch gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-brand-black text-brand-white text-xs flex items-center justify-center font-medium shrink-0">
                        {i + 1}
                      </div>
                      {i < flowSteps.length - 1 && (
                        <div className="w-px flex-1 bg-brand-gray-200 my-1" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="text-brand-gray-700 pt-1">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-gray-50 border-t border-brand-gray-100">
        <div className="container-base text-center">
          <Link
            href={`/${locale}/lien-he?role=contractor`}
            className="px-8 py-4 bg-brand-black text-brand-white text-sm font-medium hover:bg-brand-gray-800 transition-colors rounded-sm"
          >
            {t('cta')}
          </Link>
        </div>
      </section>
    </>
  );
}
