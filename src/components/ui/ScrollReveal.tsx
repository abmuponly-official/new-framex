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
 *    The CSS in globals.css also sets transition:none, so elements simply
 *    appear at full opacity with no animation whatsoever.
 *
 * Normal cadence:
 *  — threshold 0.08 — reveal begins when 8% of element is visible
 *  — rootMargin -40px bottom — soft buffer for breathing feel
 *  — animate once (unobserve after .in-view)
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
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
