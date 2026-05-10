import { useMemo } from "react";
import { useAtmospherePresence } from "@/hooks/useAtmospherePresence";

/**
 * RisingBronzeEmbers v4 — UX-optimized.
 *
 * 3 ameliorations UX (user feedback "defois intrusif") :
 *
 * 1. PRELOAD : embers actifs quand section visible OU section suivante dans
 *    le prochain viewport. Effet "atmospheric continuity" : la prochaine
 *    demarre avant que user la voit, transition fluide.
 *
 * 2. VELOCITY FADE : opacity baisse a 0.3 quand user scroll vite.
 *    Anti motion sickness + pas distrayant en lecture rapide.
 *
 * 3. PAUSE OFF-SCREEN : animation-play-state paused quand off-screen.
 *    Economie GPU + moins de mouvement peripherique.
 *
 * Z-index : wrapper a z-0 (above bg-image z-auto par DOM order, sous content
 * qui doit avoir relative z-10). Resout user feedback "passe sous le texte".
 *
 * 3 tones (bicolor adaptatif) :
 * - "dark" (defaut) : streak CREAM/WHITE pour navy sections
 * - "light" : streak NAVY pour cream sections
 * - "bronze" : streak BRONZE (marron du site)
 *
 * Performance : streak GPU-only (transform + opacity), respect prefers-reduced-motion.
 */
type Tone = "dark" | "light" | "bronze";

const TONE_CLASS: Record<Tone, string> = {
  dark: "ember-buteau-cream",
  light: "ember-buteau-navy",
  bronze: "ember-bronze",
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
  const { ref, inView, opacity } = useAtmospherePresence<HTMLDivElement>();

  const streaks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i / count) * 100 + (Math.random() * 100) / count}%`,
        duration: 12 + Math.random() * 8, // 12-20s (slower = atmospheric)
        delay: -(Math.random() * 18),
        height: 80 + Math.random() * 120,
      })),
    [count],
  );

  return (
    <div
      ref={ref}
      // BREAKOUT pattern : w-screen + left-1/2 + -translate-x-1/2 = full viewport.
      // z-[1] : ABOVE bg-image overlays (z-auto level 6) mais sous content
      // (qui doit avoir relative z-10 pour passer dessus). FIX 2026-05-10 PM :
      // bug "embers gone" cause par z-0 (meme niveau que z-auto, couvert par
      // bg-image qui vient apres dans DOM).
      // embers-paused class : pause CSS animation quand off-screen (GPU saving).
      className={`pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full overflow-hidden z-[1] transition-opacity duration-300 ease-out ${
        inView ? "" : "embers-paused"
      } ${className ?? ""}`}
      style={{ opacity }}
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
