import type { ReactNode } from "react";
import { useHeartbeatOnView } from "@/hooks/useHeartbeatOnView";

/**
 * HeartbeatCta — wrapper inline-block qui declenche une pulse heartbeat
 * (CSS .cta-heartbeat) sur viewport entry. A appliquer sur les CTAs
 * section-end qui pointent vers les pages dediees (decouvrabilite
 * multi-pages — feedback Aby 2026-05-23).
 *
 * Usage :
 *   <HeartbeatCta>
 *     <Link to="/equipe" className="btn-bronze">Rencontrer l'equipe</Link>
 *   </HeartbeatCta>
 *
 * Le wrapper span en inline-block ne casse pas le centering (text-center
 * parent) ni le layout flex/grid. Animation = paused par defaut hors
 * viewport, prefers-reduced-motion = tout statique (gere dans index.css).
 */
export function HeartbeatCta({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useHeartbeatOnView<HTMLSpanElement>();
  return (
    <span ref={ref} className={`cta-heartbeat ${className}`}>
      {children}
    </span>
  );
}
