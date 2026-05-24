import { motion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * ScrollSideBronzeLine v4 — pattern Serujan motion/react (parfait fluide).
 *
 * Implementation perf-safe :
 * - useScroll + useSpring → motion ecrit directement sur le transform GPU
 * - position fixed → aucun reflow, juste compositing
 * - z-[40] → derriere navbar (z-50) et au-dessus du contenu
 * - pointer-events-none → ne bloque jamais l'interaction
 *
 * Theme luxury minimal corporate Buteau : bronze + glow bronze subtle.
 */
export function ScrollSideBronzeLine() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });
  const headY = useTransform(scrollYProgress, (v) => `${v * 100}vh`);
  const headOpacity = useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  return (
    <>
      {/* Rail taupe tres discret — toute la hauteur du viewport */}
      <div
        className="fixed top-0 left-0 w-px h-screen z-[40] pointer-events-none hidden md:block"
        style={{ backgroundColor: "oklch(0.704 0.077 56 / 0.12)" }}
        aria-hidden
      />
      {/* Fil bronze qui se trace au scroll */}
      <motion.div
        className="fixed top-0 left-0 w-px h-screen z-[40] origin-top pointer-events-none hidden md:block"
        style={{
          scaleY,
          background:
            "linear-gradient(to bottom, oklch(0.704 0.077 56 / 1) 0%, oklch(0.704 0.077 56 / 0.7) 50%, oklch(0.704 0.077 56 / 0.3) 100%)",
        }}
        aria-hidden
      />
      {/* Tete lumineuse — point bronze qui descend avec le scroll */}
      <motion.div
        className="fixed left-0 top-0 -translate-x-1/2 w-2 h-2 rounded-full z-[40] pointer-events-none hidden md:block"
        style={{
          y: headY,
          opacity: headOpacity,
          backgroundColor: "oklch(0.704 0.077 56)",
          boxShadow: "0 0 10px 2px oklch(0.704 0.077 56 / 0.55)",
        }}
        aria-hidden
      />
    </>
  );
}
