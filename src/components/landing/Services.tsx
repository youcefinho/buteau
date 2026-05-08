import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { ta } from "@/lib/translations";
import { translations } from "@/lib/translations";

/**
 * Section Services — 4 cartes border-left taupe → bronze on hover.
 * Ref visuelle : Accueil.html lignes 1248-1283.
 */
export function Services() {
  const { t, lang } = useLanguage();
  const items = ta<Array<{ title: string; desc: string }>>(
    translations[lang],
    "home.services.items",
  );

  return (
    <section id="services" className="py-24 surface-cream">
      <Container size="lg">
        <SectionHeading
          eyebrow={t("home.services.eyebrow")}
          title={t("home.services.title")}
          tone="light"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {items.map((s, idx) => (
            <article
              key={idx}
              className="group bg-[color:var(--color-surface)] p-8 md:p-10 border-l-[3px] border-[color:var(--color-taupe)] transition-all duration-500 hover:border-l-[5px] hover:border-[color:var(--color-bronze)] hover:shadow-[0_8px_30px_rgba(16,34,61,0.12)] hover:translate-x-2 relative overflow-hidden"
            >
              <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[var(--tracking-eyebrow)] mb-3">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--color-navy-deep)]/85">
                {s.desc}
              </p>
              <span
                className="absolute bottom-0 left-0 h-0.5 bg-[color:var(--color-bronze)] w-0 group-hover:w-full transition-[width] duration-500"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
