import { useEffect, useRef } from "react";

/**
 * Active la pulse heartbeat sur un element tant qu'il est visible dans
 * le viewport, et la met en pause des qu'il sort.
 *
 * Pourquoi : feedback Aby 2026-05-23 — les visiteurs restent sur la home
 * et ne realisent pas qu'il faut cliquer pour acceder aux pages dediees
 * (/equipe, /capsules, /journal, /outils...). Le heartbeat signale "il y
 * a plus a voir ici" sans casser le ton editorial Buteau.
 *
 * L'animation CSS .cta-heartbeat est par defaut animation-play-state:
 * paused ; ce hook ajoute /retire data-heartbeat="active" via toggle
 * IntersectionObserver pour lancer (in-view) ou pause (off-screen).
 *
 * Threshold 0.5 : declenche quand 50% du CTA visible — assez tot pour
 * que la pulse soit deja en cours quand le user finit son scroll dessus,
 * sans firer prematurement quand juste un sliver depasse.
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
        } else {
          el.removeAttribute("data-heartbeat");
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);

    return () => obs.disconnect();
  }, []);

  return ref;
}
