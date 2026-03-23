'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollReveal — attaches an IntersectionObserver to every `.reveal` element
 * and adds `.in-view` when the element enters the viewport.
 *
 * Placed once in the locale layout so it runs on EVERY page, and crucially
 * re-runs on EVERY client-side route change (the key fix for the homepage
 * "sections stay hidden after returning via logo / back button" bug).
 *
 * Root cause of the back-navigation bug
 * ──────────────────────────────────────
 * Next.js App Router keeps the ScrollReveal component MOUNTED across soft
 * navigations — it never unmounts when you go from /vi/tin-tuc back to /vi.
 * Because the old `useEffect(fn, [])` ran only once (on initial mount), the
 * observer was already destroyed and the `.reveal` elements that the NEW page
 * rendered had never been seen by any observer, so they stayed `opacity: 0`.
 *
 * The fix
 * ───────
 * 1. Add `pathname` to the useEffect dependency array so the entire init
 *    block re-runs on every route change.
 * 2. Before querying elements, STRIP any stale `.in-view` classes from the
 *    previous visit so every element starts invisible and animates in fresh.
 *    (Without this, elements from the previous page that share class names
 *    would leak their `.in-view` state into the next render.)
 * 3. Keep all the existing reliability fixes:
 *    — prefers-reduced-motion: mark everything visible immediately
 *    — immediate viewport check: elements already on screen at mount time
 *    — 3 s safety timeout: force-show any stuck elements
 *    — rootMargin '0px': avoids missed Observer triggers on Safari
 *
 * Hero keyframe animations (HeroSection.tsx)
 * ───────────────────────────────────────────
 * The hero headline/sub/CTA use CSS `animation: hFadeUp ... both` which is
 * fine on first visit because `animation-fill-mode: both` holds `opacity: 0`
 * before the animation plays. On return navigation however the browser may
 * skip replaying finished animations on elements it considers "already
 * painted". The HeroScrollReset component (see below) handles this by
 * forcing a style recalculation via a brief `animation: none` toggle.
 *
 * Accessibility:
 *  — prefers-reduced-motion: all `.reveal` elements are shown immediately
 *    without any observer or timeout.
 *  — @media (scripting: none) fallback in globals.css ensures content is
 *    visible even when JS is disabled.
 */

const SELECTOR =
  '.reveal, .guided-q-reveal, .guided-card-reveal, .pain-card-reveal';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    /* ── 1. Strip stale .in-view from the PREVIOUS route ──────────────────
     * When navigating back to the homepage, the new page's elements are
     * freshly rendered without .in-view.  But to be safe we also clean up
     * any that React might have recycled (e.g. layout-level shared elements).
     * This is a no-op on first load (no elements have .in-view yet).
     * ─────────────────────────────────────────────────────────────────── */
    document
      .querySelectorAll<HTMLElement>(`${SELECTOR}.in-view`)
      .forEach((el) => el.classList.remove('in-view'));

    /* ── 2. Query the current page's reveal elements ───────────────────── */
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(SELECTOR)
    );

    if (elements.length === 0) return;

    /* ── 3. Reduced motion: show everything immediately ─────────────────── */
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      elements.forEach((el) => el.classList.add('in-view'));
      return;
    }

    /* ── 4. Immediate viewport check ─────────────────────────────────────
     * Elements already inside the viewport when this effect runs (e.g. the
     * hero section, or anything above the fold on a large monitor) are
     * revealed right away.  This also fixes Safari which sometimes fires the
     * IntersectionObserver late for elements that were visible at mount time.
     * ─────────────────────────────────────────────────────────────────── */
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const stillHidden: HTMLElement[] = [];

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0 && rect.left < vw && rect.right > 0) {
        el.classList.add('in-view');
      } else {
        stillHidden.push(el);
      }
    });

    if (stillHidden.length === 0) return;

    /* ── 5. IntersectionObserver for off-screen elements ─────────────────── */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); // animate once per visit
          }
        });
      },
      {
        threshold: 0.05,   // trigger when 5 % of element is visible
        rootMargin: '0px', // no negative margin — was causing missed triggers on mobile
      }
    );

    stillHidden.forEach((el) => observer.observe(el));

    /* ── 6. Safety timeout ───────────────────────────────────────────────
     * If the observer never fires within 3 s (iOS Safari background tab,
     * very slow layout, or unusual scroll position on return navigation),
     * force-reveal any elements still hidden so the page is never blank.
     * ─────────────────────────────────────────────────────────────────── */
    const safetyTimer = setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(`${SELECTOR}:not(.in-view)`)
        .forEach((el) => el.classList.add('in-view'));
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(safetyTimer);
    };

    // Re-run the ENTIRE effect on every route change — this is intentional
    // and is the core fix for the back-navigation visibility bug.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
