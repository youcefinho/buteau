import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

/**
 * SectionDivider — filet bronze + ornement central, anime au scroll-into-view.
 *
 * Pattern édito magazine adapté au theme luxury minimal corporate Buteau :
 * - 2 hairlines taupe horizontaux (gauche + droite)
 * - Ornement central : "❦" (fleuron) en bronze italic Cormorant Garamond
 * - Anim subtle scale+fade au scroll-into-view
 *
 * Usage : à insérer entre 2 sections pour respiration éditoriale.
 *   <Mission />
 *   <SectionDivider />
 *   <AdPage />
 *
 * 3 variantes ornement disponibles :
 * - "fleuron" (❦) — défaut, signature classique
 * - "ampersand" (&) — pour transitions narratives
 * - "asterism" (⁂) — pour ruptures fortes
 */
type Variant = "fleuron" | "ampersand" | "asterism";

const ORNAMENTS: Record<Variant, string> = {
  fleuron: "❦",
  ampersand: "&",
  asterism: "⁂",
};

export function SectionDivider({
  variant = "fleuron",
  tone = "light",
  className,
}: {
  variant?: Variant;
  /** Tone du contexte autour : "light" = surface cream, "dark" = surface navy, "bronze" = cream + accent bronze */
  tone?: "light" | "dark" | "bronze";
  className?: string;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const lineColor =
    tone === "dark"
      ? "bg-[color:var(--color-taupe)]/30"
      : "bg-[color:var(--color-taupe)]/50";
  const ornamentColor =
    tone === "dark"
      ? "text-[color:var(--color-bronze)]/85"
      : "text-[color:var(--color-bronze)]";

  return (
    <div
      ref={ref}
      className={cn(
        "py-[clamp(3rem,6vw,5rem)] flex items-center justify-center gap-[clamp(1.5rem,2.5vw,2rem)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        tone === "dark" ? "surface-navy" : "",
        className,
      )}
      aria-hidden="true"
    >
      <span className={cn("h-px flex-1 max-w-[clamp(10rem,14vw,14rem)]", lineColor)} />
      <span
        className={cn(
          "font-[family-name:var(--font-editorial)] italic text-[clamp(1.5rem,2.5vw,1.875rem)] select-none leading-none",
          ornamentColor,
        )}
      >
        {ORNAMENTS[variant]}
      </span>
      <span className={cn("h-px flex-1 max-w-[clamp(10rem,14vw,14rem)]", lineColor)} />
    </div>
  );
}
