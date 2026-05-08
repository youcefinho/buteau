import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";

/**
 * Bloc CTA réutilisable — pattern "PRÊT À STRUCTURER VOTRE PROJET ?".
 * Surface navy + image overlay + titre uppercase + subtitle + bouton bronze.
 *
 * Réutilisé en bas de pages Équipe / Institutions / Outils.
 */
type CtaBlockProps = {
  bgImageUrl?: string;
};

export function CtaBlock({ bgImageUrl = "https://i.imgur.com/Bw7Zyf4.jpg" }: CtaBlockProps = {}) {
  const { t } = useLanguage();

  return (
    <section className="relative py-24 md:py-32 surface-navy overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(16, 34, 61, 0.88), rgba(16, 34, 61, 0.92)), url('${bgImageUrl}')`,
        }}
        aria-hidden="true"
      />

      <Container size="md" className="relative">
        <div className="text-center space-y-7 max-w-2xl mx-auto">
          <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.05em] leading-[1.1]">
            {t("cta.title")}
          </h2>
          <div className="w-16 h-0.5 bg-[color:var(--color-bronze)] mx-auto" />
          <p className="text-base md:text-lg text-[color:var(--color-cream)]/85 italic font-light">
            {t("cta.subtitle")}
          </p>
          <div className="pt-4">
            {/* Anchor vers la section #contact de l'Accueil (formulaire) */}
            <Link to="/" hash="contact" className="btn-bronze">
              {t("cta.button")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
