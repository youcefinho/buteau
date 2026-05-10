import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import { RisingBronzeEmbers } from "@/components/atmosphere/RisingBronzeEmbers";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { ta, translations } from "@/lib/translations";

/**
 * GuidesShelf — table-of-contents éditoriale magazine pour les guides + docs
 * téléchargeables. Format "library shelf" : chaque item est listé comme une
 * entrée de sommaire de magazine.
 *
 * Pourquoi NOVEL : pattern unique vs grid 3 cards génériques. L'utilisateur
 * voit la bibliothèque entière (5 items) avec numérotation Cormorant + lien
 * vers chaque section. Synergie avec ToolsTeaser + GuidesGrid sur /outils.
 *
 * Layout : 5/12 (header sticky desktop) + 7/12 (liste verticale items).
 */
export function GuidesShelf() {
  const { t, lang } = useLanguage();
  const items = ta<
    Array<{ kind: "guide" | "doc"; title: string; excerpt: string; tag: string }>
  >(translations[lang], "home.guidesShelf.items");

  return (
    <section className="relative py-24 md:py-32 surface-cream overflow-hidden lined-paper">
      {/* Atmospheric continuity — embers per-section signature */}
      <RisingBronzeEmbers count={5} tone="bronze" />

      {/* Filigrane Cormorant "&" decoratif */}
      <span
        aria-hidden="true"
        className="absolute -top-12 right-0 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/8 text-[24rem] leading-none pointer-events-none select-none"
      >
        ¶
      </span>

      <Container size="xl" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Header column — 5/12 sticky desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-[color:var(--color-taupe-dark)] inline-flex items-center gap-3 mb-5">
              <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
              {t("home.guidesShelf.eyebrow")}
            </p>
            <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-3xl md:text-4xl uppercase tracking-[0.04em] leading-[1.1] mb-5">
              {t("home.guidesShelf.title")}
            </h2>
            <div className="w-12 h-px bg-[color:var(--color-bronze)] mb-6" />
            <p className="font-[var(--font-editorial)] italic text-base md:text-lg leading-[1.65] text-[color:var(--color-navy-deep)]/80 mb-8">
              {t("home.guidesShelf.subtitle")}
            </p>

            <Link
              to="/outils"
              hash="guides"
              className="group inline-flex items-center gap-2 font-[var(--font-display)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-bronze-deep)] hover:text-[color:var(--color-bronze)] transition-colors"
            >
              <span className="relative">
                {t("home.guidesShelf.ctaFull")}
                <span className="absolute left-0 -bottom-1 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Items list — 7/12 — magazine table-of-contents éditorial */}
          <ol className="lg:col-span-7 space-y-0 border-t border-[color:var(--color-taupe)]/40">
            {items.map((item, idx) => {
              const Icon = item.kind === "guide" ? BookOpen : FileText;
              return (
                <li key={idx}>
                  <Link
                    to="/outils"
                    hash={item.kind === "guide" ? "guides" : "documents"}
                    className="group flex items-start gap-5 md:gap-7 py-6 md:py-7 border-b border-[color:var(--color-taupe)]/40 transition-colors duration-300 hover:border-[color:var(--color-bronze)]"
                  >
                    {/* Numéro Cormorant italic XL — pattern table-of-contents magazine */}
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)] group-hover:text-[color:var(--color-bronze-deep)] text-3xl md:text-4xl leading-none tabular-nums w-12 md:w-14 transition-colors duration-300"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    {/* Body */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Tag eyebrow + icon */}
                      <div className="flex items-center gap-2 mb-1">
                        <Icon
                          size={12}
                          className="text-[color:var(--color-bronze)]"
                          aria-hidden="true"
                        />
                        <p className="eyebrow text-[color:var(--color-bronze-deep)] text-[10px]">
                          {item.tag}
                        </p>
                      </div>

                      {/* Title */}
                      <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-lg md:text-xl uppercase tracking-[0.02em] leading-snug group-hover:text-[color:var(--color-bronze-deep)] transition-colors">
                        {item.title}
                      </h3>

                      {/* Excerpt italic */}
                      <p className="font-[var(--font-editorial)] italic text-sm md:text-base leading-[1.6] text-[color:var(--color-navy-deep)]/75">
                        {item.excerpt}
                      </p>
                    </div>

                    {/* Right column : Coming Soon badge + arrow */}
                    <div className="shrink-0 flex flex-col items-end gap-3">
                      <span className="eyebrow text-[color:var(--color-bronze-deep)] text-[9px] border-l-2 border-[color:var(--color-bronze)] pl-2">
                        {t("home.guidesShelf.comingSoon")}
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-[color:var(--color-taupe)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[color:var(--color-bronze-deep)] transition-all duration-300"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
