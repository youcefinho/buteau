import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useGlossary } from "@/lib/GlossaryContext";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { Tiltable } from "@/components/layout/Tiltable";
import { SchemaJsonLd } from "@/components/layout/SchemaJsonLd";
import { ToolsFinalCta } from "@/components/landing/ToolsFinalCta";
import { ta, translations } from "@/lib/translations";

/**
 * /journal — index magazine. Chaque article ouvre une page dediee
 * /journal/$slug (pas d'accordion inline) pour exposer le contenu complet.
 */
export const Route = createFileRoute("/journal/")({
  component: JournalPage,
});

type Article = {
  slug: string;
  category: string;
  date: string;
  dateIso?: string;
  readingTime: number;
  title: string;
  lead: string;
  excerpt: string;
  pullQuote?: string;
};

function JournalPage() {
  const { t, lang } = useLanguage();
  const { open: openGlossary } = useGlossary();
  const isFr = lang === "fr";
  const articles = ta<Article[]>(translations[lang], "journal.articles");

  return (
    <LegalPageWrap
      eyebrow={isFr ? "Le journal" : "The journal"}
      title={ta<string>(translations[lang], "journal.title")}
      afterContent={<ToolsFinalCta />}
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
            url: `https://equipe-buteau.intralysqc.workers.dev/journal/${a.slug}`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://equipe-buteau.intralysqc.workers.dev/journal/${a.slug}`,
            },
            author: { "@type": "Person", name: "Andrew Buteau", jobTitle: "Courtier hypothécaire" },
            datePublished: a.dateIso ?? a.date,
            articleSection: a.category,
            description: a.lead,
          })),
        }}
      />

      {/* Subtitle Cormorant italic */}
      <p className="font-[var(--font-editorial)] italic text-[clamp(1rem,1.4vw,1.125rem)] text-[color:var(--color-navy-deep)]/80 leading-[1.65] mb-[clamp(2.5rem,5vw,3rem)]">
        {t("journal.subtitle")}
      </p>

      {/* Articles list — format magazine editorial */}
      <div className="space-y-12 not-prose" style={{ perspective: "1500px" }}>
        {articles.map((a, idx) => (
          <Tiltable key={a.slug} maxDeg={2}>
            <article
              id={a.slug}
              className="group relative bg-[color:var(--color-surface)] border border-[color:var(--color-taupe)]/40 hover:border-[color:var(--color-bronze)]/70 transition-all duration-500 halo-glow flex flex-col md:flex-row gap-0 overflow-hidden"
            >
              {/* Numero editorial XL filigrane gauche */}
              <div className="md:w-[120px] md:shrink-0 bg-[color:var(--color-cream-warm)] border-r border-[color:var(--color-taupe)]/30 flex items-center justify-center py-6 md:py-0">
                <span
                  aria-hidden="true"
                  className="font-[var(--font-editorial)] italic text-[color:var(--color-bronze)] text-[clamp(3rem,6vw,4.5rem)] leading-none"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex-1 p-[clamp(1.75rem,3vw,2.5rem)] flex flex-col">
                {/* Meta : category + date + reading time */}
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mb-5">
                  <p className="eyebrow text-[color:var(--color-bronze-deep)]">{a.category}</p>
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

                {/* Title display — clickable */}
                <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.5rem,2.5vw,1.875rem)] uppercase tracking-[0.02em] leading-[1.15] mb-4 group-hover:text-[color:var(--color-bronze-deep)] transition-colors">
                  <Link
                    to="/journal/$slug"
                    params={{ slug: a.slug }}
                    className="hover:underline decoration-[color:var(--color-bronze)] decoration-2 underline-offset-4"
                  >
                    {a.title}
                  </Link>
                </h2>

                <div className="w-10 h-px bg-[color:var(--color-bronze)] mb-5 transition-[width] duration-500 group-hover:w-20" />

                {/* Lead Cormorant italic */}
                <p className="font-[var(--font-editorial)] italic text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.65] text-[color:var(--color-navy-deep)]/85 mb-4">
                  {a.lead}
                </p>

                {/* Excerpt */}
                <p className="text-[clamp(0.875rem,1.2vw,1rem)] leading-[1.65] text-[color:var(--color-navy-deep)]/75 mb-6">
                  {a.excerpt}
                </p>

                {/* CTA vers page dediee */}
                <div className="mt-auto pt-5 flex items-center justify-between gap-4">
                  <Link
                    to="/journal/$slug"
                    params={{ slug: a.slug }}
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

                  <Link
                    to="/"
                    hash="contact"
                    className="hidden md:inline-flex items-center gap-2 font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-taupe-dark)] hover:text-[color:var(--color-bronze-deep)] transition-colors"
                  >
                    <span className="relative">
                      {isFr ? "En parler avec Andrew" : "Discuss with Andrew"}
                      <span className="absolute left-0 -bottom-1 w-0 h-px bg-[color:var(--color-bronze)] hover:w-full transition-[width] duration-500" />
                    </span>
                    <ArrowRight
                      size={12}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
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

      {/* Liens croises Capsules + Lexique */}
      <div className="text-center mt-8 flex flex-col sm:flex-row gap-6 justify-center items-center">
        <Link
          to="/capsules"
          className="group inline-flex items-center gap-2 font-[var(--font-editorial)] italic text-base text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-bronze-deep)] transition-colors"
        >
          <span className="relative">
            {isFr ? "Voir les capsules courtes" : "Browse the short capsules"}
            <span className="absolute left-0 -bottom-0.5 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </span>
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </Link>
        <button
          type="button"
          onClick={() => openGlossary()}
          className="group inline-flex items-center gap-2 font-[var(--font-editorial)] italic text-base text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-bronze-deep)] transition-colors"
        >
          <span className="relative">
            {isFr ? "Consulter le lexique" : "Browse the glossary"}
            <span className="absolute left-0 -bottom-0.5 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </span>
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </LegalPageWrap>
  );
}
