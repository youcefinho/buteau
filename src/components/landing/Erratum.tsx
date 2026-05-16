import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";

/**
 * Erratum — encart humour signature en pied de page (style Apartamento / Cereal).
 *
 * Pourquoi : touche éditoriale qui humanise sans se prendre au sérieux. Présent
 * uniquement sur l'Accueil (pas sur les pages secondaires) pour rester signature
 * et ne pas devenir un running gag fatigant.
 *
 * Pattern visuel : bordure double-filet, eyebrow uppercase, body Cormorant italic,
 * signature droite "— La direction". Discret mais reconnaissable.
 */
export function Erratum() {
  const { t } = useLanguage();

  return (
    <section
      aria-labelledby="errata-heading"
      className="relative py-16 md:py-20 surface-cream overflow-hidden"
    >
      {/* Atmospheric continuity — embers per-section signature */}

      <Container size="lg" className="relative">
        <div className="max-w-2xl mx-auto">
          {/* Double filet — top */}
          <div
            className="h-px bg-[color:var(--color-taupe)]/40 mb-2"
            aria-hidden="true"
          />
          <div
            className="h-px bg-[color:var(--color-taupe)]/40 mb-8"
            aria-hidden="true"
          />

          <p
            id="errata-heading"
            className="eyebrow text-[color:var(--color-bronze-deep)] mb-5 text-center"
          >
            {t("home.errata.eyebrow")}
          </p>

          <p className="font-[var(--font-editorial)] italic text-[color:var(--color-navy-deep)]/85 text-base md:text-lg leading-[1.7] text-center">
            {t("home.errata.body")}
          </p>

          <p className="text-center mt-6 eyebrow text-[color:var(--color-taupe-dark)]">
            {t("home.errata.signature")}
          </p>

          {/* Double filet — bottom */}
          <div
            className="h-px bg-[color:var(--color-taupe)]/40 mt-8 mb-2"
            aria-hidden="true"
          />
          <div
            className="h-px bg-[color:var(--color-taupe)]/40"
            aria-hidden="true"
          />
        </div>
      </Container>
    </section>
  );
}
