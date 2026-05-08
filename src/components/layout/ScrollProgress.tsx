import { useEffect, useState } from "react";

/**
 * Scroll progress bar — fine ligne bronze qui se remplit en haut de la page
 * au fur et à mesure que l'utilisateur scrolle. Détail luxury subtle.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        setProgress(ratio);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="scroll-progress"
      style={{ width: "100%", transform: `scaleX(${progress})` }}
      aria-hidden="true"
    />
  );
}
