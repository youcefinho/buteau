import { Link } from "@tanstack/react-router";
import { Cookie } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useCookieConsent } from "@/hooks/useCookieConsent";

/**
 * CookieBanner — Loi 25 art. 23 Quebec.
 *
 * Boutons d'EGALE visibilite (Loi 25 art. 23 alinea 4) :
 *   - Accepter tout
 *   - Refuser tout
 *   - En savoir plus → /confidentialite
 * Pas de "X" qui ferme silencieusement (l'absence de choix = refus par défaut, mais
 * la banner reste visible jusqu'à choix explicite).
 *
 * Cf. skill `intralys-consent-loi25` pour la doctrine complete.
 */
export function CookieBanner() {
  const { t } = useLanguage();
  const { showBanner, acceptAll, refuseAll } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <>
      {/* Audit UI-D fix : spacer pour compenser la hauteur de la banner cookie sur mobile,
          sinon elle chevauche le contenu (notamment le formulaire de contact en bas de l'Accueil). */}
      <div aria-hidden="true" className="h-[260px] md:h-[160px] pointer-events-none" />
      <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-body"
      className="fixed inset-x-0 bottom-0 z-[60] bg-[color:var(--color-navy)] border-t-2 border-[color:var(--color-taupe-dark)] shadow-2xl"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 md:py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-8">
          {/* Icon + Text cluster */}
          <div className="flex items-start gap-4 flex-1">
            <Cookie
              size={28}
              className="shrink-0 text-[color:var(--color-taupe-dark)] mt-1"
              aria-hidden="true"
            />
            <div className="space-y-2">
              <h2
                id="cookie-banner-title"
                className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-sm uppercase tracking-[0.06em]"
              >
                {t("cookies.title")}
              </h2>
              <p
                id="cookie-banner-body"
                className="text-[clamp(0.75rem,1.1vw,0.875rem)] leading-relaxed text-[color:var(--color-cream)]/85 max-w-3xl text-pretty"
              >
                {t("cookies.body")}{" "}
                <Link
                  to="/confidentialite"
                  className="underline underline-offset-2 hover:text-[color:var(--color-taupe-light)]"
                >
                  {t("cookies.learnMore")}
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Boutons d'EGALE visibilite — meme taille, meme style, meme prominence */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={refuseAll}
              className="px-6 py-3 font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] border border-[color:var(--color-cream)]/40 text-[color:var(--color-cream)] hover:bg-[color:var(--color-cream)]/10 transition-colors"
            >
              {t("cookies.refuse")}
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="px-6 py-3 font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] bg-[color:var(--color-taupe-dark)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-navy)] transition-colors"
            >
              {t("cookies.accept")}
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
