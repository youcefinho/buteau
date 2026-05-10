import { useEffect, useState } from "react";

/**
 * ScrollSideBronzeLine v3 — fil bronze 1px gauche, scaleY GPU + opacity inline.
 *
 * v2 BUG : utilisait `bg-[color:var(--color-taupe)]/15` mais Tailwind v4 ne
 * supporte pas opacity modifier sur arbitrary values via `[color:var(...)]`.
 * Resultat : track + trace rendus SOLID 100%.
 *
 * v3 FIX : utilise inline style background avec oklch alpha direct.
 *
 * Theme luxury minimal corporate Buteau : bronze + glow bronze subtle.
 * Desktop only md:block, respect prefers-reduced-motion.
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
      {/* Track : fil 15% opacity toute hauteur (oklch alpha inline taupe) */}
      <div
        className="pointer-events-none fixed left-0 top-0 w-px h-screen z-30 hidden md:block"
        style={{ backgroundColor: "oklch(0.722 0.018 84 / 0.15)" }}
        aria-hidden="true"
      />
      {/* Trace : div h-screen, scaleY transform origin-top GPU compositor */}
      <div
        className="pointer-events-none fixed left-0 top-0 w-px h-screen z-30 hidden md:block origin-top"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.704 0.077 56 / 0.55) 0%, oklch(0.704 0.077 56 / 0.80) 50%, oklch(0.704 0.077 56 / 1) 100%)",
          transform: `scaleY(${progress})`,
          transition: reduceMotion ? "none" : "transform 90ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
        aria-hidden="true"
      />
      {/* Tete lumineuse : translate3d Y GPU, opacity 0 si tout en haut */}
      {!reduceMotion && (
        <div
          className="pointer-events-none fixed top-0 -left-[3px] w-[7px] h-[7px] rounded-full z-30 hidden md:block"
          style={{
            backgroundColor: "oklch(0.704 0.077 56)",
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
