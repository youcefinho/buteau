/**
 * Données client centralisées — Équipe Buteau (Andrew Buteau, Planiprêt).
 *
 * JAMAIS hardcoder ces données dans les composants. Toujours `import { config } from "@/lib/config"`.
 *
 * Champs avec valeur "" (vide) sont des PLACEHOLDERS Phase 8/9 — à remplir quand le client fournit.
 */
export const config = {
  // Identité de marque
  name: "Équipe Buteau",
  brandName: "BUTEAU",
  tagline: "L'hypothèque autrement",
  cabinet: "Planiprêt Cabinet en Courtage Hypothécaire",

  // Contact
  phone: {
    raw: "+14384944567",
    display: "438-494-4567",
  },
  email: "gestion@equipebuteau.com",

  // Adresse (CONFIRMÉE via fiche Planiprêt Andrew Buteau)
  address: {
    streetAddress: "2300 boul. Saint-Martin Est, suite 200",
    addressLocality: "Laval",
    addressRegion: "QC",
    postalCode: "H7E 5P3",
    addressCountry: "CA",
  },

  // Équipe (3 membres)
  team: {
    andrew: {
      firstName: "Andrew",
      lastName: "Buteau",
      role: "Courtier hypothécaire — Lead",
      email: "abuteau@planipret.com",
    },
    abygaele: {
      firstName: "Abygaèle",
      lastName: "",
      role: "Courtière hypothécaire",
      email: "",
    },
    alexis: {
      firstName: "Alexis",
      lastName: "",
      role: "En formation de courtier hypothécaire",
      email: "",
    },
  },

  // Régulateur AMF (Phase 8 — placeholders à remplir par le client)
  amf: {
    certificateNumberAndrew: "",
    certificateNumberAbygaele: "",
    // Alexis : "en formation" → pas de numéro encore, mention adaptée dans translations
    disclaimer: {
      fr: "Les renseignements présentés sur ce site ne constituent pas une offre ni une recommandation personnalisée. Tout dossier hypothécaire est sujet à approbation par le prêteur. Les taux et conditions varient selon le profil de l'emprunteur, la propriété et l'institution financière. Équipe Buteau opère sous le permis de Planiprêt Cabinet en Courtage Hypothécaire, inscrit auprès de l'Autorité des marchés financiers (AMF).",
      en: "The information on this site does not constitute an offer or personalized recommendation. All mortgage applications are subject to lender approval. Rates and conditions vary depending on the borrower's profile, the property, and the financial institution. Équipe Buteau operates under the licence of Planiprêt Cabinet en Courtage Hypothécaire, registered with the Autorité des marchés financiers (AMF).",
    },
  },

  // Mentions légales / Loi 25 (Phase 8 — placeholders)
  legal: {
    neq: "", // À fournir
    cabinet: "Planiprêt Cabinet en Courtage Hypothécaire",
    streetAddress: "2300 boul. Saint-Martin Est, suite 200, Laval, QC H7E 5P3",
    dpoEmail: "", // À fournir Phase 8
    effectiveDate: "2026-05-08",
  },

  // Calendly (Phase 9 — placeholder)
  calendlyUrl: "",

  // GHL pipeline V6 (Phase 7 — placeholders)
  ghl: {
    locationId: "",
    trackingId: "",
    customFields: {
      // À ajouter au fur et à mesure que GHL fournit des IDs de custom fields
      // Format : `customFieldKeyName: "GHL_CUSTOM_FIELD_ID_xxxxx"`
    },
  },

  // Tracking pixels (Phase 7 — placeholders, no-op si vides)
  tracking: {
    ga4: "",          // G-XXXXXXXXXX
    metaPixel: "",    // 16 chiffres
    clarity: "",      // 10-char Clarity project
    googleAds: "",    // AW-XXXXXXXXXX
  },

  // Assets (à enrichir au fur et à mesure du build — Phase 2-3)
  assets: {
    logo: "", // À fournir / créer
    ogImage: "",
    teamPhotos: {
      andrew: "",
      abygaele: "",
      alexis: "",
    },
  },

  // 9 institutions financières partenaires (page institutions.html)
  institutions: [
    { name: "Banque Nationale", slug: "banque-nationale" },
    { name: "MCAP", slug: "mcap" },
    { name: "First National", slug: "first-national" },
    { name: "CIBC", slug: "cibc" },
    { name: "CMLS", slug: "cmls" },
    { name: "TD", slug: "td" },
    { name: "Scotia", slug: "scotia" },
    { name: "Manuvie", slug: "manuvie" },
    { name: "Desjardins", slug: "desjardins" },
  ],
} as const;

export type Config = typeof config;
