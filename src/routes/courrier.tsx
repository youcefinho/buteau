import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { Tiltable } from "@/components/layout/Tiltable";
import { SchemaJsonLd, breadcrumbs } from "@/components/layout/SchemaJsonLd";
import { ta, translations } from "@/lib/translations";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=Andrew+Buteau+Courtier+Hypothecaire";

/**
 * /courrier — page complète "Courrier des lecteurs" (extension Reviews).
 *
 * Pourquoi NOVEL : pattern Reviews "Letters" du home étendu en page dédiée
 * format magazine éditorial complet. Chaque témoignage = vraie lettre
 * datée + signée + lieu d'origine. Synergie max avec :
 * - Reviews letter format (home)
 * - Tiltable (cards 3D suivent curseur)
 * - LegalPageWrap (header + fleuron)
 * - Footer back cover monogramme XL
 *
 * Total lettres : 3 (home) + 6 additionnelles = 9 lettres affichées chronologique inverse.
 */
export const Route = createFileRoute("/courrier")({
  component: CourrierPage,
});

function CourrierPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const homeReviews = ta<
    Array<{
      quote: string;
      authorInitial: string;
      author: string;
      city: string;
      date: string;
    }>
  >(translations[lang], "home.reviews.items");

  const additional = ta<
    Array<{
      quote: string;
      authorInitial: string;
      author: string;
      city: string;
      date: string;
    }>
  >(translations[lang], "courrier.additionalLetters");

  // Combine + tri inverse chronologique (basique : ordre tableau, plus récent d'abord)
  const allLetters = [...homeReviews, ...additional];

  return (
    <LegalPageWrap
      eyebrow={isFr ? "Édition spéciale" : "Special edition"}
      title={isFr ? "Courrier des lecteurs" : "Letters to the Editor"}
      lastUpdated={isFr ? `Édition mise à jour — ${new Date().toLocaleDateString("fr-CA", { month: "long", year: "numeric" })}` : `Edition updated — ${new Date().toLocaleDateString("en-CA", { month: "long", year: "numeric" })}`}
    >
      <SchemaJsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: isFr ? "Accueil" : "Home",
              item: "https://equipe-buteau.intralysqc.workers.dev/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: isFr ? "Courrier" : "Letters",
              item: "https://equipe-buteau.intralysqc.workers.dev/courrier",
            },
          ],
        }}
      />

      {/* Subtitle éditorial */}
      <p className="font-[var(--font-editorial)] italic text-[clamp(1rem,1.4vw,1.125rem)] text-[color:var(--color-navy-deep)]/80 leading-[1.65] mb-[clamp(2.5rem,5vw,3rem)] text-pretty">
        {ta<string>(translations[lang], "courrier.subtitle")}
      </p>

      {/* Grid lettres — 2 colonnes desktop pour rythme magazine */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(1.5rem,2.3vw,1.75rem)] not-prose"
        style={{ perspective: "1200px" }}
      >
        {allLetters.map((r, idx) => (
          <Tiltable key={idx} maxDeg={3}>
            <article className="group relative bg-[color:var(--color-surface)] border border-[color:var(--color-taupe)]/45 transition-all duration-500 hover:border-[color:var(--color-bronze)]/70 halo-glow flex flex-col h-full">
              {/* Numéro filigrane Cormorant top-right */}
              <span
                aria-hidden="true"
                className="absolute top-3 right-5 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/25 text-3xl leading-none pointer-events-none select-none"
              >
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Letter header */}
              <header className="flex items-baseline justify-between gap-3 px-6 pt-6 pb-4 border-b border-dashed border-[color:var(--color-taupe)]/40">
                <div>
                  <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-1 text-[9px]">
                    {ta<string>(translations[lang], "courrier.letterDateLabel")}
                  </p>
                  <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-navy-deep)]">
                    {r.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-1 text-[9px]">
                    {ta<string>(translations[lang], "courrier.letterFromLabel")}
                  </p>
                  <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-navy-deep)]">
                    {r.city}
                  </p>
                </div>
              </header>

              {/* Body */}
              <div className="px-6 py-6 flex-1 flex flex-col">
                <div className="flex gap-1 mb-4" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      className="fill-[color:var(--color-rating-amber)] text-[color:var(--color-rating-amber)]"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="font-[var(--font-editorial)] italic text-sm leading-[1.6] text-[color:var(--color-navy-deep)]/90 text-pretty">
                  <span className="font-[var(--font-editorial)] not-italic font-bold text-[color:var(--color-bronze)] text-xl mr-0.5 align-baseline">
                    «
                  </span>
                  {" "}
                  {r.quote}
                  {" "}
                  <span className="font-[var(--font-editorial)] not-italic font-bold text-[color:var(--color-bronze)] text-xl ml-0.5 align-baseline">
                    »
                  </span>
                </p>
              </div>

              {/* Footer signature */}
              <footer className="px-6 pb-5">
                <div className="flex items-center gap-3 pt-3 border-t border-[color:var(--color-taupe)]/30">
                  <div
                    className="w-7 h-7 rounded-full bg-[color:var(--color-bronze)]/15 flex items-center justify-center text-[color:var(--color-bronze-deep)] font-[var(--font-display)] font-bold text-[10px] tracking-wider"
                    aria-hidden="true"
                  >
                    {r.authorInitial}
                  </div>
                  <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-navy-deep)]">
                    — {r.author}
                  </p>
                </div>
              </footer>
            </article>
          </Tiltable>
        ))}
      </div>

      {/* Footnote chronologique */}
      <p className="text-xs italic text-[color:var(--color-taupe-dark)] mt-10 text-center">
        {ta<string>(translations[lang], "courrier.footnote")}
      </p>

      {/* CTA Google reviews */}
      <div className="text-center mt-12">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 font-[var(--font-editorial)] italic text-base text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-bronze-deep)] transition-colors"
        >
          <span className="relative">
            {ta<string>(translations[lang], "courrier.googleLinkLabel")}
            <span className="absolute left-0 -bottom-0.5 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </span>
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </LegalPageWrap>
  );
}
