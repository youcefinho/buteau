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
    <section className="py-24 surface-cream border-t border-[color:var(--color-border)]">
      <Container size="xl">
        <SectionHeading
          title={t("institutions.lendersSectionTitle")}
          tone="light"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {lenders.map((l, idx) => (
            <article
              key={idx}
              className="card-luxury p-7 flex flex-col items-center text-center"
            >
              {/* Logo */}
              <div className="h-20 flex items-center justify-center mb-5">
                <img
                  src={l.logo}
                  alt={l.name}
                  loading="lazy"
                  className="max-h-full max-w-[180px] w-auto object-contain"
                />
              </div>

              {/* Signature line bronze */}
              <div className="w-10 h-0.5 bg-[color:var(--color-bronze)] mb-4" aria-hidden="true" />

              {/* Nom */}
              <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[0.04em] mb-3">
                {l.name}
              </h3>

              {/* Adresse */}
              <address className="not-italic text-sm leading-relaxed text-[color:var(--color-navy-deep)]/85">
                {l.address}
                {l.city && (
                  <>
                    <br />
                    {l.city}
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
