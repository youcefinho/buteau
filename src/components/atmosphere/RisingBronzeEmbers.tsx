/**
 * RisingBronzeEmbers — particules atmosphériques cross-section.
 *
 * Inspiration : Mathis a `RisingCrimsonEmbers`, Serujan a `RisingGoldEmbers` —
 * pattern "fil atmosphérique continu" qui lie les sections sombres.
 * Adapté au theme luxury minimal corporate Buteau :
 * - Particules taupe + bronze (pas crimson ni gold)
 * - Mouvement plus lent et plus subtle (corporate vs flashy)
 * - Pas de trail vivid, juste un float-and-fade discret
 *
 * Usage : à insérer en absolu dans une section navy avec position relative.
 *   <section className="surface-navy relative overflow-hidden">
 *     <RisingBronzeEmbers />
 *     ...
 *   </section>
 *
 * Respecte prefers-reduced-motion : opacity reduite, animation arrêtée.
 */
export function RisingBronzeEmbers({
  count = 6,
  className,
}: {
  /** Nombre de particules (4-8 recommandé, défaut 6). */
  count?: number;
  className?: string;
}) {
  // Positions pseudo-random pré-calculées pour rendu déterministe SSR-safe.
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

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      {positions.map((p, i) => (
        <span
          key={i}
          className="ember-bronze"
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
