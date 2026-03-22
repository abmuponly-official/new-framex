import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/request';
import BridgeParallax from './BridgeParallax';

type Props = { locale: Locale };

/*
 * BridgeSection — Section 3 "Khoảng chuyển từ tĩnh lặng sang logic"
 * Motion design:
 *   — Background: very subtle parallax via BridgeParallax (client, ±18px max)
 *   — Primary paragraph: scroll-reveal, fade-up 20px, 1.1s, delay 0
 *   — Supporting paragraph: scroll-reveal, fade-up 12px, 1.0s, delay 0.35s
 *     → the gap between the two paragraphs arriving gives a breathing pause
 * No CTA, no attribution, no eyebrow, no divider.
 */
export default async function BridgeSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section
      className="relative section-screen overflow-hidden"
      aria-label="Bridge statement"
      style={{ background: '#0E0E0E' }}
    >
      {/* ── Background with subtle parallax (client component) ── */}
      <BridgeParallax />

      {/* ── Deep overlay — legibility, meditative darkness ── */}
      <div
        className="absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,8,8,0.93) 0%, rgba(12,12,12,0.87) 45%, rgba(8,8,8,0.95) 100%)',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 container-base w-full">
        <div style={{ maxWidth: '44rem' }}>

          {/* Primary — big statement, heavier reveal */}
          <p
            className="reveal"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(1.375rem, 3.2vw, 2.125rem)',
              color: '#FFFFFF',
              lineHeight: '1.48',
              letterSpacing: '-0.02em',
              textWrap: 'balance',
              marginBottom: '2.25rem',
              /* delay 0 — arrives first when section enters viewport */
              transitionDelay: '0s',
            }}
          >
            {t('bridge')}
          </p>

          {/* Supporting — quieter, arrives 0.35s later — breathing pause */}
          <p
            className="reveal"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
              color: 'rgba(255,255,255,0.38)',
              lineHeight: '1.8',
              letterSpacing: '0.005em',
              maxWidth: '40rem',
              transitionDelay: '0.35s',
            }}
          >
            {t('bridge_sub')}
          </p>

        </div>
      </div>

      {/* ── Bottom scroll line ── */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        aria-hidden="true"
      >
        <div
          style={{
            width: '1px',
            height: '2.5rem',
            background: 'linear-gradient(to bottom, transparent, rgba(255,107,53,0.22))',
          }}
        />
      </div>
    </section>
  );
}
