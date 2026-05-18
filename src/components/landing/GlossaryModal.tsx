import { useEffect, useMemo, useRef, useState } from "react";
import { X, ArrowRight, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { useGlossary } from "@/lib/GlossaryContext";
import { glossary } from "@/lib/glossary";

/**
 * GlossaryModal — affiche les termes hypothécaires dans une fenetre modale.
 *
 * - Search bar pré-remplie avec le terme cliqué (initialQuery du context).
 * - Filtre la liste en live selon le query (label fr/en + fr_alt + definition).
 * - Scroll auto vers le terme exact si selectedSlug fourni + match query.
 * - Trap focus + Escape pour fermer.
 * - Mobile : pleine hauteur. Desktop : 900px max width.
 */
export function GlossaryModal() {
  const { lang } = useLanguage();
  const { isOpen, selectedSlug, initialQuery, close } = useGlossary();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [query, setQuery] = useState<string>(initialQuery);

  // Reset query quand initialQuery change (nouveau click sur un autre terme).
  useEffect(() => {
    if (isOpen) setQuery(initialQuery);
  }, [isOpen, initialQuery]);

  // Filtre la liste selon la query (label fr/en + fr_alt + definition contiennent query).
  const filteredGlossary = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return glossary;
    return glossary.filter((g) => {
      if (g.term[lang].toLowerCase().includes(q)) return true;
      if (g.term.fr.toLowerCase().includes(q)) return true;
      if (g.term.en.toLowerCase().includes(q)) return true;
      if (g.term.fr_alt?.some((alt) => alt.toLowerCase().includes(q))) return true;
      if (g.definition[lang].toLowerCase().includes(q)) return true;
      return false;
    });
  }, [query, lang]);

  // Scrolle au terme sélectionné dès l'ouverture (si il est dans le filtre actif).
  useEffect(() => {
    if (!isOpen || !selectedSlug || !containerRef.current) return;
    const t = window.setTimeout(() => {
      const el = containerRef.current?.querySelector(`#term-${selectedSlug}`);
      if (el instanceof HTMLElement) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
    return () => window.clearTimeout(t);
  }, [isOpen, selectedSlug, filteredGlossary]);

  // Escape pour fermer + focus trap reel + restore focus + body scroll lock.
  // Audit HI-02 fix : avant on n'avait qu'un focus initial, le Tab s'echappait du modal.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const FOCUSABLE_SELECTOR =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const container = containerRef.current;
      if (!container) return;
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute("inert"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      // Restore focus a l'element qui avait declenche l'ouverture (WCAG 2.4.3)
      previouslyFocused?.focus?.();
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="glossary-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-0 md:p-6 bg-[color:var(--color-navy-deep)]/80 backdrop-blur-sm"
      onClick={(e) => {
        // close on backdrop click only
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={containerRef}
        className="relative bg-[color:var(--color-cream)] w-full max-w-3xl max-h-[100vh] md:max-h-[88vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-[clamp(1.5rem,3vw,2.5rem)] py-5 bg-[color:var(--color-cream)] border-b border-[color:var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="eyebrow text-[color:var(--color-taupe-dark)]">
                {lang === "fr" ? "Lexique" : "Glossary"}
              </p>
              <h2
                id="glossary-title"
                className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.25rem,1.8vw,1.5rem)] uppercase tracking-[0.04em] text-balance"
              >
                {lang === "fr" ? "Termes hypothécaires" : "Mortgage terminology"}
              </h2>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={close}
              aria-label={lang === "fr" ? "Fermer le lexique" : "Close glossary"}
              className="p-2 -mr-2 text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-bronze-deep)] transition-colors"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>
          {/* Search bar — pré-remplie avec le terme cliqué (initialQuery du context). */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-taupe-dark)] pointer-events-none"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "fr" ? "Rechercher un terme..." : "Search a term..."}
              aria-label={lang === "fr" ? "Rechercher un terme" : "Search a term"}
              className="w-full pl-10 pr-4 py-2.5 bg-[color:var(--color-surface)] border border-[color:var(--color-taupe)]/50 rounded-sm text-[color:var(--color-navy-deep)] placeholder:text-[color:var(--color-taupe-dark)] focus:outline-none focus:border-[color:var(--color-bronze)] transition-colors"
            />
          </div>
        </div>

        {/* Body — list of terms (filtered by query) */}
        <div className="px-[clamp(1.5rem,3vw,2.5rem)] py-8 space-y-8">
          {filteredGlossary.length === 0 && (
            <p className="text-center font-[var(--font-editorial)] italic text-sm text-[color:var(--color-taupe-dark)] py-8">
              {lang === "fr"
                ? `Aucun terme ne correspond à "${query}".`
                : `No term matches "${query}".`}
            </p>
          )}
          {filteredGlossary.map((g) => (
            <article id={`term-${g.slug}`} key={g.slug} className="scroll-mt-24">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-lg uppercase tracking-[0.04em] text-balance">
                  {g.term[lang]}
                </h3>
                {g.term.fr_alt && lang === "fr" && (
                  <span className="text-xs italic text-[color:var(--color-taupe-dark)]">
                    {g.term.fr_alt.join(", ")}
                  </span>
                )}
              </div>
              <div className="w-8 h-0.5 bg-[color:var(--color-bronze)] my-3" />
              <p className="text-sm leading-relaxed text-[color:var(--color-navy-deep)]/85 text-pretty hyphens-auto">
                {g.definition[lang]}
              </p>
              {g.source && (
                <p className="eyebrow text-[color:var(--color-taupe-dark)] mt-3">
                  {lang === "fr" ? "Source" : "Source"} : {g.source}
                </p>
              )}
            </article>
          ))}

          {/* CTA bas de modal — block premium vers /lexique (pattern Carnet/Colophon) */}
          <div className="pt-8 mt-4 border-t border-[color:var(--color-taupe)]/40">
            <Link
              to="/lexique"
              onClick={close}
              className="group flex items-center justify-between gap-4 p-5 rounded-sm bg-[color:var(--color-bronze)]/8 border border-[color:var(--color-bronze)]/30 hover:bg-[color:var(--color-bronze)]/15 hover:border-[color:var(--color-bronze)]/55 transition-all"
            >
              <div>
                <div className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-bronze-deep)] font-bold mb-1">
                  {lang === "fr" ? "Voir le lexique complet" : "See the full glossary"}
                </div>
                <div className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[0.04em]">
                  {lang === "fr"
                    ? "Le lexique hypothécaire — version éditoriale"
                    : "Mortgage glossary — editorial version"}
                </div>
              </div>
              <ArrowRight
                className="w-4 h-4 text-[color:var(--color-bronze-deep)]/70 group-hover:text-[color:var(--color-bronze-deep)] group-hover:translate-x-0.5 transition-all shrink-0"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
