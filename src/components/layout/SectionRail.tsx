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
  { id: "calc-preview", type: "main", label: { fr: "Calculateur", en: "Calculator" } },
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

  useEffect(() => {
    // IntersectionObserver détecte quelle section est centrée dans le viewport.
    // rootMargin -40%/-40% = zone d'intérêt = milieu vertical de l'écran.
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
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    // Update URL hash sans déclencher de scroll natif additionnel
    if (typeof window.history.replaceState === "function") {
      window.history.replaceState(null, "", `#${id}`);
    }
  }

  return (
    <nav
      aria-label={lang === "fr" ? "Navigation des sections" : "Section navigation"}
      className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-2.5 pointer-events-none"
    >
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
            className="group pointer-events-auto inline-flex items-center gap-3 py-1 transition-colors"
          >
            {/* Cercle — taille différente selon type (main/sub) */}
            <span
              aria-hidden="true"
              className={`block rounded-full shrink-0 transition-all duration-300 ${
                isMain ? "w-2.5 h-2.5" : "w-1.5 h-1.5"
              } ${
                isActive
                  ? "bg-[color:var(--color-bronze)] shadow-[0_0_0_3px_oklch(0.704_0.077_56/0.18)]"
                  : "bg-[color:var(--color-taupe)]/45 group-hover:bg-[color:var(--color-bronze)]"
              }`}
            />

            {/* Label Cormorant italic — taille différente selon type */}
            <span
              className={`font-[var(--font-editorial)] italic transition-all duration-300 whitespace-nowrap ${
                isMain ? "text-sm" : "text-xs"
              } ${
                isActive
                  ? "text-[color:var(--color-bronze)] opacity-100"
                  : "text-[color:var(--color-taupe-dark)] opacity-70 group-hover:opacity-100 group-hover:text-[color:var(--color-bronze)]"
              }`}
            >
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
