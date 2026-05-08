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
              {/* Numéro romain filigrane top-right (rythme avec Mission/TeamMethod) */}
              <span
                aria-hidden="true"
                className="absolute top-3 right-5 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/25 text-5xl md:text-6xl leading-none pointer-events-none select-none transition-colors duration-500 group-hover:text-[color:var(--color-bronze)]/35"
              >
                {["I", "II", "III", "IV"][idx]}
              </span>

              <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base md:text-lg uppercase tracking-[var(--tracking-eyebrow)] mb-3 pr-12 leading-snug">
                {s.title}
              </h3>

              {/* Signature line bronze qui s'étend au hover */}
              <div className="w-8 h-px bg-[color:var(--color-bronze)] mb-4 transition-[width] duration-500 group-hover:w-14" />

              <p className="text-sm leading-[1.6] text-[color:var(--color-navy-deep)]/80">
                {s.desc}
              </p>

              <span
                className="absolute bottom-0 left-0 h-px bg-[color:var(--color-bronze)] w-0 group-hover:w-full transition-[width] duration-500"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
