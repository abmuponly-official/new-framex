'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * RouteChangeHandler — zero-render client component that handles two
 * side-effects on every client-side navigation:
 *
 * 1. Instant scroll reset to top
 *    ────────────────────────────
 *    Next.js App Router does NOT reset scroll on same-layout navigations.
 *    Going from /vi/tin-tuc → /vi leaves the window at the old scroll offset.
 *    This matters because ScrollReveal's immediate-viewport check fires
 *    against whatever getBoundingClientRect() returns at that moment — if the
 *    window is still at y=800, sections that are at y=0 in the document have
 *    negative rect.top and fail the "is this visible?" test, so they stay
 *    opacity:0 forever.
 *
 *    Fix: call window.scrollTo({ top:0, behavior:'instant' }) synchronously
 *    in useEffect (i.e., synchronously before the browser paints), and
 *    temporarily add `html.scroll-instant` to disable CSS smooth-scroll so
 *    the programmatic reset is not animated.
 *
 * 2. Hero CSS animation replay
 *    ───────────────────────────
 *    HeroSection uses inline `animation: hFadeUp ... fill-mode:both`.
 *    fill-mode:both holds opacity:0 before the animation plays.
 *    On soft route-change the browser may skip replaying finished animations.
 *    Fix: toggle `animation:none` + rAF restore to force a replay from t=0.
 *    A safety timer adds `.hero-anim-done` to #hero after 3.5s (worst-case
 *    animation end = 1.6s delay + 1.6s duration + buffer), which triggers a
 *    CSS rule that forces all animated hero children to opacity:1 — so text
 *    is ALWAYS readable even if the replay fails.
 *
 * Safety invariants:
 *  — Only fires on actual route CHANGES (skips first mount)
 *  — Hero replay only runs when navigating TO a homepage route
 *  — Does not touch elements outside #hero
 *  — Cleans up all rAFs and timers on dep-change / unmount
 *  — prefers-reduced-motion: no rAF gymnastics needed; globals.css already
 *    suppresses animations globally
 */

export default function RouteChangeHandler() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    // Skip the very first mount — we only act on CHANGES
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      return;
    }

    // Same path — bail (re-render without navigation)
    if (prevPathname.current === pathname) return;

    prevPathname.current = pathname;

    /* ── 1. Instant scroll reset ────────────────────────────────────────── */
    const html = document.documentElement;

    // Disable smooth-scroll so our programmatic reset is instantaneous
    html.classList.add('scroll-instant');

    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    } catch {
      // Safari < 15.4 doesn't support 'instant'
      window.scrollTo(0, 0);
    }

    // Re-enable smooth-scroll after a brief delay (next paint is enough)
    const smoothRestoreTimer = setTimeout(() => {
      html.classList.remove('scroll-instant');
    }, 50);

    /* ── 2. Hero animation replay ──────────────────────────────────────── */
    const isHomepage = /^\/(vi|en)\/?$/.test(pathname);
    if (!isHomepage) {
      return () => clearTimeout(smoothRestoreTimer);
    }

    let rafId: number;
    let safetyTimer: ReturnType<typeof setTimeout>;

    const hero = document.getElementById('hero');

    // Collect hero elements with inline animation right away (before rAF)
    // so we can snapshot them even if the DOM mutates between rAFs
    const getAnimated = () =>
      hero
        ? Array.from(hero.querySelectorAll<HTMLElement>('[style*="animation"]'))
        : [];

    rafId = requestAnimationFrame(() => {
      const animated = getAnimated();
      if (animated.length === 0) return;

      // Snapshot original animation strings
      const originals = animated.map((el) => el.style.animation);

      // Step A: reset animation
      animated.forEach((el) => { el.style.animation = 'none'; });

      // Step B: force style recalculation (read offsetHeight — canonical trick)
      if (hero) void hero.offsetHeight;

      // Step C: restore in next rAF → browser replays animation from t=0
      rafId = requestAnimationFrame(() => {
        animated.forEach((el, i) => { el.style.animation = originals[i]; });

        // Step D: safety — after worst-case animation duration + buffer,
        // add .hero-anim-done which CSS uses to force opacity:1 on all
        // animated children (ensures text is readable even if replay fails).
        // Worst case: hScrollPulse has delay 2s + 3s = 5s; add 1s buffer = 6s
        // but practically the text animations are done by 0.9s + 1.2s = 2.1s.
        safetyTimer = setTimeout(() => {
          if (hero) hero.classList.add('hero-anim-done');
        }, 3500);
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(safetyTimer);
      clearTimeout(smoothRestoreTimer);
    };
  }, [pathname]);

  return null;
}
