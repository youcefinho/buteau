import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { HeartbeatCta } from "@/components/layout/HeartbeatCta";

/**
 * CTA final propre a la page Outils — "Besoin d'accompagnement ?".
 * Different du CtaBlock generique (qui dit "Pret a structurer votre projet ?").
 */
export function ToolsFinalCta() {
  const { t } = useLanguage();

  return (
    <section id="contact-cta" className="relative py-[clamp(4rem,9vw,8rem)] surface-navy overflow-hidden grain-overlay">
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(16, 34, 61, 0.76) 0%, rgba(16, 34, 61, 0.88) 100%), image-set(url('/texture-navy-fixed.avif') type('image/avif'), url('/texture-navy-fixed.webp') type('image/webp'), url('/texture-navy-fixed.jpg'))",
        }}
        aria-hidden="true"
      />

      {/* Filigrane editorial */}
      <span
        aria-hidden="true"
        className="absolute -bottom-10 right-0 font-[family-name:var(--font-editorial)]  text-[color:var(--color-taupe)]/8 text-[18rem] leading-none pointer-events-none select-none"
      >
        ?
      </span>

      <Container size="md" className="relative">
        <div className="text-center space-y-7 max-w-2xl mx-auto">
          <p className="eyebrow text-[color:var(--color-bronze)] inline-flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-[color:var(--color-orange)]" />
            {t("tools.finalCta.eyebrow")}
            <span className="inline-block w-6 h-px bg-[color:var(--color-orange)]" />
          </p>

          <h2 className="font-[family-name:var(--font-display)] font-bold text-[color:var(--color-cream)] text-[clamp(1.875rem,5vw,3.5rem)] uppercase tracking-[0.04em] leading-[1.05] text-balance">
            {t("tools.finalCta.title")}
          </h2>

          <div className="w-16 h-px bg-[color:var(--color-bronze)] mx-auto" />

          <p className=" text-[clamp(1rem,1.4vw,1.125rem)] text-[color:var(--color-cream)]/85 leading-[1.5] text-pretty">
            {t("tools.finalCta.body")}
          </p>

          <div className="pt-2">
            <HeartbeatCta>
              <Link to="/" hash="contact" className="btn-bronze cta-sheen">
                {t("tools.finalCta.button")}
              </Link>
            </HeartbeatCta>
          </div>
        </div>
      </Container>
    </section>
  );
}
