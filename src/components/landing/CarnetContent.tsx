import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { AutoGlossary } from "@/components/landing/AutoGlossary";
import { ButeauMonogramInline } from "@/components/atmosphere/ButeauMonogramInline";
import { HeartbeatCta } from "@/components/layout/HeartbeatCta";

// ═══════════════════════════════════════════════════════════
// CarnetContent — Buteau (single source of truth).
// Réutilisé par CarnetModal.tsx (modal) + routes/carnet.tsx (page SEO).
// ═══════════════════════════════════════════════════════════

type CarnetEntry = {
  name: string;
  url: string;
  note: string;
};

type CarnetSection = {
  numeral: string;
  title: string;
  intro: string;
  entries: CarnetEntry[];
};

interface CarnetContentProps {
  variant: "modal" | "page";
  onClose?: () => void;
}

export function CarnetContent({ variant, onClose }: CarnetContentProps) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const isPage = variant === "page";

  const linkRel = isPage ? "noopener noreferrer" : "noopener noreferrer nofollow";

  const sections: CarnetSection[] = isFr
    ? [
        {
          numeral: "01",
          title: "Notaires & actes",
          intro:
            "Trouver un notaire est une étape obligatoire au Quebec — il signe l'acte de vente et l'acte hypothécaire. Voici les répertoires officiels.",
          entries: [
            { name: "Chambre des notaires du Québec", url: "https://www.cnq.org", note: "Trouver un notaire par région, code postal ou langue de service." },
            { name: "OACIQ — Organisme d'autoréglementation du courtage immobilier du Québec", url: "https://www.oaciq.com", note: "Vérifier le permis d'un courtier immobilier (à ne pas confondre avec courtier hypothécaire AMF)." },
          ],
        },
        {
          numeral: "02",
          title: "Subventions & programmes",
          intro:
            "Les programmes officiels qui peuvent réduire votre mise de fonds, vos taxes ou votre fardeau hypothécaire de premier acheteur.",
          entries: [
            { name: "RAP — Régime d'accession à la propriété", url: "https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/reer-rpac/regime-accession-propriete-rap.html", note: "Retrait jusqu'à 60 000 $ de votre REER sans impôt pour mise de fonds (premier achat ou retour à la propriété 4+ ans)." },
            { name: "CELIAPP — Compte d'épargne libre d'impôt pour l'achat d'une première propriété", url: "https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/celiapp.html", note: "Cotisez jusqu'à 8 000 $/an (40 000 $ à vie), retraits non imposables si destinés à un premier achat." },
            { name: "Crédit d'impôt pour l'achat d'une habitation (CIAH)", url: "https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/tout-votre-declaration-revenus/declaration-revenus/remplir-declaration-revenus/deductions-credits-depenses/ligne-31270-montant-pour-habitation-admissible.html", note: "Crédit d'impôt fédéral non remboursable pouvant atteindre 1 500 $ pour les primo-acheteurs." },
          ],
        },
        {
          numeral: "03",
          title: "Inspecteurs & expertise",
          intro:
            "L'inspection préachat n'est pas légalement obligatoire mais fortement recommandée. Voici les ordres et bases de données pour vérifier la qualification.",
          entries: [
            { name: "AIBQ — Association des inspecteurs en bâtiment du Québec", url: "https://www.aibq.qc.ca", note: "Répertoire d'inspecteurs membres respectant un code de déontologie." },
            { name: "RBQ — Régie du bâtiment du Québec", url: "https://www.rbq.gouv.qc.ca", note: "Vérifier la licence d'un entrepreneur ou consulter les antécédents disciplinaires avant rénovation." },
          ],
        },
        {
          numeral: "04",
          title: "Assurances & garanties",
          intro:
            "Si votre mise de fonds est inférieure à 20 %, l'assurance prêt hypothécaire est obligatoire. Trois assureurs canadiens dominent ce marché.",
          entries: [
            { name: "SCHL — Société canadienne d'hypothèques et de logement", url: "https://www.cmhc-schl.gc.ca", note: "Assureur public fédéral, principal acteur du marché. Outils et calculatrices gratuits." },
            { name: "Sagen Canada", url: "https://www.sagen.ca/fr", note: "Assureur privé, alternative à la SCHL pour certains profils." },
            { name: "Canada Guaranty", url: "https://www.canadaguaranty.ca/fr", note: "Troisième assureur privé du marché, conditions distinctes selon le prêteur." },
          ],
        },
        {
          numeral: "05",
          title: "Outils gouvernementaux",
          intro:
            "Calculatrices, droits de mutation (« taxe de bienvenue ») et outils officiels — directement à la source, sans intermédiaire.",
          entries: [
            { name: "Calculatrice de droits de mutation immobilière (Ville de Laval)", url: "https://www.laval.ca", note: "Estimer la « taxe de bienvenue » payable au notaire selon la valeur de la propriété." },
            { name: "Tribunal administratif du logement", url: "https://www.tal.gouv.qc.ca", note: "Tribunal administratif du logement — droits du locataire/propriétaire." },
            { name: "Office de la protection du consommateur du Québec", url: "https://www.opc.gouv.qc.ca", note: "Pour signaler ou comprendre les pratiques commerciales en immobilier." },
          ],
        },
        {
          numeral: "06",
          title: "Crédit & recours",
          intro:
            "Votre dossier de crédit est consulté à chaque demande hypothécaire. Et si un litige survient avec une banque ou un courtier, voici les recours canadiens.",
          entries: [
            { name: "Equifax Canada", url: "https://www.consumer.equifax.ca/personnel/", note: "Consulter votre dossier de crédit gratuitement 1× par an. Vérifiez avant toute préapprobation pour corriger les erreurs (jusqu'à 60 jours d'écart entre demande et signature)." },
            { name: "TransUnion Canada", url: "https://www.transunion.ca/fr", note: "Second bureau de crédit. Les prêteurs consultent l'un OU l'autre selon leurs ententes — vérifier les deux donne une vision complète." },
            { name: "OBSI — Ombudsman des services bancaires et d'investissement", url: "https://www.obsi.ca/fr/", note: "Recours gratuit si un litige avec une banque/courtier hypothécaire n'est pas résolu en 56 jours. Indépendant et impartial." },
          ],
        },
      ]
    : [
        {
          numeral: "01",
          title: "Notaries & deeds",
          intro:
            "Hiring a notary is mandatory in Quebec — they sign the deed of sale and the mortgage deed. Here are the official directories.",
          entries: [
            { name: "Chambre des notaires du Québec", url: "https://www.cnq.org", note: "Find a notary by region, postal code or service language." },
            { name: "OACIQ — Quebec real estate brokerage self-regulatory body", url: "https://www.oaciq.com", note: "Verify a real estate broker's license (not to be confused with AMF mortgage broker)." },
          ],
        },
        {
          numeral: "02",
          title: "Grants & programs",
          intro:
            "Official programs that may reduce your down payment, taxes or first-time buyer mortgage burden.",
          entries: [
            { name: "HBP — Home Buyers' Plan", url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan.html", note: "Withdraw up to $60,000 from your RRSP tax-free for a down payment (first purchase or return to ownership after 4+ years)." },
            { name: "FHSA — First Home Savings Account", url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html", note: "Contribute up to $8,000/year ($40,000 lifetime), tax-free withdrawals if used for a first home." },
            { name: "Home Buyers' Tax Credit (HBTC)", url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-31270-home-buyers-amount.html", note: "Federal non-refundable tax credit up to $1,500 for first-time buyers." },
          ],
        },
        {
          numeral: "03",
          title: "Inspectors & expertise",
          intro:
            "Pre-purchase inspection isn't legally required but strongly recommended. Here are the bodies and databases to verify qualification.",
          entries: [
            { name: "AIBQ — Quebec association of building inspectors", url: "https://www.aibq.qc.ca", note: "Directory of member inspectors held to a code of conduct." },
            { name: "RBQ — Quebec building authority", url: "https://www.rbq.gouv.qc.ca", note: "Verify a contractor's license or consult disciplinary records before renovating." },
          ],
        },
        {
          numeral: "04",
          title: "Insurance & guarantees",
          intro:
            "If your down payment is below 20%, mortgage insurance is mandatory. Three Canadian insurers dominate this market.",
          entries: [
            { name: "CMHC — Canada Mortgage and Housing Corporation", url: "https://www.cmhc-schl.gc.ca", note: "Federal public insurer, main market player. Free tools and calculators." },
            { name: "Sagen Canada", url: "https://www.sagen.ca", note: "Private insurer, alternative to CMHC for certain profiles." },
            { name: "Canada Guaranty", url: "https://www.canadaguaranty.ca", note: "Third private insurer in the market, distinct conditions per lender." },
          ],
        },
        {
          numeral: "05",
          title: "Government tools",
          intro:
            "Calculators, transfer duties (« welcome tax ») and official tools — straight from the source, no intermediary.",
          entries: [
            { name: "Real estate transfer duties calculator (City of Laval)", url: "https://www.laval.ca", note: "Estimate the « welcome tax » payable to the notary based on property value." },
            { name: "Quebec Housing Tribunal", url: "https://www.tal.gouv.qc.ca", note: "Administrative housing tribunal — tenant/owner rights." },
            { name: "Quebec Consumer Protection Office", url: "https://www.opc.gouv.qc.ca", note: "To report or understand commercial practices in real estate." },
          ],
        },
        {
          numeral: "06",
          title: "Credit & recourse",
          intro:
            "Your credit file is consulted on every mortgage application. And if a dispute arises with a bank or broker, here are the Canadian recourses.",
          entries: [
            { name: "Equifax Canada", url: "https://www.consumer.equifax.ca/personal/", note: "Check your credit file for free once a year. Verify before any pre-approval to correct errors (up to 60 days between application and signing)." },
            { name: "TransUnion Canada", url: "https://www.transunion.ca", note: "Second credit bureau. Lenders consult one OR the other based on their agreements — verifying both gives a complete view." },
            { name: "OBSI — Ombudsman for Banking Services and Investments", url: "https://www.obsi.ca/en/", note: "Free recourse if a dispute with a bank/mortgage broker is not resolved in 56 days. Independent and impartial." },
          ],
        },
      ];

  const carnetSchema = useMemo(
    () =>
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: isFr
          ? "Le carnet de l'emprunteur québécois"
          : "The Quebec borrower's address book",
        numberOfItems: sections.reduce((sum, s) => sum + s.entries.length, 0),
        itemListElement: sections.flatMap((section, sIdx) =>
          section.entries.map((entry, eIdx) => ({
            "@type": "ListItem",
            position: sIdx * 100 + eIdx + 1,
            item: {
              "@type": "Organization",
              name: entry.name,
              url: entry.url,
              description: entry.note,
            },
          })),
        ),
      }),
    [isFr, sections],
  );

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: carnetSchema }}
      />

      {/* Intro éditoriale */}
      <p className=" text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.7] text-[color:var(--color-navy-deep)]/85 first-letter:text-6xl first-letter:text-[color:var(--color-navy)] first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85] first-letter:mt-1 text-pretty hyphens-auto">
        {isFr
          ? "Voici les organismes, programmes et calculatrices que nous recommandons à un primo-acheteur du Québec. Aucun n'est affilié à L'Équipe Buteau — c'est précisément pourquoi vous pouvez vous y fier. On vous tend le carnet, même si vous ne signez pas avec nous."
          : "Here are the organizations, programs and calculators we recommend to a Quebec first-time buyer. None are affiliated with Équipe Buteau — that's precisely why you can rely on them. We hand you the address book, even if you don't sign with us."}
      </p>

      {/* Sections numérotées */}
      <div className="space-y-12 pt-10">
        {sections.map((section) => (
          <section
            key={section.numeral}
            id={isPage ? `carnet-${section.numeral}` : undefined}
            className={isPage ? "scroll-mt-24" : ""}
          >
            <div className="flex items-baseline gap-5 mb-5">
              <span className="font-[family-name:var(--font-editorial)]  text-[color:var(--color-navy)] text-3xl shrink-0 leading-none">
                {section.numeral}
              </span>
              <div className="flex-1">
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.125rem,1.6vw,1.25rem)] uppercase tracking-[0.04em] leading-snug text-balance">
                  {section.title}
                </h3>
                <div className="w-10 h-px bg-[color:var(--color-bronze)] mt-3" aria-hidden="true" />
              </div>
            </div>
            <p className=" text-base leading-[1.7] text-[color:var(--color-navy-deep)]/75 mb-6 ml-12 text-pretty hyphens-auto">
              <AutoGlossary text={section.intro} maxWraps={2} />
            </p>

            <ul className="ml-12 space-y-5">
              {section.entries.map((entry) => (
                <li
                  key={entry.name}
                  className="border-l-2 border-[color:var(--color-taupe)]/40 pl-5 hover:border-[color:var(--color-bronze)] transition-colors duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  <a
                    href={entry.url}
                    target="_blank"
                    rel={linkRel}
                    className="group inline-flex items-baseline gap-2 font-[family-name:var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base hover:text-[color:var(--color-navy)] transition-colors duration-[240ms]"
                  >
                    <span className="relative">
                      {entry.name}
                      <span
                        className="absolute left-0 -bottom-0.5 w-0 h-px bg-[color:var(--color-bronze)] group-hover:w-full transition-[width] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                        aria-hidden="true"
                      />
                    </span>
                    <ExternalLink size={12} className="shrink-0 opacity-50 group-hover:opacity-100" aria-hidden="true" />
                  </a>
                  <p className="mt-2  text-sm leading-[1.65] text-[color:var(--color-navy-deep)]/70 text-pretty hyphens-auto">
                    <AutoGlossary text={entry.note} maxWraps={2} />
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Disclaimer */}
      <section className="pt-12 mt-10 border-t border-[color:var(--color-taupe)]/40 text-center">
        <p className=" text-[color:var(--color-navy-deep)]/65 text-sm leading-relaxed max-w-xl mx-auto text-pretty hyphens-auto">
          {isFr
            ? "Ces ressources sont publiques et gratuites. Aucune commission ni rétro-rémunération. Les informations peuvent évoluer — vérifiez toujours auprès de la source officielle au moment de votre démarche."
            : "These resources are public and free. No commission or kickback. Information may evolve — always verify with the official source at the time of your process."}
        </p>
      </section>

      {/* CTA "Lire la version complète" — uniquement en mode modal */}
      {variant === "modal" && (
        <div className="mt-10 pt-8 border-t border-[color:var(--color-taupe)]/40">
          <HeartbeatCta className="cta-heartbeat--block">
            <Link
              to="/carnet"
              onClick={onClose}
              className="group flex items-center justify-between gap-4 p-5 bg-[color:var(--color-bronze)]/5 border border-[color:var(--color-bronze)]/20 hover:bg-[color:var(--color-bronze)]/10 hover:border-[color:var(--color-bronze)]/40 transition-all"
            >
              <div>
                <div className="eyebrow text-[color:var(--color-navy)] mb-1">
                  <ButeauMonogramInline className="mr-1" /> {isFr ? "Lire le carnet complet" : "Read the full address book"}
                </div>
                <div className="font-[family-name:var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[0.04em]">
                  {isFr ? "Le carnet de l'emprunteur québécois" : "The Quebec borrower's address book"}
                </div>
              </div>
              <ArrowRight
                className="w-5 h-5 text-[color:var(--color-bronze)] group-hover:text-[color:var(--color-navy)] group-hover:translate-x-0.5 transition-all shrink-0"
                aria-hidden
              />
            </Link>
          </HeartbeatCta>
        </div>
      )}
    </>
  );
}
