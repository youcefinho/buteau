import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";

/**
 * Section "Notre Méthode" — 3 piliers (Collaboration / Analyse / Exécution)
 * sur surface cream, layout vertical éditorial avec numéros romains filigrane.
 */
export function TeamMethod() {
  const { t, lang } = useLanguage();
  const items = ta<Array<{ label: string; desc: string }>>(
    translations[lang],
    "team.method.items",
  );

  return (
    <section className="py-24 surface-cream">
      <Container size="lg">
        <SectionHeading
          eyebrow={t("team.method.eyebrow")}
          title={t("team.method.title")}
          subtitle={t("team.method.intro")}
          tone="bronze"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-5xl mx-auto">
          {items.map((p, idx) => (
            <div key={idx} className="relative pt-16 md:pt-20">
              {/* Roman numeral filigrane — drop cap éditorial XL (audit P2-I) */}
              <span
                className="absolute -top-4 -left-2 md:-left-3 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/30 text-[8rem] md:text-[10rem] lg:text-[11rem] leading-[0.85] pointer-events-none select-none"
                aria-hidden="true"
              >
                {["01", "02", "03"][idx]}
              </span>

              {/* Label uppercase */}
              <h3 className="relative font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-xl md:text-2xl uppercase tracking-[0.06em] mb-4">
                {p.label}
              </h3>

              {/* Signature line bronze */}
              <div className="w-12 h-px bg-[color:var(--color-bronze)] mb-5" />

              {/* Description */}
              <p className="text-sm md:text-base leading-[1.6] text-[color:var(--color-navy-deep)]/80">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
