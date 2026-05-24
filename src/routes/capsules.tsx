import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Sparkles, ArrowRight, Filter } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { HeartbeatCta } from "@/components/layout/HeartbeatCta";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { SchemaJsonLd } from "@/components/layout/SchemaJsonLd";
import { ToolsFinalCta } from "@/components/landing/ToolsFinalCta";
import { SectionRail, type SectionEntry } from "@/components/layout/SectionRail";
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
  // URL TikTok individuelle de la capsule (optionnel — fallback profile si absent).
  // À remplir par client quand chaque vidéo TikTok est publiée.
  url?: string;
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

  // Filter state — "all" par défaut, sinon id de catégorie active
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Filtered categories — "all" affiche tout, sinon une seule catégorie
  const filteredCategories =
    activeFilter === "all"
      ? categories
      : categories.filter((c) => c.id === activeFilter);

  // Total capsules count (toutes catégories — affiché dans le header)
  const totalCount = categories.reduce((acc, c) => acc + c.items.length, 0);
  // Visible count après filtre
  const visibleCount = filteredCategories.reduce((acc, c) => acc + c.items.length, 0);

  // SectionRail config — Hero + une entree par catégorie (id varie par lang)
  // + Contact final. Les eyebrows des catégories sont déjà lang-aware.
  const capsulesSections: SectionEntry[] = useMemo(() => [
    { id: "hero", type: "main", label: { fr: "Capsules", en: "Capsules" } },
    ...categories.map((cat) => ({
      id: cat.id,
      type: "sub" as const,
      label: { fr: cat.eyebrow, en: cat.eyebrow },
    })),
    { id: "contact-cta", type: "main", label: { fr: "Contact", en: "Contact" } },
  ], [categories]);

  return (
    <>
    <SectionRail sections={capsulesSections} />
    <LegalPageWrap
      eyebrow={ta<string>(translations[lang], "capsules.eyebrow")}
      title={ta<string>(translations[lang], "capsules.title")}
      afterContent={<ToolsFinalCta />}
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
              // URL TikTok individuelle si fournie (sinon profile via fallback)
              ...(it.url ? { url: it.url } : {}),
            })),
          ),
        }}
      />

      {/* Subtitle Cormorant italic */}
      <p className="italic text-[clamp(1rem,1.4vw,1.125rem)] text-[color:var(--color-navy-deep)]/80 leading-[1.65] mb-10 text-pretty">
        {t("capsules.subtitle")}
      </p>

      {/* Pull-quote signature Andrew — pattern intralys-edito-magazine
          Citation factuelle extraite de la voix Andrew (capsules TikTok existantes) */}
      <blockquote className="not-prose relative mb-14 py-2 border-l-2 border-[color:var(--color-taupe-dark)] pl-6 lg:pl-8">
        <p className="font-[var(--font-editorial)] italic text-[clamp(1.25rem,2.2vw,1.65rem)] leading-[1.3] text-[color:var(--color-navy-deep)] tracking-tight text-pretty">
          {isFr
            ? "« L'hypothèque, c'est pas compliqué. Ce qui est compliqué, c'est qu'on te l'explique mal. En 30 secondes, je te montre que la plupart des règles sont plus simples — et plus généreuses — que ce qu'on t'a dit. »"
            : "« Mortgages aren't complicated. What's complicated is the way it's been explained to you. In 30 seconds, I show you most rules are simpler — and more generous — than you were told. »"}
        </p>
        <footer className="mt-3 text-xs eyebrow text-[color:var(--color-navy)]">
          — Andrew Buteau
        </footer>
      </blockquote>

      {/* Compteur + CTAs réseaux sociaux */}
      <div className="not-prose mb-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[color:var(--color-taupe)]/40">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="font-[var(--font-editorial)] italic text-[color:var(--color-taupe-dark)] text-[clamp(3rem,5vw,3.75rem)] leading-none tabular-nums"
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
            className="group font-[var(--font-display)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-navy)] transition-colors inline-flex items-center gap-2"
          >
            <Sparkles size={14} className="text-[color:var(--color-taupe-dark)]" aria-hidden="true" />
            <span className="relative">
              {config.phone.display}
              <span className="absolute left-0 -bottom-1 w-0 h-px bg-[color:var(--color-taupe-dark)] group-hover:w-full transition-[width] duration-500" />
            </span>
          </a>
        </div>
      </div>

      {/* Tag filters chips — "Tous" + 7 catégories. Filtrage live au clic.
          Pattern intralys-edito-magazine : eyebrow italique + chips bordure bronze */}
      <div className="not-prose mb-12 -mt-2">
        <div className="flex items-center gap-3 mb-4">
          <Filter size={12} className="text-[color:var(--color-taupe-dark)]" aria-hidden="true" />
          <p className="eyebrow text-[color:var(--color-navy)] text-[10px]">
            {isFr ? "Filtrer par catégorie" : "Filter by category"}
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={isFr ? "Filtrer par catégorie" : "Filter by category"}
        >
          {/* Chip "Tous" */}
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            aria-pressed={activeFilter === "all"}
            className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
              activeFilter === "all"
                ? "bg-[color:var(--color-navy-deep)] border-[color:var(--color-navy-deep)] text-[color:var(--color-cream)]"
                : "bg-transparent border-[color:var(--color-taupe)]/50 text-[color:var(--color-navy-deep)] hover:border-[color:var(--color-taupe-dark)] hover:text-[color:var(--color-navy)]"
            }`}
          >
            <span className="font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)]">
              {isFr ? "Tous" : "All"}
            </span>
            <span className="italic text-xs tabular-nums opacity-70">
              {totalCount}
            </span>
          </button>
          {/* Chips par catégorie */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveFilter(cat.id)}
              aria-pressed={activeFilter === cat.id}
              className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                activeFilter === cat.id
                  ? "bg-[color:var(--color-navy-deep)] border-[color:var(--color-navy-deep)] text-[color:var(--color-cream)]"
                  : "bg-transparent border-[color:var(--color-taupe)]/50 text-[color:var(--color-navy-deep)] hover:border-[color:var(--color-taupe-dark)] hover:text-[color:var(--color-navy)]"
              }`}
            >
              <span className="font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)]">
                {cat.eyebrow}
              </span>
              <span className="italic text-xs tabular-nums opacity-70">
                {cat.items.length}
              </span>
            </button>
          ))}
        </div>
        {/* Compteur résultats visibles si filtre actif — Intl.PluralRules pour FR/EN propres (fix MEDIUM) */}
        {activeFilter !== "all" && (() => {
          const pluralRules = new Intl.PluralRules(isFr ? "fr-CA" : "en-CA");
          const isPlural = pluralRules.select(visibleCount) !== "one";
          const fmt = isFr
            ? `${visibleCount} ${isPlural ? "capsules affichées" : "capsule affichée"} sur ${totalCount}`
            : `${visibleCount} ${isPlural ? "capsules shown" : "capsule shown"} of ${totalCount}`;
          return (
            <p className="italic text-xs text-[color:var(--color-taupe-dark)] mt-3">
              {fmt}
            </p>
          );
        })()}
      </div>

      {/* Catégories — sommaire magazine vertical (filtrées) */}
      <div className="space-y-20 not-prose">
        {filteredCategories.map((cat, ci) => (
          <section key={cat.id} id={cat.id} className="relative">
            {/* Numéro XL filigrane à gauche */}
            <span
              aria-hidden="true"
              className="hidden md:block absolute -left-20 top-0 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/15 text-[10rem] leading-none pointer-events-none select-none tabular-nums"
            >
              {String(ci + 1).padStart(2, "0")}
            </span>

            {/* Header catégorie — eyebrow numéro section + h2 nom catégorie + filet bronze + intro avec dropcap.
                Fix BLOCKER code-review : eyebrow ne duplique plus le h2 (avant les 2 affichaient cat.eyebrow). */}
            <div className="mb-8 md:mb-10">
              <p className="eyebrow text-[color:var(--color-navy)] mb-3 inline-flex items-center gap-3">
                <span className="italic text-base text-[color:var(--color-taupe-dark)] tabular-nums">
                  {String(ci + 1).padStart(2, "0")}
                </span>
                <span className="inline-block w-6 h-px bg-[color:var(--color-taupe-dark)]" />
                {isFr ? "Rubrique" : "Section"}
              </p>
              <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.5rem,2.5vw,1.875rem)] uppercase tracking-[0.04em] leading-[1.15] mb-4 text-balance">
                {cat.eyebrow}
              </h2>
              {/* Filet décoratif w-10 → w-20 hover (signature line bronze) */}
              <div className="w-10 h-px bg-[color:var(--color-taupe-dark)] mb-5 transition-[width] duration-500 hover:w-20" />
              {/* Intro avec dropcap — pattern édito magazine premier paragraphe */}
              <p className="dropcap text-[clamp(1rem,1.3vw,1.0625rem)] leading-[1.7] text-[color:var(--color-navy-deep)]/85 max-w-2xl text-pretty hyphens-auto">
                {cat.intro}
              </p>
            </div>

            {/* Liste capsules — table-of-contents éditoriale */}
            <ol className="border-t border-[color:var(--color-taupe)]/40">
              {cat.items.map((item, ii) => (
                <li key={`${cat.id}-${ii}-${item.title.slice(0, 20)}`}>
                  <a
                    href={item.url ?? "https://www.tiktok.com/@equipebuteau"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.url
                      ? `${item.title} — ${isFr ? "voir la capsule" : "watch capsule"}`
                      : `${item.title} — ${isFr ? "voir le profil TikTok" : "view TikTok profile"}`}
                    className="group flex items-start gap-[clamp(1.25rem,2vw,1.75rem)] py-[clamp(1.25rem,1.5vw,1.5rem)] border-b border-[color:var(--color-taupe)]/40 transition-colors duration-300 hover:border-[color:var(--color-taupe-dark)]"
                  >
                    {/* Numéro Cormorant italic */}
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)] group-hover:text-[color:var(--color-navy)] text-[clamp(1.5rem,2.5vw,1.875rem)] leading-none tabular-nums w-10 md:w-12 transition-colors duration-300"
                    >
                      {String(ii + 1).padStart(2, "0")}
                    </span>

                    {/* Body */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1rem,1.4vw,1.125rem)] uppercase tracking-[0.02em] leading-snug text-balance group-hover:text-[color:var(--color-navy)] transition-colors">
                        {item.title}
                      </h3>
                      <p className="italic text-[clamp(0.875rem,1.2vw,1rem)] leading-[1.6] text-[color:var(--color-navy-deep)]/75 text-pretty">
                        « {item.hook} »
                      </p>
                    </div>

                    {/* Right column : Play badge */}
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span className="inline-flex items-center gap-1 eyebrow text-[color:var(--color-navy)] text-[10px] border-l-2 border-[color:var(--color-taupe-dark)] pl-2">
                        <Play size={9} aria-hidden="true" />
                        TikTok
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-[color:var(--color-taupe)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[color:var(--color-navy)] transition-all duration-300"
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
        <HeartbeatCta>
          <Link
            to="/journal"
            className="group inline-flex items-center gap-2 italic text-base text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-navy)] transition-colors"
          >
            <span className="relative">
              {isFr ? "Lire nos articles longs" : "Read our long articles"}
              <span className="absolute left-0 -bottom-0.5 w-full h-px bg-[color:var(--color-taupe-dark)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </span>
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </HeartbeatCta>
      </div>
    </LegalPageWrap>
    </>
  );
}

