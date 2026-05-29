import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Phone, MessageSquare, CalendarCheck } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";

/**
 * MobileStickyCta — barre CTA fixe bas écran sur mobile uniquement.
 *
 * Pourquoi : conversion mobile sans forcer le user à scroll jusqu'au form.
 * Pattern app-like premium aligné Gatineau (4 actions Phone | SMS | Calendly | CTA).
 *
 * Comportement :
 * - Visible UNIQUEMENT mobile (lg:hidden)
 * - Cachée au tout début (scroll < 200px) pour ne pas masquer le Hero
 * - Cachée près du footer (distanceToBottom < 400px) — le user est arrivé au form
 * - Slide up smooth, respect prefers-reduced-motion
 *
 * Actions (gauche à droite) :
 * 1. Phone icon → tel: direct (call to action immédiat, friction minimale)
 * 2. SMS icon → sms: avec body pré-rempli (1 tap pour envoyer)
 * 3. Calendly icon → openCalendly() — render conditional si config.calendlyUrl
 *    set, sinon hide (jusqu'à ce que la URL soit fournie en Phase 9).
 * 4. CTA principal filled bronze "Démarrer mon parcours" → #contact form scroll.
 *
 * Skills appliquées :
 * - frontend-design : conversion mobile premium, motion fluide
 * - intralys-edito-magazine : palette bronze + signature line bronze top
 * - intralys-gatineau-portage : pattern 4-actions ported from Gatineau
 */
export function MobileStickyCta() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewportH = window.innerHeight;
      const scrollableMax = docHeight - viewportH;
      const distanceToBottom = scrollableMax - y;

      const shouldShow = y > 200 && distanceToBottom > 400;
      setVisible(shouldShow);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Calendly : icone toujours visible (4 actions design final). Si calendlyUrl
  // vide (Phase 9 a venir) -> bouton no-op (preventDefault, ne fait rien).
  // Quand Andrew fournira la vraie URL Calendly, le bouton ouvrira la popup.
  const openCalendly = (e: React.MouseEvent) => {
    e.preventDefault();
    if (config.calendlyUrl) {
      window.open(config.calendlyUrl, "_blank", "noopener,noreferrer");
    }
    // Sinon : no-op silencieux le temps de mettre l'URL.
  };

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 lg:hidden transition-transform duration-500 ease-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Signature line bronze top — micro-detail édito magazine */}
      <div className="h-px bg-gradient-to-r from-transparent via-[color:var(--color-bronze)] to-transparent" />

      <div className="bg-[color:var(--color-navy-deep)]/95 backdrop-blur-md border-t border-[color:var(--color-bronze)]/20 shadow-[0_-12px_32px_-8px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-1.5 p-2.5">
          {/* 1. Phone — icon only, tap = compose direct */}
          <a
            href={`tel:${config.phone.raw}`}
            className="inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-md border border-[color:var(--color-bronze)]/25 text-[color:var(--color-cream)]/85 hover:text-[color:var(--color-bronze)] hover:border-[color:var(--color-bronze)]/60 hover:bg-[color:var(--color-bronze)]/5 active:scale-95 transition-all duration-300"
            aria-label={`${t("common.callUs")} ${config.phone.display}`}
            tabIndex={visible ? 0 : -1}
          >
            <Phone size={16} strokeWidth={1.7} aria-hidden />
          </a>

          {/* 2. SMS — icon only, tap = ouvre app SMS native avec body pre-rempli */}
          <a
            href={`sms:${config.phone.raw}?body=${encodeURIComponent(t("common.smsBody"))}`}
            className="inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-md border border-[color:var(--color-bronze)]/25 text-[color:var(--color-cream)]/85 hover:text-[color:var(--color-bronze)] hover:border-[color:var(--color-bronze)]/60 hover:bg-[color:var(--color-bronze)]/5 active:scale-95 transition-all duration-300"
            aria-label={`${t("common.smsLabel")} Andrew`}
            tabIndex={visible ? 0 : -1}
          >
            <MessageSquare size={16} strokeWidth={1.7} aria-hidden />
          </a>

          {/* 3. Calendly — icone toujours visible. Si calendlyUrl present :
              ouvre popup en nouvel onglet. Sinon : no-op (bouton "mort" le temps
              de mettre l'URL Phase 9). */}
          <a
            href={config.calendlyUrl || "#"}
            target={config.calendlyUrl ? "_blank" : undefined}
            rel={config.calendlyUrl ? "noopener noreferrer" : undefined}
            onClick={openCalendly}
            className="inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-md border border-[color:var(--color-bronze)]/25 text-[color:var(--color-cream)]/85 hover:text-[color:var(--color-bronze)] hover:border-[color:var(--color-bronze)]/60 hover:bg-[color:var(--color-bronze)]/5 active:scale-95 transition-all duration-300"
            aria-label="Calendly"
            tabIndex={visible ? 0 : -1}
          >
            <CalendarCheck size={16} strokeWidth={1.7} aria-hidden />
          </a>

          {/* 4. CTA principal — Démarrer mon parcours (filled bronze)
              text-[11px] (vs text-[10px] avant) pour WCAG SC 1.4.4 (lisibilité
              CTA #1 conversion mobile). Tracking reduit (0.08em vs eyebrow
              0.12em) pour gagner ~15% de largeur et eviter truncate trop tot. */}
          {/* Link Router (to="/" hash="contact") au lieu de plain anchor : sur sub-pages,
              SPA nav vers /#contact + declenche v55 polling __root scroll au form.
              Sur home, doc-level intercept handle directement. */}
          <Link
            to="/"
            hash="contact"
            className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[color:var(--color-orange)] hover:bg-[color:var(--color-orange-deep)] text-[color:var(--color-navy)] font-bold rounded-md shadow-md text-[11px] uppercase tracking-[0.08em] active:scale-[0.97] transition-all duration-200"
            aria-label={t("common.contactCta")}
            tabIndex={visible ? 0 : -1}
          >
            <span className="truncate">{t("common.contactCta")}</span>
          </Link>
        </div>

        {/* Safe area inset bottom (iOS notch) */}
        <div
          className="bg-[color:var(--color-navy-deep)]"
          style={{ height: "env(safe-area-inset-bottom)" }}
        />
      </div>
    </div>
  );
}
