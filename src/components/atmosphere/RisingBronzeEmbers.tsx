/**
 * RisingBronzeEmbers — particules atmospheriques per-section.
 *
 * v2 (2026-05-10 PM) : ajout du prop `tone` pour bicolor adaptatif :
 * - tone="dark" (defaut) : embers CREAM/WHITE pour sections navy/sombres
 * - tone="light" : embers NAVY pour sections claires (cream surface), prend
 *   la couleur du site comme accent.
 * - tone="bronze" : retro-compat avec v1 (bronze/taupe), pour cas particuliers
 *
 * Mecanique : particules absolute inset-0 dans une section relative+overflow-hidden.
 * Animation emberRise CSS pure GPU compositor (translate + opacity), 16-22s loop.
 * Each section contient ses propres embers — die at section top, respawn next.
 *
 * Respecte prefers-reduced-motion : opacity reduite, animation arretee.
 */
type Tone = "dark" | "light" | "bronze";

const TONE_CLASS: Record<Tone, string> = {
  dark: "ember-buteau-cream", // cream/white sur navy
  light: "ember-buteau-navy", // navy sur cream
  bronze: "ember-bronze", // legacy bronze/taupe (pour cas particuliers)
};

export function RisingBronzeEmbers({
  count = 6,
  tone = "dark",
  className,
}: {
  /** Nombre de particules (4-8 recommande, defaut 6). */
  count?: number;
  /** Tone embers : "dark" (cream sur navy), "light" (navy sur cream), "bronze" (legacy). */
  tone?: Tone;
  className?: string;
}) {
  // Positions pseudo-random pre-calculees pour rendu deterministe SSR-safe.
  const positions = [
    { left: "8%", delay: "0s", duration: "16s", size: 3 },
    { left: "22%", delay: "4s", duration: "20s", size: 4 },
    { left: "38%", delay: "8s", duration: "18s", size: 3 },
    { left: "54%", delay: "2s", duration: "22s", size: 4 },
    { left: "70%", delay: "6s", duration: "17s", size: 3 },
    { left: "86%", delay: "10s", duration: "19s", size: 4 },
    { left: "15%", delay: "12s", duration: "21s", size: 3 },
    { left: "62%", delay: "14s", duration: "16s", size: 4 },
  ].slice(0, count);

  const emberClass = TONE_CLASS[tone];

  return (
    <div
      // z-[2] : sit ABOVE bg-image overlays (z-auto = 0) and .ambient-particles (z-1).
      // Container content uses `relative` later in DOM order so it still paints on top.
      // FIX 2026-05-10 PM : embers etaient invisibles car bg-image divs (DOM apres)
      // les recouvraient dans le meme contexte d'empilement.
      className={`pointer-events-none absolute inset-0 overflow-hidden z-[2] ${className ?? ""}`}
      aria-hidden="true"
    >
      {positions.map((p, i) => (
        <span
          key={i}
          className={emberClass}
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
