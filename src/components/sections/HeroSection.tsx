import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

/*
 * HeroSection — Section 1 "Landing thiền"
 * Motion design:
 *   — Each element animates independently with its own delay + duration
 *   — Headline: slow fade-up from 28px, 1.6s, delay 0
 *   — Sub:      fade-up from 18px, 1.4s, delay 0.45s (arrives after headline settles)
 *   — CTA:      fade-in only (no translate), 1.2s, delay 0.9s
 *   — Scroll hint: fade-in, 1s, delay 1.6s — last, whisper quiet
 *   — Scroll line: pulse breathe loop, starts after 2s
 *   — Top marks: fade-in separately, very slow (2s)
 *   Background: static gradient — no motion on bg
 */
export default async function HeroSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section
      id="hero"
      className="relative section-screen overflow-hidden"
      aria-label="Hero"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* ── Keyframes — defined once, scoped to this section ── */}
      <style>{`
        @keyframes hFadeUp {
          0%   { opacity: 0; transform: translateY(28px); }
          100% { opacity: 1; transform: translateY(0);    }
        }
        @keyframes hFadeUpSm {
          0%   { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0);    }
        }
        @keyframes hFadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes hMarkIn {
          0%   { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0);    }
        }
        @keyframes hScrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.75); transform-origin: top; }
          50%       { opacity: 0.8; transform: scaleY(1);    transform-origin: top; }
        }
        .hero-skip-link:hover { color: rgba(255,255,255,0.55) !important; }
        .hero-cta-link:hover  { color: #FFFFFF !important; border-color: rgba(255,255,255,0.55) !important; }
      `}</style>

      {/* ── Very faint depth vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 130% 70% at 50% 110%, rgba(0,0,0,0.4) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 50% 25%,  rgba(255,255,255,0.012) 0%, transparent 70%)
          `,
        }}
        aria-hidden="true"
      />

      {/* ── Top-left: FrameX small mark — fades in slowly ── */}
      <div
        className="absolute top-8 left-8 z-20"
        style={{ animation: 'hMarkIn 1.8s cubic-bezier(0.22,1,0.36,1) 0.2s both' }}
      >
        <span
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.8125rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.32)',
          }}
          aria-label="FrameX"
        >
          Frame<span style={{ color: '#FF6B35' }}>X</span>
        </span>
      </div>

      {/* ── Top-right: Bỏ qua / Skip — fades in with mark ── */}
      <div
        className="absolute top-8 right-8 z-20"
        style={{ animation: 'hMarkIn 1.8s cubic-bezier(0.22,1,0.36,1) 0.35s both' }}
      >
        <a
          href="#guided-question"
          className="hero-skip-link"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8125rem',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.04em',
            transition: 'color 0.5s ease',
          }}
        >
          {locale === 'vi' ? 'Bỏ qua' : 'Skip'}
        </a>
      </div>

      {/* ── Centre content ── */}
      <div className="relative z-10 container-base w-full">
        <div className="max-w-2xl mx-auto text-center">

          {/* Headline — arrives first, slowest, heaviest weight */}
          <h1
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(1.75rem, 4vw, 2.875rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              lineHeight: '1.18',
              textWrap: 'balance',
              marginBottom: '1.75rem',
              animation: 'hFadeUp 1.6s cubic-bezier(0.16,1,0.3,1) 0s both',
            }}
          >
            {t('hero_headline')}
          </h1>

          {/* Sub-headline — arrives 0.45s after headline, shorter travel */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(255,255,255,0.40)',
              letterSpacing: '0.02em',
              lineHeight: '1.65',
              marginBottom: '3.75rem',
              animation: 'hFadeUpSm 1.4s cubic-bezier(0.16,1,0.3,1) 0.45s both',
            }}
          >
            {t('hero_sub')}
          </p>

          {/* CTA — pure fade, no translate; soft and non-aggressive */}
          <a
            href="#guided-question"
            className="hero-cta-link"
            style={{
              display: 'inline-block',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '0.9375rem',
              color: 'rgba(255,255,255,0.68)',
              letterSpacing: '0.01em',
              borderBottom: '1px solid rgba(255,255,255,0.22)',
              paddingBottom: '3px',
              transition: 'color 0.5s ease, border-color 0.5s ease',
              animation: 'hFadeIn 1.2s cubic-bezier(0.16,1,0.3,1) 0.9s both',
            }}
          >
            {t('hero_cta')}
          </a>
        </div>
      </div>

      {/* ── Bottom: scroll microcopy + breath line ── */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        aria-hidden="true"
        style={{ animation: 'hFadeIn 1.2s ease 1.6s both' }}
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.625rem',
            color: 'rgba(255,255,255,0.15)',
            letterSpacing: '0.18em',
            textTransform: 'lowercase',
          }}
        >
          {t('hero_scroll')}
        </span>
        {/* Breathing scroll indicator */}
        <div
          style={{
            width: '1px',
            height: '2.75rem',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,107,53,0.30))',
            animation: 'hScrollPulse 3s ease-in-out 2s infinite',
          }}
        />
      </div>
    </section>
  );
}
