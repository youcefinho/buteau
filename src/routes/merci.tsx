import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Calculator as CalcIcon, BookOpen, Home as HomeIcon } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useGlossary } from "@/lib/GlossaryContext";
import { useQuizTier } from "@/hooks/useQuizTier";
import { config } from "@/lib/config";
import { Container } from "@/components/layout/Container";
import { HeartbeatCta } from "@/components/layout/HeartbeatCta";
import { AnimatedSignature } from "@/components/landing/AnimatedSignature";
import { ta, translations } from "@/lib/translations";

/**
 * /merci — page de confirmation post-form, format éditorial luxury.
 *
 * Pourquoi NOVEL : pattern 404-luxury appliqué au confirmation, plus
 * personnalisation selon le tier du quiz pré-qualif (si fait). Le user voit
 * un message AJUSTÉ à son profil — primo / refi / investor / explorer.
 *
 * Synergie : 404 pattern × Quiz tier × AnimatedSignature × LegalPageWrap pattern.
 */
export const Route = createFileRoute("/merci")({
  component: MerciPage,
});

function MerciPage() {
  const { t, lang } = useLanguage();
  const { open: openGlossary } = useGlossary();
  const { tier } = useQuizTier();

  // /merci doit être noindex (post-form confirmation, pas de valeur SEO)
  // + retire de l'index si déjà cawlé. Set en runtime via meta dynamic.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // Message personnalisé selon le tier (si quiz fait)
  const tierMessage = tier
    ? ta<string>(translations[lang], `merci.tierMessages.${tier}`)
    : null;

  const today = new Date().toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main
      id="main"
      className="min-h-screen surface-cream relative flex items-center overflow-hidden"
    >
      {/* "M" Cormorant italic gigantesque en filigrane */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/12 text-[18rem] sm:text-[24rem] md:text-[32rem] leading-none pointer-events-none select-none"
      >
        M
      </span>

      <Container size="md" className="relative py-[clamp(5rem,11vw,10rem)]">
        <div className="max-w-3xl mx-auto">
          {/* Eyebrow encadré */}
          <p className="eyebrow text-[color:var(--color-taupe-dark)] inline-flex items-center gap-3 mb-8 animate-[buteauFadeUp_700ms_ease-out_100ms_both]">
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            {t("merci.eyebrow")}
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
          </p>

          {/* Title Fraunces signature XL */}
          <h1 className="font-signature text-[color:var(--color-navy-deep)] text-[clamp(3.75rem,9vw,7rem)] leading-[0.95] tracking-[-0.02em] mb-8 text-balance animate-[buteauFadeUp_900ms_ease-out_200ms_both]">
            {t("merci.title")}
          </h1>

          {/* Bronze line */}
          <div className="w-16 h-px bg-[color:var(--color-taupe-dark)] mb-8 animate-[buteauWidth_700ms_ease-out_500ms_both]" />

          {/* Subtitle */}
          <p className="italic text-[clamp(1.125rem,1.6vw,1.25rem)] text-[color:var(--color-navy-deep)]/85 leading-[1.65] mb-8 max-w-2xl text-pretty hyphens-auto animate-[buteauFadeUp_700ms_ease-out_600ms_both]">
            {t("merci.subtitle")}
          </p>

          {/* Tier-personalized message — si quiz fait */}
          {tierMessage && (
            <div className="mb-12 pl-[clamp(1.5rem,2.3vw,2rem)] border-l-2 border-[color:var(--color-taupe-dark)] animate-[buteauFadeUp_700ms_ease-out_750ms_both]">
              <p className="text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.6] text-[color:var(--color-navy-deep)]/85 text-pretty hyphens-auto">
                {tierMessage}
              </p>
            </div>
          )}

          {/* Signature animée */}
          <div className="mb-16 max-w-[280px] animate-[buteauFadeUp_700ms_ease-out_900ms_both]">
            <AnimatedSignature className="w-full h-auto" duration={2200} />
            <div className="mt-3 flex items-center gap-3">
              <span className="block w-8 h-px bg-[color:var(--color-taupe-dark)]" />
              <p className="eyebrow text-[color:var(--color-taupe-dark)]">
                Andrew Buteau
              </p>
            </div>
          </div>

          {/* Next steps — 3 liens éditoriaux */}
          <div className="space-y-6 animate-[buteauFadeUp_700ms_ease-out_1100ms_both]">
            <p className="eyebrow text-[color:var(--color-navy)] inline-flex items-center gap-3">
              <span className="inline-block w-6 h-px bg-[color:var(--color-taupe-dark)]" />
              {t("merci.nextStepsLabel")}
            </p>

            <ul className="space-y-3 max-w-md">
              <li>
                <HeartbeatCta className="cta-heartbeat--block">
                  <Link
                    to="/outils"
                    hash="calculateur"
                    className="group flex items-center gap-4 py-3 border-b border-[color:var(--color-taupe)]/30 hover:border-[color:var(--color-taupe-dark)] transition-colors"
                  >
                    <CalcIcon size={18} className="shrink-0 text-[color:var(--color-taupe-dark)]" aria-hidden="true" />
                    <span className="font-[var(--font-display)] text-base text-[color:var(--color-navy-deep)] group-hover:text-[color:var(--color-navy)] transition-colors">
                      {t("merci.nextStepCalc")}
                    </span>
                    <span aria-hidden="true" className="ml-auto text-[color:var(--color-taupe)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </Link>
                </HeartbeatCta>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openGlossary()}
                  className="group w-full flex items-center gap-4 py-3 border-b border-[color:var(--color-taupe)]/30 hover:border-[color:var(--color-taupe-dark)] transition-colors text-left"
                >
                  <BookOpen size={18} className="shrink-0 text-[color:var(--color-taupe-dark)]" aria-hidden="true" />
                  <span className="font-[var(--font-display)] text-base text-[color:var(--color-navy-deep)] group-hover:text-[color:var(--color-navy)] transition-colors">
                    {t("merci.nextStepLexique")}
                  </span>
                  <span aria-hidden="true" className="ml-auto text-[color:var(--color-taupe)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </button>
              </li>
              <li>
                <HeartbeatCta className="cta-heartbeat--block">
                  <Link
                    to="/"
                    className="group flex items-center gap-4 py-3 border-b border-[color:var(--color-taupe)]/30 hover:border-[color:var(--color-taupe-dark)] transition-colors"
                  >
                    <HomeIcon size={18} className="shrink-0 text-[color:var(--color-taupe-dark)]" aria-hidden="true" />
                    <span className="font-[var(--font-display)] text-base text-[color:var(--color-navy-deep)] group-hover:text-[color:var(--color-navy)] transition-colors">
                      {t("merci.nextStepBack")}
                    </span>
                    <span aria-hidden="true" className="ml-auto text-[color:var(--color-taupe)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </Link>
                </HeartbeatCta>
              </li>
            </ul>

            {/* Direct call CTA */}
            <a
              href={`tel:${config.phone.raw}`}
              className="inline-flex items-center gap-2.5 mt-8 group"
            >
              <Phone size={14} className="text-[color:var(--color-taupe-dark)]" aria-hidden="true" />
              <span className="italic text-[color:var(--color-navy-deep)] text-base group-hover:text-[color:var(--color-navy)] transition-colors">
                {lang === "fr" ? "Ou appelez directement" : "Or call directly"} —{" "}
                <span className="font-[var(--font-display)] not-italic font-semibold">
                  {config.phone.display}
                </span>
              </span>
            </a>
          </div>

          {/* Footnote ISSN-style */}
          <p className="eyebrow text-[color:var(--color-taupe)]/60 text-[10px] mt-16 animate-[buteauFadeUp_700ms_ease-out_1300ms_both]">
            {t("merci.footnote")} · {today}
          </p>
        </div>
      </Container>
    </main>
  );
}
