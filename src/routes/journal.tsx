import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { Tiltable } from "@/components/layout/Tiltable";
import { SchemaJsonLd } from "@/components/layout/SchemaJsonLd";
import { ta, translations } from "@/lib/translations";

/**
 * /journal — page index blog éditorial magazine.
 *
 * Pourquoi NOVEL : pattern blog luxury — pas une grille SaaS, mais une vraie
 * page de magazine avec drop caps + categories + reading time + signature ligne.
 *
 * Synergie : Mission drop cap × BrokerLetter signature × ChapterMarkers ×
 * Reviews letters format × LegalPageWrap pattern.
 */
export const Route = createFileRoute("/journal")({
  component: JournalPage,
});

type Article = {
  slug: string;
  category: string;
  date: string;
  readingTime: number;
  title: string;
  lead: string;
  excerpt: string;
};

function JournalPage() {
  const { t, lang } = useLanguage();
  const isFr = lang === "fr";

  const articles = ta<Article[]>(translations[lang], "journal.articles");

  return (
    <LegalPageWrap
      eyebrow={isFr ? "Le journal" : "The journal"}
      title={ta<string>(translations[lang], "journal.title")}
    >
      <SchemaJsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: ta<string>(translations[lang], "journal.title"),
          inLanguage: isFr ? "fr-CA" : "en-CA",
          url: "https://equipe-buteau.intralysqc.workers.dev/journal",
          publisher: { "@id": "https://equipe-buteau.intralysqc.workers.dev/#business" },
          blogPost: articles.map((a) => ({
            "@type": "BlogPosting",
            headline: a.title,
            datePublished: a.date,
            articleSection: a.category,
            description: a.lead,
          })),
        }}
      />

      {/* Subtitle Cormorant italic */}
      <p className="font-[var(--font-editorial)] italic text-base md:text-lg text-[color:var(--color-navy-deep)]/80 leading-[1.65] mb-12">
        {t("journal.subtitle")}
      </p>

      {/* Articles list — format magazine éditorial */}
      <div className="space-y-12 not-prose" style={{ perspective: "1500px" }}>
        {articles.map((a, idx) => (
          <Tiltable key={a.slug} maxDeg={2}>
            <article className="group relative bg-[color:var(--color-surface)] border border-[color:var(--color-taupe)]/40 hover:border-[color:var(--color-bronze)]/70 transition-all duration-500 halo-glow flex flex-col md:flex-row gap-0 overflow-hidden">
              {/* Numéro éditorial XL filigrane gauche (desktop) */}
              <div className="md:w-[120px] md:shrink-0 bg-[color:var(--color-cream-warm)] border-r border-[color:var(--color-taupe)]/30 flex items-center justify-center py-6 md:py-0">
                <span
                  aria-hidden="true"
                  className="font-[var(--font-editorial)] italic text-[color:var(--color-bronze)] text-5xl md:text-7xl leading-none"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Article body */}
              <div className="flex-1 p-7 md:p-10 flex flex-col">
                {/* Meta : category + date + reading time */}
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mb-5">
                  <p className="eyebrow text-[color:var(--color-bronze-deep)]">
                    {a.category}
                  </p>
                  <span aria-hidden="true" className="text-[color:var(--color-taupe)]/50">·</span>
                  <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)]">
                    {a.date}
                  </p>
                  <span aria-hidden="true" className="text-[color:var(--color-taupe)]/50">·</span>
                  <p className="inline-flex items-center gap-1.5 text-xs italic text-[color:var(--color-taupe-dark)]">
                    <Clock size={11} aria-hidden="true" />
                    {a.readingTime} {t("journal.readingLabel")}
                  </p>
                </div>

                {/* Title display */}
                <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-2xl md:text-3xl uppercase tracking-[0.02em] leading-[1.15] mb-4 group-hover:text-[color:var(--color-bronze-deep)] transition-colors">
                  {a.title}
                </h2>

                <div className="w-10 h-px bg-[color:var(--color-bronze)] mb-5 transition-[width] duration-500 group-hover:w-20" />

                {/* Lead — drop cap subtle Cormorant italic */}
                <p className="font-[var(--font-editorial)] italic text-base md:text-lg leading-[1.65] text-[color:var(--color-navy-deep)]/85 mb-4">
                  {a.lead}
                </p>

                {/* Excerpt */}
                <p className="text-sm leading-[1.65] text-[color:var(--color-navy-deep)]/75 mb-6">
                  {a.excerpt}
                </p>

                {/* CTA + coming soon badge */}
                <div className="mt-auto flex items-center justify-between gap-4">
                  <span className="inline-block eyebrow text-[color:var(--color-bronze-deep)] border-l-2 border-[color:var(--color-bronze)] pl-2.5 text-[10px]">
                    {t("journal.comingSoonLabel")}
                  </span>
                  <span className="inline-flex items-center gap-2 font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-taupe-dark)] group-hover:text-[color:var(--color-bronze-deep)] transition-colors">
                    {t("journal.readMoreLabel")}
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </article>
          </Tiltable>
        ))}
      </div>

      {/* Footnote */}
      <p className="text-xs italic text-[color:var(--color-taupe-dark)] mt-14 text-center">
        {t("journal.footnote")}
      </p>

      {/* Lien retour vers Lexique (référence croisée éditoriale) */}
      <div className="text-center mt-8">
        <Link
          to="/lexique"
          className="group inline-flex items-center gap-2 font-[var(--font-editorial)] italic text-base text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-bronze-deep)] transition-colors"
        >
          <span className="relative">
            {isFr ? "Consulter le lexique" : "Browse the glossary"}
            <span className="absolute left-0 -bottom-0.5 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </span>
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </LegalPageWrap>
  );
}
