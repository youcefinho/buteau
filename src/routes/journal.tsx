import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useGlossary } from "@/lib/GlossaryContext";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { Tiltable } from "@/components/layout/Tiltable";
import { SchemaJsonLd } from "@/components/layout/SchemaJsonLd";
import { ta, translations } from "@/lib/translations";

/**
 * /journal — page index blog éditorial magazine.
 *
 * Pourquoi NOVEL : pattern blog luxury — pas une grille SaaS, mais une vraie
 * page de magazine avec drop caps + categories + reading time + signature ligne.
 * Ouverture inline (accordion) pour lire le body complet sans navigation.
 *
 * Synergie : Mission drop cap × BrokerLetter signature × ChapterMarkers ×
 * Reviews letters format × LegalPageWrap pattern × FAQ accordion pattern.
 */
export const Route = createFileRoute("/journal")({
  component: JournalPage,
});

type Article = {
  slug: string;
  category: string;
  date: string; // affichage humain (FR/EN)
  dateIso?: string; // ISO 8601 pour Schema.org datePublished (fix LOW)
  readingTime: number;
  title: string;
  lead: string;
  excerpt: string;
  body?: string[];
  bodyHtml?: string; // HTML brut autonome (rendu iframe srcDoc) — fidelite totale au document source
  pullQuote?: string;
};

/**
 * Rich HTML article rendered in an isolated iframe (srcDoc) so the
 * source document keeps its own styles, scripts and layout intact.
 * Iframe height auto-grows to fit content via onLoad measurement.
 */
function RichHtmlArticle({ html, title }: { html: string; title: string }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const resize = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    const next = Math.max(
      doc.documentElement.scrollHeight,
      doc.body?.scrollHeight ?? 0,
    );
    iframe.style.height = `${next + 8}px`;
  };

  useEffect(() => {
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title={title}
      srcDoc={html}
      onLoad={() => {
        resize();
        // Re-mesure une fois les fonts/images chargees (layout shift)
        setTimeout(resize, 300);
        setTimeout(resize, 1200);
      }}
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      className="w-full block border-0 bg-transparent"
      style={{ minHeight: "600px" }}
    />
  );
}

function JournalPage() {
  const { t, lang } = useLanguage();
  const { open: openGlossary } = useGlossary();
  const isFr = lang === "fr";
  const articles = ta<Article[]>(translations[lang], "journal.articles");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const openArticleRef = useRef<HTMLDivElement | null>(null);

  // Reading progress bar — track scroll position relative to open article body.
  // Pattern Medium/Substack : barre fine bronze fixed top qui se remplit selon
  // la progression dans le body de l'article ouvert. Reset quand on ferme.
  useEffect(() => {
    if (!openSlug) {
      setReadingProgress(0);
      return;
    }

    const computeProgress = () => {
      const el = openArticleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // Fix HIGH : utiliser viewport mid pour position de lecture cohérente
      // (pas position de l'élément). Marche pour articles courts ET longs.
      const articleStart = rect.top + window.scrollY;
      const articleEnd = articleStart + rect.height;
      const viewportMid = window.scrollY + viewportH / 2;
      const range = articleEnd - articleStart;
      if (range <= 0) {
        setReadingProgress(0);
        return;
      }
      const ratio = (viewportMid - articleStart) / range;
      setReadingProgress(Math.max(0, Math.min(1, ratio)));
    };

    computeProgress();
    window.addEventListener("scroll", computeProgress, { passive: true });
    window.addEventListener("resize", computeProgress);
    return () => {
      window.removeEventListener("scroll", computeProgress);
      window.removeEventListener("resize", computeProgress);
    };
  }, [openSlug]);

  return (
    <LegalPageWrap
      eyebrow={isFr ? "Le journal" : "The journal"}
      title={ta<string>(translations[lang], "journal.title")}
    >
      {/* Reading progress bar — visible uniquement quand un article est ouvert.
          Pattern Medium/Substack premium feeling. Bronze fine ligne top fixed. */}
      {openSlug && (
        <div
          aria-hidden="true"
          className="fixed top-0 inset-x-0 z-[60] h-[2px] bg-[color:var(--color-taupe)]/20 pointer-events-none"
        >
          <div
            className="h-full bg-gradient-to-r from-[color:var(--color-bronze)] via-[color:var(--color-bronze-deep)] to-[color:var(--color-bronze)] transition-[width] duration-150 ease-out"
            style={{ width: `${readingProgress * 100}%` }}
          />
        </div>
      )}
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
            // Fix HIGH : url + mainEntityOfPage + author pour rich snippet Google
            url: `https://equipe-buteau.intralysqc.workers.dev/journal#${a.slug}`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://equipe-buteau.intralysqc.workers.dev/journal#${a.slug}`,
            },
            author: {
              "@type": "Person",
              name: "Andrew Buteau",
              jobTitle: "Courtier hypothécaire",
            },
            // datePublished : ISO si dispo (Schema.org exige ISO 8601), sinon string FR (fallback)
            datePublished: a.dateIso ?? a.date,
            articleSection: a.category,
            description: a.lead,
            articleBody: a.bodyHtml
              ? a.bodyHtml.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
              : (a.body ?? []).join(" "),
          })),
        }}
      />

      {/* Subtitle Cormorant italic */}
      <p className="font-[var(--font-editorial)] italic text-base md:text-lg text-[color:var(--color-navy-deep)]/80 leading-[1.65] mb-12">
        {t("journal.subtitle")}
      </p>

      {/* Articles list — format magazine éditorial avec ouverture inline */}
      <div className="space-y-12 not-prose" style={{ perspective: "1500px" }}>
        {articles.map((a, idx) => {
          const isOpen = openSlug === a.slug;
          const hasRichHtml = typeof a.bodyHtml === "string" && a.bodyHtml.length > 0;
          const hasBody = hasRichHtml || (Array.isArray(a.body) && a.body.length > 0);

          return (
            <Tiltable key={a.slug} maxDeg={isOpen ? 0 : 2}>
              <article
                id={a.slug}
                className="group relative bg-[color:var(--color-surface)] border border-[color:var(--color-taupe)]/40 hover:border-[color:var(--color-bronze)]/70 transition-all duration-500 halo-glow flex flex-col md:flex-row gap-0 overflow-hidden"
              >
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
                    <p className="eyebrow text-[color:var(--color-bronze-deep)]">{a.category}</p>
                    <span aria-hidden="true" className="text-[color:var(--color-taupe)]/50">
                      ·
                    </span>
                    <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)]">
                      {a.date}
                    </p>
                    <span aria-hidden="true" className="text-[color:var(--color-taupe)]/50">
                      ·
                    </span>
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

                  {/* Excerpt — visible toujours */}
                  <p className="text-sm md:text-base leading-[1.65] text-[color:var(--color-navy-deep)]/75 mb-6">
                    {a.excerpt}
                  </p>

                  {/* Body complet — affiché en accordion */}
                  {hasBody && isOpen && hasRichHtml && (
                    <div
                      ref={openArticleRef}
                      className="border-t border-[color:var(--color-taupe)]/30 pt-7 mt-3 animate-[buteauFadeUp_500ms_ease-out_both]"
                    >
                      <RichHtmlArticle html={a.bodyHtml!} title={a.title} />
                      {/* Signature de fin d'article */}
                      <div className="pt-6 mt-6 border-t border-[color:var(--color-taupe)]/30 flex items-baseline gap-3">
                        <span className="block w-8 h-px bg-[color:var(--color-bronze)]" aria-hidden="true" />
                        <p className="font-[var(--font-editorial)] italic text-sm text-[color:var(--color-taupe-dark)]">
                          {isFr ? "Andrew Buteau, courtier hypothécaire" : "Andrew Buteau, mortgage broker"}
                          {" · "}
                          {a.date}
                        </p>
                      </div>
                    </div>
                  )}
                  {hasBody && isOpen && !hasRichHtml && (
                    <div
                      ref={openArticleRef}
                      className="border-t border-[color:var(--color-taupe)]/30 pt-7 mt-3 space-y-5 animate-[buteauFadeUp_500ms_ease-out_both]"
                    >
                      {/* Drop cap sur 1er paragraphe + pull-quote middle (skip si body < 3 paragraphes — fix MEDIUM) */}
                      {(() => {
                        const bodyLen = a.body!.length;
                        const middleIdx = bodyLen >= 3 ? Math.floor(bodyLen / 2) : -1;
                        return a.body!.map((para, pi) => {
                          const showPullQuote = a.pullQuote && pi === middleIdx;
                          return (
                            <div key={`${a.slug}-p-${pi}`}>
                              {showPullQuote && (
                                <blockquote className="not-prose relative my-8 py-3 border-l-2 border-[color:var(--color-bronze)] pl-6 lg:pl-8">
                                  <p className="font-[var(--font-editorial)] italic text-xl md:text-2xl leading-[1.3] text-[color:var(--color-navy-deep)] tracking-tight">
                                    « {a.pullQuote} »
                                  </p>
                                </blockquote>
                              )}
                              <p
                                className={`text-base md:text-[1.0625rem] leading-[1.75] text-[color:var(--color-navy-deep)]/85 ${
                                  pi === 0 ? "dropcap" : ""
                                }`}
                              >
                                {para}
                              </p>
                            </div>
                          );
                        });
                      })()}

                      {/* Signature de fin d'article */}
                      <div className="pt-6 mt-3 border-t border-[color:var(--color-taupe)]/30 flex items-baseline gap-3">
                        <span className="block w-8 h-px bg-[color:var(--color-bronze)]" aria-hidden="true" />
                        <p className="font-[var(--font-editorial)] italic text-sm text-[color:var(--color-taupe-dark)]">
                          {isFr ? "Andrew Buteau, courtier hypothécaire" : "Andrew Buteau, mortgage broker"}
                          {" · "}
                          {a.date}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CTA toggle ouverture/fermeture */}
                  {hasBody && (
                    <div className="mt-auto pt-5 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setOpenSlug(isOpen ? null : a.slug)}
                        aria-expanded={isOpen}
                        aria-controls={`article-body-${a.slug}`}
                        className="group/btn inline-flex items-center gap-2 font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-bronze-deep)] hover:text-[color:var(--color-bronze)] transition-colors"
                      >
                        <span className="relative">
                          {isOpen ? t("journal.hideLabel") : t("journal.readMoreLabel")}
                          <span className="absolute left-0 -bottom-1 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left" />
                        </span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>

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
                  )}
                </div>
              </article>
            </Tiltable>
          );
        })}
      </div>

      {/* Footnote */}
      <p className="text-xs italic text-[color:var(--color-taupe-dark)] mt-14 text-center">
        {t("journal.footnote")}
      </p>

      {/* Liens croisés Capsules + Lexique */}
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
