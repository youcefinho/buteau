import { useEffect, useState, useCallback, useRef } from "react";
import { X, Phone, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";
import { config } from "@/lib/config";

/**
 * ExitIntent — modal rattrapage Équipe Buteau (édito navy + bronze).
 *
 * Trigger :
 *   - Desktop : souris sort par le haut (clientY <= 0) après 15s minimum
 *   - Mobile  : inactivité >= 60s (pas de mousemove possible)
 *   - Auto    : ouverture forcée à 90s si pas encore montré
 * Affiché UNE fois par session (sessionStorage gate). ESC ferme.
 * Respecte prefers-reduced-motion.
 */
const STORAGE_KEY = "buteau:exitintent-shown";
const DESKTOP_DELAY_MS = 15_000;
const AUTO_TIMER_MS = 90_000;
const MOBILE_INACTIVITY_MS = 60_000;

function alreadyShown(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markShown() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* sessionStorage indisponible */
  }
}

function scrollToContact() {
  if (typeof document === "undefined") return;
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ExitIntent() {
  const { t, lang } = useLanguage();
  const tr = translations[lang].exitIntent as {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    ctaCall: string;
    ctaContact: string;
    decline: string;
    close: string;
  };
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setOpen(false);
    markShown();
  }, []);

  // Armer après délai (évite faux positif au load)
  useEffect(() => {
    if (alreadyShown()) return;
    const id = setTimeout(() => setArmed(true), DESKTOP_DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  // Auto-fire après 90s si jamais déclenché autrement
  useEffect(() => {
    if (alreadyShown() || open) return;
    const id = setTimeout(() => {
      if (!alreadyShown()) {
        setOpen(true);
        markShown();
      }
    }, AUTO_TIMER_MS);
    return () => clearTimeout(id);
  }, [open]);

  // Desktop — souris quitte par le haut
  useEffect(() => {
    if (!armed || open || alreadyShown()) return;
    function onLeave(e: MouseEvent) {
      if (e.clientY <= 0 && e.relatedTarget === null) {
        setOpen(true);
        markShown();
      }
    }
    document.addEventListener("mouseleave", onLeave);
    return () => document.removeEventListener("mouseleave", onLeave);
  }, [armed, open]);

  // Mobile — inactivité prolongée
  useEffect(() => {
    if (!armed || open || alreadyShown()) return;
    const isCoarse = window.matchMedia?.("(pointer: coarse)").matches;
    if (!isCoarse) return;
    let last = Date.now();
    const reset = () => {
      last = Date.now();
    };
    const id = setInterval(() => {
      if (Date.now() - last > MOBILE_INACTIVITY_MS && document.hasFocus()) {
        setOpen(true);
        markShown();
      }
    }, 5000);
    window.addEventListener("scroll", reset, { passive: true });
    window.addEventListener("touchstart", reset, { passive: true });
    return () => {
      clearInterval(id);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("touchstart", reset);
    };
  }, [armed, open]);

  // ESC ferme
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function handleContactCta() {
    setOpen(false);
    markShown();
    setTimeout(scrollToContact, 200);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      className="fixed inset-0 z-[80] flex items-center justify-center px-4 animate-[buteauFadeUp_300ms_ease-out_both]"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[color:var(--color-navy-deep)]/85 backdrop-blur-sm"
        aria-hidden
      />

      {/* Modal — édito navy + bronze + Cormorant italic */}
      <div
        ref={boxRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[color:var(--color-navy)] border border-[color:var(--color-bronze)]/30 rounded-sm p-7 md:p-9 shadow-2xl animate-[buteauScale_400ms_cubic-bezier(0.4,0,0.2,1)_both]"
      >
        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          aria-label={tr.close}
          className="absolute top-3 right-3 w-9 h-9 inline-flex items-center justify-center rounded-full text-[color:var(--color-cream)]/55 hover:text-[color:var(--color-bronze)] hover:bg-[color:var(--color-navy-deep)]/60 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" strokeWidth={1.7} />
        </button>

        {/* Eyebrow tirets bronze */}
        <p className="inline-flex items-center gap-3 mb-5 text-xs uppercase tracking-[0.22em] text-[color:var(--color-bronze)]">
          <span className="inline-block w-6 h-px bg-[color:var(--color-bronze)]" />
          {tr.eyebrow}
          <span className="inline-block w-6 h-px bg-[color:var(--color-bronze)]" />
        </p>

        {/* Titre — Cormorant italic édito */}
        <h3
          id="exit-intent-title"
          className="font-[var(--font-editorial)] text-[color:var(--color-cream)] text-2xl md:text-3xl leading-[1.15] tracking-tight mb-3 text-balance"
        >
          {tr.title}{" "}
          <em className="italic text-[color:var(--color-bronze-soft)]">{tr.titleAccent}</em>
        </h3>

        {/* Filet bronze */}
        <div className="h-px w-12 bg-[color:var(--color-bronze)]/60 mb-5" aria-hidden />

        {/* Body */}
        <p className="text-sm text-[color:var(--color-cream)]/75 leading-relaxed mb-7">
          {tr.body}
        </p>

        {/* CTAs */}
        <div className="space-y-3">
          <a
            href={`tel:${config.phone.raw}`}
            onClick={handleClose}
            className="group w-full inline-flex items-center justify-center gap-2 py-3 rounded-sm bg-[color:var(--color-bronze)] text-[color:var(--color-cream)] font-semibold text-sm hover:bg-[color:var(--color-bronze-deep)] transition-all duration-300"
          >
            <Phone className="w-3.5 h-3.5" strokeWidth={1.8} />
            <span>
              {tr.ctaCall} · {config.phone.display}
            </span>
          </a>

          <button
            type="button"
            onClick={handleContactCta}
            className="group w-full inline-flex items-center justify-center gap-2 py-3 rounded-sm border border-[color:var(--color-bronze)]/35 text-[color:var(--color-cream)] font-medium text-sm hover:border-[color:var(--color-bronze)]/70 hover:bg-[color:var(--color-bronze)]/5 transition-all duration-300"
          >
            <span>{tr.ctaContact}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Decline subtle */}
        <button
          type="button"
          onClick={handleClose}
          className="mt-4 w-full py-2 text-xs text-[color:var(--color-cream)]/45 hover:text-[color:var(--color-cream)]/70 transition-colors"
        >
          {tr.decline}
        </button>
      </div>
    </div>
  );
}
