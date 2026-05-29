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
    <section id="methode" className="py-24 surface-cream">
      <Container size="lg">
        <SectionHeading
          eyebrow={t("team.method.eyebrow")}
          title={t("team.method.title")}
          subtitle={t("team.method.intro")}
          tone="bronze"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(3rem,5vw,4rem)] max-w-5xl mx-auto">
          {items.map((p, idx) => (
            <div key={idx} className="relative pt-[clamp(4rem,6vw,5rem)]">
              {/* Roman numeral filigrane — drop cap éditorial XL (audit P2-I) */}
              <span
                className="absolute -top-4 -left-2 md:-left-3 font-[var(--font-editorial)]  text-[color:var(--color-taupe)]/30 text-[8rem] md:text-[10rem] lg:text-[11rem] leading-[0.85] pointer-events-none select-none"
                aria-hidden="true"
              >
                {["01", "02", "03"][idx]}
              </span>

              {/* Label uppercase */}
              <h3 className="relative font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.25rem,1.8vw,1.5rem)] uppercase tracking-[0.06em] mb-4 text-balance">
                {p.label}
              </h3>

              {/* Signature line bronze */}
              <div className="w-12 h-px bg-[color:var(--color-bronze)] mb-5" />

              {/* Description */}
              <p className="text-[clamp(0.875rem,1.2vw,1rem)] leading-[1.6] text-[color:var(--color-navy-deep)]/80 text-pretty hyphens-auto">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
