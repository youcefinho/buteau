import { useEffect, useState } from "react";

/**
 * ScrollSideBronzeLine — fil bronze 1px gauche, scaleY GPU-only au scroll.
 *
 * Inspire de Serujan ScrollSideGoldLine (motion/react) — vanilla impl pour
 * Buteau (pas de motion/react bundle). Difference clef vs v1 buggy :
 *
 * v1 BUG : changeait `height: ${progress}%` ce qui cause reflow + jumps
 * visuels au scroll (line "starts full -> empties -> refills").
 *
 * v2 FIX : div toujours h-screen full, transform `scaleY(progress)` avec
 * `transform-origin: top`. GPU compositor only, zero reflow, smooth.
 *
 * Tete lumineuse : `translate3d(0, calc(progress * 100vh), 0)` GPU-only.
 *
 * Theme luxury minimal corporate Buteau : bronze + glow bronze subtle.
 * Desktop only md:block, respect prefers-reduced-motion (statique 100%).
 */
export function ScrollSideBronzeLine() {
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);

    if (mq.matches) {
      setProgress(1);
      return;
    }

    let ticking = false;
    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      const v = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      setProgress(v);
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
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {/* Track : fil tres subtle taupe/15 toute hauteur viewport */}
      <div
        className="pointer-events-none fixed left-0 top-0 w-px h-screen z-30 hidden md:block bg-[color:var(--color-taupe)]/15"
        aria-hidden="true"
      />
      {/* Trace : div h-screen full, scaleY transform origin-top GPU compositor */}
      <div
        className="pointer-events-none fixed left-0 top-0 w-px h-screen z-30 hidden md:block origin-top bg-gradient-to-b from-[color:var(--color-bronze)]/60 via-[color:var(--color-bronze)]/80 to-[color:var(--color-bronze)]"
        style={{
          transform: `scaleY(${progress})`,
          transition: reduceMotion ? "none" : "transform 90ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
        aria-hidden="true"
      />
      {/* Tete lumineuse : translate3d Y GPU, opacity 0 si tout en haut */}
      {!reduceMotion && (
        <div
          className="pointer-events-none fixed top-0 -left-[3px] w-[7px] h-[7px] rounded-full z-30 hidden md:block bg-[color:var(--color-bronze)]"
          style={{
            transform: `translate3d(0, calc(${progress} * 100vh), 0)`,
            transition: "transform 90ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease-out",
            opacity: progress > 0.005 ? 1 : 0,
            willChange: "transform",
            boxShadow:
              "0 0 8px oklch(0.704 0.077 56 / 0.6), 0 0 16px oklch(0.704 0.077 56 / 0.3)",
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
}
