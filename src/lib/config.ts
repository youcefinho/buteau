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
    felix: {
      firstName: "Felix",
      lastName: "",
      role: "Coordonnateur des opérations de courtage hypothécaire",
      email: "",
    },
  },

  // Régulateur AMF (Phase 8 — placeholders à remplir par le client)
  amf: {
    certificateNumberAndrew: "",
    certificateNumberAbygaele: "",
    // Felix : pas encore courtier — coordonnateur des opérations, pas de numéro AMF
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

  // Google Reviews — URL publique de la fiche Andrew Buteau
  // Utilise par Reviews.tsx + Hero trust chip + Footer.
  // Ne PAS inventer une note chiffree (aggregateRating) sans verification publique.
  googleReviewsUrl:
    "https://www.google.com/search?q=Andrew+Buteau+Courtier+Hypothecaire",

  // Reseaux sociaux Andrew Buteau (fournis par user 2026-05-14)
  socials: {
    instagram: { url: "https://www.instagram.com/andrew.buteau/" },
    linkedin: { url: "https://ca.linkedin.com/in/andrew-buteau-a133a415a" },
    facebook: { url: "https://www.facebook.com/andrew.buteau.1/" },
  },

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
      andrew: "https://i.imgur.com/k4bZmLl.jpg",
      abygaele:
        "https://ugc.production.linktr.ee/5iBsvLTR0iXiJgoKotJw_I4Qhjq9XsUtz0u6v?io=true&size=avatar-v3_0",
      alexis: "https://i.imgur.com/MUD07Kc.jpg",
      felix: "/equipe/felix.jpeg",
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
