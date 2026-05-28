import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * BackToTop — bouton flottant bas-GAUCHE qui apparait apres 800px de scroll.
 * Position gauche pour ne pas chevaucher le WhatsApp FAB a droite.
 * Smooth-scroll vers le haut, respecte prefers-reduced-motion.
 * Theme bronze Buteau coherent avec navbar + footer.
 * Cache jusqu'a lg (1024px) pour eviter chevauchement avec MobileStickyCta
 * qui occupe le bottom mobile + tablet jusqu'a lg:hidden.
 */
export function BackToTop() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setVisible(window.scrollY > 800);
        rafId = null;
      });
    };
    setVisible(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function scrollToTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduced ? "auto" : "smooth" });
  }

  const label = lang === "fr" ? "Retour en haut" : "Back to top";

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={label}
      className={`group hidden lg:flex fixed bottom-6 left-6 z-40 w-12 h-12 items-center justify-center rounded-full bg-[color:var(--color-cream)]/95 backdrop-blur-xl border border-[color:var(--color-bronze)]/35 text-[color:var(--color-navy)] hover:border-[color:var(--color-bronze)]/70 hover:bg-[color:var(--color-bronze)]/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-[0_8px_32px_-12px_rgba(16,34,61,0.18)] ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      {/* Tooltip au hover desktop — apparait a droite du bouton */}
      <span className="pointer-events-none absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md bg-[color:var(--color-navy-deep)] border border-[color:var(--color-bronze)]/30 text-[color:var(--color-cream)] text-xs font-medium whitespace-nowrap opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
        {label}
      </span>

      {/* Halo bronze pulsant 2-layer ripple (parite WhatsApp pill) — pause au hover */}
      <span
        className="absolute inset-0 rounded-full bg-[color:var(--color-bronze)]/30 motion-safe:animate-ping pointer-events-none group-hover:hidden"
        style={{ animationDuration: "2.4s" }}
        aria-hidden
      />
      <span
        className="absolute -inset-1 rounded-full bg-[color:var(--color-bronze)]/15 motion-safe:animate-ping pointer-events-none group-hover:hidden"
        style={{ animationDuration: "2.4s", animationDelay: "0.6s" }}
        aria-hidden
      />

      <ArrowUp className="relative w-4 h-4" strokeWidth={2} aria-hidden />
    </button>
  );
}
