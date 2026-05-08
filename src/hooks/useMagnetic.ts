import { useEffect, useRef } from "react";

/**
 * Hook magnetic hover — l'élément se déplace subtilement vers le curseur quand
 * il entre dans son champ. Détail luxury reconnaissable.
 *
 * - Active uniquement sur pointer fin (desktop + tablette stylet).
 * - Respecte prefers-reduced-motion.
 * - Strength 0.25 par défaut (subtle), maxOffset 12px.
 */
export function useMagnetic<T extends HTMLElement = HTMLAnchorElement>(options?: {
  strength?: number;
  maxOffset?: number;
}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || isReduced) return;

    const strength = options?.strength ?? 0.25;
    const maxOffset = options?.maxOffset ?? 12;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      targetX = Math.max(-maxOffset, Math.min(maxOffset, dx * strength));
      targetY = Math.max(-maxOffset, Math.min(maxOffset, dy * strength));
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
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
  }, [options?.strength, options?.maxOffset]);

  return ref;
}
