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
    <section className="relative py-[clamp(4rem,10vw,9rem)] surface-navy overflow-hidden grain-overlay">
      {/* Background image avec overlay tonal — image visible */}
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(16, 34, 61, 0.78) 0%, rgba(16, 34, 61, 0.88) 100%), url('${bgImageUrl}')`,
        }}
        aria-hidden="true"
      />

      {/* Filigrane "buteau" Cormorant gigantesque en arriere-plan */}
      <span
        aria-hidden="true"
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/8 text-[18rem] md:text-[24rem] leading-none whitespace-nowrap pointer-events-none select-none"
      >
        buteau.
      </span>

      <Container size="md" className="relative">
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          {/* Eyebrow ligne taupe encadrée */}
          <p className="eyebrow text-[color:var(--color-taupe)] inline-flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            {t("cta.eyebrow")}
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
          </p>

          <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-[clamp(1.875rem,5vw,3.5rem)] uppercase tracking-[0.04em] leading-[1.05] text-balance">
            {t("cta.title")}
          </h2>

          <div className="w-16 h-px bg-[color:var(--color-bronze)] mx-auto" />

          <p className="font-[var(--font-editorial)] italic text-[clamp(1rem,1.4vw,1.125rem)] text-[color:var(--color-cream)]/85 leading-[1.5] text-pretty">
            {t("cta.subtitle")}
          </p>

          <div className="pt-2">
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
