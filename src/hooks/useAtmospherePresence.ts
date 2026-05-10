import { useEffect, useRef, useState } from "react";

/**
 * useAtmospherePresence — gere la presence des effets atmospheriques (embers).
 *
 * Combine 3 optimisations UX :
 *
 * 1. INTERSECTION + PRELOAD : embers actifs quand la section est visible OU
 *    quand la section suivante est dans le prochain viewport (rootMargin 100%).
 *    Resout le user feedback "j'aimerais que la section qu'il vois et celle
 *    en dessous demarrent avant qu'il la vois pour effet jolie".
 *
 * 2. VELOCITY FADE : detecte vitesse scroll. Quand user scroll vite, embers
 *    fade a 0.3 opacity (anti motion sickness). Quand idle, opacity 1.
 *
 * 3. PAUSE OFF-SCREEN : animation-play-state paused quand off-screen.
 *    Economie GPU + reduit mouvement peripherique distrayant.
 *
 * Returns :
 * - ref : a attacher au wrapper div des embers
 * - inView : section dans viewport (ou prochain) — controle pause animation
 * - opacity : multiplicateur opacity selon velocity (0.3 fast → 1.0 idle)
 *
 * Singleton scroll velocity tracker pour eviter duplication listeners.
 */

// ── Singleton scroll velocity tracker ────────────────────────────
let scrollVelocity = 0;
let listenerCount = 0;
let lastScrollY = 0;
let lastTime = 0;
let scrollHandler: (() => void) | null = null;

function startScrollTracker() {
  if (listenerCount === 0 && typeof window !== "undefined") {
    lastScrollY = window.scrollY;
    lastTime = performance.now();
    scrollHandler = () => {
      const now = performance.now();
      const dy = window.scrollY - lastScrollY;
      const dt = Math.max(1, now - lastTime);
      const v = Math.abs((dy / dt) * 1000); // px/s
      // EMA smoothing
      scrollVelocity = scrollVelocity * 0.6 + v * 0.4;
      lastScrollY = window.scrollY;
      lastTime = now;
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });
  }
  listenerCount++;
}

function stopScrollTracker() {
  listenerCount = Math.max(0, listenerCount - 1);
  if (listenerCount === 0 && scrollHandler && typeof window !== "undefined") {
    window.removeEventListener("scroll", scrollHandler);
    scrollHandler = null;
    scrollVelocity = 0;
  }
}

// Fonction de mapping velocity → opacity
function velocityToOpacity(v: number): number {
  // < 200 px/s : idle → 1.0
  // 200-800 : normal scroll → 0.85
  // 800-1500 : medium fast → 0.55
  // > 1500 : very fast → 0.3
  if (v < 200) return 1.0;
  if (v < 800) return 0.85;
  if (v < 1500) return 0.55;
  return 0.3;
}

// ── Hook ────────────────────────────────────────────────────────
export function useAtmospherePresence<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true); // SSR-safe default
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === "undefined") return;

    // Respect prefers-reduced-motion : pas de velocity fade, juste opacity
    // statique au minimum (mais visible) + on garde l'IntersectionObserver
    // pour pause off-screen.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. IntersectionObserver avec preload (rootMargin 100% top + bottom).
    //    Section consideree "visible" des qu'elle est dans le prochain viewport
    //    avant ou apres → embers demarrent avant que user scroll dessus.
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setInView(e.isIntersecting);
        }
      },
      { rootMargin: "100% 0px 100% 0px", threshold: 0 },
    );
    obs.observe(node);

    if (reduceMotion) {
      setOpacity(1);
      return () => obs.disconnect();
    }

    // 2. Velocity tracker + rAF tick pour update opacity smoothly
    startScrollTracker();
    let rafId = 0;
    let currentOpacity = 1;
    const tick = () => {
      const target = velocityToOpacity(scrollVelocity);
      // Lerp pour transition smooth
      currentOpacity = currentOpacity * 0.85 + target * 0.15;
      setOpacity(currentOpacity);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      obs.disconnect();
      stopScrollTracker();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return { ref, inView, opacity };
}
