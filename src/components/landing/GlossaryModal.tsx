import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useGlossary } from "@/lib/GlossaryContext";
import { glossary } from "@/lib/glossary";

/**
 * GlossaryModal — affiche les 14 termes hypothécaires dans une fenetre modale.
 *
 * - Trap focus dans la modal (a11y).
 * - Escape pour fermer.
 * - Si selectedSlug fourni, scrolle au terme dès l'ouverture.
 * - Mobile : pleine hauteur. Desktop : 900px max width.
 */
export function GlossaryModal() {
  const { lang } = useLanguage();
  const { isOpen, selectedSlug, close } = useGlossary();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Scrolle au terme sélectionné dès l'ouverture.
  useEffect(() => {
    if (!isOpen || !selectedSlug || !containerRef.current) return;
    const t = window.setTimeout(() => {
      const el = containerRef.current?.querySelector(`#term-${selectedSlug}`);
      if (el instanceof HTMLElement) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
    return () => window.clearTimeout(t);
  }, [isOpen, selectedSlug]);

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
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-10 py-5 bg-[color:var(--color-cream)] border-b border-[color:var(--color-border)]">
          <div>
            <p className="eyebrow text-[color:var(--color-taupe-dark)]">
              {lang === "fr" ? "Lexique" : "Glossary"}
            </p>
            <h2
              id="glossary-title"
              className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-xl md:text-2xl uppercase tracking-[0.04em]"
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

        {/* Body — list of terms */}
        <div className="px-6 md:px-10 py-8 space-y-8">
          {glossary.map((g) => (
            <article id={`term-${g.slug}`} key={g.slug} className="scroll-mt-24">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-lg uppercase tracking-[0.04em]">
                  {g.term[lang]}
                </h3>
                {g.term.fr_alt && lang === "fr" && (
                  <span className="text-xs italic text-[color:var(--color-taupe-dark)]">
                    {g.term.fr_alt.join(", ")}
                  </span>
                )}
              </div>
              <div className="w-8 h-0.5 bg-[color:var(--color-bronze)] my-3" />
              <p className="text-sm leading-relaxed text-[color:var(--color-navy-deep)]/85">
                {g.definition[lang]}
              </p>
              {g.source && (
                <p className="eyebrow text-[color:var(--color-taupe-dark)] mt-3">
                  {lang === "fr" ? "Source" : "Source"} : {g.source}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
