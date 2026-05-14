import { useLanguage } from "@/lib/LanguageContext";

/**
 * LanguageToggle — selecteur FR / EN editorial 2 boutons (refonte 2026-05-14).
 *
 * Pattern aligne sur EGSF/Gatineau/Serujan : 2 boutons visibles cote a cote,
 * langue active en bronze (couleur signature Buteau) + font display + size+1,
 * langue inactive en muted small caps. Separateur hairline ".".
 *
 * Persistance via LanguageProvider (clef buteau-lang). Pas de dropdown,
 * pas de flag — minimal editorial.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Selecteur de langue"
      className={`items-center gap-2 select-none shrink-0 whitespace-nowrap ${className || "inline-flex"}`}
    >
      <button
        type="button"
        onClick={() => setLang("fr")}
        aria-label="Francais"
        aria-pressed={lang === "fr"}
        className="font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] transition-colors max-md:min-h-[44px] max-md:min-w-[44px] inline-flex items-center justify-center"
        style={{
          color: lang === "fr" ? "var(--color-bronze-deep)" : "color-mix(in oklch, currentColor 55%, transparent)",
          fontSize: lang === "fr" ? "13px" : "11px",
          fontWeight: lang === "fr" ? 700 : 600,
        }}
      >
        FR
      </button>
      <span
        aria-hidden="true"
        className="text-[10px]"
        style={{
          color: "color-mix(in oklch, currentColor 35%, transparent)",
        }}
      >
        ·
      </span>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-label="English"
        aria-pressed={lang === "en"}
        className="font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] transition-colors max-md:min-h-[44px] max-md:min-w-[44px] inline-flex items-center justify-center"
        style={{
          color: lang === "en" ? "var(--color-bronze-deep)" : "color-mix(in oklch, currentColor 55%, transparent)",
          fontSize: lang === "en" ? "13px" : "11px",
          fontWeight: lang === "en" ? 700 : 600,
        }}
      >
        EN
      </button>
    </div>
  );
}
