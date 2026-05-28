import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

// ═══════════════════════════════════════════════════════════
// PoweredByIntralys — pill "Creation fierement quebecoise signee INTRALYS"
// Cliquable -> https://intralys.net/. Inspire roynakhal.com signature.
// Composants : SVG inline 3 barres Intralys + wording + icone external link.
// Placement : coin bas-droit des calculateurs + sections API live + footer global.
// Style : pill discret backdrop-blur, hover lift + couleurs brand bronze Buteau.
// Bilingue FR/EN via useLanguage() — Buteau utilise pattern `lang === "fr" ? X : Y`
// (le t() du projet attend des paths string, pas un objet {fr,en}).
// ═══════════════════════════════════════════════════════════

type Props = {
  className?: string;
  /** Variant pour Footer global : plus subtil, sans pill background. */
  variant?: "pill" | "inline";
};

// Logo 3 barres Intralys (orange + bleu clair + bleu vif) - SVG inline portable.
function IntralysMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 30 22"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="0" y="11" width="7" height="11" rx="0.5" fill="#F5A02C" />
      <rect x="11" y="5" width="7" height="17" rx="0.5" fill="#BDDFEF" />
      <rect x="22" y="0" width="7" height="22" rx="0.5" fill="#26A6E8" />
    </svg>
  );
}

export function PoweredByIntralys({ className = "", variant = "pill" }: Props) {
  const { lang } = useLanguage();

  const text = lang === "fr"
    ? "Création fièrement québécoise signée"
    : "Proudly Quebec creation by";

  const ariaLabel = lang === "fr" ? "Site réalisé par Intralys" : "Site built by Intralys";

  if (variant === "inline") {
    // Footer global : ligne inline minimaliste, sans background pill.
    return (
      <div className={`flex justify-center items-center gap-2 ${className}`}>
        <a
          href="https://intralys.net/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-taupe)] hover:text-[color:var(--color-bronze)] transition-colors"
        >
          <span>{text}</span>
          <IntralysMark className="w-4 h-3" />
          <span className="font-bold tracking-[0.2em] text-[color:var(--color-bronze)]">INTRALYS</span>
          <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
        </a>
      </div>
    );
  }

  // Pill (defaut) : coin bas-droit calculateurs + API live.
  return (
    <div className={`flex justify-end mt-4 ${className}`}>
      <a
        href="https://intralys.net/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[color:var(--color-bronze)]/20 bg-[color:var(--color-cream)]/60 backdrop-blur-sm text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-taupe-dark)] hover:border-[color:var(--color-bronze)]/50 hover:text-[color:var(--color-bronze)] hover:bg-[color:var(--color-cream)]/90 hover:-translate-y-0.5 transition-all"
      >
        <span>{text}</span>
        <IntralysMark className="w-4 h-3 shrink-0" />
        <span className="font-bold tracking-[0.18em] text-[color:var(--color-bronze)]">INTRALYS</span>
        <ArrowUpRight className="w-3 h-3 text-[color:var(--color-bronze)]/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
      </a>
    </div>
  );
}
