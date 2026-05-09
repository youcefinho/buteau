import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * PageTransition — wrapper qui applique une transition cinématique entre routes.
 *
 * Pourquoi NOVEL : la sensation "tourner la page" magazine. Quand on clique
 * /equipe depuis l'Accueil, le contenu actuel fade out + slide up, le nouveau
 * fade in + slide up depuis dessous. Subtle mais reconnaissable.
 *
 * Implementation :
 * - Détecte le pathname change via useRouterState
 * - À chaque change, on applique 'transitioning' state pendant 280ms (out)
 * - Puis le nouveau contenu monte avec 'entering' state (320ms in)
 * - Respecte prefers-reduced-motion (skip)
 */
type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const { location } = useRouterState();
  const pathname = location.pathname;
  const previousPath = useRef<string>(pathname);
  const [phase, setPhase] = useState<"idle" | "entering">("idle");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (pathname === previousPath.current) return;
    previousPath.current = pathname;

    if (reduced) {
      setPhase("idle");
      return;
    }

    setPhase("entering");
    const t = window.setTimeout(() => setPhase("idle"), 600);
    return () => window.clearTimeout(t);
  }, [pathname, reduced]);

  if (reduced) return <>{children}</>;

  // Fix BLOCKER code-review : retrait key={pathname} qui forçait remount complet
  // de l'arbre Outlet → reset state des routes interactives (/capsules filter,
  // /journal openSlug, etc.). L'animation est maintenant scopée au wrapper
  // sans démonter les enfants. View Transitions API + cette anim coexistent.
  return (
    <div
      style={{
        animation:
          phase === "entering"
            ? "buteauPageEnter 600ms cubic-bezier(0.4, 0, 0.2, 1) both"
            : undefined,
      }}
    >
      {children}
    </div>
  );
}
