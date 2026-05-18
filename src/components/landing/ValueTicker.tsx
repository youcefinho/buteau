import { useMemo } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { ta, translations } from "@/lib/translations";

/**
 * ValueTicker — bandeau scrolling éditorial avec valeurs vérifiées.
 *
 * Pourquoi : effet "live data" magazine sans inventer de chiffres.
 * Toutes les phrases sont des FAITS vérifiés (200 familles 2025, 9+ institutions,
 * tagline officielle, territoires desservis).
 *
 * Pattern : marquee CSS-only infinite scroll, deux copies du contenu pour
 * loop seamless. Police Cormorant italic XL pour cohérence édito magazine.
 *
 * Skills appliquées :
 * - intralys-edito-magazine : Cormorant italic + bronze accents + grain feel
 * - frontend-design : motion subtle CSS-only, pas de lib JS pour perf
 * - feedback_factualite_zero_invention : que des faits vérifiés depuis sources
 *   officielles (Planiprêt + Équipe Buteau site)
 */
export function ValueTicker() {
  const { lang } = useLanguage();
  const items = ta<string[]>(translations[lang], "home.valueTicker.items");

  // Memoized doubled array (fix LOW : pas recréé à chaque render)
  const doubled = useMemo(() => [...items, ...items], [items]);

  return (
    <section
      aria-label={lang === "fr" ? "Faits clés" : "Key facts"}
      className="relative bg-[color:var(--color-navy-deep)] border-y border-[color:var(--color-bronze)]/20 py-5 overflow-hidden group"
    >
      {/* Atmospheric continuity — embers per-section signature */}

      {/* Fade gauche/droite pour transition douce hors viewport */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[color:var(--color-navy-deep)] to-transparent z-10 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[color:var(--color-navy-deep)] to-transparent z-10 pointer-events-none"
      />

      {/* Marquee : translateX -50% sur le double, loop infinite 45s.
          Fix HIGH : pause au hover/focus pour permettre lecture (a11y + UX). */}
      <div className="flex animate-[ticker_45s_linear_infinite] whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
        {doubled.map((item, idx) => {
          // Fix HIGH a11y : la 2e copie (pour seamless loop) est aria-hidden
          // pour ne pas être lue 2 fois par les SR.
          const isClone = idx >= items.length;
          return (
            <span
              key={`${idx}-${item.slice(0, 12)}`}
              aria-hidden={isClone ? "true" : undefined}
              className="inline-flex items-center gap-6 px-8 font-[var(--font-editorial)] italic text-[color:var(--color-cream)]/90 text-[clamp(1rem,1.4vw,1.125rem)]"
            >
              <span>{item}</span>
              <span
                aria-hidden="true"
                className="text-[color:var(--color-bronze)] text-2xl select-none"
              >
                ❦
              </span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
