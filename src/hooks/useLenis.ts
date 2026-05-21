import { useEffect } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
export function getLenis(): Lenis | null { return lenisInstance; }

/**
 * useLenis — Buteau butter-smooth scroll (~5KB gzip).
 *
 * Phase Lenis cross-Intralys — duration 1.1s + Apple medium easing
 * (register bronze hypothécaire navy luxury, crédibilité bancaire smooth).
 *
 * - Auto-disabled on touch (mobile keeps native scroll for performance + UX).
 * - Auto-disabled on prefers-reduced-motion (a11y).
 *
 * Hash anchor handling (user 2026-05-21 v1 Buteau, ported from EGSF v40+v47) :
 * Le browser natif gere mal les clics 2x sur le meme hash (pas de hashchange
 * si URL identique → pas de re-scroll). Click intercept explicit qui re-scroll
 * a chaque clic, peu importe l'URL. Filtre id === 'contact' (CTAs vers form).
 * Tourne sur TOUS les devices (mobile inclus) avec fallback window.scrollTo.
 */
export function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const useLenisLib =
      !window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lenis: Lenis | null = null;
    let rafId = 0;

    if (useLenisLib) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
        touchMultiplier: 2,
        smoothWheel: true,
        syncTouch: false,
      });
      lenisInstance = lenis;

      const raf = (time: number) => {
        lenis!.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    // Click intercept pour CTAs vers #contact — TOUJOURS actif (PC + mobile).
    // Bypass la dedup browser (qui skip re-scroll si URL hash inchange).
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest<HTMLAnchorElement>('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !/^\/?#[\w-]+$/.test(href)) return;
      const id = href.replace(/^\/?#/, '');
      if (id !== 'contact') return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();

      const nav = document.querySelector('nav') as HTMLElement | null;
      const navHeight = nav?.getBoundingClientRect().height ?? 100;

      const getAbsoluteOffsetTop = (node: HTMLElement): number => {
        let top = 0;
        let current: HTMLElement | null = node;
        while (current) {
          top += current.offsetTop;
          current = current.offsetParent as HTMLElement | null;
        }
        return top;
      };

      const scrollTo = (targetY: number) => {
        if (lenis) {
          lenis.scrollTo(targetY, { immediate: true });
        } else {
          window.scrollTo({ top: targetY, behavior: 'instant' });
        }
      };

      const targetY = getAbsoluteOffsetTop(el) - navHeight - 24;
      scrollTo(targetY);

      // Correction apres 1.5s pour lazy content layout shift.
      window.setTimeout(() => {
        const newTarget = getAbsoluteOffsetTop(el) - navHeight - 24;
        if (Math.abs(window.scrollY - newTarget) > 30) {
          scrollTo(newTarget);
        }
      }, 1500);

      window.history.replaceState(null, '', `#${id}`);
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.destroy();
        lenisInstance = null;
      }
    };
  }, []);
}
