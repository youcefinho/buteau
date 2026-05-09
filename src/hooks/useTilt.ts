import { useEffect, useRef } from "react";

/**
 * Hook tilt 3D — la card "respire" en suivant le curseur.
 * Pattern luxury portfolio (Bruno Simon, Robb Report digital).
 *
 * - rotateY suit dx (gauche/droite), rotateX suit -dy (haut/bas).
 * - perspective 1000 + transform-style preserve-3d sur le parent (à appliquer en CSS).
 * - Lerp 0.18 buttery smooth.
 * - Reset à 0 au pointer leave.
 * - Active uniquement sur pointer fin + reduced-motion off.
 */
export function useTilt<T extends HTMLElement = HTMLElement>(options?: {
  /** Amplitude max en degrés (défaut 6°) */
  maxDeg?: number;
  /** Easing factor 0..1 (plus haut = plus réactif). Défaut 0.18 */
  ease?: number;
}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || isReduced) return;

    const maxDeg = options?.maxDeg ?? 6;
    const ease = options?.ease ?? 0.18;

    let raf = 0;
    let targetRX = 0;
    let targetRY = 0;
    let currentRX = 0;
    let currentRY = 0;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      targetRY = Math.max(-1, Math.min(1, dx)) * maxDeg;
      targetRX = -Math.max(-1, Math.min(1, dy)) * maxDeg;
    };

    const onLeave = () => {
      targetRX = 0;
      targetRY = 0;
    };

    const animate = () => {
      currentRX += (targetRX - currentRX) * ease;
      currentRY += (targetRY - currentRY) * ease;
      el.style.transform = `perspective(1000px) rotateX(${currentRX.toFixed(2)}deg) rotateY(${currentRY.toFixed(2)}deg)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
    };
  }, [options?.maxDeg, options?.ease]);

  return ref;
}
