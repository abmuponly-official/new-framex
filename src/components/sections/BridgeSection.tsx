import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

/*
 * BridgeSection — Section 3 of the landing page.
 * Full-screen dark section with an architectural image background,
 * heavy dark overlay, and centered quote.
 * Image: steel frame architecture (Pexels CC0 — pexels.com/photo/4067521)
 */
export default async function BridgeSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section
      className="relative section-screen overflow-hidden"
      aria-label="Bridge statement"
      style={{ background: '#1A1A1A' }}
    >
      {/* ── Background architectural image with strong dark overlay ── */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/4067521/pexels-photo-4067521.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Multi-layer overlay for depth and text legibility */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: 'linear-gradient(to bottom, rgba(17,17,17,0.88) 0%, rgba(26,26,26,0.82) 50%, rgba(17,17,17,0.92) 100%)' }}
      />
      {/* Orange glow from bottom-right — very subtle */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 80%, rgba(255,107,53,0.05) 0%, transparent 60%)' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 container-base w-full py-24">
        <div className="max-w-3xl mx-auto text-center">

          {/* Orange accent line */}
          <div className="flex justify-center mb-10 reveal">
            <span className="divider-accent" aria-hidden="true" />
          </div>

          {/* Primary quote */}
          <blockquote className="reveal reveal-delay-1">
            <p
              className="font-display font-bold text-balance"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                color: '#FFFFFF',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
              }}
            >
              {t('bridge')}
            </p>
          </blockquote>

          {/* Supporting paragraph */}
          <p
            className="mt-8 text-base reveal reveal-delay-2"
            style={{
              color: 'rgba(255,255,255,0.5)',
              lineHeight: '1.75',
              maxWidth: '52ch',
              margin: '2rem auto 0',
            }}
          >
            {t('bridge_sub')}
          </p>

          {/* FrameX attribution */}
          <div className="mt-12 flex justify-center items-center gap-3 reveal reveal-delay-3">
            <span className="divider-accent" style={{ width: '1.5rem' }} aria-hidden="true" />
            <span
              className="text-xs tracking-[0.16em] uppercase"
              style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, sans-serif' }}
            >
              FrameX
            </span>
          </div>

        </div>
      </div>

      {/* ── Bottom scroll nudge ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
        <div
          className="w-px h-10 animate-pulse"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,107,53,0.4))' }}
        />
      </div>
    </section>
  );
}
