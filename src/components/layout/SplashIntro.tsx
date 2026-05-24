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
  const { t } = useLanguage();
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
        {/* Monogramme medaillon "B" — premier element (sceau magazine).
            Anime en fade+scale au delay 0ms, AVANT le BUTEAU mark. */}
        <div className="flex items-center justify-center mb-8 animate-[buteauScale_700ms_cubic-bezier(0.4,0,0.2,1)_0ms_both]">
          <svg
            width="68"
            height="68"
            viewBox="0 0 56 56"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Cercle medaillon hairline bronze (sceau de cire vintage) */}
            <circle cx="28" cy="28" r="22" fill="none" stroke="var(--color-taupe-dark)" strokeWidth="0.8" opacity="0.7" />
            {/* Arc interieur depth */}
            <circle cx="28" cy="28" r="19.5" fill="none" stroke="var(--color-taupe-dark)" strokeWidth="0.4" opacity="0.4" />
            {/* "B" du logo officiel - scale 0.13 (occupe le medaillon) */}
            <g transform="translate(28, 28) scale(0.13) translate(-235, -705)">
              <path
                d="M321.781,756.962C321.781,769.003 318.609,779.084 312.267,787.203C305.925,795.322 297.404,801.468 286.703,805.641C276.002,809.815 264.21,811.901 251.324,811.901L147.853,811.901L147.853,598.109L263.966,598.109C274.004,598.109 282.686,600.769 290.013,606.089C297.34,611.408 302.961,618.261 306.875,626.647C310.79,635.033 312.747,643.742 312.747,652.776C312.747,662.882 310.143,672.53 304.935,681.721C299.726,690.911 292.092,697.769 282.033,702.295C294.279,705.909 303.965,712.389 311.091,721.736C318.217,731.083 321.781,742.825 321.781,756.962ZM192.433,636.247L192.433,686.303L245.001,686.303C249.317,686.303 253.24,685.335 256.77,683.398C260.3,681.461 263.16,678.615 265.35,674.861C267.539,671.106 268.634,666.572 268.634,661.259C268.634,655.986 267.668,651.523 265.735,647.869C263.803,644.214 261.2,641.364 257.925,639.317C254.651,637.271 250.945,636.247 246.808,636.247L192.433,636.247ZM276.566,748.149C276.566,743.19 275.555,738.705 273.532,734.693C271.508,730.682 268.787,727.469 265.368,725.055C261.95,722.642 257.971,721.435 253.432,721.435L192.433,721.435L192.433,774.097L251.324,774.097C256.064,774.097 260.344,772.946 264.164,770.644C267.984,768.341 271.007,765.235 273.23,761.323C275.454,757.412 276.566,753.021 276.566,748.149Z"
                fill="var(--color-cream)"
              />
            </g>
          </svg>
        </div>

        {/* Brand mark XL */}
        <p className="font-[var(--font-display)] text-[color:var(--color-cream)] text-7xl md:text-9xl lg:text-[10rem] font-extrabold tracking-[0.22em] leading-[0.95] pl-[0.22em] animate-[buteauScale_900ms_cubic-bezier(0.4,0,0.2,1)_400ms_both]">
          {config.brandName}
        </p>

        {/* Bronze line */}
        <span className="block w-16 h-px bg-[color:var(--color-taupe-dark)] mx-auto my-8 animate-[buteauWidth_600ms_ease-out_1100ms_both]" />

        {/* Tagline italic */}
        <p className="italic text-[color:var(--color-cream)]/85 text-[clamp(1.25rem,2.5vw,1.875rem)] leading-tight animate-[buteauFadeUp_600ms_ease-out_1300ms_both]">
          {t("common.tagline")}
        </p>
      </div>
    </div>
  );
}
