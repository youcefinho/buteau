import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { ta, translations } from "@/lib/translations";

/**
 * AdPage — pleine page éditoriale style "publicité magazine luxe" (Cereal vol.18).
 *
 * Pourquoi : entre 2 sections denses, insérer une page-respiration. UNE seule
 * phrase signature en Fraunces italic XL, beaucoup de vide, attribution discrète.
 * Crée du rythme + autorité (le luxe vrai chuchote).
 *
 * Pattern : pleine page navy deep, statement centré, filet bronze, attribution
 * en bas droite uppercase tracking. Inspiré couvertures intérieures Apartamento.
 *
 * Props pas requis — pioche dans translations.home.adPage par défaut.
 * Pour insérer une 2e AdPage avec un autre statement : passer `entryKey="adPage2"` etc.
 */
export function AdPage({ entryKey = "adPage" }: { entryKey?: string }) {
  const { lang } = useLanguage();
  const data = ta<{ statement: string; attribution: string }>(
    translations[lang],
    `home.${entryKey}`,
  );

  return (
    <section
      aria-label="Édition spéciale"
      className="relative surface-navy grain-overlay min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden"
    >
      {/* Filigrane « ¶ » pilcrow Cormorant — touche éditoriale typographique */}
      <span
        aria-hidden="true"
        className="absolute -top-12 -left-8 md:-left-16 font-[var(--font-editorial)] italic text-[color:var(--color-cream)]/[0.04] text-[18rem] md:text-[24rem] leading-none pointer-events-none select-none"
      >
        ¶
      </span>

      <Container size="lg" className="relative py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow magazine */}
          <p className="eyebrow text-[color:var(--color-taupe)] mb-10 inline-flex items-center gap-3">
            <span
              className="inline-block w-6 h-px bg-[color:var(--color-bronze)]"
              aria-hidden="true"
            />
            {lang === "fr" ? "Édition spéciale" : "Special edition"}
            <span
              className="inline-block w-6 h-px bg-[color:var(--color-bronze)]"
              aria-hidden="true"
            />
          </p>

          {/* Statement Fraunces italic XL — la "publicité" elle-même */}
          <p className="font-signature italic text-[color:var(--color-cream)] text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.1] tracking-[-0.01em] text-balance">
            « {data.statement} »
          </p>

          {/* Filet décoratif bronze */}
          <div
            className="mx-auto mt-12 h-px w-16 bg-[color:var(--color-bronze)]"
            aria-hidden="true"
          />

          {/* Attribution discrète */}
          <p className="mt-6 eyebrow text-[color:var(--color-taupe)]/80">
            — {data.attribution}
          </p>
        </div>
      </Container>
    </section>
  );
}
