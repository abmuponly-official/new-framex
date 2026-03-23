'use client';

import { useEffect } from 'react';

/**
 * ScrollReveal — attaches an IntersectionObserver to every `.reveal` element
 * and adds `.in-view` when it enters the viewport.
 * Placed once in the locale layout so it runs on every page.
 *
 * Accessibility:
 *  — If prefers-reduced-motion is active, ALL .reveal elements are marked
 *    .in-view immediately on mount (no observer, no scroll dependency).
 *
 * Mobile/Safari fixes (v2):
 *  — threshold lowered to 0.05 (5%) — less area required before reveal fires
 *  — rootMargin reduced to -10px — avoids over-subtracting on short screens
 *  — Initial viewport check: any .reveal element already in the viewport on
 *    mount (e.g., the hero, sections 1-4 above the fold) is immediately
 *    marked .in-view so users never see invisible content on load.
 *  — Safety timeout fallback: after 2.8 s any remaining un-revealed .reveal
 *    element that is currently intersecting the viewport (isIntersecting=true
 *    on latest check) is force-revealed. This catches Safari's edge case where
 *    IntersectionObserver fires late or misses the initial entry.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal');

    /* ── Reduced motion: skip observer, mark everything visible now ── */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      elements.forEach((el) => el.classList.add('in-view'));
      return;
    }

    /* ── Normal path: IntersectionObserver ── */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      {
        // Lower threshold: only 5% of element needs to be visible
        threshold: 0.05,
        // Smaller negative bottom margin — safer for short mobile viewports
        rootMargin: '0px 0px -10px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    /* ── Immediate viewport check ──────────────────────────────────────
       Any element already within the visible viewport on mount should
       be revealed instantly, without waiting for a scroll event.
       This handles hero / above-fold sections on all devices.
    ─────────────────────────────────────────────────────────────────── */
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inViewport =
        rect.top < vh &&
        rect.bottom > 0 &&
        rect.left < vw &&
        rect.right > 0;
      if (inViewport) {
        el.classList.add('in-view');
        observer.unobserve(el);
      }
    });

    /* ── Safety timeout fallback (Safari/iOS) ───────────────────────
       After 2.8 s, any .reveal element that is intersecting but has
       not yet received .in-view (IntersectionObserver fired late or
       missed on Safari) is force-revealed.
    ─────────────────────────────────────────────────────────────────── */
    const safetyTimer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.reveal:not(.in-view)').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh + 100) {          // within or just below the fold
          el.classList.add('in-view');
        }
      });
    }, 2800);

    return () => {
      observer.disconnect();
      clearTimeout(safetyTimer);
    };
  }, []);

  return null;
}
