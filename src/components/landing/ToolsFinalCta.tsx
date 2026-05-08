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
    <section className="relative py-24 md:py-32 surface-navy overflow-hidden grain-overlay">
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(16, 34, 61, 0.76) 0%, rgba(16, 34, 61, 0.88) 100%), url('https://i.imgur.com/Bw7Zyf4.jpg')",
        }}
        aria-hidden="true"
      />

      {/* Filigrane editorial */}
      <span
        aria-hidden="true"
        className="absolute -bottom-10 right-0 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/8 text-[18rem] leading-none pointer-events-none select-none"
      >
        ?
      </span>

      <Container size="md" className="relative">
        <div className="text-center space-y-7 max-w-2xl mx-auto">
          <p className="eyebrow text-[color:var(--color-taupe)] inline-flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            {t("tools.finalCta.eyebrow")}
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
          </p>

          <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-3xl md:text-5xl lg:text-[3.5rem] uppercase tracking-[0.04em] leading-[1.05]">
            {t("tools.finalCta.title")}
          </h2>

          <div className="w-16 h-px bg-[color:var(--color-bronze)] mx-auto" />

          <p className="font-[var(--font-editorial)] italic text-base md:text-lg text-[color:var(--color-cream)]/85 leading-[1.5]">
            {t("tools.finalCta.body")}
          </p>

          <div className="pt-2">
            <Link to="/" hash="contact" className="btn-bronze">
              {t("tools.finalCta.button")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
