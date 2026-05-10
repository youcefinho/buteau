import { BookOpen, BookMarked } from "lucide-react";
import { RisingBronzeEmbers } from "@/components/atmosphere/RisingBronzeEmbers";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { AutoGlossary } from "./AutoGlossary";
import { ta, translations } from "@/lib/translations";
import { useGlossary } from "@/lib/GlossaryContext";
import { useCarnet } from "@/lib/CarnetContext";

/**
 * Services Accueil — refonte DIAGONAL FLOW (audit frontend-design #2).
 *
 * Pourquoi NOVEL : break la grid 2x2 conventionnelle pour un layout en escalier
 * où chaque card est décalée horizontalement (pattern "cascading staircase").
 * Le visuel évoque une ouverture de magazine — chaque service est une "page"
 * qui s'enchaîne avec rythme.
 *
 * Structure : 4 cards empilées vertical (vs grid), chacune décalée :
 * - Card 1 : aligned left
 * - Card 2 : décalée 8% à droite
 * - Card 3 : décalée 16% à droite
 * - Card 4 : décalée 24% à droite
 *
 * Mobile : décalages ramenés à 0 (stack vertical clean).
 *
 * Chaque card : numéro romain XL filigrane à gauche débordant + titre Cormorant
 * + description Open Sans + ligne bronze qui s'étend au hover.
 */
export function Services() {
  const { t, lang } = useLanguage();
  const { open: openGlossary } = useGlossary();
  const { open: openCarnet } = useCarnet();
  const items = ta<Array<{ title: string; desc: string }>>(
    translations[lang],
    "home.services.items",
  );

  // Décalages staircase en classes Tailwind responsive (fix MEDIUM : avant <style> tag inline + sélecteur fragile #services > div > div > article:nth-child)
  // Tailwind v4 supporte arbitrary values + breakpoint md: → ml appliqué uniquement >= 768px
  const offsetClasses = [
    "md:ml-0",
    "md:ml-[5%]",
    "md:ml-[10%]",
    "md:ml-[15%]",
    "md:ml-[20%]",
  ];
  const numerals = ["I", "II", "III", "IV", "V"];

  return (
    <section id="services" className="relative py-24 md:py-32 surface-cream overflow-hidden dot-grid">
      {/* Atmospheric continuity — embers per-section signature */}
      <RisingBronzeEmbers count={5} tone="light" />

      <Container size="xl" className="relative">
        <SectionHeading
          eyebrow={t("home.services.eyebrow")}
          title={t("home.services.title")}
          tone="light"
        />

        {/* Cascading staircase — diagonal flow desktop via Tailwind arbitrary values */}
        <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto">
          {items.map((s, idx) => (
            <article
              key={s.title}
              className={`group relative bg-[color:var(--color-surface)] border-l-[3px] border-[color:var(--color-taupe)] transition-all duration-500 hover:border-l-[5px] hover:border-[color:var(--color-bronze)] hover:shadow-[0_18px_44px_-22px_rgba(16,34,61,0.32)] hover:-translate-y-1 overflow-hidden md:max-w-[78%] ${offsetClasses[idx] ?? ""}`}
            >
              {/* Numéro romain XL filigrane DEBORDANT à gauche (signature diagonal) */}
              <span
                aria-hidden="true"
                className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/15 text-[12rem] leading-none pointer-events-none select-none transition-colors duration-500 group-hover:text-[color:var(--color-bronze)]/25"
              >
                {numerals[idx]}
              </span>

              <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 p-7 md:p-10 md:pl-32">
                {/* Eyebrow + Title — col 5 */}
                <div className="md:col-span-5">
                  <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-3">
                    {numerals[idx]} — {lang === "fr" ? "Service" : "Service"}
                  </p>
                  <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-xl md:text-2xl uppercase tracking-[0.04em] leading-[1.1]">
                    {s.title}
                  </h3>
                  <div className="w-8 h-px bg-[color:var(--color-bronze)] mt-4 transition-[width] duration-500 group-hover:w-16" />
                </div>

                {/* Description — col 7. AutoGlossary wrap les termes hypothécaires détectés. */}
                <div className="md:col-span-7">
                  <p className="text-base md:text-lg leading-[1.6] text-[color:var(--color-navy-deep)]/80 font-[var(--font-editorial)] italic">
                    <AutoGlossary text={s.desc} maxWraps={2} />
                  </p>
                </div>
              </div>

              {/* Bottom underline qui s'étend au hover */}
              <span
                className="absolute bottom-0 left-0 h-px bg-[color:var(--color-bronze)] w-0 group-hover:w-full transition-[width] duration-500"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>

        {/* Footer ressources transversales — chaque service a son vocabulaire */}
        <div className="mt-16 max-w-4xl mx-auto pt-10 border-t border-[color:var(--color-taupe)]/40 text-center">
          <p className="font-[var(--font-editorial)] italic text-base md:text-lg text-[color:var(--color-navy-deep)]/80 mb-5">
            {lang === "fr"
              ? "Chaque service a son vocabulaire — APP, RAP, ratio, garantie."
              : "Each service has its vocabulary — FHSA, HBP, ratio, security."}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-sm">
            <button
              type="button"
              onClick={() => openGlossary()}
              className="text-glow-hover inline-flex items-center gap-2 font-[var(--font-editorial)] italic text-[color:var(--color-navy-deep)] cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[color:var(--color-bronze-deep)]" strokeWidth={1.5} aria-hidden />
              {lang === "fr" ? "Voir le lexique" : "View glossary"}
            </button>
            <span className="text-[color:var(--color-bronze)]/40 select-none hidden sm:inline" aria-hidden>·</span>
            <button
              type="button"
              onClick={openCarnet}
              className="text-glow-hover inline-flex items-center gap-2 font-[var(--font-editorial)] italic text-[color:var(--color-navy-deep)] cursor-pointer"
            >
              <BookMarked className="w-4 h-4 text-[color:var(--color-bronze-deep)]" strokeWidth={1.5} aria-hidden />
              {lang === "fr" ? "Carnet de l'emprunteur" : "Borrower notebook"}
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
