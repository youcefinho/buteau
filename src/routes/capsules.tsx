import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { SchemaJsonLd } from "@/components/layout/SchemaJsonLd";
import { ta, translations } from "@/lib/translations";
import { config } from "@/lib/config";

/**
 * /capsules — bibliothèque éditoriale magazine des capsules vidéo « 30 sec
 * top chrono » d'Andrew. Pattern : sommaire de magazine, pas une grille
 * SaaS. Chaque catégorie est une rubrique, chaque capsule un titre + hook.
 *
 * Pourquoi NOVEL : aucun courtier hypothécaire ne présente ses capsules
 * comme une vraie collection éditoriale. Renforce l'autorité contenu +
 * pousse vers TikTok/Instagram (acquisition réseaux sociaux).
 *
 * Compose : LegalPageWrap (édito frame) × Cormorant numérotation × halo-glow
 * × signature lines bronze hover. Schema.org VideoObject collection.
 */
export const Route = createFileRoute("/capsules")({
  component: CapsulesPage,
});

type CapsuleItem = {
  title: string;
  hook: string;
};

type CapsuleCategory = {
  id: string;
  eyebrow: string;
  intro: string;
  items: CapsuleItem[];
};

function CapsulesPage() {
  const { t, lang } = useLanguage();
  const isFr = lang === "fr";
  const categories = ta<CapsuleCategory[]>(translations[lang], "capsules.categories");

  // Total capsules count
  const totalCount = categories.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <LegalPageWrap
      eyebrow={ta<string>(translations[lang], "capsules.eyebrow")}
      title={ta<string>(translations[lang], "capsules.title")}
    >
      <SchemaJsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: ta<string>(translations[lang], "capsules.title"),
          inLanguage: isFr ? "fr-CA" : "en-CA",
          numberOfItems: totalCount,
          itemListElement: categories.flatMap((cat, ci) =>
            cat.items.map((it, ii) => ({
              "@type": "CreativeWork",
              position: ci * 10 + ii + 1,
              name: it.title,
              description: it.hook,
              about: cat.eyebrow,
              creator: { "@type": "Person", name: "Andrew Buteau" },
            })),
          ),
        }}
      />

      {/* Subtitle Cormorant italic */}
      <p className="font-[var(--font-editorial)] italic text-base md:text-lg text-[color:var(--color-navy-deep)]/80 leading-[1.65] mb-10">
        {t("capsules.subtitle")}
      </p>

      {/* Pull-quote signature Andrew — pattern intralys-edito-magazine
          Citation factuelle extraite de la voix Andrew (capsules TikTok existantes) */}
      <blockquote className="not-prose relative mb-14 py-2 border-l-2 border-[color:var(--color-bronze)] pl-6 lg:pl-8">
        <p className="font-[var(--font-editorial)] italic text-xl md:text-2xl lg:text-[1.65rem] leading-[1.3] text-[color:var(--color-navy-deep)] tracking-tight">
          {isFr
            ? "« L'hypothèque, c'est pas compliqué. Ce qui est compliqué, c'est qu'on te l'explique mal. En 30 secondes, je te montre que la plupart des règles sont plus simples — et plus généreuses — que ce qu'on t'a dit. »"
            : "« Mortgages aren't complicated. What's complicated is the way it's been explained to you. In 30 seconds, I show you most rules are simpler — and more generous — than you were told. »"}
        </p>
        <footer className="mt-3 text-xs eyebrow text-[color:var(--color-bronze-deep)]">
          — Andrew Buteau
        </footer>
      </blockquote>

      {/* Compteur + CTAs réseaux sociaux */}
      <div className="not-prose mb-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[color:var(--color-taupe)]/40">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="font-[var(--font-editorial)] italic text-[color:var(--color-bronze)] text-5xl md:text-6xl leading-none tabular-nums"
          >
            {String(totalCount).padStart(2, "0")}
          </span>
          <div>
            <p className="eyebrow text-[color:var(--color-taupe-dark)] text-[10px] mb-1">
              {isFr ? "Capsules disponibles" : "Capsules available"}
            </p>
            <p className="text-sm text-[color:var(--color-navy-deep)]/75 max-w-xs">
              {t("capsules.followLine")}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://www.tiktok.com/@equipebuteau"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-bronze btn-shine inline-flex items-center gap-2"
          >
            <Play size={14} aria-hidden="true" />
            {t("capsules.ctaTikTok")}
          </a>
          <a
            href={`tel:${config.phone.raw}`}
            className="group font-[var(--font-display)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-bronze-deep)] transition-colors inline-flex items-center gap-2"
          >
            <Sparkles size={14} className="text-[color:var(--color-bronze)]" aria-hidden="true" />
            <span className="relative">
              {config.phone.display}
              <span className="absolute left-0 -bottom-1 w-0 h-px bg-[color:var(--color-bronze)] group-hover:w-full transition-[width] duration-500" />
            </span>
          </a>
        </div>
      </div>

      {/* Catégories — sommaire magazine vertical */}
      <div className="space-y-20 not-prose">
        {categories.map((cat, ci) => (
          <section key={cat.id} id={cat.id} className="relative">
            {/* Numéro romain XL filigrane à gauche */}
            <span
              aria-hidden="true"
              className="hidden md:block absolute -left-20 top-0 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/15 text-[10rem] leading-none pointer-events-none select-none"
            >
              {romanNumeral(ci + 1)}
            </span>

            {/* Header catégorie — eyebrow tirets longs + h2 + filet bronze + intro avec dropcap */}
            <div className="mb-8 md:mb-10">
              <p className="eyebrow text-[color:var(--color-bronze-deep)] mb-3 inline-flex items-center gap-3">
                <span className="font-[var(--font-editorial)] italic text-base text-[color:var(--color-bronze)] tabular-nums">
                  {String(ci + 1).padStart(2, "0")}
                </span>
                <span className="inline-block w-6 h-px bg-[color:var(--color-bronze)]" />
                {cat.eyebrow}
              </p>
              <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-2xl md:text-3xl uppercase tracking-[0.04em] leading-[1.15] mb-4">
                {cat.eyebrow}
              </h2>
              {/* Filet décoratif w-10 → w-20 hover (signature line bronze) */}
              <div className="w-10 h-px bg-[color:var(--color-bronze)] mb-5 transition-[width] duration-500 hover:w-20" />
              {/* Intro avec dropcap — pattern édito magazine premier paragraphe */}
              <p className="dropcap text-base md:text-[1.0625rem] leading-[1.7] text-[color:var(--color-navy-deep)]/85 max-w-2xl">
                {cat.intro}
              </p>
            </div>

            {/* Liste capsules — table-of-contents éditoriale */}
            <ol className="border-t border-[color:var(--color-taupe)]/40">
              {cat.items.map((item, ii) => (
                <li key={ii}>
                  <a
                    href="https://www.tiktok.com/@equipebuteau"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-5 md:gap-7 py-5 md:py-6 border-b border-[color:var(--color-taupe)]/40 transition-colors duration-300 hover:border-[color:var(--color-bronze)]"
                  >
                    {/* Numéro Cormorant italic */}
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)] group-hover:text-[color:var(--color-bronze-deep)] text-2xl md:text-3xl leading-none tabular-nums w-10 md:w-12 transition-colors duration-300"
                    >
                      {String(ii + 1).padStart(2, "0")}
                    </span>

                    {/* Body */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base md:text-lg uppercase tracking-[0.02em] leading-snug group-hover:text-[color:var(--color-bronze-deep)] transition-colors">
                        {item.title}
                      </h3>
                      <p className="font-[var(--font-editorial)] italic text-sm md:text-base leading-[1.6] text-[color:var(--color-navy-deep)]/75">
                        « {item.hook} »
                      </p>
                    </div>

                    {/* Right column : Play badge */}
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span className="inline-flex items-center gap-1 eyebrow text-[color:var(--color-bronze-deep)] text-[9px] border-l-2 border-[color:var(--color-bronze)] pl-2">
                        <Play size={9} aria-hidden="true" />
                        TikTok
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-[color:var(--color-taupe)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[color:var(--color-bronze-deep)] transition-all duration-300"
                        aria-hidden="true"
                      />
                    </div>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      {/* Footnote */}
      <p className="text-xs italic text-[color:var(--color-taupe-dark)] mt-16 text-center max-w-2xl mx-auto">
        {t("capsules.footnote")}
      </p>

      {/* Lien retour vers Journal (référence croisée éditoriale) */}
      <div className="text-center mt-8">
        <Link
          to="/journal"
          className="group inline-flex items-center gap-2 font-[var(--font-editorial)] italic text-base text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-bronze-deep)] transition-colors"
        >
          <span className="relative">
            {isFr ? "Lire les articles longs au Journal" : "Read the long articles in the Journal"}
            <span className="absolute left-0 -bottom-0.5 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </span>
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </LegalPageWrap>
  );
}

function romanNumeral(n: number): string {
  const map: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII" };
  return map[n] ?? String(n);
}
