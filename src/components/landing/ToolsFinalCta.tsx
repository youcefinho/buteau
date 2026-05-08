import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";

/**
 * CTA final propre a la page Outils — "Besoin d'accompagnement ?".
 * Different du CtaBlock generique (qui dit "Pret a structurer votre projet ?").
 */
export function ToolsFinalCta() {
  const { t } = useLanguage();

  return (
    <section className="relative py-24 md:py-28 surface-navy overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 34, 61, 0.88), rgba(16, 34, 61, 0.92)), url('https://i.imgur.com/Bw7Zyf4.jpg')",
        }}
        aria-hidden="true"
      />

      <Container size="md" className="relative">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <p className="eyebrow text-[color:var(--color-taupe)]">
            {t("tools.finalCta.eyebrow")}
          </p>
          <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.05em] leading-[1.1]">
            {t("tools.finalCta.title")}
          </h2>
          <div className="w-16 h-0.5 bg-[color:var(--color-bronze)] mx-auto" />
          <p className="text-base md:text-lg text-[color:var(--color-cream)]/85 italic font-light">
            {t("tools.finalCta.body")}
          </p>
          <div className="pt-4">
            <Link to="/" hash="contact" className="btn-bronze">
              {t("tools.finalCta.button")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
