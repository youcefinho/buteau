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
  /** Tone du contexte autour : "light" = surface cream, "dark" = surface navy */
  tone?: "light" | "dark";
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
        "py-12 md:py-16 flex items-center justify-center gap-6 md:gap-8 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        tone === "dark" ? "surface-navy" : "",
        className,
      )}
      aria-hidden="true"
    >
      <span className={cn("h-px flex-1 max-w-[10rem] md:max-w-[14rem]", lineColor)} />
      <span
        className={cn(
          "font-[family-name:var(--font-editorial)] italic text-2xl md:text-3xl select-none leading-none",
          ornamentColor,
        )}
      >
        {ORNAMENTS[variant]}
      </span>
      <span className={cn("h-px flex-1 max-w-[10rem] md:max-w-[14rem]", lineColor)} />
    </div>
  );
}
