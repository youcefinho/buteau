import { useEffect, useRef, useState } from "react";

/**
 * Anime un nombre de 0 (ou `from`) à `to` en `duration` ms.
 * Démarre seulement quand `start === true` (typiquement via IntersectionObserver).
 * Respecte prefers-reduced-motion (saute direct au target).
 */
export function useCountUp(
  to: number,
  options?: { from?: number; duration?: number; start?: boolean; decimals?: number },
): number {
  const { from = 0, duration = 1400, start = true, decimals = 0 } = options ?? {};
  const [value, setValue] = useState<number>(from);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (to - from) * eased;
      setValue(Number(next.toFixed(decimals)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [to, from, duration, start, decimals]);

  return value;
}
