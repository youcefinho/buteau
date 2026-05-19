import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";

/**
 * Bloc "Votre institution ne figure pas ?" — invitation a contacter un courtier.
 * Plus contenu/discret que CtaBlock standard. Surface cream, encadre taupe.
 */
export function InstitutionMissing() {
  const { t } = useLanguage();

  return (
    <section id="autre-institution" className="py-20 surface-cream">
      <Container size="md">
        <div className="bg-[color:var(--color-surface)] border-2 border-[color:var(--color-taupe)] p-[clamp(2.5rem,4vw,3rem)] text-center space-y-6">
          <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.25rem,1.8vw,1.5rem)] uppercase tracking-[0.04em] leading-snug text-balance">
            {t("institutions.missing.title")}
          </h3>
          <div className="w-12 h-0.5 bg-[color:var(--color-bronze)] mx-auto" />
          <p className="text-[clamp(1rem,1.4vw,1.125rem)] italic text-[color:var(--color-taupe-dark)] text-pretty">
            {t("institutions.missing.body")}
          </p>
          <div className="pt-2">
            <Link to="/" hash="contact" className="btn-bronze">
              {t("institutions.missing.cta")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
