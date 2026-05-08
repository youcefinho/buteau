/**
 * Translations FR/EN — Équipe Buteau.
 *
 * Pattern BilingualLax + helper générique `ta<T>()` pour TS strict avec literals divergents FR/EN.
 * Cf. skill `intralys-i18n-bilingual`.
 *
 * Usage :
 *   const { t } = useLanguage();
 *   t("home.hero.title")          → string
 *   t<string[]>("home.values.list") → string[]
 */

export type Lang = "fr" | "en";

type BilingualLax = {
  [k: string]: string | string[] | { [k: string]: string | string[] | unknown } | unknown;
};

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
    common: {
      brand: "Équipe Buteau",
      tagline: "L'hypothèque autrement",
      cabinet: "Planiprêt",
      callUs: "Nous joindre",
      contactCta: "Prendre rendez-vous",
      learnMore: "En savoir plus",
      backHome: "Retour à l'accueil",
      writeUs: "Nous écrire",
      seeAllReviews: "Lire tous nos avis Google",
      seeAllTools: "Voir tous nos outils",
    },

    nav: {
      home: "Accueil",
      team: "Équipe",
      institutions: "Institutions",
      tools: "Outils",
      lexique: "Lexique",
      contact: "Contact",
      skipToContent: "Passer au contenu principal",
      languageToggle: "English",
      bookAppointment: "Prendre rendez-vous",
      clientLogin: "Espace client",
    },

    footer: {
      rights: "Tous droits réservés.",
      legal: "Mentions légales",
      privacy: "Confidentialité",
      lexique: "Lexique",
      brokerLicence:
        "Courtage hypothécaire — Planiprêt Cabinet en Courtage Hypothécaire — Inscrit AMF",
      contact: "Contact",
      sitemap: "Navigation",
      legalLabel: "Légal",
      territoryLabel: "Territoire desservi",
      territoryValue: "Tout le Québec",
      websiteBy: "Site web par",
    },

    home: {
      hero: {
        eyebrow: "Courtage hypothécaire — Planiprêt",
        title: "L'hypothèque autrement",
        subtitle:
          "Des stratégies hypothécaires structurées et professionnelles. L'expérience client au cœur de notre succès.",
        ctaPrimary: "Prendre rendez-vous",
        ctaSecondary: "Découvrir notre équipe",
      },

      partners: {
        eyebrow: "Nos partenaires",
        title: "Plus de 9 institutions financières",
        subtitle: "Quelques-unes de nos institutions financières partenaires.",
        cta: "Consulter les institutions financières",
      },

      teamTeaser: {
        eyebrow: "Notre équipe",
        title: "Trois courtiers, une seule rigueur",
        andrewName: "Andrew Buteau",
        andrewRole: "Courtier hypothécaire & Fondateur",
        abygaeleName: "Abygaèle Gagné",
        abygaeleRole: "Coordonnatrice exécutive",
        alexisName: "Alexis Buteau",
        alexisRole: "Assistant en gestion hypothécaire",
        cta: "Découvrir notre équipe",
      },

      services: {
        eyebrow: "Nos services",
        title: "Quatre services, une seule philosophie",
        items: [
          {
            title: "Achat d'une propriété",
            desc: "Accompagnement complet pour l'acquisition de votre résidence principale, secondaire ou immeuble à revenus.",
          },
          {
            title: "Refinancement",
            desc: "Restructuration de votre financement pour optimiser vos liquidités et votre taux d'intérêt.",
          },
          {
            title: "Renouvellement",
            desc: "Analyse de marché et négociation pour obtenir les meilleures conditions lors du renouvellement.",
          },
          {
            title: "Investissement",
            desc: "Stratégies de financement structurées pour développer votre portefeuille immobilier.",
          },
        ],
      },

      mission: {
        eyebrow: "Notre mission",
        title: "L'hypothèque autrement",
        bodyP1Lead: "Chez ",
        bodyP1Brand: "L'Équipe BUTEAU",
        bodyP1Continued:
          ", notre priorité est d'offrir un service rapide, efficace et humain. Notre mission est de simplifier le processus de financement, d'éliminer les zones grises et de créer des stratégies personnalisées qui s'adaptent à vos besoins uniques.",
        bodyP2Lead: "En ",
        bodyP2Year: "2025",
        bodyP2Continued: ", nous avons accompagné plus de ",
        bodyP2Stat: "200 familles",
        bodyP2End:
          " à travers le Québec. Avec rigueur et disponibilité, nous propulsons chaque projet vers la réussite.",
        values: [
          {
            title: "Analyse des données",
            desc: "Approche structurée basée sur vos chiffres pour des décisions optimales.",
          },
          {
            title: "Expérience étendue",
            desc: "Plus de 200 familles accompagnées en 2025 à travers la province.",
          },
          {
            title: "Équipe professionnelle",
            desc: "Courtiers rigoureux et disponibles pour vous accompagner à chaque étape.",
          },
          {
            title: "Éventail de prêteurs",
            desc: "Accès à plusieurs institutions pour trouver le meilleur taux et conditions.",
          },
        ],
      },

      tools: {
        eyebrow: "Outils & ressources",
        title: "Tout ce qu'il vous faut pour avancer",
        subtitle: "Explorez nos ressources pour vous accompagner.",
        items: [
          {
            title: "Guides éducatifs",
            desc: "Comprendre le financement hypothécaire simplement.",
          },
          {
            title: "Capsules éducatives",
            desc: "Vidéos courtes pour des conseils rapides et efficaces.",
          },
          {
            title: "Blog",
            desc: "Articles, tendances et analyses de marché.",
          },
          {
            title: "Documents",
            desc: "Checklists et formulaires à télécharger.",
          },
        ],
        cta: "Voir tous nos outils",
      },

      reviews: {
        eyebrow: "Témoignages",
        title: "Ce que nos clients disent",
        googleBadgeLabel: "Évaluation Excellente",
        // Note Google : a verifier en mode incognito avant d'inscrire la note dans
        // Schema.org aggregateRating (skill intralys-compliance, regle A8 anti-pattern).
        // Pour l'instant, on omet le rating chiffre dans le Schema, mais on affiche
        // le Google trust badge sans rating dur en attendant la verification.
        items: [
          {
            quote:
              "Un service professionnel et rassurant pour notre premier achat d'une propriété. L'équipe a su nous obtenir des conditions exceptionnelles et nous a accompagnés à chaque étape avec une grande clarté.",
            authorInitial: "M",
            author: "Maxime T.",
          },
          {
            quote:
              "Efficacité redoutable pour notre refinancement. Andrew est rigoureux et transparent, il a pris le temps d'analyser tous nos chiffres pour structurer une stratégie vraiment avantageuse.",
            authorInitial: "C",
            author: "Catherine P.",
          },
          {
            quote:
              "Disponibilité incroyable, ils font les choses autrement. Le suivi de dossier avec Abygaèle et Alexis était impeccable. On se sent entre de bonnes mains du début à la fin. Fortement recommandé.",
            authorInitial: "J",
            author: "Jonathan D.",
          },
        ],
      },

      contact: {
        eyebrow: "Contact",
        title: "Contactez-nous",
        subtitle: "Prêt à structurer votre projet hypothécaire ?",
        emailCta: "Écrire un courriel",
        territoryLabel: "Territoire desservi",
        territoryValue: "Nous finançons vos propriétés partout à travers le Québec.",
        formLabel: "Demande d'information",
      },

      faq: {
        eyebrow: "FAQ",
        title: "Questions fréquemment posées",
        moreQuestionsLabel: "Vous avez d'autres questions ?",
        items: [
          {
            q: "Quel est le processus pour obtenir une pré-qualification ?",
            a: "La pré-qualification est simple et rapide. Nous analysons votre situation financière, vos revenus, vos dettes et votre historique de crédit. Une fois complétée, vous recevrez une lettre de pré-qualification valide pour négocier une propriété en toute confiance.",
          },
          {
            q: "Combien de temps prend le processus hypothécaire ?",
            a: "Généralement, le processus complet prend entre 30 et 45 jours du moment où l'offre d'achat est acceptée jusqu'à la clôture. Notre équipe travaille pour minimiser ce délai grâce à notre efficacité et nos relations privilégiées avec les prêteurs.",
          },
          {
            q: "Quelle est la mise de fonds minimale requise ?",
            a: "La mise de fonds minimale est généralement de 5 % pour l'achat d'une première propriété. Pour les investissements ou les propriétés de luxe, elle peut être plus élevée. Nous vous aiderons à explorer les options comme le RAP ou le CELIAPP pour réduire vos coûts initiaux.",
          },
          {
            q: "Taux fixe ou taux variable : lequel choisir ?",
            a: "Le choix dépend de votre situation et de votre tolérance au risque. Un taux fixe offre une stabilité prévisible, tandis qu'un taux variable peut être avantageux en période de baisse des taux. Notre équipe analysera vos options pour recommander la meilleure stratégie.",
          },
          {
            q: "Y a-t-il des frais cachés ?",
            a: "Non. Nous croyons à la transparence totale. Tous les frais vous sont communiqués dès le départ et expliqués clairement. Notre rôle est de vous accompagner sans surprise, en sachant exactement ce que vous devez payer.",
          },
          {
            q: "Pouvez-vous refinancer ma propriété actuelle ?",
            a: "Absolument. Le refinancement est l'une de nos spécialités. Que ce soit pour réduire vos paiements, libérer de l'équité ou consolider vos dettes, nous trouvons la meilleure solution adaptée à votre situation financière.",
          },
          {
            q: "Comment puis-je améliorer mon score de crédit ?",
            a: "Plusieurs actions peuvent améliorer votre score : payer vos factures à temps, réduire vos soldes de cartes de crédit, et éviter les nouvelles demandes de crédit inutiles. Nous pouvons vous conseiller sur des stratégies pour optimiser votre profil de crédit.",
          },
        ],
      },
    },

    team: {
      hero: {
        eyebrow: "Notre équipe",
        title: "Une équipe de courtiers hypothécaires passionnés",
        subtitle:
          "Dédiés à structurer votre réussite financière avec rigueur et humanité.",
      },
      method: {
        eyebrow: "Notre méthode",
        title: "Trois piliers, une exécution",
        items: [
          {
            label: "Collaboration",
            desc: "Nous travaillons à vos côtés, en transparence totale, du premier appel à la clôture.",
          },
          {
            label: "Analyse",
            desc: "Chaque dossier est étudié sur mesure : revenus, dettes, projet, profil de risque.",
          },
          {
            label: "Exécution",
            desc: "Une équipe rigoureuse qui structure et négocie pour vous, sans zones grises.",
          },
        ],
      },
    },

    institutions: {
      hero: {
        eyebrow: "Nos partenaires",
        title: "9 institutions financières à votre service",
        subtitle:
          "Nous travaillons avec un large éventail de prêteurs pour vous offrir les meilleures conditions hypothécaires disponibles sur le marché.",
      },
      insurance: {
        eyebrow: "Bon à savoir",
        title: "Protégez votre investissement",
        body: "Une bonne assurance habitation est essentielle pour sécuriser votre investissement immobilier. Nous pouvons vous orienter vers nos partenaires de confiance pour évaluer vos options et obtenir les meilleures conditions.",
      },
      missingLabel: "Votre institution ne figure pas dans la liste ?",
      missingCta: "Parlons-en ensemble",
    },

    tools: {
      hero: {
        eyebrow: "Outils & ressources",
        title: "Des outils concrets pour des décisions éclairées",
        subtitle:
          "Calculateur hypothécaire, guides éducatifs, capsules vidéo, documents téléchargeables — tout ce qu'il vous faut pour préparer votre dossier en confiance.",
      },
    },

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
      contactCta: "Book an appointment",
      learnMore: "Learn more",
      backHome: "Back to home",
      writeUs: "Email us",
      seeAllReviews: "Read all our Google reviews",
      seeAllTools: "See all our tools",
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
      bookAppointment: "Book a meeting",
      clientLogin: "Client portal",
    },

    footer: {
      rights: "All rights reserved.",
      legal: "Legal notice",
      privacy: "Privacy",
      lexique: "Glossary",
      brokerLicence:
        "Mortgage brokerage — Planiprêt Cabinet en Courtage Hypothécaire — AMF registered",
      contact: "Contact",
      sitemap: "Sitemap",
      legalLabel: "Legal",
      territoryLabel: "Service area",
      territoryValue: "All of Quebec",
      websiteBy: "Website by",
    },

    home: {
      hero: {
        eyebrow: "Mortgage brokerage — Planiprêt",
        title: "Mortgage. Differently.",
        subtitle:
          "Structured, professional mortgage strategies. Client experience at the heart of our success.",
        ctaPrimary: "Book an appointment",
        ctaSecondary: "Meet our team",
      },

      partners: {
        eyebrow: "Our partners",
        title: "9+ financial institutions",
        subtitle: "A few of our financial institution partners.",
        cta: "Browse all financial institutions",
      },

      teamTeaser: {
        eyebrow: "Our team",
        title: "Three brokers, one rigor",
        andrewName: "Andrew Buteau",
        andrewRole: "Mortgage broker & Founder",
        abygaeleName: "Abygaèle Gagné",
        abygaeleRole: "Executive coordinator",
        alexisName: "Alexis Buteau",
        alexisRole: "Mortgage management assistant",
        cta: "Meet our team",
      },

      services: {
        eyebrow: "Our services",
        title: "Four services, one philosophy",
        items: [
          {
            title: "Property purchase",
            desc: "Full support for buying your principal residence, second home, or income property.",
          },
          {
            title: "Refinancing",
            desc: "Restructure your financing to optimize your liquidity and interest rate.",
          },
          {
            title: "Renewal",
            desc: "Market analysis and negotiation to secure the best conditions at renewal time.",
          },
          {
            title: "Investment",
            desc: "Structured financing strategies to grow your real-estate portfolio.",
          },
        ],
      },

      mission: {
        eyebrow: "Our mission",
        title: "Mortgage. Differently.",
        bodyP1Lead: "At ",
        bodyP1Brand: "Équipe BUTEAU",
        bodyP1Continued:
          ", our priority is to deliver a fast, efficient and human service. Our mission is to simplify the financing process, eliminate grey areas, and design personalized strategies that fit your unique needs.",
        bodyP2Lead: "In ",
        bodyP2Year: "2025",
        bodyP2Continued: ", we supported more than ",
        bodyP2Stat: "200 families",
        bodyP2End:
          " across Quebec. With rigor and availability, we move every project toward success.",
        values: [
          {
            title: "Data-driven analysis",
            desc: "A structured approach grounded in your numbers for optimal decisions.",
          },
          {
            title: "Extensive experience",
            desc: "200+ families supported in 2025 across the province.",
          },
          {
            title: "Professional team",
            desc: "Rigorous, available brokers guiding you at every step.",
          },
          {
            title: "Wide lender network",
            desc: "Access to multiple institutions for the best rate and conditions.",
          },
        ],
      },

      tools: {
        eyebrow: "Tools & resources",
        title: "Everything you need to move forward",
        subtitle: "Browse our resources designed to support you.",
        items: [
          { title: "Educational guides", desc: "Understand mortgage financing the simple way." },
          { title: "Educational shorts", desc: "Quick videos for rapid, useful tips." },
          { title: "Blog", desc: "Articles, market trends and analysis." },
          { title: "Documents", desc: "Downloadable checklists and forms." },
        ],
        cta: "See all our tools",
      },

      reviews: {
        eyebrow: "Testimonials",
        title: "What our clients say",
        googleBadgeLabel: "Excellent rating",
        items: [
          {
            quote:
              "A professional and reassuring service for our first home purchase. The team secured exceptional conditions and walked us through every step with great clarity.",
            authorInitial: "M",
            author: "Maxime T.",
          },
          {
            quote:
              "Outstanding efficiency for our refinancing. Andrew is rigorous and transparent — he took the time to analyze every number to structure a truly advantageous strategy.",
            authorInitial: "C",
            author: "Catherine P.",
          },
          {
            quote:
              "Incredible availability — they really do things differently. File follow-up with Abygaèle and Alexis was flawless. We felt in good hands from start to finish. Highly recommended.",
            authorInitial: "J",
            author: "Jonathan D.",
          },
        ],
      },

      contact: {
        eyebrow: "Contact",
        title: "Get in touch",
        subtitle: "Ready to structure your mortgage project?",
        emailCta: "Email us",
        territoryLabel: "Service area",
        territoryValue: "We finance your properties anywhere in Quebec.",
        formLabel: "Request information",
      },

      faq: {
        eyebrow: "FAQ",
        title: "Frequently asked questions",
        moreQuestionsLabel: "Got more questions?",
        items: [
          {
            q: "What's the pre-qualification process?",
            a: "Pre-qualification is simple and fast. We analyze your financial situation — income, debts, credit history — and once complete, you receive a pre-qualification letter to negotiate a property with confidence.",
          },
          {
            q: "How long does the mortgage process take?",
            a: "The full process typically takes 30 to 45 days from accepted offer to closing. Our team works to minimize that delay through efficiency and strong lender relationships.",
          },
          {
            q: "What's the minimum down payment?",
            a: "The minimum down payment is generally 5% for a first home purchase. For investment or luxury properties, it may be higher. We help explore options like HBP (RRSP) or FHSA (CELIAPP) to reduce your initial cost.",
          },
          {
            q: "Fixed or variable rate — which to choose?",
            a: "It depends on your situation and risk tolerance. A fixed rate offers predictable stability; a variable rate can pay off in falling-rate environments. We analyze your options and recommend the best strategy.",
          },
          {
            q: "Are there hidden fees?",
            a: "No. We believe in total transparency. All fees are disclosed and explained from day one. Our role is to support you with no surprises — you know exactly what you owe.",
          },
          {
            q: "Can you refinance my current property?",
            a: "Absolutely. Refinancing is one of our specialties. Whether to reduce your payments, free up equity, or consolidate debts, we find the best fit for your financial situation.",
          },
          {
            q: "How can I improve my credit score?",
            a: "Several actions help: paying bills on time, reducing credit-card balances, avoiding unnecessary new credit applications. We can advise on strategies to optimize your credit profile.",
          },
        ],
      },
    },

    team: {
      hero: {
        eyebrow: "Our team",
        title: "A team of dedicated mortgage brokers",
        subtitle:
          "Committed to structuring your financial success with rigor and humanity.",
      },
      method: {
        eyebrow: "Our method",
        title: "Three pillars, one execution",
        items: [
          {
            label: "Collaboration",
            desc: "We work alongside you, in full transparency, from first call to closing.",
          },
          {
            label: "Analysis",
            desc: "Every file is studied carefully: income, debts, project, risk profile.",
          },
          {
            label: "Execution",
            desc: "A rigorous team that structures and negotiates for you — no grey areas.",
          },
        ],
      },
    },

    institutions: {
      hero: {
        eyebrow: "Our partners",
        title: "9 financial institutions at your service",
        subtitle:
          "We work with a wide range of lenders to bring you the best mortgage conditions on the market.",
      },
      insurance: {
        eyebrow: "Good to know",
        title: "Protect your investment",
        body: "Solid home insurance is essential to secure your real-estate investment. We can refer you to our trusted partners to evaluate options and find the best conditions.",
      },
      missingLabel: "Your institution isn't on the list?",
      missingCta: "Let's discuss",
    },

    tools: {
      hero: {
        eyebrow: "Tools & resources",
        title: "Concrete tools for informed decisions",
        subtitle:
          "Mortgage calculator, educational guides, video shorts, downloadable documents — everything you need to confidently prepare your file.",
      },
    },

    amf: {
      certificateLabel: "AMF registered — Mortgage broker",
      noPromiseDisclaimer:
        "No mortgage approval is guaranteed. Conditions, rates and eligibility criteria vary based on the lender and borrower profile.",
    },
  },
} as const satisfies Record<Lang, BilingualLax>;
