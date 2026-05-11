import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useGlossary } from "@/lib/GlossaryContext";
import { glossary, type GlossaryTerm } from "@/lib/glossary";

/**
 * GlossaryHovercard — wraps un terme inline avec underline pointillée +
 * popover qui apparaît au hover/focus avec la définition + lien "Voir le lexique".
 *
 * Pourquoi NOVEL : aucun autre client Intralys n'a de hovercards de glossaire
 * (Gatineau a AutoGlossary inline + modal click). Ici l'utilisateur a la définition
 * INSTANT au hover (vs cliquer modal). Réduit la friction éducative.
 *
 * Usage : <GlossaryHovercard term="Mise de fonds">5%</GlossaryHovercard>
 *   ou auto-wrappé via <GlossaryAutoWrap>...</GlossaryAutoWrap>
 */
type GlossaryHovercardProps = {
  /** Slug ou label exact du terme dans le glossaire (matche term.fr ou term.en) */
  term: string;
  children: ReactNode;
};

export function GlossaryHovercard({ term, children }: GlossaryHovercardProps) {
  const { lang } = useLanguage();
  const { open } = useGlossary();
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLSpanElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);
  const id = useId();

  const matched = findTerm(term, lang);

  // Position du popover sous le trigger, centré
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const cardW = 320;
    let left = rect.left + rect.width / 2 - cardW / 2;
    const margin = 8;
    if (left < margin) left = margin;
    if (left + cardW > window.innerWidth - margin) {
      left = window.innerWidth - cardW - margin;
    }
    setCoords({
      left: left + window.scrollX,
      top: rect.bottom + window.scrollY + 8,
    });
  }, [isOpen]);

  // Close au scroll (threshold 80px pour éviter fermeture sur micro-scroll trackpad — fix MEDIUM)
  // ou keypress Escape
  useEffect(() => {
    if (!isOpen) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - lastY) > 80) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (!matched) {
    // Terme non trouvé — affiche le children sans hovercard
    return <>{children}</>;
  }

  return (
    <>
      <span
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-describedby={isOpen ? id : undefined}
        aria-label={`${matched.term[lang]} — ${lang === "fr" ? "voir dans le lexique" : "view in glossary"}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onClick={(e) => {
          // Click direct = ouvre modal avec query pré-remplie (label du terme).
          // Pattern aligné Mathis/Serujan/EG : modal + search bar pre-fill.
          // Le hover preview reste actif en parallèle pour preview rapide.
          // CRITICAL : stopPropagation + preventDefault pour ne pas declencher
          // un parent <Link>/<button> (GuidesShelf items sont dans Link vers /outils).
          e.stopPropagation();
          e.preventDefault();
          setIsOpen(false);
          open(matched.slug, matched.term[lang]);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen(false);
            open(matched.slug, matched.term[lang]);
          }
        }}
        className="relative cursor-pointer underline decoration-[color:var(--color-bronze)] decoration-dotted underline-offset-[3px] decoration-[1.5px] hover:text-[color:var(--color-bronze-deep)] transition-colors"
      >
        {children}
      </span>

      {isOpen && coords && (
        <span
          ref={cardRef}
          id={id}
          role="tooltip"
          style={{
            position: "absolute",
            left: coords.left,
            top: coords.top,
            width: 320,
            zIndex: 50,
          }}
          className="block bg-[color:var(--color-cream)] border border-[color:var(--color-taupe)]/60 shadow-[0_18px_40px_-18px_rgba(16,34,61,0.35)] p-5 animate-[buteauFadeUp_220ms_ease-out_both]"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <span className="block font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-sm uppercase tracking-[0.04em] mb-2">
            {matched.term[lang]}
          </span>
          <span className="block w-8 h-px bg-[color:var(--color-bronze)] mb-3" />
          <span className="block text-xs leading-[1.55] text-[color:var(--color-navy-deep)]/85">
            {matched.definition[lang]}
          </span>
          {matched.source && (
            <span className="block eyebrow text-[color:var(--color-taupe-dark)] mt-3">
              Source : {matched.source}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              open(matched.slug);
              setIsOpen(false);
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-[var(--font-display)] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-bronze-deep)] hover:text-[color:var(--color-bronze)] transition-colors"
          >
            {lang === "fr" ? "Voir tout le lexique" : "Open full glossary"} →
          </button>
        </span>
      )}
    </>
  );
}

/**
 * Helper : recherche un terme dans le glossaire par label fr OU en (case-insensitive).
 */
function findTerm(label: string, lang: "fr" | "en"): GlossaryTerm | null {
  const norm = label.toLowerCase().trim();
  for (const g of glossary) {
    if (g.term[lang].toLowerCase() === norm) return g;
    if (g.term.fr.toLowerCase() === norm) return g;
    if (g.term.en.toLowerCase() === norm) return g;
    if (g.term.fr_alt?.some((alt) => alt.toLowerCase() === norm)) return g;
    if (g.slug.toLowerCase() === norm) return g;
  }
  return null;
}
