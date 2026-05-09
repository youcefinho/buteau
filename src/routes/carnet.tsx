import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";

/**
 * /carnet — « Le carnet du primo-acchéteur ».
 *
 * Pourquoi NOVEL : aucun courtier hypothécaire au Quebec n'offre une page de
 * ressources EXTERNES (gouvernement, ordres pros, organismes officiels). C'est
 * un acte de service — on tend le carnet d'adresses même si le visiteur ne
 * signe pas avec nous. Pattern « carnet de week-end » de magazine luxe.
 *
 * Toutes les ressources pointent vers des organismes RÉELS et OFFICIELS du
 * Quebec — chambres professionnelles, programmes gouvernementaux, organismes
 * d'autoréglementation. Aucune référence inventée.
 */
export const Route = createFileRoute("/carnet")({
  component: CarnetPage,
});

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

function CarnetPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const sections: CarnetSection[] = isFr
    ? [
        {
          numeral: "I",
          title: "Notaires & actes",
          intro:
            "Trouver un notaire est une étape obligatoire au Quebec — il signe l'acte de vente et l'acte hypothécaire. Voici les répertoires officiels.",
          entries: [
            { name: "Chambre des notaires du Québec", url: "https://www.cnq.org", note: "Trouver un notaire par région, code postal ou langue de service." },
            { name: "OACIQ — Organisme d'autoréglementation du courtage immobilier du Québec", url: "https://www.oaciq.com", note: "Vérifier le permis d'un courtier immobilier (à ne pas confondre avec courtier hypothécaire AMF)." },
          ],
        },
        {
          numeral: "II",
          title: "Subventions & programmes",
          intro:
            "Les programmes officiels qui peuvent réduire votre mise de fonds, vos taxes ou votre fardeau hypothécaire de premier acchéteur.",
          entries: [
            { name: "RAP — Régime d'accession à la propriété", url: "https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/reer-rpac/regime-accession-propriete-rap.html", note: "Retrait jusqu'à 60 000 $ de votre REER sans impôt pour mise de fonds (premier achat ou retour à la propriété 4+ ans)." },
            { name: "CELIAPP — Compte d'épargne libre d'impôt pour l'achat d'une première propriété", url: "https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/celiapp.html", note: "Cotisez jusqu'à 8 000 $/an (40 000 $ à vie), retraits non imposables si destinés à un premier achat." },
            { name: "Crédit d'impôt pour l'achat d'une habitation (CIAH)", url: "https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/tout-votre-declaration-revenus/declaration-revenus/remplir-declaration-revenus/deductions-credits-depenses/ligne-31270-montant-pour-habitation-admissible.html", note: "Crédit d'impôt fédéral non remboursable pouvant atteindre 1 500 $ pour les primo-acchéteurs." },
          ],
        },
        {
          numeral: "III",
          title: "Inspecteurs & expertise",
          intro:
            "L'inspection préachat n'est pas légalement obligatoire mais fortement recommandée. Voici les ordres et bases de données pour vérifier la qualification.",
          entries: [
            { name: "AIBQ — Association des inspecteurs en bâtiment du Québec", url: "https://www.aibq.qc.ca", note: "Répertoire d'inspecteurs membres respectant un code de déontologie." },
            { name: "RBQ — Régie du bâtiment du Québec", url: "https://www.rbq.gouv.qc.ca", note: "Vérifier la licence d'un entrepreneur ou consulter les antécédents disciplinaires avant rénovation." },
          ],
        },
        {
          numeral: "IV",
          title: "Assurances & garanties",
          intro:
            "Si votre mise de fonds est inférieure à 20 %, l'assurance prêt hypothécaire est obligatoire. Trois assureurs canadiens dominent ce marché.",
          entries: [
            { name: "SCHL — Société canadienne d'hypothèques et de logement", url: "https://www.schl.ca", note: "Assureur public fédéral, principal acteur du marché. Outils et calculatrices gratuits." },
            { name: "Sagen Canada", url: "https://www.sagen.ca/fr", note: "Assureur privé, alternative à la SCHL pour certains profils." },
            { name: "Canada Guaranty", url: "https://www.canadaguaranty.ca/fr", note: "Troisième assureur privé du marché, conditions distinctes selon le prêteur." },
          ],
        },
        {
          numeral: "V",
          title: "Outils gouvernementaux",
          intro:
            "Calculatrices, droits de mutation (« taxe de bienvenue ») et outils officiels — directement à la source, sans intermédiaire.",
          entries: [
            { name: "Calculatrice de droits de mutation immobilière (Ville de Laval)", url: "https://www.laval.ca", note: "Estimer la « taxe de bienvenue » payable au notaire selon la valeur de la propriété." },
            { name: "Évaluation municipale — Régie du logement", url: "https://www.tal.gouv.qc.ca", note: "Tribunal administratif du logement — droits du locataire/propriétaire." },
            { name: "Office de la protection du consommateur du Québec", url: "https://www.opc.gouv.qc.ca", note: "Pour signaler ou comprendre les pratiques commerciales en immobilier." },
          ],
        },
      ]
    : [
        {
          numeral: "I",
          title: "Notaries & deeds",
          intro:
            "Hiring a notary is mandatory in Quebec — they sign the deed of sale and the mortgage deed. Here are the official directories.",
          entries: [
            { name: "Chambre des notaires du Québec", url: "https://www.cnq.org", note: "Find a notary by region, postal code or service language." },
            { name: "OACIQ — Quebec real estate brokerage self-regulatory body", url: "https://www.oaciq.com", note: "Verify a real estate broker's license (not to be confused with AMF mortgage broker)." },
          ],
        },
        {
          numeral: "II",
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
          numeral: "III",
          title: "Inspectors & expertise",
          intro:
            "Pre-purchase inspection isn't legally required but strongly recommended. Here are the bodies and databases to verify qualification.",
          entries: [
            { name: "AIBQ — Quebec association of building inspectors", url: "https://www.aibq.qc.ca", note: "Directory of member inspectors held to a code of conduct." },
            { name: "RBQ — Quebec building authority", url: "https://www.rbq.gouv.qc.ca", note: "Verify a contractor's license or consult disciplinary records before renovating." },
          ],
        },
        {
          numeral: "IV",
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
          numeral: "V",
          title: "Government tools",
          intro:
            "Calculators, transfer duties (« welcome tax ») and official tools — straight from the source, no intermediary.",
          entries: [
            { name: "Real estate transfer duties calculator (City of Laval)", url: "https://www.laval.ca", note: "Estimate the « welcome tax » payable to the notary based on property value." },
            { name: "Quebec Housing Tribunal", url: "https://www.tal.gouv.qc.ca", note: "Administrative housing tribunal — tenant/owner rights." },
            { name: "Quebec Consumer Protection Office", url: "https://www.opc.gouv.qc.ca", note: "To report or understand commercial practices in real estate." },
          ],
        },
      ];

  return (
    <LegalPageWrap
      eyebrow={isFr ? "Service éditorial" : "Editorial service"}
      title={isFr ? "Le carnet" : "The address book"}
      lastUpdated={
        isFr
          ? "Le carnet du primo-acchéteur — Édition Quebec MMXXVI"
          : "The first-time buyer's address book — Edition Quebec MMXXVI"
      }
    >
      {/* Intro éditoriale */}
      <p className="font-[var(--font-editorial)] italic text-lg leading-[1.7] text-[color:var(--color-navy-deep)]/85 first-letter:font-[var(--font-editorial)] first-letter:italic first-letter:text-6xl first-letter:text-[color:var(--color-bronze-deep)] first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85] first-letter:mt-1">
        {isFr
          ? "Voici les organismes, programmes et calculatrices que nous recommandons à un primo-acchéteur du Québec. Aucun n'est affilié à L'Équipe Buteau — c'est précisément pourquoi vous pouvez vous y fier. On vous tend le carnet, même si vous ne signez pas avec nous."
          : "Here are the organizations, programs and calculators we recommend to a Quebec first-time buyer. None are affiliated with Équipe Buteau — that's precisely why you can rely on them. We hand you the address book, even if you don't sign with us."}
      </p>

      {/* Sections numérotées */}
      <div className="space-y-14 pt-10">
        {sections.map((section) => (
          <section key={section.numeral}>
            {/* Header section avec numéro romain */}
            <div className="flex items-baseline gap-5 mb-5">
              <span className="font-[var(--font-editorial)] italic text-[color:var(--color-bronze-deep)] text-3xl shrink-0 leading-none">
                {section.numeral}
              </span>
              <div className="flex-1">
                <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-xl md:text-2xl uppercase tracking-[0.04em] leading-snug">
                  {section.title}
                </h2>
                <div className="w-10 h-px bg-[color:var(--color-bronze)] mt-3" aria-hidden="true" />
              </div>
            </div>
            <p className="font-[var(--font-editorial)] italic text-base leading-[1.7] text-[color:var(--color-navy-deep)]/75 mb-6 ml-12">
              {section.intro}
            </p>

            {/* Liste entries */}
            <ul className="ml-12 space-y-5">
              {section.entries.map((entry) => (
                <li key={entry.name} className="border-l-2 border-[color:var(--color-taupe)]/40 pl-5 hover:border-[color:var(--color-bronze)] transition-colors duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="group inline-flex items-baseline gap-2 font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base hover:text-[color:var(--color-bronze-deep)] transition-colors duration-[240ms]"
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
                  <p className="mt-2 font-[var(--font-editorial)] italic text-sm leading-[1.65] text-[color:var(--color-navy-deep)]/70">
                    {entry.note}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Note de pied — disclaimer */}
      <section className="pt-12 mt-10 border-t border-[color:var(--color-taupe)]/40 text-center">
        <p className="font-[var(--font-editorial)] italic text-[color:var(--color-navy-deep)]/65 text-sm leading-relaxed max-w-xl mx-auto">
          {isFr
            ? "Ces ressources sont publiques et gratuites. Aucune commission ni rétro-rémunération. Les informations peuvent évoluer — vérifiez toujours auprès de la source officielle au moment de votre démarche."
            : "These resources are public and free. No commission or kickback. Information may evolve — always verify with the official source at the time of your process."}
        </p>
      </section>
    </LegalPageWrap>
  );
}
