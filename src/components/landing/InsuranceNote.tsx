import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";

/**
 * Section info "Preuves d'assurance habitation valide".
 * Layout : intro paragraphe + encadré "Attention" avec icône.
 */
export function InsuranceNote() {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-24 surface-cream">
      <Container size="md">
        <SectionHeading
          eyebrow={t("institutions.insurance.eyebrow")}
          title={t("institutions.insurance.title")}
          tone="light"
        />

        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Intro */}
          <p className="text-base md:text-lg leading-relaxed text-[color:var(--color-navy-deep)]/85 text-center">
            {t("institutions.insurance.bodyP1")}
          </p>

          {/* Encadré Attention */}
          <div className="bg-[color:var(--color-cream-warm)] border-l-[3px] border-[color:var(--color-bronze)] p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle
                size={20}
                className="text-[color:var(--color-bronze)] shrink-0"
                aria-hidden="true"
              />
              <p className="eyebrow text-[color:var(--color-bronze-deep)]">
                {t("institutions.insurance.attentionLabel")}
              </p>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-[color:var(--color-navy-deep)]/85">
              {t("institutions.insurance.attentionP1")}
            </p>
            <p className="text-sm md:text-base leading-relaxed text-[color:var(--color-navy-deep)]/85">
              {t("institutions.insurance.attentionP2")}
            </p>
          </div>

          {/* Réassurance */}
          <p className="text-sm md:text-base italic text-center text-[color:var(--color-taupe-dark)] pt-4">
            {t("institutions.reassurance")}
          </p>
        </div>
      </Container>
    </section>
  );
}
