import { useEffect, useState } from "react";

/**
 * useReducedMotion — retourne true si l'utilisateur a active prefers-reduced-motion.
 *
 * Sert a conditionner les animations inline (style={{ animation: "..." }}) qui
 * echappent au global CSS @media (prefers-reduced-motion: reduce) a cause d'un
 * bug Chrome avec cubic-bezier custom (cf .audit/UI-REVIEW-2026-05-19.md motion 7/10).
 *
 * Reactif : ecoute les changements de preference user pendant la session.
 *
 * Usage :
 *   const reduceMotion = useReducedMotion();
 *   <span style={reduceMotion ? undefined : { animation: "buteauLetterIn ..." }} />
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
