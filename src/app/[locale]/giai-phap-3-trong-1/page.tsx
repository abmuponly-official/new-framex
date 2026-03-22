import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';
import JsonLd from '@/components/seo/JsonLd';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'solution' });
  return {
    title: t('headline'),
    description: t('sub'),
    alternates: {
      languages: {
        vi: '/vi/giai-phap-3-trong-1',
        en: '/en/giai-phap-3-trong-1',
      },
    },
  };
}

export default async function SolutionPage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'solution' });
  const tHome = await getTranslations({ locale, namespace: 'home' });

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: '3-in-1 Building Envelope Solution',
    provider: { '@type': 'Organization', name: 'FrameX' },
    description: t('sub'),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'vi' ? 'Gói giải pháp FrameX' : 'FrameX Solution Packages',
      itemListElement: [
        { '@type': 'Offer', name: 'Basic', description: t('pkg_1_desc') },
        { '@type': 'Offer', name: 'Premium', description: t('pkg_2_desc') },
        { '@type': 'Offer', name: 'Custom', description: t('pkg_3_desc') },
      ],
    },
  };

  const pillars = [
    { num: tHome('pillar_1_num'), title: tHome('pillar_1_title'), desc: tHome('pillar_1_desc'), outcome: tHome('pillar_1_outcome') },
    { num: tHome('pillar_2_num'), title: tHome('pillar_2_title'), desc: tHome('pillar_2_desc'), outcome: tHome('pillar_2_outcome') },
    { num: tHome('pillar_3_num'), title: tHome('pillar_3_title'), desc: tHome('pillar_3_desc'), outcome: tHome('pillar_3_outcome') },
  ];

  const packages = [
    { name: t('pkg_1_name'), desc: t('pkg_1_desc'), highlight: false },
    { name: t('pkg_2_name'), desc: t('pkg_2_desc'), highlight: true },
    { name: t('pkg_3_name'), desc: t('pkg_3_desc'), highlight: false },
  ];

  return (
    <>
      <JsonLd data={serviceSchema} />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-brand-black text-brand-white">
        <div className="container-base max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
            {t('eyebrow')}
          </p>
          <h1 className="text-display-lg font-semibold text-brand-white mb-6">
            {t('headline')}
          </h1>
          <p className="text-lg text-brand-gray-300 mb-10 max-w-2xl">
            {t('sub')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${locale}/lien-he`}
              className="px-6 py-3 bg-brand-white text-brand-black text-sm font-medium hover:bg-brand-gray-100 transition-colors rounded-sm"
            >
              {t('cta_primary')}
            </Link>
            <Link
              href={`/${locale}/du-an`}
              className="px-6 py-3 border border-brand-gray-600 text-brand-gray-200 text-sm font-medium hover:border-brand-white hover:text-brand-white transition-colors rounded-sm"
            >
              {t('cta_secondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* Why Integration */}
      <section className="section-padding bg-brand-white border-b border-brand-gray-100">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-display-sm font-semibold text-brand-black mb-4">{t('why_headline')}</h2>
              <p className="text-brand-gray-600 leading-relaxed">{t('why_desc')}</p>
            </div>
            <div className="flex flex-col gap-4">
              {[t('why_1'), t('why_2'), t('why_3')].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-brand-gray-50 rounded-sm">
                  <span className="text-brand-gray-300 text-sm font-mono mt-0.5">0{i + 1}</span>
                  <p className="text-brand-black font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="section-padding bg-brand-black text-brand-white">
        <div className="container-base">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-gray-700">
            {pillars.map((pillar, i) => (
              <article key={i} className="bg-brand-black p-10">
                <span className="text-brand-gray-600 text-sm font-mono mb-6 block">{pillar.num}</span>
                <h3 className="text-xl font-semibold text-brand-white mb-4">{pillar.title}</h3>
                <p className="text-brand-gray-400 text-sm leading-relaxed mb-8">{pillar.desc}</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-px bg-brand-accent" />
                  <span className="text-brand-accent text-sm font-medium">{pillar.outcome}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section-padding bg-brand-white">
        <div className="container-base">
          <h2 className="text-display-sm font-semibold text-brand-black mb-12">{t('package_headline')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className={`p-8 rounded-sm border ${
                  pkg.highlight
                    ? 'border-brand-black bg-brand-black text-brand-white'
                    : 'border-brand-gray-100 bg-brand-white'
                }`}
              >
                <h3 className={`text-lg font-semibold mb-2 ${pkg.highlight ? 'text-brand-white' : 'text-brand-black'}`}>
                  {pkg.name}
                </h3>
                <p className={`text-sm mb-8 ${pkg.highlight ? 'text-brand-gray-300' : 'text-brand-gray-500'}`}>
                  {pkg.desc}
                </p>
                <Link
                  href={`/${locale}/lien-he?package=${pkg.name.toLowerCase()}`}
                  className={`text-sm font-medium hover:underline ${pkg.highlight ? 'text-brand-white' : 'text-brand-black'}`}
                >
                  {t('pkg_cta')} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
