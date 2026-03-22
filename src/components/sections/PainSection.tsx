import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

/*
 * PainSection — Section 4
 * Motion design (scroll-triggered via .reveal + IntersectionObserver):
 *   — Eyebrow:     reveal, delay 0
 *   — Headline:    reveal, delay 0.12s, deeper translateY
 *   — pain_sub:    reveal, delay 0.24s
 *   — pain_body:   reveal, delay 0.36s — arrives slowly, narrative weight
 *   — Card 1:      reveal, delay 0.12s
 *   — Card 2:      reveal, delay 0.26s
 *   — Card 3:      reveal, delay 0.40s
 *   — Card 4:      reveal, delay 0.54s
 *   — Closing:     reveal, delay 0.64s
 * Cards use a lighter translateY (10px) for subtlety.
 * Background: static gradient, noise overlay — no motion.
 */
export default async function PainSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const pains = [
    { title: t('pain_1_title'), desc: t('pain_1_desc') },
    { title: t('pain_2_title'), desc: t('pain_2_desc') },
    { title: t('pain_3_title'), desc: t('pain_3_desc') },
    { title: t('pain_4_title'), desc: t('pain_4_desc') },
  ];

  /* Card stagger delays */
  const cardDelays = ['0.12s', '0.26s', '0.40s', '0.54s'];

  return (
    <section
      className="relative section-screen overflow-hidden"
      aria-labelledby="pain-heading"
      style={{ background: 'var(--gradient-section)' }}
    >
      <style>{`
        /* Card hover */
        .pain-card { transition: background 0.45s ease; }
        .pain-card:hover { background: rgba(58,58,58,0.72) !important; }

        /* Card reveal — smaller travel for a grounded feel */
        .pain-card-reveal {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.95s cubic-bezier(0.16,1,0.3,1),
                      transform 0.95s cubic-bezier(0.16,1,0.3,1);
        }
        .pain-card-reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.022] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 container-base w-full py-24">

        {/* ── Section header ── */}
        <div className="max-w-2xl mb-14">

          {/* Eyebrow — arrives first */}
          <div
            className="flex items-center gap-4 mb-6 reveal"
            style={{ transitionDelay: '0s' }}
          >
            <span className="divider-accent" aria-hidden="true" />
            <span className="text-eyebrow">{t('pain_eyebrow')}</span>
          </div>

          {/* Headline — arrives 0.12s later, deeper travel */}
          <h2
            id="pain-heading"
            className="reveal"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.022em',
              lineHeight: '1.22',
              textWrap: 'balance',
              transitionDelay: '0.12s',
            }}
          >
            {t('pain_headline')}
          </h2>

          {/* Sub — one-liner */}
          <p
            className="mt-4 reveal"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.44)',
              maxWidth: '52ch',
              lineHeight: '1.7',
              transitionDelay: '0.24s',
            }}
          >
            {t('pain_sub')}
          </p>

          {/* Body — full narrative, very quiet, arrives last in header */}
          <p
            className="mt-5 reveal"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(0.875rem, 1.4vw, 1rem)',
              color: 'rgba(255,255,255,0.28)',
              lineHeight: '1.9',
              maxWidth: '60ch',
              letterSpacing: '0.005em',
              transitionDelay: '0.36s',
            }}
          >
            {t('pain_body')}
          </p>
        </div>

        {/* ── Pain cards grid — each card independently staggered ── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{
            background: 'rgba(255,255,255,0.055)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          {pains.map((pain, i) => (
            <div
              key={i}
              className="pain-card pain-card-reveal reveal p-8"
              style={{
                background: 'rgba(42,42,42,0.62)',
                backdropFilter: 'blur(2px)',
                transitionDelay: cardDelays[i],
              }}
            >
              {/* Number */}
              <span
                className="block mb-5"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.6875rem',
                  color: 'rgba(255,107,53,0.65)',
                  letterSpacing: '0.12em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                0{i + 1}
              </span>
              {/* Orange micro-line */}
              <div
                className="mb-6"
                style={{
                  width: '1.5rem',
                  height: '2px',
                  background: '#FF6B35',
                  opacity: 0.65,
                }}
                aria-hidden="true"
              />
              <h3
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: '#FFFFFF',
                  lineHeight: '1.32',
                  marginBottom: '0.625rem',
                }}
              >
                {pain.title}
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.42)',
                  lineHeight: '1.65',
                }}
              >
                {pain.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Closing line — arrives last ── */}
        <p
          className="mt-12 reveal"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.28)',
            letterSpacing: '0.02em',
            transitionDelay: '0.64s',
          }}
        >
          {t('pain_closing')}
        </p>
      </div>
    </section>
  );
}
