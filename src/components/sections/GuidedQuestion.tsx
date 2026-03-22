import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

/*
 * GuidedQuestion — Section 2 "Guided question"
 * Doc: "Dẫn hướng bằng trạng thái, không bằng chức danh"
 * Tone: contemplative, dark, no decorative chrome. Choices feel like
 * states of mind, not navigation tabs.
 */
export default async function GuidedQuestion({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const choices = [
    { label: t('guided_c1'), href: `/${locale}/chu-dau-tu`,   num: '01' },
    { label: t('guided_c2'), href: `/${locale}/kien-truc-su`, num: '02' },
    { label: t('guided_c3'), href: `/${locale}/nha-thau`,     num: '03' },
  ];

  return (
    <section
      id="guided-question"
      className="relative section-screen overflow-hidden"
      aria-label="Guided question"
      style={{ background: 'var(--gradient-section)' }}
    >
      <style>{`
        .guided-choice { transition: border-color 0.35s ease, background 0.35s ease; }
        .guided-choice:hover { border-color: rgba(255,255,255,0.18) !important; background: rgba(255,255,255,0.06) !important; }
        .guided-choice:hover .guided-arrow { opacity: 0.7; transform: translateX(4px); }
        .guided-arrow { opacity: 0; transition: opacity 0.35s ease, transform 0.35s ease; }
        .guided-num { transition: color 0.35s ease; }
        .guided-choice:hover .guided-num { color: rgba(255,107,53,0.9) !important; }
      `}</style>

      <div className="relative z-10 container-base w-full">
        <div style={{ maxWidth: '36rem', margin: '0 auto' }}>

          {/* Opening copy — understated, lead-in */}
          <div style={{ marginBottom: '3rem', animation: 'heroFadeIn 1s 0.1s both' }}>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 300,
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.38)',
                lineHeight: '1.75',
                marginBottom: '1rem',
              }}
            >
              {t('guided_lead')}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[t('guided_s1'), t('guided_s2'), t('guided_s3')].map((s, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 300,
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.28)',
                    lineHeight: '1.9',
                    paddingLeft: '1rem',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '0.6em',
                      width: '4px',
                      height: '1px',
                      background: 'rgba(255,107,53,0.5)',
                      display: 'inline-block',
                    }}
                    aria-hidden="true"
                  />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Question — the centrepiece */}
          <h2
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(1.375rem, 3vw, 1.875rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.25',
              marginBottom: '2.5rem',
              animation: 'heroFadeIn 1s 0.25s both',
            }}
          >
            {t('guided_q')}
          </h2>

          {/* Choice list — contemplative, dark cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '2px',
              overflow: 'hidden',
              animation: 'heroFadeIn 1s 0.4s both',
            }}
          >
            {choices.map((c, i) => (
              <Link
                key={c.num}
                href={c.href}
                className="guided-choice"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.375rem 1.5rem',
                  background: 'rgba(30,30,30,0.8)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 0,
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    className="guided-num"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '0.6875rem',
                      color: 'rgba(255,107,53,0.5)',
                      letterSpacing: '0.1em',
                      minWidth: '1.5rem',
                    }}
                  >
                    {c.num}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '0.9375rem',
                      color: 'rgba(255,255,255,0.65)',
                      letterSpacing: '0.005em',
                      lineHeight: '1.4',
                    }}
                  >
                    {c.label}
                  </span>
                </div>
                {/* Subtle arrow — only visible on hover via CSS */}
                <svg
                  className="guided-arrow"
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  aria-hidden="true"
                >
                  <path d="M2 7H12M8 3L12 7L8 11" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ))}
          </div>

        </div>
      </div>

      {/* ── Bottom scroll nudge ── */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <div
          style={{
            width: '1px',
            height: '2.5rem',
            background: 'linear-gradient(to bottom, transparent, rgba(255,107,53,0.3))',
          }}
        />
      </div>
    </section>
  );
}
