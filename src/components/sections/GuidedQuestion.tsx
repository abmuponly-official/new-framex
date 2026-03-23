import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

/*
 * GuidedQuestion — Section 2
 * Motion design (scroll-triggered via .reveal + IntersectionObserver):
 *   — lead paragraph:  reveal, delay 0
 *   — sub-line 1:      reveal, delay 0.12s
 *   — sub-line 2:      reveal, delay 0.22s
 *   — sub-line 3:      reveal, delay 0.32s
 *   — question h2:     reveal with larger translateY (more weight), delay 0.5s
 *   — card 1:          reveal, delay 0.15s
 *   — card 2:          reveal, delay 0.28s
 *   — card 3:          reveal, delay 0.41s
 * Hover: border brightens, number shifts to orange, arrow slides in from left
 * Background: static dark gradient — no motion
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
      {/* ── CSS: hover-only interactions (reveal classes live in globals.css) ── */}
      <style>{`
        /* Hover interactions */
        .guided-choice {
          transition: border-color 0.45s ease, background 0.45s ease;
        }
        .guided-choice:hover {
          border-color: rgba(255,255,255,0.16) !important;
          background: rgba(255,255,255,0.055) !important;
        }
        .guided-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .guided-choice:hover .guided-arrow {
          opacity: 0.55;
          transform: translateX(0);
        }
        .guided-num {
          transition: color 0.4s ease;
        }
        .guided-choice:hover .guided-num {
          color: rgba(255,107,53,0.85) !important;
        }
      `}</style>

      <div className="relative z-10 container-base w-full">
        <div style={{ maxWidth: '36rem', margin: '0 auto' }}>

          {/* ── Opening lead — first element to reveal ── */}
          <div style={{ marginBottom: '2.75rem' }}>
            <p
              className="reveal"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 300,
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.38)',
                lineHeight: '1.8',
                marginBottom: '1.25rem',
                /* delay 0 — arrives first */
              }}
            >
              {t('guided_lead')}
            </p>

            {/* Sub-lines — stagger 0.12 / 0.22 / 0.32 after parent enters view */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[t('guided_s1'), t('guided_s2'), t('guided_s3')].map((s, i) => (
                <li
                  key={i}
                  className="reveal"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 300,
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.26)',
                    lineHeight: '1.95',
                    paddingLeft: '1rem',
                    position: 'relative',
                    transitionDelay: `${0.12 + i * 0.10}s`,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '0.65em',
                      width: '4px',
                      height: '1px',
                      background: 'rgba(255,107,53,0.45)',
                      display: 'inline-block',
                    }}
                    aria-hidden="true"
                  />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Question — centrepiece, heavier reveal ── */}
          <h2
            className="guided-q-reveal"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(1.375rem, 3vw, 1.875rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.022em',
              lineHeight: '1.28',
              marginBottom: '2.5rem',
              transitionDelay: '0.5s',
            }}
          >
            {t('guided_q')}
          </h2>

          {/* ── Choice cards — individual stagger ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            {choices.map((c, i) => (
              <Link
                key={c.num}
                href={c.href}
                className="guided-choice guided-card-reveal"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.5rem 1.5rem',
                  background: 'rgba(28,28,28,0.85)',
                  border: '1px solid rgba(255,255,255,0.055)',
                  borderRadius: 0,
                  textDecoration: 'none',
                  transitionDelay: `${0.15 + i * 0.13}s`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.125rem' }}>
                  <span
                    className="guided-num"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '0.6875rem',
                      color: 'rgba(255,107,53,0.45)',
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
                      color: 'rgba(255,255,255,0.62)',
                      letterSpacing: '0.005em',
                      lineHeight: '1.45',
                    }}
                  >
                    {c.label}
                  </span>
                </div>
                {/* Arrow — slides in on hover */}
                <svg
                  className="guided-arrow"
                  width="13" height="13" viewBox="0 0 14 14" fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7H12M8 3L12 7L8 11"
                    stroke="rgba(255,255,255,0.45)"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
            background: 'linear-gradient(to bottom, transparent, rgba(255,107,53,0.25))',
          }}
        />
      </div>
    </section>
  );
}
