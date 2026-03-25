import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';
import JsonLd from '@/components/seo/JsonLd';
import { buildOpenGraph, buildAlternates } from '@/lib/seo';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'solution' });
  return {
    title: t('headline'),
    description: t('sub'),
    alternates: buildAlternates(locale, '/giai-phap-3-trong-1'),
    openGraph: buildOpenGraph({
      locale,
      title: t('headline'),
      description: t('sub'),
      url: `https://framex.vn/${locale}/giai-phap-3-trong-1`,
    }),
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
        { '@type': 'Offer', name: 'Basic',   description: t('pkg_1_desc') },
        { '@type': 'Offer', name: 'Premium', description: t('pkg_2_desc') },
        { '@type': 'Offer', name: 'Custom',  description: t('pkg_3_desc') },
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
    { name: t('pkg_2_name'), desc: t('pkg_2_desc'), highlight: true  },
    { name: t('pkg_3_name'), desc: t('pkg_3_desc'), highlight: false },
  ];

  return (
    <>
      <JsonLd data={serviceSchema} />

      {/* ── HERO ── */}
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
            <Link href={`/${locale}/lien-he`} className="btn-primary">
              {t('cta_primary')}
            </Link>
            <Link href={`/${locale}/du-an`} className="btn-outline-white">
              {t('cta_secondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY INTEGRATION ── */}
      <section
        className="section-padding"
        style={{ background: '#1E1E1E' }}
      >
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <span className="divider-accent" aria-hidden="true" />
              </div>
              <h2
                className="font-display font-bold mb-4"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2',
                }}
              >
                {t('why_headline')}
              </h2>
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.7' }}>
                {t('why_desc')}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[t('why_1'), t('why_2'), t('why_3')].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 card-dark p-5"
                >
                  <span
                    className="text-xs font-mono mt-0.5 shrink-0"
                    style={{ color: 'rgba(255,107,53,0.7)', letterSpacing: '0.1em', fontWeight: 600 }}
                  >
                    0{i + 1}
                  </span>
                  <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── THREE PILLARS ── */}
      <section
        className="section-padding"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="container-base">
          <div className="flex items-center gap-4 mb-5">
            <span className="divider-accent" aria-hidden="true" />
            <span className="text-eyebrow">{tHome('solution_eyebrow')}</span>
          </div>
          <h2
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
            {tHome('solution_headline')}
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ gap: '1px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}
          >
            {pillars.map((pillar, i) => (
              <article
                key={i}
                className="p-8 md:p-10 transition-colors duration-300"
                style={{ background: 'rgba(26,26,26,0.95)' }}
              >
                <span
                  className="block text-xs font-mono mb-6"
                  style={{ color: 'rgba(255,107,53,0.6)', letterSpacing: '0.1em' }}
                >
                  {pillar.num}
                </span>
                <h3
                  className="font-display font-bold mb-4"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.0625rem', color: '#FFFFFF', lineHeight: '1.3' }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-8"
                  style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.65' }}
                >
                  {pillar.desc}
                </p>
                <div className="flex items-center gap-2">
                  <div style={{ width: '1.5rem', height: '2px', background: '#FF6B35' }} aria-hidden="true" />
                  <span className="text-sm font-semibold" style={{ color: '#FF6B35', fontFamily: 'Inter, sans-serif' }}>
                    {pillar.outcome}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section
        className="section-padding"
        style={{ background: '#1A1A1A' }}
      >
        <div className="container-base">
          <div className="flex items-center gap-4 mb-5">
            <span className="divider-accent" aria-hidden="true" />
          </div>
          <h2
            className="font-display font-bold mb-12"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            {t('package_headline')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className="p-8 flex flex-col"
                style={
                  pkg.highlight
                    ? {
                        background: 'rgba(255,107,53,0.08)',
                        border: '1px solid rgba(255,107,53,0.3)',
                        borderRadius: '2px',
                      }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '2px',
                      }
                }
              >
                {pkg.highlight && (
                  <span
                    className="text-xs font-semibold mb-3 block"
                    style={{ color: '#FF6B35', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}
                  >
                    {locale === 'vi' ? 'Phổ biến nhất' : 'Most Popular'}
                  </span>
                )}
                <h3
                  className="font-semibold mb-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '1.0625rem',
                    color: pkg.highlight ? '#FF6B35' : '#FFFFFF',
                    lineHeight: '1.3',
                  }}
                >
                  {pkg.name}
                </h3>
                <p
                  className="text-sm mb-8 flex-1"
                  style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.65' }}
                >
                  {pkg.desc}
                </p>
                <Link
                  href={`/${locale}/lien-he?package=${pkg.name.toLowerCase()}`}
                  className="text-sm font-medium transition-colors"
                  style={{ color: pkg.highlight ? '#FF6B35' : 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}
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
