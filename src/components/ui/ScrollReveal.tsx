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
 * Reliability fixes (mobile / iPad / Safari):
 *  1. rootMargin changed to '0px' — eliminates the -40px bottom buffer
 *     that prevented observer from firing on full-viewport sections.
 *  2. Immediate viewport check on mount — any .reveal element whose
 *     bounding rect is already inside the viewport gets .in-view at once,
 *     fixing first-load visibility on large screens / fast connections.
 *  3. Safety timeout (3 s) — if the observer never fires (e.g., Safari
 *     backgrounding or an unusual layout), all remaining hidden .reveal
 *     elements are force-shown so the page is never permanently blank.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.reveal, .guided-q-reveal, .guided-card-reveal, .pain-card-reveal'
      )
    );

    if (elements.length === 0) return;

    /* ── Reduced motion: skip observer, mark everything visible now ── */
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      elements.forEach((el) => el.classList.add('in-view'));
      return;
    }

    /* ── Immediate viewport check ───────────────────────────────────────
     * Elements already in the viewport at mount time are revealed right
     * away — this handles the hero section and whatever is above the fold
     * on large monitors, and fixes Safari which sometimes fires the
     * observer late on the initial (already-visible) elements.
     * ─────────────────────────────────────────────────────────────────── */
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const stillHidden: HTMLElement[] = [];

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Reveal if any part of the element is inside the viewport
      if (rect.top < vh && rect.bottom > 0 && rect.left < vw && rect.right > 0) {
        el.classList.add('in-view');
      } else {
        stillHidden.push(el);
      }
    });

    if (stillHidden.length === 0) return;

    /* ── Normal path: IntersectionObserver for off-screen elements ──── */
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
        threshold: 0.05,      // trigger when 5 % of element is visible
        rootMargin: '0px',    // no negative bottom margin — was causing missed triggers
      }
    );

    stillHidden.forEach((el) => observer.observe(el));

    /* ── Safety timeout ─────────────────────────────────────────────────
     * If the observer never fires within 3 s (iOS Safari background tab,
     * very slow layout, or unusual scroll position), force-reveal any
     * elements still hidden so the page is never permanently blank.
     * ─────────────────────────────────────────────────────────────────── */
    const safetyTimer = setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(
          '.reveal:not(.in-view), .guided-q-reveal:not(.in-view), .guided-card-reveal:not(.in-view), .pain-card-reveal:not(.in-view)'
        )
        .forEach((el) => {
          el.classList.add('in-view');
        });
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(safetyTimer);
    };
  }, []);

  return null;
}
