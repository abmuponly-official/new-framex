'use client';

import { useEffect } from 'react';

/**
 * ScrollReveal — attaches an IntersectionObserver to every `.reveal` element
 * and adds `.in-view` when it enters the viewport.
 * Placed once in the locale layout so it runs on every page.
 *
 * Tuned for meditative cadence:
 *  — threshold 0.08 (reveal begins when 8% visible, earlier trigger)
 *  — rootMargin -40px bottom (slight buffer so reveal isn't instant at edge)
 *  — Handles both initial elements and any added after mount (e.g. CMS content)
 */
export default function ScrollReveal() {
  useEffect(() => {
    const observe = (elements: NodeListOf<HTMLElement>) => {
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
      return observer;
    };

    const initial = document.querySelectorAll<HTMLElement>('.reveal');
    const obs = observe(initial);

    return () => obs.disconnect();
  }, []);

  return null;
}
