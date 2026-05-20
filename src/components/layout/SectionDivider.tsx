import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

/**
 * SectionDivider — filet bronze + ornement central, anime au scroll-into-view.
 *
 * Pattern édito magazine adapté au theme luxury minimal corporate Buteau :
 * - 2 hairlines taupe horizontaux (gauche + droite)
 * - Ornement central : monogramme "B" navy + swash bronze (2026-05-20 user :
 *   "remplacer fleuron par logo Buteau marriage couleurs")
 * - Anim subtle scale+fade au scroll-into-view
 *
 * Usage : à insérer entre 2 sections pour respiration éditoriale.
 *   <Mission />
 *   <SectionDivider />
 *   <AdPage />
 *
 * 3 variantes ornement disponibles :
 * - "fleuron" — monogramme B Buteau navy + swash bronze (signature client)
 * - "ampersand" (&) — pour transitions narratives
 * - "asterism" (⁂) — pour ruptures fortes
 */
type Variant = "fleuron" | "ampersand" | "asterism";

// Path du "B" extrait du logo officiel BUTEAU (Raleway Bold uppercase).
// Source viewBox 1563x1563, B coords [147,598] -> [322,812] (~175x214).
// Voir scripts/gen-favicon.cjs pour la source originale.
const B_PATH =
  "M321.781,756.962C321.781,769.003 318.609,779.084 312.267,787.203C305.925,795.322 297.404,801.468 286.703,805.641C276.002,809.815 264.21,811.901 251.324,811.901L147.853,811.901L147.853,598.109L263.966,598.109C274.004,598.109 282.686,600.769 290.013,606.089C297.34,611.408 302.961,618.261 306.875,626.647C310.79,635.033 312.747,643.742 312.747,652.776C312.747,662.882 310.143,672.53 304.935,681.721C299.726,690.911 292.092,697.769 282.033,702.295C294.279,705.909 303.965,712.389 311.091,721.736C318.217,731.083 321.781,742.825 321.781,756.962ZM192.433,636.247L192.433,686.303L245.001,686.303C249.317,686.303 253.24,685.335 256.77,683.398C260.3,681.461 263.16,678.615 265.35,674.861C267.539,671.106 268.634,666.572 268.634,661.259C268.634,655.986 267.668,651.523 265.735,647.869C263.803,644.214 261.2,641.364 257.925,639.317C254.651,637.271 250.945,636.247 246.808,636.247L192.433,636.247ZM276.566,748.149C276.566,743.19 275.555,738.705 273.532,734.693C271.508,730.682 268.787,727.469 265.368,725.055C261.95,722.642 257.971,721.435 253.432,721.435L192.433,721.435L192.433,774.097L251.324,774.097C256.064,774.097 260.344,772.946 264.164,770.644C267.984,768.341 271.007,765.235 273.23,761.323C275.454,757.412 276.566,753.021 276.566,748.149Z";

/**
 * Monogramme B Buteau — variant "fleuron" remplace l'ancien ❦ par le B
 * du logo officiel (navy core) + swash bronze decoratif + 2 micro-dots
 * bronze comme bookends. Marriage editorial des 2 couleurs brand.
 */
function ButeauMonogram({ tone }: { tone: "light" | "dark" | "bronze" }) {
  const bColor =
    tone === "dark" ? "var(--color-cream)" : "var(--color-navy-deep)";
  const bronzeColor = "var(--color-bronze)";
  return (
    <svg
      width="56"
      height="48"
      viewBox="0 0 56 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="select-none shrink-0"
      style={{ overflow: "visible" }}
    >
      {/* Cercle medaillon hairline bronze (vibe sceau de cire vintage)
          Centre (28, 17), rayon 13 = englobe le B avec ~3 unites d'air. */}
      <circle
        cx="28"
        cy="17"
        r="13"
        fill="none"
        stroke={bronzeColor}
        strokeWidth="0.6"
        opacity={tone === "dark" ? "0.55" : "0.65"}
      />
      {/* Arc bronze subtle interieur (depth de medaillon) */}
      <circle
        cx="28"
        cy="17"
        r="11.5"
        fill="none"
        stroke={bronzeColor}
        strokeWidth="0.3"
        opacity="0.3"
      />
      {/* "B" du logo officiel - scale 0.065 (un peu plus petit pour respecter le medaillon)
          Centre vertical y=17 (B range y[10, 24]) inscrit dans le cercle. */}
      <g transform="translate(28, 17) scale(0.065) translate(-235, -705)">
        <path d={B_PATH} fill={bColor} />
      </g>
      {/* 2 petits losanges (lozenges) serif terminaux gauche+droite (style chapter book) */}
      <g fill={bronzeColor} opacity="0.7">
        <path d="M 6 17 L 9 14 L 12 17 L 9 20 Z" />
        <path d="M 44 17 L 47 14 L 50 17 L 47 20 Z" />
      </g>
      {/* Swash bronze courbe sous medaillon (signature flourish editorial) */}
      <path
        d="M 8 38 Q 28 44, 48 38"
        stroke={bronzeColor}
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
        opacity={tone === "dark" ? "0.75" : "0.9"}
      />
      {/* Micro-dots terminaux du swash */}
      <circle cx="5" cy="38" r="0.8" fill={bronzeColor} opacity="0.6" />
      <circle cx="51" cy="38" r="0.8" fill={bronzeColor} opacity="0.6" />
    </svg>
  );
}

const TEXT_ORNAMENTS: Record<Exclude<Variant, "fleuron">, string> = {
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
      {variant === "fleuron" ? (
        <ButeauMonogram tone={tone} />
      ) : (
        <span
          className={cn(
            "font-[family-name:var(--font-editorial)] italic text-[clamp(1.5rem,2.5vw,1.875rem)] select-none leading-none",
            ornamentColor,
          )}
        >
          {TEXT_ORNAMENTS[variant]}
        </span>
      )}
      <span className={cn("h-px flex-1 max-w-[clamp(10rem,14vw,14rem)]", lineColor)} />
    </div>
  );
}
