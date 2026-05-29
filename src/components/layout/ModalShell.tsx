import { useEffect, useRef, type ReactNode } from "react";
import { X, Printer } from "lucide-react";

/**
 * ModalShell — boilerplate modal réutilisable (focus trap + Escape + body lock + restore focus).
 *
 * Pattern factorisé depuis GlossaryModal pour ColophonModal et CarnetModal.
 * - Trap focus (WCAG 2.4.3)
 * - Escape ferme
 * - Body scroll lock
 * - Restore focus au trigger à la fermeture
 * - Backdrop click ferme
 *
 * Le children reçoit le viewport scrollable. Header sticky avec eyebrow + titre + close.
 */
type ModalShellProps = {
  isOpen: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  closeLabel: string;
  ariaLabelledById: string;
  children: ReactNode;
  /** Largeur max desktop. Défaut max-w-3xl. */
  maxWidth?: string;
  /** Si true, affiche un bouton Imprimer dans le header (Phase 4). */
  printable?: boolean;
  /** Label du bouton Imprimer (i18n). */
  printLabel?: string;
};

export function ModalShell({
  isOpen,
  onClose,
  eyebrow,
  title,
  closeLabel,
  ariaLabelledById,
  children,
  maxWidth = "max-w-3xl",
  printable = false,
  printLabel = "Imprimer",
}: ModalShellProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const FOCUSABLE_SELECTOR =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
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
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledById}
      className="fixed inset-0 z-[70] flex items-center justify-center p-0 md:p-6 bg-[color:var(--color-navy-deep)]/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={containerRef}
        className={`relative bg-[color:var(--color-cream)] w-full ${maxWidth} max-h-[100vh] md:max-h-[88vh] overflow-y-auto shadow-2xl`}
      >
        {/* Header sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-[clamp(1.5rem,3vw,2.5rem)] py-5 bg-[color:var(--color-cream)] border-b border-[color:var(--color-border)]">
          <div>
            <p className="eyebrow text-[color:var(--color-taupe-dark)]">{eyebrow}</p>
            <h2
              id={ariaLabelledById}
              className="font-[family-name:var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.25rem,1.8vw,1.5rem)] uppercase tracking-[0.04em] text-balance"
            >
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {printable && (
              <button
                type="button"
                onClick={() => window.print()}
                aria-label={printLabel}
                title={printLabel}
                className="p-2 text-[color:var(--color-bronze)] hover:text-[color:var(--color-navy)] transition-colors"
              >
                <Printer size={20} aria-hidden="true" />
              </button>
            )}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="p-2 -mr-2 text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-navy)] transition-colors"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Body scrollable */}
        <div className="px-[clamp(1.5rem,3vw,2.5rem)] py-8">{children}</div>
      </div>
    </div>
  );
}
