import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { glossary } from "@/lib/glossary";

// ═══════════════════════════════════════════════════════════
// /lexique — page SEO du Lexique hypothécaire Buteau (14 termes).
// Pendant routable du modal Glossary (qui reste pour UX rapide depuis Footer).
// Schema.org DefinedTermSet pour rich snippets long-tail Google.
// Mots-clés : RAP CELIAPP Quebec, mise de fonds, refinancement, primo,
// préapprobation, taxe de bienvenue, vice caché, hypothèque assurée.
// ═══════════════════════════════════════════════════════════

export const Route = createFileRoute("/lexique")({
  component: LexiquePage,
});

function LexiquePage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  // Schema.org DefinedTermSet — JSON-LD inline pour SEO long-tail Google.
  const definedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": "https://equipe-buteau.intralysqc.workers.dev/lexique",
    name: isFr ? "Lexique hypothécaire — Équipe Buteau" : "Mortgage glossary — Équipe Buteau",
    inLanguage: isFr ? "fr-CA" : "en-CA",
    hasDefinedTerm: glossary.map((g) => ({
      "@type": "DefinedTerm",
      "@id": `https://equipe-buteau.intralysqc.workers.dev/lexique#${g.slug}`,
      name: g.term[lang],
      description: g.definition[lang],
      ...(g.source ? { source: g.source } : {}),
    })),
  };

  return (
    <LegalPageWrap
      eyebrow={isFr ? "Ressource" : "Resource"}
      title={isFr ? "Lexique hypothécaire" : "Mortgage glossary"}
      lastUpdated={
        isFr
          ? "14 termes essentiels pour comprendre votre dossier hypothécaire au Québec"
          : "14 essential terms to understand your mortgage file in Quebec"
      }
    >
      {/* Schema.org JSON-LD — SEO long-tail */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSet) }}
      />

      <p className="text-base leading-relaxed text-[color:var(--color-navy-deep)]/85">
        {isFr
          ? "14 termes essentiels pour comprendre votre dossier hypothécaire au Québec. Sources officielles : SCHL, AMF, ARC, Code civil du Québec."
          : "14 essential terms to understand your mortgage file in Quebec. Official sources: CMHC, AMF, CRA, Civil Code of Quebec."}
      </p>

      <div className="space-y-8 mt-8">
        {glossary.map((g) => (
          <article id={g.slug} key={g.slug} className="scroll-mt-32">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-xl uppercase tracking-[0.04em]">
                {g.term[lang]}
              </h2>
              {g.term.fr_alt && lang === "fr" && (
                <span className="text-xs italic text-[color:var(--color-taupe-dark)]">
                  {g.term.fr_alt.join(", ")}
                </span>
              )}
            </div>
            <div className="w-8 h-0.5 bg-[color:var(--color-bronze)] my-3" />
            <p className="text-sm md:text-base leading-relaxed text-[color:var(--color-navy-deep)]/85">
              {g.definition[lang]}
            </p>
            {g.source && (
              <p className="eyebrow text-[color:var(--color-taupe-dark)] mt-3">
                {isFr ? "Source" : "Source"} : {g.source}
              </p>
            )}
          </article>
        ))}
      </div>
    </LegalPageWrap>
  );
}
