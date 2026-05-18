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
    <section className="py-[clamp(3rem,7vw,6rem)] surface-cream">
      <Container size="md">
        <SectionHeading
          eyebrow={t("institutions.insurance.eyebrow")}
          title={t("institutions.insurance.title")}
          tone="bronze"
        />

        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Intro */}
          <p className="text-[clamp(1rem,1.4vw,1.125rem)] leading-relaxed text-[color:var(--color-navy-deep)]/85 text-center">
            {t("institutions.insurance.bodyP1")}
          </p>

          {/* Encadré Attention */}
          <div className="bg-[color:var(--color-cream-warm)] border-l-[3px] border-[color:var(--color-bronze)] p-[clamp(1.5rem,2.5vw,2rem)] space-y-4">
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
            <p className="text-[clamp(0.875rem,1.2vw,1rem)] leading-relaxed text-[color:var(--color-navy-deep)]/85">
              {t("institutions.insurance.attentionP1")}
            </p>
            <p className="text-[clamp(0.875rem,1.2vw,1rem)] leading-relaxed text-[color:var(--color-navy-deep)]/85">
              {t("institutions.insurance.attentionP2")}
            </p>
          </div>

          {/* Réassurance */}
          <p className="text-[clamp(0.875rem,1.2vw,1rem)] italic text-center text-[color:var(--color-taupe-dark)] pt-4">
            {t("institutions.reassurance")}
          </p>
        </div>
      </Container>
    </section>
  );
}
