/**
 * Glossaire hypothécaire — 14 termes essentiels pour le marché québécois résidentiel.
 *
 * Sources :
 * - SCHL (Société canadienne d'hypothèques et de logement)
 * - AMF Quebec (mortgage broker glossary officiel)
 * - Loi sur les courtiers hypothécaires du Québec
 * - Code civil du Québec (acte de vente)
 * - ARC (RAP, CELIAPP)
 *
 * Cf. skill `intralys-glossary` + `intralys-outils-immobiliers-qc`.
 *
 * Schema.org DefinedTermSet : exposé sur /lexique pour SEO.
 */

export type GlossaryTerm = {
  slug: string;
  term: { fr: string; fr_alt?: string[]; en: string };
  definition: { fr: string; en: string };
  source?: string; // organisme/loi de référence
};

export const glossary: GlossaryTerm[] = [
  {
    slug: "mise-de-fonds",
    term: { fr: "Mise de fonds", en: "Down payment" },
    definition: {
      fr: "Somme initiale versée par l'acheteur lors de l'achat d'une propriété, exprimée en pourcentage du prix d'achat. Au Canada, elle est généralement d'un minimum de 5 % pour les propriétés résidentielles de moins de 500 000 $.",
      en: "Initial sum paid by the buyer when purchasing a property, expressed as a percentage of the purchase price. In Canada, it is generally a minimum of 5% for residential properties under $500,000.",
    },
    source: "SCHL",
  },
  {
    slug: "schl",
    term: { fr: "SCHL", fr_alt: ["Société canadienne d'hypothèques et de logement"], en: "CMHC" },
    definition: {
      fr: "Société canadienne d'hypothèques et de logement — agence fédérale qui assure les prêts hypothécaires lorsque la mise de fonds est inférieure à 20 %. Cette assurance protège le prêteur en cas de défaut de paiement.",
      en: "Canada Mortgage and Housing Corporation — federal agency that insures mortgage loans when the down payment is less than 20%. The insurance protects the lender in case of default.",
    },
    source: "Gouvernement du Canada",
  },
  {
    slug: "prequalification",
    term: { fr: "Préqualification", en: "Pre-qualification" },
    definition: {
      fr: "Évaluation préliminaire (sans vérification approfondie) du montant d'hypothèque qu'un emprunteur pourrait obtenir, basée sur ses déclarations de revenus et de dettes. Sert à orienter la recherche immobilière.",
      en: "Preliminary estimate (without deep verification) of the mortgage amount a borrower could obtain, based on their stated income and debts. Used to guide the property search.",
    },
  },
  {
    slug: "preapprobation",
    term: { fr: "Préapprobation", en: "Pre-approval" },
    definition: {
      fr: "Engagement formel d'un prêteur quant au montant maximal qu'il accordera, valide pour une période déterminée (typiquement 90 à 120 jours), souvent assorti d'un taux d'intérêt garanti. Plus solide qu'une préqualification.",
      en: "Formal lender commitment regarding the maximum amount they will grant, valid for a set period (typically 90 to 120 days), often with a guaranteed interest rate. Stronger than a pre-qualification.",
    },
  },
  {
    slug: "taux-fixe",
    term: { fr: "Taux fixe", en: "Fixed rate" },
    definition: {
      fr: "Taux d'intérêt qui demeure inchangé pendant toute la durée du terme hypothécaire. Offre une stabilité prévisible des paiements mensuels, sans exposition aux fluctuations du marché.",
      en: "Interest rate that remains unchanged throughout the mortgage term. Provides predictable monthly payment stability without exposure to market fluctuations.",
    },
  },
  {
    slug: "taux-variable",
    term: { fr: "Taux variable", en: "Variable rate" },
    definition: {
      fr: "Taux d'intérêt qui varie en fonction du taux préférentiel des banques. Les paiements peuvent rester fixes (la portion intérêt/capital varie) ou ajustables (paiement total qui change selon le taux).",
      en: "Interest rate that varies based on banks' prime rate. Payments can remain fixed (with interest/principal proportions varying) or be adjustable (total payment changing with the rate).",
    },
  },
  {
    slug: "refinancement",
    term: { fr: "Refinancement", en: "Refinancing" },
    definition: {
      fr: "Action de remplacer un prêt hypothécaire existant par un nouveau, généralement pour libérer de l'équité, consolider des dettes, ou obtenir un meilleur taux. Au Canada, on peut refinancer jusqu'à 80 % de la valeur de la propriété.",
      en: "Replacing an existing mortgage with a new one, generally to free up equity, consolidate debts, or get a better rate. In Canada, refinancing can go up to 80% of the property's value.",
    },
  },
  {
    slug: "renouvellement",
    term: { fr: "Renouvellement", en: "Renewal" },
    definition: {
      fr: "Reconduction du prêt hypothécaire à la fin d'un terme (ex. : 5 ans), avec négociation d'un nouveau taux et de nouvelles conditions. Le solde du prêt est conservé. C'est un moment opportun pour magasiner les taux.",
      en: "Mortgage renewal at the end of a term (e.g., 5 years), with negotiation of a new rate and new conditions. The loan balance is kept. A prime moment to shop rates.",
    },
  },
  {
    slug: "marge-hypothecaire",
    term: { fr: "Marge hypothécaire", fr_alt: ["MCMH"], en: "Home equity line of credit (HELOC)" },
    definition: {
      fr: "Marge de crédit garantie par la valeur nette de la propriété (équité). Au Canada, on peut généralement emprunter jusqu'à 65 % de la valeur de la propriété, avec un total emprunté (hypothèque + marge) limité à 80 %.",
      en: "Line of credit secured by the home's equity. In Canada, you can typically borrow up to 65% of the property's value, with total borrowed (mortgage + line) capped at 80%.",
    },
  },
  {
    slug: "ratio-abd",
    term: { fr: "Ratio ABD", fr_alt: ["Amortissement brut de la dette"], en: "GDS ratio" },
    definition: {
      fr: "Ratio d'amortissement brut de la dette — proportion des revenus bruts mensuels consacrée aux frais de logement (hypothèque + taxes + chauffage + 50 % des frais de copropriété). Plafonné à 39 % par les prêteurs canadiens conventionnels.",
      en: "Gross Debt Service ratio — proportion of gross monthly income dedicated to housing costs (mortgage + taxes + heating + 50% of condo fees). Capped at 39% by conventional Canadian lenders.",
    },
    source: "SCHL",
  },
  {
    slug: "ratio-atd",
    term: { fr: "Ratio ATD", fr_alt: ["Amortissement total de la dette"], en: "TDS ratio" },
    definition: {
      fr: "Ratio d'amortissement total de la dette — proportion des revenus bruts mensuels consacrée à l'ensemble des dettes (logement + cartes de crédit + prêt auto + autres). Plafonné à 44 % par les prêteurs canadiens conventionnels.",
      en: "Total Debt Service ratio — proportion of gross monthly income dedicated to all debts (housing + credit cards + auto loan + other). Capped at 44% by conventional Canadian lenders.",
    },
    source: "SCHL",
  },
  {
    slug: "rap",
    term: { fr: "RAP", fr_alt: ["Régime d'accession à la propriété"], en: "HBP" },
    definition: {
      fr: "Régime d'accession à la propriété — programme fédéral permettant à un primo-acheteur de retirer jusqu'à 60 000 $ de son REER (120 000 $ par couple) sans impôt, à condition de rembourser sur 15 ans.",
      en: "Home Buyers' Plan — federal program allowing a first-time buyer to withdraw up to $60,000 from their RRSP ($120,000 per couple) tax-free, with repayment over 15 years.",
    },
    source: "Agence du revenu du Canada",
  },
  {
    slug: "celiapp",
    term: { fr: "CELIAPP", fr_alt: ["Compte d'épargne libre d'impôt pour l'achat d'une première propriété"], en: "FHSA" },
    definition: {
      fr: "Compte d'épargne libre d'impôt pour l'achat d'une première propriété — instauré en 2023, plafond de 8 000 $/an et 40 000 $ à vie, contributions déductibles d'impôt et retraits non imposables pour l'achat.",
      en: "First Home Savings Account — introduced in 2023, $8,000/year and $40,000 lifetime cap, contributions tax-deductible, withdrawals tax-free for home purchase.",
    },
    source: "Agence du revenu du Canada",
  },
  {
    slug: "acte-de-vente",
    term: { fr: "Acte de vente", en: "Deed of sale" },
    definition: {
      fr: "Document juridique notarié qui officialise le transfert de propriété d'un immeuble entre vendeur et acheteur. Au Québec, il doit obligatoirement être signé devant notaire et publié au Registre foncier.",
      en: "Notarized legal document that officializes the transfer of ownership of a property between seller and buyer. In Quebec, it must be signed before a notary and published in the Land Register.",
    },
    source: "Code civil du Québec",
  },
];
