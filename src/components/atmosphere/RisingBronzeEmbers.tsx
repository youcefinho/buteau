import { useMemo } from "react";

/**
 * RisingBronzeEmbers v3 — STREAK pattern (inspire Serujan/EG, fresh pour Buteau).
 *
 * v2 BUG : utilisait des circles 3-4px qui etaient TOTALEMENT invisibles
 * (user feedback "y a rien"). Switch au pattern streak (vertical gradient
 * line) qui est confirme visible sur Serujan/EG.
 *
 * Caracteristiques :
 * - 6 streaks par instance (count par defaut)
 * - Position X random + duration variee = effet organique
 * - Hauteur variable 80-200px = mix courtes + longues
 * - Animation 7-13s = lent atmospherique
 * - Delais -0 a -12s = etales (pas de "vague")
 * - aria-hidden + pointer-events-none = 100% decoratif
 *
 * 3 tones (bicolor adaptatif) :
 * - "dark" (defaut) : streak CREAM/WHITE pour navy sections
 * - "light" : streak NAVY pour cream sections
 * - "bronze" : streak BRONZE (legacy, marron du site)
 *
 * Performance : seul transform + opacity = compositor layer, zero reflow.
 * Respecte prefers-reduced-motion.
 *
 * Usage : a placer en absolute inset-0 dans une section relative + overflow-hidden.
 */
type Tone = "dark" | "light" | "bronze";

const TONE_CLASS: Record<Tone, string> = {
  dark: "ember-buteau-cream", // cream/white sur navy
  light: "ember-buteau-navy", // navy sur cream
  bronze: "ember-bronze", // bronze (marron du site, pour cream sections selon user)
};

export function RisingBronzeEmbers({
  count = 6,
  tone = "dark",
  className,
}: {
  count?: number;
  tone?: Tone;
  className?: string;
}) {
  const emberClass = TONE_CLASS[tone];

  // Stable random params - calculs une seule fois au mount
  const streaks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i / count) * 100 + (Math.random() * 100) / count}%`,
        duration: 7 + Math.random() * 6, // 7-13s
        delay: -(Math.random() * 12), // -0 a -12s (negatif = part deja en cours)
        height: 80 + Math.random() * 120, // 80-200px
      })),
    [count],
  );

  return (
    <div
      // z-[2] : sit ABOVE bg-image overlays (z-auto = 0) and .ambient-particles (z-1).
      className={`pointer-events-none absolute inset-0 overflow-hidden z-[2] ${className ?? ""}`}
      aria-hidden="true"
    >
      {streaks.map((s, i) => (
        <span
          key={i}
          className={emberClass}
          style={{
            left: s.left,
            height: `${s.height}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
