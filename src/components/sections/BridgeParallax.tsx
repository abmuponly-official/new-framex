'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/*
 * BridgeParallax — subtle background image parallax for BridgeSection.
 *
 * Safety constraints:
 *  — Travel clamped to ±14px (inset is -24px, so 10px hard safety margin
 *    even at iOS Safari elastic overscroll extremes)
 *  — Respects prefers-reduced-motion: skip all transforms when user
 *    has requested reduced motion (accessibility requirement)
 *  — will-change-transform applied only during active scroll via
 *    .is-scrolling class, removed after 120ms idle — avoids holding
 *    a GPU compositing layer open on low-RAM devices when not in use
 *  — passive scroll listener, rAF-batched, cleanup on unmount
 */

const MAX_TRAVEL = 14;   // px — never exceeds inset (-24px), safe on iOS
const IDLE_DELAY = 120;  // ms before will-change is released after scroll stops

export default function BridgeParallax() {
  const bgRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    /* ── Respect prefers-reduced-motion ── */
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      // No parallax — clear any transform and exit immediately
      el.style.transform = 'translateY(0)';
      return;
    }

    let rafId: number;
    let idleTimer: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      /* Activate compositing layer only while scrolling */
      el.classList.add('is-scrolling');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => el.classList.remove('is-scrolling'), IDLE_DELAY);

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!el) return;
        const section = el.closest('section');
        if (!section) return;

        const rect   = section.getBoundingClientRect();
        const vh     = window.innerHeight;

        /*
         * progress: 0 when section is centred in viewport.
         * Range is ≈ [-0.5, +0.5] normally; iOS elastic scroll can push
         * it a bit beyond that — clamped below.
         */
        const raw      = (vh / 2 - (rect.top + rect.height / 2)) / vh;
        const progress = Math.max(-1, Math.min(1, raw)); // hard clamp before multiply
        const y        = Math.max(-MAX_TRAVEL, Math.min(MAX_TRAVEL, progress * MAX_TRAVEL));

        el.style.transform = `translateY(${y.toFixed(2)}px)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial position on mount

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      clearTimeout(idleTimer);
      el.classList.remove('is-scrolling');
    };
  // Re-run when the route changes so the scroll listener is re-attached
  // after returning to the homepage via back/logo navigation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/*
       * .is-scrolling activates will-change only when needed.
       * Defined here as a scoped <style> so it doesn't pollute globals.
       */}
      <style>{`
        .bridge-bg.is-scrolling { will-change: transform; }
        .bridge-bg              { will-change: auto; }
      `}</style>

      <div
        ref={bgRef}
        className="bridge-bg absolute"
        aria-hidden="true"
        style={{
          /*
           * Self-hosted: eliminates Pexels CDN DNS + TCP handshake (~100-300 ms).
           * image-set(): serves WebP to modern browsers (saves ~18%), JPEG fallback.
           * 30-day cache via next.config.js /images/* header rule.
           * inset: -24px gives 24px bleed; MAX_TRAVEL (14px) + 10px buffer = safe.
           */
          inset: '-24px',
          backgroundImage: [
            'image-set(url("/images/bridge-bg.webp") type("image/webp"), url("/images/bridge-bg.jpg") type("image/jpeg"))',
            /* Legacy fallback for browsers without image-set() */
            'url("/images/bridge-bg.jpg")',
          ].join(', '),
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
          transform: 'translateY(0)',
        }}
      />
    </>
  );
}
