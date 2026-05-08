import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";

/**
 * Grid 9 institutions financières avec leurs adresses (preuve d'assurance).
 * Pas un simple carousel logo — chaque carte montre logo + nom + adresse complete.
 */
export function LendersGrid() {
  const { t, lang } = useLanguage();
  const lenders = ta<Array<{ name: string; address: string; city: string; logo: string }>>(
    translations[lang],
    "institutions.lenders",
  );

  return (
    <section className="py-24 md:py-28 surface-cream border-t border-[color:var(--color-border)] relative overflow-hidden">
      {/* Filigrane decoratif numero romain V */}
      <span
        aria-hidden="true"
        className="absolute -top-12 left-1/2 -translate-x-1/2 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/10 text-[24rem] leading-none pointer-events-none select-none"
      >
        V
      </span>

      <Container size="xl" className="relative">
        <SectionHeading
          title={t("institutions.lendersSectionTitle")}
          tone="light"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-9">
          {lenders.map((l, idx) => (
            <article
              key={idx}
              className="group relative bg-[color:var(--color-surface)] border border-[color:var(--color-taupe)]/40 p-8 transition-all duration-500 hover:border-[color:var(--color-bronze)]/70 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(16,34,61,0.28)] flex flex-col"
            >
              {/* Numéro filigrane (01-09) */}
              <span
                aria-hidden="true"
                className="absolute top-4 right-5 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/30 text-4xl leading-none pointer-events-none select-none transition-colors duration-500 group-hover:text-[color:var(--color-bronze)]/40"
              >
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Logo (anchored top-left to align with numéro top-right) */}
              <div className="h-16 mb-6 flex items-center">
                <img
                  src={l.logo}
                  alt={l.name}
                  loading="lazy"
                  className="max-h-full max-w-[160px] w-auto object-contain filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                />
              </div>

              {/* Signature line bronze qui s'étend au hover */}
              <div className="w-8 h-px bg-[color:var(--color-bronze)] mb-4 transition-[width] duration-500 group-hover:w-14" />

              {/* Nom */}
              <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[0.04em] mb-3 leading-snug">
                {l.name}
              </h3>

              {/* Adresse italique éditoriale */}
              <address className="not-italic text-sm leading-[1.6] text-[color:var(--color-navy-deep)]/75 mt-auto">
                {l.address}
                {l.city && (
                  <>
                    <br />
                    <span className="text-[color:var(--color-taupe-dark)]">{l.city}</span>
                  </>
                )}
              </address>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
