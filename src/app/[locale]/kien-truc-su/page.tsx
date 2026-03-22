import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'architect' });
  return { title: t('headline'), description: t('sub') };
}

export default async function ArchitectPage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'architect' });

  return (
    <>
      <section className="pt-32 pb-20 bg-brand-white border-b border-brand-gray-100">
        <div className="container-base max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
            {locale === 'vi' ? 'Kiến trúc sư' : 'Architect'}
          </p>
          <h1 className="text-display-lg font-semibold text-brand-black mb-6">{t('headline')}</h1>
          <p className="text-lg text-brand-gray-500 max-w-2xl">{t('sub')}</p>
        </div>
      </section>

      <section className="section-padding bg-brand-white">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-display-sm font-semibold text-brand-black mb-8">
                {locale === 'vi' ? 'Mất mát thường thấy tại công trường' : 'Common losses on site'}
              </h2>
              <ul className="space-y-3">
                {[t('pain_1'), t('pain_2'), t('pain_3')].map((p, i) => (
                  <li key={i} className="flex items-start gap-4 p-5 border border-brand-gray-100 rounded-sm">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-brand-gray-300 shrink-0" />
                    <span className="text-brand-gray-700">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-display-sm font-semibold text-brand-black mb-8">
                {locale === 'vi' ? 'FrameX bảo vệ concept như thế nào' : 'How FrameX protects concept'}
              </h2>
              <ul className="space-y-3">
                {[t('value_1'), t('value_2'), t('value_3')].map((val, i) => (
                  <li key={i} className="flex items-start gap-4 p-5 bg-brand-black text-brand-white rounded-sm">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-brand-accent shrink-0" />
                    <span className="font-medium">{val}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-gray-50 border-t border-brand-gray-100">
        <div className="container-base text-center">
          <Link
            href={`/${locale}/lien-he?role=architect`}
            className="px-8 py-4 bg-brand-black text-brand-white text-sm font-medium hover:bg-brand-gray-800 transition-colors rounded-sm"
          >
            {t('cta')}
          </Link>
        </div>
      </section>
    </>
  );
}
