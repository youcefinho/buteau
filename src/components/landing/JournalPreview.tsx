import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { Tiltable } from "@/components/layout/Tiltable";
import { ta, translations } from "@/lib/translations";

type Article = {
  slug: string;
  category: string;
  date: string;
  readingTime: number;
  title: string;
  lead: string;
  excerpt: string;
  pullQuote?: string;
};

/**
 * JournalPreview — section Accueil mettant en avant les articles du journal.
 *
 * Pattern : 5/12 sticky header + 7/12 feature card (vs CapsulesPreview qui liste).
 * Pour 1 article, format grand card editorial. Pour N articles, on pourrait
 * stack-er en liste. Aujourd'hui : 1 article preapprobation -> grande card.
 */
export function JournalPreview() {
  const { t, lang } = useLanguage();
  const isFr = lang === "fr";
  const articles = ta<Article[]>(translations[lang], "journal.articles");
  if (!articles.length) return null;
  const featured = articles[0];

  return (
    <section id="journal-preview" className="relative py-[clamp(4rem,9vw,8rem)] surface-navy overflow-hidden border-t border-[color:var(--color-taupe)]/20 grain-overlay">
      {/* Filigrane § XL background — signature editoriale */}
      <span
        aria-hidden="true"
        className="absolute -top-12 right-0 font-[var(--font-editorial)] italic text-[color:var(--color-bronze)]/8 text-[22rem] leading-none pointer-events-none select-none"
      >
        §
      </span>

      <Container size="xl" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(2.5rem,5vw,4rem)]">
          {/* Header column — 5/12 sticky desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-[color:var(--color-bronze-soft)] inline-flex items-center gap-3 mb-5">
              <span className="inline-block w-6 h-px bg-[color:var(--color-bronze)]" />
              {isFr ? "Le journal" : "The journal"}
            </p>
            <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-[clamp(1.875rem,3vw,2.25rem)] uppercase tracking-[0.04em] leading-[1.1] mb-5 text-balance">
              {isFr ? "Articles et analyses du marché." : "Articles and market analyses."}
            </h2>
            <div className="w-12 h-px bg-[color:var(--color-bronze)] mb-6" />
            <p className="font-[var(--font-editorial)] italic text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.65] text-[color:var(--color-cream)]/80 mb-8 text-pretty hyphens-auto">
              {isFr
                ? "Décryptages, stratégies et explications pratiques sur le marché hypothécaire québécois. Lectures longues, rédigées pour aider à mieux décider avant de signer."
                : "Insights, strategies and practical explanations on the Quebec mortgage market. Long-form reads, written to help you decide better before signing."}
            </p>

            <Link
              to="/journal"
              className="group inline-flex items-center gap-2 font-[var(--font-display)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-bronze-soft)] hover:text-[color:var(--color-cream)] transition-colors"
            >
              <span className="relative">
                {isFr ? "Voir tous les articles" : "Browse all articles"}
                <span className="absolute left-0 -bottom-1 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Feature article card — 7/12 */}
          <div className="lg:col-span-7" style={{ perspective: "1500px" }}>
            <Tiltable maxDeg={2}>
              <article className="group relative bg-[color:var(--color-surface)] border border-[color:var(--color-taupe)]/40 hover:border-[color:var(--color-bronze)]/70 transition-all duration-500 halo-glow overflow-hidden">
                {/* Numero filigrane gauche */}
                <div className="absolute top-0 left-0 bottom-0 w-[100px] bg-[color:var(--color-cream-warm)] border-r border-[color:var(--color-taupe)]/30 hidden md:flex items-center justify-center pointer-events-none">
                  <span
                    aria-hidden="true"
                    className="font-[var(--font-editorial)] italic text-[color:var(--color-bronze)] text-7xl leading-none"
                  >
                    01
                  </span>
                </div>

                <div className="md:pl-[120px] p-[clamp(1.75rem,3vw,2.5rem)] flex flex-col">
                  {/* Meta */}
                  <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mb-5">
                    <p className="eyebrow text-[color:var(--color-bronze-deep)]">{featured.category}</p>
                    <span aria-hidden="true" className="text-[color:var(--color-taupe)]/50">·</span>
                    <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)]">
                      {featured.date}
                    </p>
                    <span aria-hidden="true" className="text-[color:var(--color-taupe)]/50">·</span>
                    <p className="inline-flex items-center gap-1.5 text-xs italic text-[color:var(--color-taupe-dark)]">
                      <Clock size={11} aria-hidden="true" />
                      {featured.readingTime} {t("journal.readingLabel")}
                    </p>
                  </div>

                  {/* Title */}
                  <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.5rem,2.5vw,1.875rem)] uppercase tracking-[0.02em] leading-[1.15] mb-4 text-balance group-hover:text-[color:var(--color-bronze-deep)] transition-colors">
                    <Link
                      to="/journal/$slug"
                      params={{ slug: featured.slug }}
                      className="hover:underline decoration-[color:var(--color-bronze)] decoration-2 underline-offset-4"
                    >
                      {featured.title}
                    </Link>
                  </h3>

                  <div className="w-10 h-px bg-[color:var(--color-bronze)] mb-5 transition-[width] duration-500 group-hover:w-20" />

                  {/* Lead */}
                  <p className="font-[var(--font-editorial)] italic text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.65] text-[color:var(--color-navy-deep)]/85 mb-4 text-pretty">
                    {featured.lead}
                  </p>

                  {/* Excerpt */}
                  <p className="text-[clamp(0.875rem,1.2vw,1rem)] leading-[1.65] text-[color:var(--color-navy-deep)]/75 mb-6 text-pretty hyphens-auto">
                    {featured.excerpt}
                  </p>

                  {/* CTA */}
                  <div className="mt-auto pt-5 border-t border-[color:var(--color-taupe)]/30 flex items-center justify-between gap-4">
                    <Link
                      to="/journal/$slug"
                      params={{ slug: featured.slug }}
                      className="group/btn inline-flex items-center gap-2 font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-bronze-deep)] hover:text-[color:var(--color-bronze)] transition-colors"
                    >
                      <span className="relative">
                        {t("journal.readMoreLabel")}
                        <span className="absolute left-0 -bottom-1 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left" />
                      </span>
                      <ArrowRight
                        size={12}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover/btn:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            </Tiltable>
          </div>
        </div>
      </Container>
    </section>
  );
}
