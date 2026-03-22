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
      num:  '01',
    },
    {
      role: t('audience_2_role'),
      copy: t('audience_2_copy'),
      cta:  t('audience_2_cta'),
      href: `/${locale}/kien-truc-su`,
      num:  '02',
    },
    {
      role: t('audience_3_role'),
      copy: t('audience_3_copy'),
      cta:  t('audience_3_cta'),
      href: `/${locale}/chu-dau-tu`,
      num:  '03',
    },
  ];

  return (
    <section
      className="section-padding bg-gradient-light"
      aria-labelledby="audience-heading"
    >
      <div className="container-base">

        {/* ── Header ── */}
        <div className="mb-4 reveal">
          <div className="flex items-center gap-4 mb-5">
            <span className="divider-accent" aria-hidden="true" />
          </div>
          <h2
            id="audience-heading"
            className="font-display font-bold text-balance"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: '#2C2C2C',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            {t('audience_headline')}
          </h2>
        </div>

        <p
          className="text-base mb-12 reveal reveal-delay-1"
          style={{ color: '#6B6B6B', maxWidth: '52ch', lineHeight: '1.7' }}
        >
          {t('audience_sub')}
        </p>

        {/* ── Audience cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 reveal reveal-delay-2">
          {audiences.map((a) => (
            <Link
              key={a.num}
              href={a.href}
              className="group block p-8 card-light"
              style={{ borderRadius: '2px' }}
            >
              <div className="flex items-start justify-between mb-5">
                <span
                  className="text-xs font-mono"
                  style={{ color: 'rgba(255,107,53,0.7)', fontWeight: 600, letterSpacing: '0.08em' }}
                >
                  {a.num}
                </span>
              </div>
              <p
                className="text-xs font-semibold mb-3 tracking-wider uppercase"
                style={{ color: '#8C8C8C', fontFamily: 'Inter, sans-serif' }}
              >
                {a.role}
              </p>
              <p
                className="text-sm mb-7 leading-relaxed"
                style={{ color: '#4A4A4A', lineHeight: '1.7' }}
              >
                {a.copy}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold transition-colors"
                  style={{ color: '#FF6B35', fontFamily: 'Inter, sans-serif', letterSpacing: '0.02em' }}
                >
                  {a.cta}
                </span>
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path d="M2 7H12M8 3L12 7L8 11" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
