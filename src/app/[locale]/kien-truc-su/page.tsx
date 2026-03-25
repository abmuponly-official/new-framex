import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { buildOpenGraph, buildAlternates } from '@/lib/seo';
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
    alternates: buildAlternates(locale, '/kien-truc-su'),
    openGraph: buildOpenGraph({
      locale,
      title: t('headline'),
      description: t('sub'),
      url: `https://framex.vn/${locale}/kien-truc-su`,
    }),
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
      <section
        className="pt-36 pb-24 relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 80px),
              repeating-linear-gradient(180deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 80px)`,
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 container-base max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="divider-accent" aria-hidden="true" />
            <span className="text-eyebrow">{t('eyebrow')}</span>
          </div>
          <h1
            className="font-display font-bold text-balance mb-6"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              lineHeight: '1.1',
            }}
          >
            {t('headline')}
          </h1>
          <p
            className="text-lg mb-10 max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.55)', lineHeight: '1.7' }}
          >
            {t('sub')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href={`/${locale}/lien-he?type=concept`} className="btn-primary">
              {t('cta_primary')}
            </Link>
            <Link href="#how-framex" className="btn-outline-white">
              {t('cta_secondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. PAIN ── */}
      <section
        className="section-padding"
        aria-labelledby="architect-pain-heading"
        style={{ background: '#1E1E1E' }}
      >
        <div className="container-base">
          <h2
            id="architect-pain-heading"
            className="font-display font-bold text-balance mb-4"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
              maxWidth: '36ch',
            }}
          >
            {t('pain_headline')}
          </h2>
          <p className="text-base mb-12" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '52ch', lineHeight: '1.7' }}>
            {t('pain_intro')}
          </p>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            style={{ gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}
          >
            {pains.map((pain, i) => (
              <div key={i} className="p-8 transition-colors duration-300" style={{ background: 'rgba(44,44,44,0.7)' }}>
                <div style={{ width: '1.5rem', height: '2px', background: '#FF6B35', marginBottom: '1.5rem' }} aria-hidden="true" />
                <h3 className="font-semibold mb-3 text-base" style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF', lineHeight: '1.3' }}>
                  {pain.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.65' }}>
                  {pain.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. HOW FRAMEX PROTECTS CONCEPT ── */}
      <section
        id="how-framex"
        className="section-padding"
        aria-labelledby="architect-protect-heading"
        style={{ background: 'var(--gradient-subtle)' }}
      >
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <span className="divider-accent" aria-hidden="true" />
              </div>
              <h2
                id="architect-protect-heading"
                className="font-display font-bold mb-4"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2',
                }}
              >
                {t('protect_headline')}
              </h2>
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.7' }}>
                {t('protect_body')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {protectItems.map((item, i) => (
                <div key={i} className="card-dark p-6">
                  <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.65' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. COLLABORATION FLOW ── */}
      <section
        className="section-padding"
        aria-labelledby="architect-collab-heading"
        style={{ background: '#1A1A1A' }}
      >
        <div className="container-base">
          <div className="flex items-center gap-4 mb-5">
            <span className="divider-accent" aria-hidden="true" />
          </div>
          <h2
            id="architect-collab-heading"
            className="font-display font-bold mb-12"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
              maxWidth: '36ch',
            }}
          >
            {t('collab_headline')}
          </h2>
          <ol className="max-w-2xl space-y-0">
            {collabSteps.map((step, i) => (
              <li key={i} className="flex items-stretch gap-6">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: '#FF6B35',
                      color: '#FFFFFF',
                      borderRadius: '2px',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {i + 1}
                  </div>
                  {i < collabSteps.length - 1 && (
                    <div
                      className="w-px flex-1 my-1"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    />
                  )}
                </div>
                <div className="pb-8">
                  <p
                    className="text-base font-semibold pt-1 mb-1"
                    style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF', lineHeight: '1.3' }}
                  >
                    {step.label}
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.65' }}>
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 5. PROJECTS PROOF ── */}
      <section
        className="section-padding"
        style={{ background: 'var(--gradient-subtle)' }}
      >
        <div className="container-base">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2
              className="font-display font-bold"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: '1.2',
                maxWidth: '36ch',
              }}
            >
              {t('proof_headline')}
            </h2>
            <Link
              href={`/${locale}/du-an`}
              className="text-sm font-medium shrink-0 transition-colors"
              style={{ color: 'rgba(255,107,53,0.8)', fontFamily: 'Inter, sans-serif' }}
            >
              {locale === 'vi' ? 'Xem tất cả dự án' : 'View all projects'} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. TRUST SIGNALS ── */}
      <section
        className="section-padding"
        aria-labelledby="architect-trust-heading"
        style={{ background: '#1E1E1E' }}
      >
        <div className="container-base">
          <div className="flex items-center gap-4 mb-5">
            <span className="divider-accent" aria-hidden="true" />
          </div>
          <h2
            id="architect-trust-heading"
            className="font-display font-bold mb-10"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
              maxWidth: '36ch',
            }}
          >
            {t('trust_headline')}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trustItems.map((item, i) => (
              <li key={i} className="card-dark flex items-start gap-4 p-5">
                <span
                  className="mt-1.5 shrink-0 rounded-full"
                  style={{ width: '5px', height: '5px', background: '#FF6B35', opacity: 0.7 }}
                  aria-hidden="true"
                />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', fontFamily: 'Inter, sans-serif' }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 7. FINAL CTA ── */}
      <section className="py-24" style={{ background: '#111111' }}>
        <div className="container-base max-w-2xl text-center">
          <div className="flex justify-center mb-8">
            <span className="divider-accent" aria-hidden="true" />
          </div>
          <h2
            className="font-display font-bold text-balance mb-4"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            {t('final_headline')}
          </h2>
          <p
            className="text-base mb-10"
            style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.7', maxWidth: '48ch', margin: '0 auto 2.5rem' }}
          >
            {t('final_sub')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/${locale}/lien-he?type=concept`} className="btn-primary min-w-[160px]">
              {t('cta')}
            </Link>
            <Link href={`/${locale}/lien-he?type=file`} className="btn-outline-white min-w-[160px]">
              {t('cta_secondary_final')}
            </Link>
          </div>
          <p className="mt-5 text-xs" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.02em' }}>
            {t('cta_microcopy')}
          </p>
        </div>
      </section>
    </>
  );
}
