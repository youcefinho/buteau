import { useEffect, useRef } from "react";

/**
 * Active la pulse heartbeat sur un element des qu'il entre dans le viewport.
 *
 * Pourquoi : feedback Aby 2026-05-23 — les visiteurs restent sur la home
 * et ne realisent pas qu'il faut cliquer pour acceder aux pages dediees
 * (/equipe, /capsules, /journal, /outils...). Le heartbeat signale "il y
 * a plus a voir ici" sans casser le ton editorial Buteau.
 *
 * L'animation CSS .cta-heartbeat est par defaut animation-play-state:
 * paused ; ce hook ajoute data-heartbeat="active" pour la lancer, puis
 * disconnect l'observer (one-shot, 3 iterations CSS puis stop naturel).
 *
 * Threshold 0.6 : declenche seulement quand 60% du CTA visible -> evite
 * que la pulse fire avant que le user ait reellement vu le bouton.
 */
export function useHeartbeatOnView<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.setAttribute("data-heartbeat", "active");
          obs.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    obs.observe(el);

    return () => obs.disconnect();
  }, []);

  return ref;
}
