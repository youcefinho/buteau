import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { SchemaJsonLd } from "@/components/layout/SchemaJsonLd";
import { ta, translations } from "@/lib/translations";
// HTML brut autonome (Vite ?raw, client-only — esbuild worker ne le bundle pas
// car la route est lazy-loaded uniquement cote client par TanStack autoCodeSplitting).
import preapprobationArticleHtml from "@/lib/articles/preapprobation-2026.html?raw";

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

const ARTICLE_BODY_HTML: Record<string, string> = {
  "preapprobation-hypothecaire-2026": preapprobationArticleHtml,
};

export const Route = createFileRoute("/journal/$slug")({
  component: JournalArticlePage,
  loader: ({ params }) => {
    if (!ARTICLE_BODY_HTML[params.slug]) {
      throw notFound();
    }
    return { slug: params.slug };
  },
});

function JournalArticlePage() {
  const { slug } = Route.useLoaderData();
  const { t, lang } = useLanguage();
  const isFr = lang === "fr";
  const articles = ta<Article[]>(translations[lang], "journal.articles");
  const article = articles.find((a) => a.slug === slug);
  const html = ARTICLE_BODY_HTML[slug];

  if (!article) {
    return (
      <LegalPageWrap eyebrow={isFr ? "Article introuvable" : "Article not found"} title="404">
        <Link to="/journal" className="font-[var(--font-editorial)] italic text-[color:var(--color-bronze-deep)]">
          {isFr ? "Retour aux articles" : "Back to articles"}
        </Link>
      </LegalPageWrap>
    );
  }

  return (
    <LegalPageWrap eyebrow={article.category} title={article.title}>
      <SchemaJsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.lead,
          inLanguage: isFr ? "fr-CA" : "en-CA",
          datePublished: article.dateIso ?? article.date,
          articleSection: article.category,
          author: { "@id": "https://equipe-buteau.intralysqc.workers.dev/#andrew-buteau" },
          publisher: { "@id": "https://equipe-buteau.intralysqc.workers.dev/#business" },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://equipe-buteau.intralysqc.workers.dev/journal/${slug}`,
          },
        }}
      />

      {/* Lien retour + meta */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-y-4 gap-x-6">
        <Link
          to="/journal"
          className="group inline-flex items-center gap-2 font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-bronze-deep)] hover:text-[color:var(--color-bronze)] transition-colors"
        >
          <ArrowLeft
            size={14}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          <span className="relative">
            {isFr ? "Retour aux articles" : "Back to articles"}
            <span className="absolute left-0 -bottom-1 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </span>
        </Link>
        <p className="inline-flex items-center gap-2 text-xs italic text-[color:var(--color-taupe-dark)]">
          <Clock size={11} aria-hidden="true" />
          {article.readingTime} {t("journal.readingLabel")}
          <span aria-hidden="true" className="text-[color:var(--color-taupe)]/50 mx-1">·</span>
          {article.date}
        </p>
      </div>

      {/* Lead + filet */}
      <p className="font-[var(--font-editorial)] italic text-[clamp(1.125rem,1.6vw,1.25rem)] leading-[1.6] text-[color:var(--color-navy-deep)]/85 mb-5 text-pretty hyphens-auto">
        {article.lead}
      </p>
      <div className="w-12 h-px bg-[color:var(--color-bronze)] mb-10" />

      {/* HTML brut palette Buteau (CSS vars override appliques cote source HTML) */}
      <div
        className="article-buteau-rich not-prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Signature de fin + retour */}
      <div className="mt-12 pt-8 border-t border-[color:var(--color-taupe)]/30 flex flex-wrap items-baseline justify-between gap-y-4 gap-x-6">
        <p className="font-[var(--font-editorial)] italic text-sm text-[color:var(--color-taupe-dark)]">
          {isFr ? "Andrew Buteau, courtier hypothécaire" : "Andrew Buteau, mortgage broker"}
          {" · "}
          {article.date}
        </p>
        <Link
          to="/"
          hash="contact"
          className="group inline-flex items-center gap-2 font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-bronze-deep)] hover:text-[color:var(--color-bronze)] transition-colors"
        >
          <span className="relative">
            {isFr ? "En parler avec Andrew" : "Discuss with Andrew"}
            <span className="absolute left-0 -bottom-1 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </span>
        </Link>
      </div>
    </LegalPageWrap>
  );
}
