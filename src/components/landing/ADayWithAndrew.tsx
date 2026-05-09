import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { ta, translations } from "@/lib/translations";

/**
 * ADayWithAndrew — section storytelling "Une journée avec Andrew".
 *
 * Pourquoi NOVEL : aucun courtier hypothécaire ne fait ça. Format timeline
 * éditoriale magazine (vertical zigzag) qui humanise Andrew au-delà du dossier
 * de prêt. 6 moments-clés d'une journée type, format vintage magazine.
 *
 * Skills appliquées :
 * - intralys-sections-edito-templates : timeline 12 mois pattern adapté en zigzag
 * - intralys-edito-magazine : chiffres filigrane Cormorant + signature lines bronze
 *   + dropcap sur 1er moment + alternance gauche/droite asymétrique
 * - frontend-design : moment "wow" via stagger reveal au scroll + filigrane heure XL
 * - copywriting : storytelling concret "café 6h" → "famille 19h" (specificity)
 *
 * Layout : 6 moments empilés vertical, chaque moment grid 12 cols asymétrique.
 * Heure en filigrane Cormorant XL en marge alternée gauche/droite.
 */
export function ADayWithAndrew() {
  const { t, lang } = useLanguage();
  const moments = ta<Array<{ time: string; title: string; body: string }>>(
    translations[lang],
    "home.aDay.moments",
  );

  return (
    <section className="relative py-24 md:py-32 surface-cream overflow-hidden lined-paper">
      {/* Filigrane "24h" Cormorant XL background */}
      <span
        aria-hidden="true"
        className="absolute -top-12 right-0 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/8 text-[24rem] leading-none pointer-events-none select-none"
      >
        24h
      </span>

      <Container size="xl" className="relative">
        {/* Header magazine */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <p className="eyebrow text-[color:var(--color-taupe-dark)] inline-flex items-center gap-3 mb-5">
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            {t("home.aDay.eyebrow")}
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
          </p>
          <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.04em] leading-[1.1] mb-5">
            {t("home.aDay.title")}
          </h2>
          <div className="w-16 h-px bg-[color:var(--color-bronze)] mx-auto mb-6" />
          <p className="font-[var(--font-editorial)] italic text-base md:text-lg text-[color:var(--color-navy-deep)]/80 leading-[1.55]">
            {t("home.aDay.subtitle")}
          </p>
        </div>

        {/* Timeline zigzag — 6 moments empilés alternés gauche/droite */}
        <div className="relative max-w-5xl mx-auto">
          {/* Ligne verticale décorative pointillée bronze (desktop) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-px w-px bg-gradient-to-b from-transparent via-[color:var(--color-bronze)]/30 to-transparent pointer-events-none"
            style={{ backgroundImage: "linear-gradient(to bottom, transparent, transparent 50%, var(--color-bronze) 50%)", backgroundSize: "1px 8px" }}
          />

          <div className="space-y-16 md:space-y-20">
            {moments.map((m, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <article
                  key={idx}
                  className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center group"
                >
                  {/* Pastille heure cercle bronze sur la ligne centrale (desktop) */}
                  <div
                    aria-hidden="true"
                    className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <div className="w-3 h-3 rounded-full bg-[color:var(--color-bronze)] ring-4 ring-[color:var(--color-cream)] transition-all duration-500 group-hover:w-4 group-hover:h-4 group-hover:bg-[color:var(--color-bronze-deep)]" />
                  </div>

                  {/* Heure filigrane XL — colonne 5/12 alternée */}
                  <div
                    className={`md:col-span-5 ${isLeft ? "md:order-1" : "md:order-2"} flex ${isLeft ? "md:justify-end" : "md:justify-start"}`}
                  >
                    <div className="relative">
                      <span
                        aria-hidden="true"
                        className="font-[var(--font-editorial)] italic text-[color:var(--color-bronze)]/30 text-[7rem] md:text-[10rem] leading-none tabular-nums select-none transition-colors duration-500 group-hover:text-[color:var(--color-bronze)]/55"
                      >
                        {m.time}
                      </span>
                    </div>
                  </div>

                  {/* Texte moment — colonne 6/12 alternée */}
                  <div
                    className={`md:col-span-6 ${isLeft ? "md:order-2 md:col-start-7" : "md:order-1 md:col-start-1"}`}
                  >
                    <p className="eyebrow text-[color:var(--color-bronze-deep)] mb-3">
                      {m.time}
                    </p>
                    <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-xl md:text-2xl uppercase tracking-[0.02em] leading-[1.2] mb-4">
                      {m.title}
                    </h3>
                    <div className="w-10 h-px bg-[color:var(--color-bronze)] mb-5 transition-[width] duration-500 group-hover:w-20" />
                    <p
                      className={`text-base md:text-[1.0625rem] leading-[1.7] text-[color:var(--color-navy-deep)]/85 ${
                        idx === 0 ? "dropcap" : "font-[var(--font-editorial)] italic"
                      }`}
                    >
                      {m.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Footnote signature */}
        <p className="text-center text-xs italic text-[color:var(--color-taupe-dark)] mt-16 max-w-xl mx-auto">
          {t("home.aDay.footnote")}
        </p>
      </Container>
    </section>
  );
}
