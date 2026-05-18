import { Link } from "@tanstack/react-router";
import { Phone, Home as HomeIcon } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";
import { Container } from "@/components/layout/Container";

/**
 * Page 404 luxury éditoriale — "Égaré ?".
 *
 * Pourquoi NOVEL : pattern 404 minimaliste mais soigné. Cormorant italic XL
 * "404" en filigrane + recovery CTAs. Sensation magazine : on ne vous abandonne
 * pas, on vous remet sur la bonne page.
 */
export function NotFoundEditorial() {
  const { t } = useLanguage();

  return (
    <main
      id="main"
      className="min-h-screen surface-navy grain-overlay relative flex items-center overflow-hidden"
    >
      {/* "404" Cormorant italic gigantesque en filigrane */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/12 text-[18rem] sm:text-[24rem] md:text-[32rem] leading-none pointer-events-none select-none whitespace-nowrap"
      >
        404
      </span>

      {/* Vignette radial subtle */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(16, 34, 61, 0.55) 100%)",
        }}
        aria-hidden="true"
      />

      <Container size="md" className="relative py-[clamp(8rem,12vw,10rem)]">
        <div className="text-center max-w-2xl mx-auto">
          {/* Eyebrow encadré */}
          <p className="eyebrow text-[color:var(--color-taupe)] inline-flex items-center gap-3 mb-8 animate-[buteauFadeUp_700ms_ease-out_100ms_both]">
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            {t("notFound.eyebrow")}
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
          </p>

          {/* Titre principal Fraunces signature */}
          <h1 className="font-signature text-[color:var(--color-cream)] text-[clamp(1.875rem,4vw,3.25rem)] leading-[1.1] tracking-[-0.01em] mb-6 text-balance animate-[buteauFadeUp_800ms_ease-out_300ms_both]">
            {t("notFound.title")}
          </h1>

          {/* Bronze line */}
          <div className="w-12 h-px bg-[color:var(--color-bronze)] mx-auto mb-8 animate-[buteauWidth_700ms_ease-out_500ms_both]" />

          {/* Subtitle */}
          <p className="text-[clamp(1rem,1.4vw,1.125rem)] text-[color:var(--color-cream)]/80 leading-[1.6] mb-12 max-w-xl mx-auto text-pretty animate-[buteauFadeUp_700ms_ease-out_600ms_both]">
            {t("notFound.subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12 animate-[buteauFadeUp_700ms_ease-out_800ms_both]">
            <Link to="/" className="btn-bronze btn-shine inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-2">
                <HomeIcon size={14} aria-hidden="true" />
                {t("notFound.ctaHome")}
              </span>
            </Link>
            <a
              href={`tel:${config.phone.raw}`}
              className="group inline-flex items-center gap-2 font-[var(--font-display)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-cream)]"
            >
              <Phone size={14} aria-hidden="true" className="text-[color:var(--color-bronze)]" />
              <span className="relative">
                {t("notFound.ctaCall")}
                <span className="absolute left-0 -bottom-1 w-0 h-px bg-[color:var(--color-bronze)] group-hover:w-full transition-[width] duration-500" />
              </span>
              <span className="font-[var(--font-editorial)] italic text-[color:var(--color-taupe)] text-base normal-case tracking-normal ml-1">
                {config.phone.display}
              </span>
            </a>
          </div>

          {/* Footnote — ISSN-style code */}
          <p className="eyebrow text-[color:var(--color-taupe)]/50 text-[10px] animate-[buteauFadeUp_700ms_ease-out_1000ms_both]">
            {t("notFound.footnote")}
          </p>
        </div>
      </Container>
    </main>
  );
}
