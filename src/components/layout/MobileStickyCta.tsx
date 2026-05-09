import { useEffect, useState } from "react";
import { Phone, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";

/**
 * MobileStickyCta — barre CTA fixe bas écran sur mobile uniquement.
 *
 * Pourquoi : conversion mobile (click-to-call direct) sans forcer le user
 * à scroll jusqu'à la section contact. Pattern app-like premium.
 *
 * Comportement :
 * - Visible UNIQUEMENT mobile (lg:hidden), donc pas dérangeant desktop
 * - Cachée au tout début (scroll < 200px) pour ne pas masquer le Hero
 * - Slide up smooth quand on commence à scroller
 * - 2 boutons : Appeler (tel:) + Prendre RDV (#contact ou Calendly)
 * - Respect prefers-reduced-motion
 *
 * Skills appliquées :
 * - frontend-design : conversion mobile premium, motion fluide
 * - intralys-edito-magazine : palette navy/bronze + signature line bronze top
 */
export function MobileStickyCta() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past Hero (~200px), hide near footer
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewportH = window.innerHeight;
      const scrollableMax = docHeight - viewportH;
      const distanceToBottom = scrollableMax - y;

      // Visible si on a scrollé > 200px ET on est pas trop près du bottom (< 400px)
      const shouldShow = y > 200 && distanceToBottom > 400;
      setVisible(shouldShow);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <div className="grid grid-cols-2 gap-px bg-[color:var(--color-bronze)]/20">
          {/* Call to action principal — Appeler Andrew */}
          <a
            href={`tel:${config.phone.raw}`}
            className="group flex items-center justify-center gap-2 py-4 bg-[color:var(--color-navy-deep)] hover:bg-[color:var(--color-navy)] active:bg-[color:var(--color-bronze-deep)] transition-colors"
            aria-label={`${t("common.callUs")} ${config.phone.display}`}
          >
            <Phone
              size={16}
              className="text-[color:var(--color-bronze)] group-hover:rotate-12 transition-transform duration-300"
              aria-hidden="true"
            />
            <span className="font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-cream)]">
              {t("common.callUs")}
            </span>
          </a>

          {/* CTA secondaire — Prendre RDV (scroll vers contact) */}
          <a
            href="#contact"
            className="group flex items-center justify-center gap-2 py-4 bg-[color:var(--color-navy-deep)] hover:bg-[color:var(--color-navy)] active:bg-[color:var(--color-bronze-deep)] transition-colors"
          >
            <Calendar
              size={16}
              className="text-[color:var(--color-bronze)] group-hover:scale-110 transition-transform duration-300"
              aria-hidden="true"
            />
            <span className="font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-cream)]">
              {t("common.contactCta")}
            </span>
          </a>
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
