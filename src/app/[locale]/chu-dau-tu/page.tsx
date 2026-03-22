import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'investor' });
  return {
    title: t('headline'),
    description: t('sub'),
    alternates: { languages: { vi: '/vi/chu-dau-tu', en: '/en/chu-dau-tu' } },
  };
}

export default async function InvestorPage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'investor' });

  const pains = [
    { title: t('pain_1'), desc: t('pain_1_desc') },
    { title: t('pain_2'), desc: t('pain_2_desc') },
    { title: t('pain_3'), desc: t('pain_3_desc') },
    { title: t('pain_4'), desc: t('pain_4_desc') },
  ];

  const values = [
    { title: t('value_1'), desc: t('value_1_desc') },
    { title: t('value_2'), desc: t('value_2_desc') },
    { title: t('value_3'), desc: t('value_3_desc') },
  ];

  const outcomes = [t('outcome_1'), t('outcome_2'), t('outcome_3'), t('outcome_4')];

  const modelItems = [
    { title: t('model_1_title'), desc: t('model_1_desc') },
    { title: t('model_2_title'), desc: t('model_2_desc') },
    { title: t('model_3_title'), desc: t('model_3_desc') },
    { title: t('model_4_title'), desc: t('model_4_desc') },
  ];

  const trustItems = [
    t('trust_1'), t('trust_2'), t('trust_3'),
    t('trust_4'), t('trust_5'), t('trust_6'),
  ];

  return (
    <>
      {/* ── 1. HERO ── */}
      <section className="pt-32 pb-20 bg-brand-white border-b border-brand-gray-100">
        <div className="container-base max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
            {t('eyebrow')}
          </p>
          <h1 className="text-display-lg font-semibold text-brand-black mb-6">
            {t('headline')}
          </h1>
          <p className="text-lg text-brand-gray-500 mb-10 max-w-2xl">
            {t('sub')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${locale}/lien-he?type=rfq`}
              className="px-6 py-3 bg-brand-black text-brand-white text-sm font-medium
                hover:bg-brand-gray-800 transition-colors rounded-sm"
            >
              {t('cta_primary')}
            </Link>
            <Link
              href="#how-framex"
              className="px-6 py-3 border border-brand-gray-200 text-brand-gray-600 text-sm font-medium
                hover:border-brand-black hover:text-brand-black transition-colors rounded-sm"
            >
              {t('cta_secondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. PAIN ── */}
      <section className="section-padding bg-brand-white" aria-labelledby="investor-pain-heading">
        <div className="container-base">
          <h2
            id="investor-pain-heading"
            className="text-display-sm font-semibold text-brand-black mb-4 max-w-2xl"
          >
            {t('pain_headline')}
          </h2>
          <p className="text-brand-gray-500 text-base mb-12 max-w-xl">
            {t('pain_intro')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-gray-100">
            {pains.map((pain, i) => (
              <div key={i} className="bg-brand-white p-8 hover:bg-brand-gray-50 transition-colors">
                <div className="w-8 h-px bg-brand-accent mb-6" />
                <h3 className="text-base font-semibold text-brand-black mb-3">{pain.title}</h3>
                <p className="text-sm text-brand-gray-500 leading-relaxed">{pain.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. HOW FRAMEX SOLVES IT ── */}
      <section
        id="how-framex"
        className="section-padding bg-brand-gray-50 border-y border-brand-gray-100"
        aria-labelledby="investor-change-heading"
      >
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: narrative */}
            <div>
              <h2
                id="investor-change-heading"
                className="text-display-sm font-semibold text-brand-black mb-4"
              >
                {t('change_headline')}
              </h2>
              <p className="text-brand-gray-600 leading-relaxed mb-10">
                {t('change_body')}
              </p>
              {/* Outcome chips */}
              <div className="flex flex-wrap gap-3">
                {outcomes.map((o, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-brand-white border border-brand-gray-200 text-sm font-medium text-brand-black rounded-sm"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: value points */}
            <div className="flex flex-col gap-4">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="p-6 bg-brand-white border border-brand-gray-100 rounded-sm"
                >
                  <h3 className="text-sm font-semibold text-brand-black mb-2">{v.title}</h3>
                  <p className="text-sm text-brand-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. OPERATIONAL MODEL ── */}
      <section className="section-padding bg-brand-white" aria-labelledby="investor-model-heading">
        <div className="container-base">
          <h2
            id="investor-model-heading"
            className="text-display-sm font-semibold text-brand-black mb-12 max-w-xl"
          >
            {t('model_headline')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modelItems.map((item, i) => (
              <div key={i} className="p-6 bg-brand-gray-50 rounded-sm border border-brand-gray-100">
                <span className="text-brand-gray-400 text-xs font-mono mb-4 block">0{i + 1}</span>
                <h3 className="text-sm font-semibold text-brand-black mb-2">{item.title}</h3>
                <p className="text-sm text-brand-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. PROJECTS PROOF (heading only, links to /du-an) ── */}
      <section className="section-padding bg-brand-gray-50 border-y border-brand-gray-100">
        <div className="container-base">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-display-sm font-semibold text-brand-black max-w-xl">
              {t('proof_headline')}
            </h2>
            <Link
              href={`/${locale}/du-an`}
              className="text-sm font-medium text-brand-gray-500 hover:text-brand-black transition-colors shrink-0"
            >
              {locale === 'vi' ? 'Xem tất cả dự án' : 'View all projects'} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. TRUST SIGNALS ── */}
      <section className="section-padding bg-brand-white" aria-labelledby="investor-trust-heading">
        <div className="container-base">
          <h2
            id="investor-trust-heading"
            className="text-display-sm font-semibold text-brand-black mb-10 max-w-xl"
          >
            {t('trust_headline')}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trustItems.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-4 p-5 border border-brand-gray-100 rounded-sm"
              >
                <div className="w-1.5 h-1.5 mt-2 rounded-full bg-brand-accent shrink-0" />
                <span className="text-sm text-brand-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 7. FINAL CTA ── */}
      <section className="py-24 bg-brand-black text-brand-white">
        <div className="container-base max-w-2xl text-center">
          <h2 className="text-display-sm font-semibold text-brand-white mb-4">
            {t('final_headline')}
          </h2>
          <p className="text-brand-gray-400 text-base mb-10">
            {t('final_sub')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/lien-he?type=rfq`}
              className="px-8 py-3.5 bg-brand-white text-brand-black text-sm font-medium
                hover:bg-brand-gray-100 transition-colors rounded-sm min-w-[160px]"
            >
              {t('cta')}
            </Link>
            <Link
              href={`/${locale}/lien-he?type=scope`}
              className="px-8 py-3.5 border border-brand-gray-600 text-brand-gray-200 text-sm font-medium
                hover:border-brand-white hover:text-brand-white transition-colors rounded-sm min-w-[160px]"
            >
              {t('cta_secondary_final')}
            </Link>
          </div>
          <p className="mt-5 text-xs text-brand-gray-600">
            {t('cta_microcopy')}
          </p>
        </div>
      </section>
    </>
  );
}
