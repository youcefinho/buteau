import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";

/**
 * SplashIntro — moment "ouverture du magazine" au 1er visit (sessionStorage gate).
 *
 * Pourquoi NOVEL : aucun autre client Intralys n'a une intro splash. C'est le
 * premier "wow" qui annonce que ce site n'est pas un SaaS landing — c'est un
 * objet luxury éditorial.
 *
 * - Affiché 1.8s puis fade out 600ms
 * - sessionStorage "buteau:splash-shown" = '1' pour ne montrer qu'une fois par session
 * - Respecte prefers-reduced-motion (skip immédiat)
 * - z-index 9999, body scroll lock pendant le splash
 */
const STORAGE_KEY = "buteau:splash-shown";

export function SplashIntro() {
  const { t, lang } = useLanguage();
  const [phase, setPhase] = useState<"hidden" | "visible" | "fading">("hidden");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip si déjà vu cette session OU reduced motion
    const seen = window.sessionStorage.getItem(STORAGE_KEY);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setPhase("hidden");
      return;
    }

    setPhase("visible");
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => {
      setPhase("fading");
    }, 1800);

    const endTimer = window.setTimeout(() => {
      setPhase("hidden");
      document.body.style.overflow = "";
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    }, 2400);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(endTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center surface-navy grain-overlay"
      style={{
        opacity: phase === "fading" ? 0 : 1,
        transition: "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: phase === "fading" ? "none" : "auto",
      }}
    >
      <div className="text-center px-6 max-w-3xl">
        {/* Eyebrow */}
        <p className="eyebrow text-[color:var(--color-taupe)] mb-8 inline-flex items-center gap-3 animate-[buteauFadeUp_500ms_ease-out_0ms_both]">
          <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
          {lang === "fr" ? "Édition" : "Edition"} N° 01
          <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
        </p>

        {/* Brand mark XL */}
        <p className="font-[var(--font-display)] text-[color:var(--color-cream)] text-7xl md:text-9xl lg:text-[10rem] font-extrabold tracking-[0.22em] leading-[0.95] pl-[0.22em] animate-[buteauScale_900ms_cubic-bezier(0.4,0,0.2,1)_200ms_both]">
          {config.brandName}
        </p>

        {/* Bronze line */}
        <span className="block w-16 h-px bg-[color:var(--color-bronze)] mx-auto my-8 animate-[buteauWidth_600ms_ease-out_900ms_both]" />

        {/* Tagline italic */}
        <p className="font-[var(--font-editorial)] italic text-[color:var(--color-cream)]/85 text-[clamp(1.25rem,2.5vw,1.875rem)] leading-tight animate-[buteauFadeUp_600ms_ease-out_1100ms_both]">
          {t("common.tagline")}
        </p>
      </div>
    </div>
  );
}
