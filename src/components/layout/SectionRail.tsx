import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * SectionRail — navigation latérale fixée à gauche (desktop only).
 *
 * Pattern : table-of-contents éditorial magazine, dots cliquables + labels
 * Cormorant . Gros cercles pour les sections principales (chapitres),
 * mini cercles pour les sous-sections. Active section tracking via
 * IntersectionObserver. Smooth scroll vers la section au click.
 *
 * Visuel signature :
 * - Spine verticale taupe derrière les dots (chapter index magazine).
 * - Slide-in mount animation (depuis -16px gauche, opacity 0 -> 1).
 * - Tooltip pédagogique chaque visite (visible 5s a 1.8s apres mount).
 *
 * Position : fixed left-6 top-1/2 -translate-y-1/2, visible lg+ (≥1024px).
 * Mobile/tablet : caché (espace écran trop précieux).
 */

export type SectionType = "main" | "sub";

export type SectionEntry = {
  id: string;
  type: SectionType;
  label: { fr: string; en: string };
};

// Sections de la home — exportée pour réutilisation dans routes/index.tsx
export const HOME_SECTIONS: ReadonlyArray<SectionEntry> = [
  { id: "hero", type: "main", label: { fr: "Accueil", en: "Home" } },
  { id: "partenaires", type: "sub", label: { fr: "Partenaires", en: "Partners" } },
  { id: "equipe", type: "sub", label: { fr: "L'équipe", en: "The team" } },
  { id: "lettre", type: "sub", label: { fr: "Andrew", en: "Andrew" } },
  { id: "services", type: "main", label: { fr: "Services", en: "Services" } },
  { id: "calculateur", type: "main", label: { fr: "Calculateur", en: "Calculator" } },
  { id: "journal-preview", type: "sub", label: { fr: "Articles", en: "Articles" } },
  { id: "outils-teaser", type: "sub", label: { fr: "Outils", en: "Tools" } },
  { id: "mission", type: "main", label: { fr: "Mission", en: "Mission" } },
  { id: "prequalification", type: "sub", label: { fr: "Quiz", en: "Quiz" } },
  { id: "avis", type: "main", label: { fr: "Témoignages", en: "Reviews" } },
  { id: "territoire", type: "sub", label: { fr: "Territoire", en: "Territory" } },
  { id: "contact", type: "main", label: { fr: "Contact", en: "Contact" } },
  { id: "faq", type: "sub", label: { fr: "FAQ", en: "FAQ" } },
];

type SectionRailProps = {
  /** Liste des sections à afficher dans la rail. Defaults à HOME_SECTIONS. */
  sections?: ReadonlyArray<SectionEntry>;
};

export function SectionRail({ sections = HOME_SECTIONS }: SectionRailProps = {}) {
  const { lang } = useLanguage();
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const [mounted, setMounted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  // Wave luminescente — boolean qui declenche cascade bronze a travers les dots
  // (1x sur appearance, 1x re-trigger a mid-life pour effet attention double)
  const [waveKey, setWaveKey] = useState(0);
  // Après l'intro (tooltip "cliquez ici"), le rail se réduit aux points seuls ;
  // les labels n'apparaissent qu'au survol de la souris (demande client 2026-05-29).
  const [collapsed, setCollapsed] = useState(false);

  // Slide-in animation au mount (delay 800ms, puis fade-in 600ms)
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  // Tooltip pédagogique — visible 5s a chaque visite (user feedback 2026-05-20 : "on le vois plus").
  // Wave luminescente declenche a t=0 (appearance) et t=2.5s (mid-life).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const showTimer = window.setTimeout(() => {
      setShowHint(true);
      setWaveKey((k) => k + 1);
    }, 1800);
    const wave2Timer = window.setTimeout(() => {
      setWaveKey((k) => k + 1);
    }, 1800 + 2500);
    const hideTimer = window.setTimeout(() => {
      setShowHint(false);
      setCollapsed(true);
    }, 6800);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(wave2Timer);
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
    sections.forEach((s) => {
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
  }, [sections]);

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
      className={`group/rail hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3.5 pointer-events-none transition-all duration-700 ease-out ${
        mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      }`}
    >
      {/* Spine verticale — chapter index magazine, ligne fine taupe derrière les dots.
          Positionnée à x=6px (centre des dot containers w-3 = 12px). */}
      <span
        aria-hidden="true"
        className="absolute left-[5.5px] top-3 bottom-3 w-px bg-[color:var(--color-taupe)]/30 pointer-events-none"
      />

      {sections.map((s, index) => {
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
                key={`${s.id}-wave-${waveKey}`}
                aria-hidden="true"
                style={{ animationDelay: `${index * 70}ms` }}
                className={`block rounded-full transition-all duration-300 motion-safe:animate-[sectionRailDotWave_900ms_ease-out_both] ${
                  isMain ? "w-3 h-3" : "w-1.5 h-1.5"
                } ${
                  isActive
                    ? "bg-[color:var(--color-orange)] shadow-[0_0_0_3px_oklch(0.667_0.224_37/0.20)]"
                    : "bg-[color:var(--color-taupe)]/45 group-hover:bg-[color:var(--color-bronze)]"
                }`}
              />
            </span>

            {/* Label — taille différente selon type.
                Visibilité : masqué tant que la souris n'est pas sur le rail
                (collapse → group-hover/rail), demande client 2026-05-29.
                Hover individuel : scale-110 origin-left (zoom magnétique) +
                passage au bronze sur le label pointé. Actif = orange. */}
            <span
              className={`transition-all duration-300 whitespace-nowrap origin-left group-hover:scale-110 ${
                isMain ? "text-base" : "text-xs"
              } ${
                collapsed
                  ? "opacity-0 -translate-x-2 group-hover/rail:opacity-100 group-hover/rail:translate-x-0"
                  : "opacity-100 translate-x-0"
              } ${
                isActive
                  ? "text-[color:var(--color-orange)]"
                  : "text-[color:var(--color-taupe-dark)] group-hover:text-[color:var(--color-bronze)]"
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
          Float subtil en boucle + shimmer gradient bronze sweep traversant
          le fond navy (effet lettre prestige magazine). */}
      <div
        role="status"
        aria-live="polite"
        style={
          showHint
            ? {
                background:
                  "linear-gradient(110deg, oklch(0.252 0.067 256) 0%, oklch(0.252 0.067 256) 35%, oklch(0.704 0.077 56 / 0.45) 50%, oklch(0.252 0.067 256) 65%, oklch(0.252 0.067 256) 100%)",
                backgroundSize: "220% 100%",
              }
            : undefined
        }
        className={`pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-6 px-3.5 py-2 text-[color:var(--color-cream)] text-sm rounded-md whitespace-nowrap shadow-[0_8px_24px_-12px_rgba(16,34,61,0.6)] transition-all duration-400 ${
          showHint
            ? "opacity-100 translate-x-0 motion-safe:animate-[sectionRailHintFloat_3.2s_ease-in-out_infinite,sectionRailHintShimmer_2.8s_linear_infinite]"
            : "opacity-0 -translate-x-3 invisible bg-[color:var(--color-navy-deep)]"
        }`}
      >
        {/* Chevrons cascade pointant vers la rail (right -> left wave).
            Le chevron le plus proche du tooltip s'allume en premier (delay 0),
            puis cascade vers la gauche (rail). Stagger 180ms entre chaque. */}
        <span
          aria-hidden="true"
          className="absolute right-full top-1/2 -translate-y-1/2 mr-1.5 inline-flex items-center gap-0"
        >
          <ChevronLeft
            size={16}
            strokeWidth={2.5}
            style={{ animationDelay: "360ms" }}
            className="text-[color:var(--color-taupe)] opacity-25 motion-safe:animate-[sectionRailChevronWave_1.4s_ease-in-out_infinite]"
          />
          <ChevronLeft
            size={16}
            strokeWidth={2.5}
            style={{ animationDelay: "180ms" }}
            className="-ml-2 text-[color:var(--color-taupe)] opacity-25 motion-safe:animate-[sectionRailChevronWave_1.4s_ease-in-out_infinite]"
          />
          <ChevronLeft
            size={16}
            strokeWidth={2.5}
            style={{ animationDelay: "0ms" }}
            className="-ml-2 text-[color:var(--color-taupe)] opacity-25 motion-safe:animate-[sectionRailChevronWave_1.4s_ease-in-out_infinite]"
          />
        </span>
        {lang === "fr"
          ? "Cliquez pour naviguer entre les sections"
          : "Click to jump between sections"}
      </div>
    </nav>
  );
}
