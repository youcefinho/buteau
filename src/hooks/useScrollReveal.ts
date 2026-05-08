import { useEffect, useRef, useState } from "react";

/**
 * Hook IntersectionObserver pour révéler du contenu au scroll.
 * Respecte prefers-reduced-motion (révèle immédiatement si reduced).
 *
 * Usage :
 *   const { ref, isVisible } = useScrollReveal();
 *   <div ref={ref} className={isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}>...</div>
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respecter prefers-reduced-motion : révèle immédiatement.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (options?.once !== false) obs.unobserve(entry.target);
          } else if (options?.once === false) {
            setIsVisible(false);
          }
        }
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
      },
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.once]);

  return { ref, isVisible };
}
