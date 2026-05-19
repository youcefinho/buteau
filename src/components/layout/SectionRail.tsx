import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * SectionRail — navigation latérale fixée à gauche (desktop only).
 *
 * Pattern : table-of-contents éditorial magazine, dots cliquables + labels
 * Cormorant italic. Gros cercles pour les sections principales (chapitres),
 * mini cercles pour les sous-sections. Active section tracking via
 * IntersectionObserver. Smooth scroll vers la section au click.
 *
 * Visuel signature :
 * - Spine verticale taupe derrière les dots (chapter index magazine).
 * - Slide-in mount animation (depuis -16px gauche, opacity 0 -> 1).
 * - Tooltip pédagogique 1ère visite (sessionStorage gate, visible 5s).
 *
 * Position : fixed left-6 top-1/2 -translate-y-1/2, visible lg+ (≥1024px).
 * Mobile/tablet : caché (espace écran trop précieux).
 */

type SectionType = "main" | "sub";

type SectionEntry = {
  id: string;
  type: SectionType;
  label: { fr: string; en: string };
};

// Ordre exact correspond au scroll du `routes/index.tsx`
const SECTIONS: ReadonlyArray<SectionEntry> = [
  { id: "hero", type: "main", label: { fr: "Accueil", en: "Home" } },
  { id: "partenaires", type: "sub", label: { fr: "Partenaires", en: "Partners" } },
  { id: "equipe", type: "sub", label: { fr: "L'équipe", en: "The team" } },
  { id: "services", type: "main", label: { fr: "Services", en: "Services" } },
  { id: "calculateur", type: "main", label: { fr: "Calculateur", en: "Calculator" } },
  { id: "journal-preview", type: "sub", label: { fr: "Journal", en: "Journal" } },
  { id: "outils-teaser", type: "sub", label: { fr: "Outils", en: "Tools" } },
  { id: "mission", type: "main", label: { fr: "Mission", en: "Mission" } },
  { id: "lettre", type: "sub", label: { fr: "Andrew", en: "Andrew" } },
  { id: "prequalification", type: "sub", label: { fr: "Quiz", en: "Quiz" } },
  { id: "avis", type: "main", label: { fr: "Témoignages", en: "Reviews" } },
  { id: "territoire", type: "sub", label: { fr: "Territoire", en: "Territory" } },
  { id: "contact", type: "main", label: { fr: "Contact", en: "Contact" } },
  { id: "faq", type: "sub", label: { fr: "FAQ", en: "FAQ" } },
];

export function SectionRail() {
  const { lang } = useLanguage();
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [mounted, setMounted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Slide-in animation au mount (delay 800ms, puis fade-in 600ms)
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  // Tooltip pédagogique — apparait a chaque refresh, visible 5s
  useEffect(() => {
    if (typeof window === "undefined") return;
    const showTimer = window.setTimeout(() => setShowHint(true), 1800);
    const hideTimer = window.setTimeout(() => setShowHint(false), 6800);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  // IntersectionObserver détecte quelle section est centrée dans le viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    const observed: Element[] = [];
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) {
        observer.observe(el);
        observed.push(el);
      }
    });

    return () => {
      observed.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    if (showHint) setShowHint(false);
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    if (typeof window.history.replaceState === "function") {
      window.history.replaceState(null, "", `#${id}`);
    }
  }

  return (
    <nav
      aria-label={lang === "fr" ? "Navigation des sections" : "Section navigation"}
      className={`hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3.5 pointer-events-none transition-all duration-700 ease-out ${
        mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      }`}
    >
      {/* Spine verticale — chapter index magazine, ligne fine taupe derrière les dots.
          Positionnée à x=6px (centre des dot containers w-3 = 12px). */}
      <span
        aria-hidden="true"
        className="absolute left-[5.5px] top-3 bottom-3 w-px bg-[color:var(--color-taupe)]/30 pointer-events-none"
      />

      {SECTIONS.map((s) => {
        const isActive = activeId === s.id;
        const isMain = s.type === "main";
        const label = lang === "fr" ? s.label.fr : s.label.en;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => handleClick(e, s.id)}
            aria-current={isActive ? "true" : undefined}
            className="group pointer-events-auto relative inline-flex items-center gap-3 py-1 transition-colors"
          >
            {/* Dot container fixed-width — assure que centres des dots s'alignent
                pile sur la spine verticale (sinon main 12px vs sub 6px desalignerait). */}
            <span className="w-3 flex justify-center shrink-0 relative z-10">
              <span
                aria-hidden="true"
                className={`block rounded-full transition-all duration-300 ${
                  isMain ? "w-3 h-3" : "w-1.5 h-1.5"
                } ${
                  isActive
                    ? "bg-[color:var(--color-bronze)] shadow-[0_0_0_3px_oklch(0.704_0.077_56/0.18)] motion-safe:animate-[sectionRailActivePulse_2.2s_ease-in-out_infinite]"
                    : "bg-[color:var(--color-taupe)]/45 group-hover:bg-[color:var(--color-bronze)]"
                }`}
              />
            </span>

            {/* Label Cormorant italic — taille différente selon type */}
            <span
              className={`font-[var(--font-editorial)] italic transition-all duration-300 whitespace-nowrap ${
                isMain ? "text-base" : "text-xs"
              } ${
                isActive
                  ? "text-[color:var(--color-bronze)] opacity-100"
                  : "text-[color:var(--color-taupe-dark)] opacity-70 group-hover:opacity-100 group-hover:text-[color:var(--color-bronze)]"
              }`}
            >
              {label}
            </span>

            {/* Hairline bronze à droite du label, visible uniquement quand actif */}
            <span
              aria-hidden="true"
              className={`block h-px bg-[color:var(--color-bronze)] transition-all duration-300 ${
                isActive ? "w-4 ml-1 opacity-100" : "w-0 ml-0 opacity-0"
              }`}
            />
          </a>
        );
      })}

      {/* Tooltip pédagogique — apparait a chaque refresh, visible 5s.
          Float subtil en boucle (translateY +/-2px) pour attirer l'oeil sans agresser. */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-6 px-3.5 py-2 bg-[color:var(--color-navy-deep)] text-[color:var(--color-cream)] font-[var(--font-editorial)] italic text-sm rounded-md whitespace-nowrap shadow-[0_8px_24px_-12px_rgba(16,34,61,0.6)] transition-all duration-400 ${
          showHint
            ? "opacity-100 translate-x-0 motion-safe:animate-[sectionRailHintFloat_3.2s_ease-in-out_infinite]"
            : "opacity-0 -translate-x-3 invisible"
        }`}
      >
        {/* Petite flèche pointant vers la rail à gauche */}
        <span
          aria-hidden="true"
          className="absolute right-full top-1/2 -translate-y-1/2 border-y-[6px] border-r-[8px] border-y-transparent border-r-[color:var(--color-navy-deep)]"
        />
        {lang === "fr"
          ? "Cliquez pour naviguer entre les sections"
          : "Click to jump between sections"}
      </div>
    </nav>
  );
}
