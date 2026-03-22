import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

const ICONS = ['✓', '⏸', '💧', '=', '◎', '📋'];

export default async function TrustSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const trustItems = [
    { label: t('trust_1'), desc: t('trust_1_desc') },
    { label: t('trust_2'), desc: t('trust_2_desc') },
    { label: t('trust_3'), desc: t('trust_3_desc') },
    { label: t('trust_4'), desc: t('trust_4_desc') },
    { label: t('trust_5'), desc: t('trust_5_desc') },
    { label: t('trust_6'), desc: t('trust_6_desc') },
  ];

  return (
    <section
      className="section-padding"
      aria-labelledby="trust-heading"
      style={{ background: 'var(--gradient-subtle)' }}
    >
      <div className="container-base">

        {/* ── Header ── */}
        <div className="flex items-center gap-4 mb-6 reveal">
          <span className="divider-accent" aria-hidden="true" />
          <span className="text-eyebrow">{t('trust_eyebrow')}</span>
        </div>

        <h2
          id="trust-heading"
          className="font-display font-bold text-balance mb-4 reveal reveal-delay-1"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: '1.2',
            maxWidth: '36ch',
          }}
        >
          {t('trust_headline')}
        </h2>

        <p
          className="text-sm mb-14 reveal reveal-delay-2"
          style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '60ch', lineHeight: '1.7' }}
        >
          {t('trust_body')}
        </p>

        {/* ── Trust cards ── */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 reveal reveal-delay-2">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="card-dark p-6 flex flex-col gap-3"
              style={{ borderRadius: '2px' }}
            >
              {/* Icon badge */}
              <div
                className="w-9 h-9 flex items-center justify-center text-sm rounded-sm shrink-0"
                style={{
                  background: 'rgba(255,107,53,0.1)',
                  border: '1px solid rgba(255,107,53,0.2)',
                  color: '#FF6B35',
                }}
              >
                {ICONS[i]}
              </div>
              <dt
                className="text-sm font-semibold"
                style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF', lineHeight: '1.3' }}
              >
                {item.label}
              </dt>
              <dd
                className="text-xs leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.65' }}
              >
                {item.desc}
              </dd>
            </div>
          ))}
        </dl>

        {/* ── Closing trust line ── */}
        <p
          className="mt-12 text-xs tracking-widest uppercase reveal reveal-delay-3"
          style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.18em' }}
        >
          {t('trust_closing')}
        </p>
      </div>
    </section>
  );
}
