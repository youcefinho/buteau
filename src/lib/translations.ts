/**
 * Translations FR/EN — Équipe Buteau.
 *
 * Pattern BilingualLax + helper générique `ta<T>()` pour TypeScript strict avec literals divergents FR/EN.
 * Cf. skill `intralys-i18n-bilingual` pour la motivation (les "as const" sur dictionnaires bilingues
 * causent ~28 erreurs TS strict à cause des readonly tuples qui divergent entre FR et EN).
 *
 * Usage dans les composants :
 *   const { lang } = useLanguage();
 *   const t = (key) => translations[lang][key];
 *
 * Usage avec des arrays (typesafe) :
 *   const items = ta<string[]>(translations[lang], "values.list");
 */

export type Lang = "fr" | "en";

// Type permissif : permet à FR et EN de diverger sur les literals tout en gardant
// l'autocomplete sur les clés racines.
type BilingualLax = {
  [k: string]: string | string[] | { [k: string]: string | string[] | unknown } | unknown;
};

/**
 * Helper générique pour récupérer une valeur typée depuis un dictionnaire bilingue
 * sans casser la TypeScript strict. Le `as T` est intentionnel — on connaît
 * la forme attendue à l'usage (ex : `ta<string[]>(t, "list")`).
 */
export function ta<T>(dict: BilingualLax, path: string): T {
  const parts = path.split(".");
  let acc: unknown = dict;
  for (const p of parts) {
    if (acc && typeof acc === "object" && p in (acc as Record<string, unknown>)) {
      acc = (acc as Record<string, unknown>)[p];
    } else {
      return undefined as T;
    }
  }
  return acc as T;
}

export const translations = {
  fr: {
    // --- Méta / commun ---
    common: {
      brand: "Équipe Buteau",
      tagline: "L'hypothèque autrement",
      cabinet: "Planiprêt",
      callUs: "Nous joindre",
      contactCta: "Prendre rendez-vous",
      learnMore: "En savoir plus",
      backHome: "Retour à l'accueil",
    },

    // --- Navigation ---
    nav: {
      home: "Accueil",
      team: "Équipe",
      institutions: "Institutions",
      tools: "Outils",
      lexique: "Lexique",
      contact: "Contact",
      skipToContent: "Passer au contenu principal",
      languageToggle: "English",
    },

    // --- Footer ---
    footer: {
      rights: "Tous droits réservés.",
      legal: "Mentions légales",
      privacy: "Confidentialité",
      lexique: "Lexique",
      brokerLicence: "Courtage hypothécaire — Planiprêt Cabinet en Courtage Hypothécaire — Inscrit AMF",
    },

    // --- Hero Accueil (Phase 3 — sera enrichi à partir de Accueil.html) ---
    home: {
      hero: {
        eyebrow: "Courtage hypothécaire — Planiprêt",
        title: "L'hypothèque autrement",
        subtitle:
          "Une équipe de courtiers hypothécaires passionnés, dédiés à structurer votre réussite financière avec rigueur et humanité.",
        ctaPrimary: "Démarrer mon dossier",
        ctaSecondary: "Découvrir notre méthode",
      },
    },

    // --- Page Équipe (Phase 4) ---
    team: {
      hero: {
        eyebrow: "Notre équipe",
        title: "Trois courtiers, une seule rigueur.",
        subtitle:
          "Nous accompagnons primo-acheteurs, propriétaires et investisseurs avec une méthode structurée — claire, transparente, sans ambiguïté.",
      },
    },

    // --- Page Institutions (Phase 5) ---
    institutions: {
      hero: {
        eyebrow: "Nos partenaires",
        title: "Plus de 9 institutions financières à votre service.",
        subtitle:
          "Nous travaillons avec un large éventail de prêteurs pour vous offrir les meilleures conditions hypothécaires disponibles sur le marché.",
      },
    },

    // --- Page Outils (Phase 6) ---
    tools: {
      hero: {
        eyebrow: "Outils & ressources",
        title: "Des outils concrets pour des décisions éclairées.",
        subtitle:
          "Calculateur hypothécaire, guides éducatifs, capsules vidéo, documents téléchargeables — tout ce qu'il vous faut pour préparer votre dossier en confiance.",
      },
    },

    // --- AMF disclaimer (Phase 8) ---
    amf: {
      certificateLabel: "Inscrit AMF — Courtier hypothécaire",
      noPromiseDisclaimer:
        "Aucune approbation hypothécaire n'est garantie. Les conditions, taux et critères d'admissibilité varient selon le prêteur et le profil de l'emprunteur.",
    },
  },

  en: {
    common: {
      brand: "Équipe Buteau",
      tagline: "Mortgage. Differently.",
      cabinet: "Planiprêt",
      callUs: "Reach us",
      contactCta: "Book a meeting",
      learnMore: "Learn more",
      backHome: "Back to home",
    },

    nav: {
      home: "Home",
      team: "Team",
      institutions: "Lenders",
      tools: "Tools",
      lexique: "Glossary",
      contact: "Contact",
      skipToContent: "Skip to main content",
      languageToggle: "Français",
    },

    footer: {
      rights: "All rights reserved.",
      legal: "Legal notice",
      privacy: "Privacy",
      lexique: "Glossary",
      brokerLicence: "Mortgage brokerage — Planiprêt Cabinet en Courtage Hypothécaire — AMF registered",
    },

    home: {
      hero: {
        eyebrow: "Mortgage brokerage — Planiprêt",
        title: "Mortgage. Differently.",
        subtitle:
          "A team of dedicated mortgage brokers, structuring your financial success with rigor and humanity.",
        ctaPrimary: "Start my file",
        ctaSecondary: "Discover our method",
      },
    },

    team: {
      hero: {
        eyebrow: "Our team",
        title: "Three brokers, one rigor.",
        subtitle:
          "We support first-time buyers, homeowners and investors with a structured method — clear, transparent, no ambiguity.",
      },
    },

    institutions: {
      hero: {
        eyebrow: "Our partners",
        title: "Access to 9+ financial institutions.",
        subtitle:
          "We work with a wide range of lenders to bring you the best mortgage conditions available on the market.",
      },
    },

    tools: {
      hero: {
        eyebrow: "Tools & resources",
        title: "Concrete tools for informed decisions.",
        subtitle:
          "Mortgage calculator, educational guides, video capsules, downloadable documents — everything you need to confidently prepare your file.",
      },
    },

    amf: {
      certificateLabel: "AMF registered — Mortgage broker",
      noPromiseDisclaimer:
        "No mortgage approval is guaranteed. Conditions, rates and eligibility criteria vary based on the lender and borrower profile.",
    },
  },
} as const satisfies Record<Lang, BilingualLax>;

export type TranslationKeys = typeof translations.fr;
