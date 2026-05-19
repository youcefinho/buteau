import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * useLenis — Buteau butter-smooth scroll (~5KB gzip).
 *
 * Phase Lenis cross-Intralys — duration 1.1s + Apple medium easing
 * (register bronze hypothécaire navy luxury, crédibilité bancaire smooth).
 *
 * - Auto-disabled on touch (mobile keeps native scroll for performance + UX).
 * - Auto-disabled on prefers-reduced-motion (a11y).
 * - Compatible IntersectionObserver (SectionRail multi-pages work unchanged).
 * - Mount once at RootLayout — persiste cross-routes TanStack Router.
 */
export function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
      smoothWheel: true,
      syncTouch: false
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
