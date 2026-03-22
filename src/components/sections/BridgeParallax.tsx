'use client';

import { useEffect, useRef } from 'react';

/*
 * BridgeParallax — client component that applies a very subtle
 * parallax translateY to the bridge section's background image.
 * Travel: max ±18px. Feels like the image breathes rather than moves.
 * Uses requestAnimationFrame for smooth 60fps, passive scroll listener.
 */
export default function BridgeParallax() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    let rafId: number;

    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!el) return;
        const section = el.closest('section');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        // progress: -1 (section above viewport) → 0 (centred) → +1 (below)
        const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
        // max ±18px travel, very slow
        const y = progress * 18;
        el.style.transform = `translateY(${y.toFixed(2)}px)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial position

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={bgRef}
      className="absolute inset-0 will-change-transform"
      aria-hidden="true"
      style={{
        backgroundImage:
          'url(https://images.pexels.com/photos/4067521/pexels-photo-4067521.jpeg?auto=compress&cs=tinysrgb&w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundRepeat: 'no-repeat',
        /* scale slightly so parallax travel never reveals edges */
        transform: 'translateY(0)',
        inset: '-24px',
      }}
    />
  );
}
