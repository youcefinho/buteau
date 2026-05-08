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
          tone="light"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 max-w-5xl mx-auto">
          {items.map((p, idx) => (
            <div key={idx} className="relative pt-12">
              {/* Roman numeral filigrane */}
              <span
                className="absolute -top-2 left-0 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)] text-7xl md:text-8xl leading-none opacity-30 pointer-events-none select-none"
                aria-hidden="true"
              >
                {["I", "II", "III"][idx]}
              </span>

              {/* Label uppercase */}
              <h3 className="relative font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-xl md:text-2xl uppercase tracking-[0.06em] mb-4">
                {p.label}
              </h3>

              {/* Signature line bronze */}
              <div className="w-12 h-0.5 bg-[color:var(--color-bronze)] mb-5" />

              {/* Description */}
              <p className="text-sm md:text-base leading-relaxed text-[color:var(--color-navy-deep)]/85">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
