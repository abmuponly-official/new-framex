import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'architect' });
  return {
    title: t('headline'),
    description: t('sub'),
    alternates: { languages: { vi: '/vi/kien-truc-su', en: '/en/kien-truc-su' } },
  };
}

export default async function ArchitectPage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'architect' });

  const pains = [
    { title: t('pain_1'), desc: t('pain_1_desc') },
    { title: t('pain_2'), desc: t('pain_2_desc') },
    { title: t('pain_3'), desc: t('pain_3_desc') },
    { title: t('pain_4'), desc: t('pain_4_desc') },
  ];

  const protectItems = [
    { title: t('protect_1_title'), desc: t('protect_1_desc') },
    { title: t('protect_2_title'), desc: t('protect_2_desc') },
    { title: t('protect_3_title'), desc: t('protect_3_desc') },
    { title: t('protect_4_title'), desc: t('protect_4_desc') },
  ];

  const collabSteps = [
    { label: t('collab_1'), desc: t('collab_1_desc') },
    { label: t('collab_2'), desc: t('collab_2_desc') },
    { label: t('collab_3'), desc: t('collab_3_desc') },
    { label: t('collab_4'), desc: t('collab_4_desc') },
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
              href={`/${locale}/lien-he?type=concept`}
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
      <section className="section-padding bg-brand-white" aria-labelledby="architect-pain-heading">
        <div className="container-base">
          <h2
            id="architect-pain-heading"
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

      {/* ── 3. HOW FRAMEX PROTECTS CONCEPT ── */}
      <section
        id="how-framex"
        className="section-padding bg-brand-gray-50 border-y border-brand-gray-100"
        aria-labelledby="architect-protect-heading"
      >
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2
                id="architect-protect-heading"
                className="text-display-sm font-semibold text-brand-black mb-4"
              >
                {t('protect_headline')}
              </h2>
              <p className="text-brand-gray-600 leading-relaxed">
                {t('protect_body')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {protectItems.map((item, i) => (
                <div
                  key={i}
                  className="p-6 bg-brand-white border border-brand-gray-100 rounded-sm"
                >
                  <h3 className="text-sm font-semibold text-brand-black mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. COLLABORATION FLOW ── */}
      <section className="section-padding bg-brand-white" aria-labelledby="architect-collab-heading">
        <div className="container-base">
          <h2
            id="architect-collab-heading"
            className="text-display-sm font-semibold text-brand-black mb-12 max-w-xl"
          >
            {t('collab_headline')}
          </h2>
          <ol className="max-w-2xl space-y-0">
            {collabSteps.map((step, i) => (
              <li key={i} className="flex items-stretch gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-brand-black text-brand-white text-xs
                    flex items-center justify-center font-semibold shrink-0">
                    {i + 1}
                  </div>
                  {i < collabSteps.length - 1 && (
                    <div className="w-px flex-1 bg-brand-gray-200 my-1" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="text-base font-semibold text-brand-black pt-1 mb-1">{step.label}</p>
                  <p className="text-sm text-brand-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 5. PROJECTS PROOF (heading + link) ── */}
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
      <section className="section-padding bg-brand-white" aria-labelledby="architect-trust-heading">
        <div className="container-base">
          <h2
            id="architect-trust-heading"
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
              href={`/${locale}/lien-he?type=concept`}
              className="px-8 py-3.5 bg-brand-white text-brand-black text-sm font-medium
                hover:bg-brand-gray-100 transition-colors rounded-sm min-w-[160px]"
            >
              {t('cta')}
            </Link>
            <Link
              href={`/${locale}/lien-he?type=file`}
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
