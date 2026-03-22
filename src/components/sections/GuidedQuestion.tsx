import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function GuidedQuestion({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const choices = [
    { label: t('guided_c1'), href: `/${locale}/chu-dau-tu`,   num: '01' },
    { label: t('guided_c2'), href: `/${locale}/kien-truc-su`, num: '02' },
    { label: t('guided_c3'), href: `/${locale}/chu-dau-tu`,   num: '03' },
  ];

  return (
    <section
      id="guided-question"
      className="section-screen bg-gradient-light"
      aria-label="Guided question"
    >
      <div className="container-base py-24 w-full">
        <div className="max-w-xl mx-auto">

          {/* Orange eyebrow line */}
          <div className="reveal mb-8">
            <span className="divider-accent" aria-hidden="true" />
          </div>

          {/* Opening copy */}
          <div className="reveal reveal-delay-1 mb-12">
            <p
              className="text-base mb-4"
              style={{ color: '#6B6B6B', lineHeight: '1.7' }}
            >
              {t('guided_lead')}
            </p>
            <ul className="space-y-1" style={{ color: '#8C8C8C' }}>
              {[t('guided_s1'), t('guided_s2'), t('guided_s3')].map((s, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span style={{ color: '#FF6B35', fontSize: '0.5rem' }}>●</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Question */}
          <h2
            className="reveal reveal-delay-2 font-display font-bold mb-10"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#2C2C2C',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            {t('guided_q')}
          </h2>

          {/* Choice cards */}
          <div className="flex flex-col gap-3 reveal reveal-delay-3">
            {choices.map((c) => (
              <Link
                key={c.num}
                href={c.href}
                className="group flex items-center justify-between px-6 py-5 card-light"
                style={{ borderRadius: '2px' }}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="text-xs font-mono shrink-0"
                    style={{ color: '#FF6B35', fontWeight: 600 }}
                  >
                    {c.num}
                  </span>
                  <span
                    className="text-sm font-medium transition-colors"
                    style={{ color: '#3A3A3A', fontFamily: 'Inter, sans-serif' }}
                  >
                    {c.label}
                  </span>
                </div>
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                  style={{ color: '#8C8C8C' }}
                  aria-hidden="true"
                >
                  <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
