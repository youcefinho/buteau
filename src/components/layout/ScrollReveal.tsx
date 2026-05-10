import { type ReactNode, type CSSProperties } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

/**
 * ScrollReveal — wrapper qui applique fade-in subtle au scroll-into-view.
 *
 * Pattern adapté au theme luxury minimal corporate Buteau :
 * - Fade + translateY 24px → 0 (pas de scale ou rotate, trop bling)
 * - Durée 800ms cubic-bezier(0.16, 1, 0.3, 1) — courbe "expo out" éditoriale
 * - Respect prefers-reduced-motion via hook (révèle immédiatement)
 *
 * Usage :
 *   <ScrollReveal>
 *     <Mission />
 *   </ScrollReveal>
 *   <ScrollReveal delay={120}>
 *     <BrokerLetter />
 *   </ScrollReveal>
 */
export function ScrollReveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Délai en ms avant l'animation (utile pour cascades). */
  delay?: number;
  className?: string;
  /** Element wrapper, défaut div. Utile pour `section` si nécessaire. */
  as?: "div" | "section" | "article";
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
  };

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
