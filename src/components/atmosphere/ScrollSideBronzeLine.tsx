import { useEffect, useState } from "react";

/**
 * ScrollSideBronzeLine — fil bronze 1px sur le bord gauche, qui se trace au scroll.
 *
 * Inspiration : Serujan a `ScrollSideGoldLine` (fil doré gauche signature). Pattern
 * adapté au theme luxury minimal corporate Buteau :
 * - Couleur bronze (pas gold)
 * - Tête lumineuse box-shadow bronze glow (pas trop intense, corporate)
 * - Hauteur scaleY animée via scroll progress (0 → 100% du document)
 * - Fixed left-0, z-index élevé pour passer au-dessus des sections navy
 *
 * Détail signature : un visiteur revient en se disant "ah, ce truc à gauche".
 *
 * Respecte prefers-reduced-motion : ligne statique sans tête mobile.
 */
export function ScrollSideBronzeLine() {
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);

    if (mq.matches) {
      setProgress(100);
      return;
    }

    let ticking = false;
    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
      setProgress(pct);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 bottom-0 z-30 hidden md:block"
      aria-hidden="true"
    >
      {/* Track : fil très subtle taupe/15 du haut en bas pour suggérer le rail */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-[color:var(--color-taupe)]/15" />

      {/* Trace : fil bronze qui grandit avec le scroll */}
      <div
        className="absolute left-0 top-0 w-px bg-gradient-to-b from-[color:var(--color-bronze)]/60 via-[color:var(--color-bronze)]/80 to-[color:var(--color-bronze)] origin-top transition-transform duration-100 ease-out"
        style={{
          height: `${progress}%`,
        }}
      />

      {/* Tête lumineuse : petit dot bronze qui suit le scroll, glow subtle */}
      {!reduceMotion && (
        <div
          className="absolute -left-[3px] w-[7px] h-[7px] rounded-full bg-[color:var(--color-bronze)] transition-[top] duration-100 ease-out"
          style={{
            top: `${progress}%`,
            boxShadow:
              "0 0 8px oklch(0.704 0.077 56 / 0.6), 0 0 16px oklch(0.704 0.077 56 / 0.3)",
          }}
        />
      )}
    </div>
  );
}
