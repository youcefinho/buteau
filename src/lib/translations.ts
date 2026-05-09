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
      coverStatement:
        "L'hypothèque ne devrait jamais être un mystère.",
      colophon: "Colophon",
      colophonComposed: "Composé en Montserrat & Cormorant Garamond",
      colophonPrinted: "Imprimé en pixels — Cloudflare, Quebec",
      colophonEdition: "Édition N° 01 — MMXXVI",
      issn: "Andrew Buteau — Inscrit AMF",
    },

    home: {
      hero: {
        eyebrow: "Courtage hypothécaire — Planiprêt",
        title: "L'hypothèque autrement",
        subtitle:
          "Des stratégies hypothécaires structurées et professionnelles. L'expérience client au cœur de notre succès.",
        ctaPrimary: "Prendre rendez-vous",
        ctaSecondary: "Découvrir notre équipe",
        issueLabel: "Édition",
        issueNumber: "N° 01",
        issueDate: "Quebec — MMXXVI",
        issueLocation: "Laval · Québec",
        scrollHint: "Faire défiler",
        // Mots signatures révélés au hover sur chaque lettre BUTEAU
        letterWords: ["Buteau", "Unique", "Transparence", "Expert", "Accessible", "Utile"],
        letterHint: "Survolez chaque lettre",
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
        eyebrow: "Courrier des lecteurs",
        title: "Ce que nos clients disent",
        googleBadgeLabel: "Évaluation Excellente",
        letterDateLabel: "Reçu le",
        letterFromLabel: "De",
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
            city: "Laval",
            date: "12 mars 2026",
          },
          {
            quote:
              "Efficacité redoutable pour notre refinancement. Andrew est rigoureux et transparent, il a pris le temps d'analyser tous nos chiffres pour structurer une stratégie vraiment avantageuse.",
            authorInitial: "C",
            author: "Catherine P.",
            city: "Montréal",
            date: "28 février 2026",
          },
          {
            quote:
              "Disponibilité incroyable, ils font les choses autrement. Le suivi de dossier avec Abygaèle et Alexis était impeccable. On se sent entre de bonnes mains du début à la fin. Fortement recommandé.",
            authorInitial: "J",
            author: "Jonathan D.",
            city: "Boisbriand",
            date: "5 février 2026",
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
        eyebrow: "L'équipe",
        title: "Notre équipe",
        subtitle:
          "Une équipe de courtiers hypothécaires passionnés, dédiés à structurer votre réussite financière avec rigueur et humanité.",
      },
      members: [
        {
          name: "Andrew Buteau",
          role: "Courtier hypothécaire & Fondateur",
          photo: "https://i.imgur.com/k4bZmLl.jpg",
          bio: "Animé par la performance et la volonté de faire les choses autrement, Andrew a fondé l'Équipe BUTEAU avec une vision claire : offrir une expérience hypothécaire transparente, structurée et orientée vers les résultats. Reconnu pour sa rigueur et son professionnalisme, il a accompagné plus de 200 familles en 2025 à l'échelle de la province.",
        },
        {
          name: "Abygaèle Gagné",
          role: "Coordonnatrice exécutive",
          photo:
            "https://ugc.production.linktr.ee/5iBsvLTR0iXiJgoKotJw_I4Qhjq9XsUtz0u6v?io=true&size=avatar-v3_0",
          bio: "Organisée, créative et profondément impliquée, Abygaèle veille à la coordination et au bon fonctionnement de l'Équipe BUTEAU. Elle supervise l'administration, le service à la clientèle et le développement de l'image de marque, incluant la création de contenu et la gestion des réseaux sociaux.",
        },
        {
          name: "Alexis Buteau",
          role: "Assistant en gestion hypothécaire",
          photo: "https://i.imgur.com/MUD07Kc.jpg",
          bio: "Calme, rigoureux et perfectionniste, Alexis occupe le rôle d'Assistant en gestion hypothécaire. Il prend en charge la gestion documentaire, le soutien administratif et l'analyse des documents essentiels au montage de chaque requête. Actuellement dans les derniers milles de sa formation de courtier hypothécaire.",
        },
      ],
      method: {
        eyebrow: "Notre méthode",
        title: "Trois piliers, une exécution",
        intro:
          "Chaque dossier est traité avec la même rigueur et la même structure. Notre équipe travaille en collaboration étroite pour analyser votre situation, identifier les meilleures options et exécuter une stratégie de financement claire et adaptée à vos objectifs.",
        items: [
          {
            label: "Collaboration",
            desc: "Chaque membre de l'équipe contribue à la réussite de votre dossier. De l'analyse initiale à la finalisation, nous travaillons ensemble pour assurer cohérence et efficacité.",
          },
          {
            label: "Analyse",
            desc: "Nous examinons votre situation financière en profondeur pour identifier les solutions les plus appropriées. Aucune hypothèse, uniquement des données concrètes et vérifiées.",
          },
          {
            label: "Exécution",
            desc: "Une fois la stratégie définie, nous mettons en œuvre le plan avec rapidité et précision. Chaque étape est suivie rigoureusement jusqu'à la réalisation complète de votre projet.",
          },
        ],
      },
    },

    cta: {
      title: "Prêt à structurer votre projet ?",
      subtitle: "Des décisions claires. Une exécution structurée. Des résultats concrets.",
      button: "Prendre rendez-vous",
    },

    territory: {
      eyebrow: "Territoire desservi",
      title: "Présents partout au Québec.",
      subtitle:
        "Andrew Buteau accompagne ses clients en visioconférence ou en personne dans cinq régions principales. Chaque dossier reçoit la même rigueur, peu importe le code postal.",
      regions: [
        { name: "Laval", note: "Siège — 2300 boul. Saint-Martin Est" },
        { name: "Montréal", note: "Île + couronne" },
        { name: "Rive-Nord", note: "Laurentides + Lanaudière" },
        { name: "Rive-Sud", note: "Montérégie" },
        { name: "Province", note: "Reste du Québec — visioconférence" },
      ],
      footnote:
        "Une question hors région ? Écrivez-nous. La distance n'est jamais un obstacle.",
    },

    letter: {
      eyebrow: "Le mot du courtier",
      heading: "Bonjour,",
      bodyP1:
        "On me demande souvent ce qui distingue notre approche. Ma réponse est simple :",
      bodyP1Emphasis: "le temps qu'on prend à comprendre votre dossier avant de signer quoi que ce soit.",
      bodyP2:
        "Une hypothèque, ce n'est pas un produit. C'est une décision financière qui vous engage 25 ans. Mon rôle n'est pas de vous vendre le taux le plus bas affiché — c'est de structurer un dossier que vous comprenez, avec un prêteur qui vous correspond.",
      bodyP3:
        "Si on travaille ensemble, voici ce que je vous promets : aucune zone grise. Vous saurez chaque chiffre, chaque clause, chaque conséquence. Et quand le marché bougera, vous m'aurez au bout du fil.",
      closing: "À bientôt,",
      role: "Andrew Buteau, courtier hypothécaire",
    },

    form: {
      fullNameLabel: "Nom complet",
      emailLabel: "Courriel",
      phoneLabel: "Téléphone (optionnel)",
      messageLabel: "Votre projet (optionnel)",
      submitLabel: "Envoyer ma demande",
      submitting: "Envoi en cours...",
      consentLabel:
        "J'accepte que mes renseignements soient utilisés par l'Équipe Buteau pour répondre à ma demande, conformément à la",
      consentLinkLabel: "politique de confidentialité",
      successTitle: "Demande reçue",
      successBody:
        "Merci. Nous vous reviendrons sous peu pour structurer votre projet hypothécaire.",
      errors: {
        consent_required: "Vous devez accepter la politique de confidentialité pour soumettre.",
        name_invalid: "Veuillez saisir votre nom complet (minimum 2 caractères).",
        name_too_long: "Le nom est trop long.",
        email_invalid: "Adresse courriel invalide.",
        email_too_long: "L'adresse courriel est trop longue.",
        phone_too_long: "Le numéro de téléphone est trop long.",
        message_too_long: "Le message est trop long.",
        invalid_json: "Données invalides.",
        rate_limited:
          "Trop de tentatives. Veuillez patienter quelques instants avant de réessayer.",
        db_error: "Erreur serveur. Veuillez réessayer dans un instant.",
        network_error: "Connexion impossible. Vérifiez votre internet et réessayez.",
        unknown_error: "Une erreur est survenue.",
      },
    },

    institutions: {
      hero: {
        eyebrow: "Adresses prêteurs",
        title: "Adresses pour assurances",
        subtitle:
          "Informations importantes pour votre preuve d'assurance habitation.",
      },
      reassurance:
        "Nous travaillons avec un large éventail de prêteurs pour vous offrir les meilleures conditions de financement adaptées à votre situation.",
      insurance: {
        eyebrow: "Important",
        title: "Preuves d'assurance habitation valide",
        bodyP1:
          "Vous devrez avoir une preuve d'assurance habitation valide à compter de la date de l'acte de vente.",
        attentionLabel: "Attention",
        attentionP1:
          "Le nom et l'adresse complète de l'institution financière devront apparaître sur la preuve d'assurance.",
        attentionP2:
          "Pour un refinancement, il est important d'aviser quand même vos assurances : même s'il n'y a pas de changement sur la police d'assurance ni sur l'adresse de la propriété assurée, votre preuve d'assurance doit afficher le bon créancier.",
      },
      lendersSectionTitle: "Adresses des institutions financières",
      addressVariesNote: "L'adresse varie selon la Caisse choisie.",
      lenders: [
        {
          name: "Banque Nationale",
          address: "800, rue Saint-Jacques",
          city: "Montréal (Québec) H3C 1A3",
          logo: "https://static.wixstatic.com/media/60fa64_ef3269be7b644d2eb233adfb8f1ce3d4~mv2.jpg/v1/fill/w_300,h_300,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/bn_vid_hero_dark_fr.jpg",
        },
        {
          name: "Société de services MCAP",
          address: "200, rue King Ouest, bureau 400",
          city: "Toronto (Ontario) M5H 3T4",
          logo: "https://static.wixstatic.com/media/60fa64_bcf3ebc0984a426ca2bccc5ddfd9323a~mv2.webp/v1/fill/w_300,h_300,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/mcap-lg.webp",
        },
        {
          name: "First National",
          address: "2000, rue Peel, bureau 200",
          city: "Montréal (Québec) H3A 2W5",
          logo: "https://static.wixstatic.com/media/60fa64_596e739841a5440eb4ffe7cc1b894de0~mv2.png/v1/fill/w_300,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/first-national-financial-corporation--600.png",
        },
        {
          name: "CIBC",
          address: "81, rue Bay",
          city: "Toronto (Ontario) M5J 0E7",
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/CIBC_logo.svg/2560px-CIBC_logo.svg.png",
        },
        {
          name: "CMLS",
          address: "530 – 8e Avenue Sud-Ouest, Bureau 1000",
          city: "Calgary (Alberta) T2P 3S8",
          logo: "https://b2b2c.ca/wp-content/uploads/2021/04/CMLS-Financial.png",
        },
        {
          name: "Banque Toronto-Dominion",
          address: "1350, boulevard René-Lévesque Ouest",
          city: "Montréal (Québec) H3G 1T4",
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Toronto-Dominion_Bank_logo.svg/2048px-Toronto-Dominion_Bank_logo.svg.png",
        },
        {
          name: "Banque Scotia",
          address: "44, rue King Ouest",
          city: "Toronto (Ontario) M5H 1H1",
          logo: "https://static.wixstatic.com/media/60fa64_73e0863852c24c888713e4b252db98bb~mv2.png/v1/fill/w_300,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Scotiabank-1024x1024.png",
        },
        {
          name: "La financière Manuvie",
          address: "200 Bloor Street East",
          city: "Toronto (Ontario) M4W 1E5",
          logo: "https://logos-world.net/wp-content/uploads/2021/09/Manulife-Logo.png",
        },
        {
          name: "Caisses Desjardins",
          address: "L'adresse varie selon la Caisse choisie.",
          city: "",
          logo: "https://static.wixstatic.com/media/60fa64_4018f458f5d54d0685b0fae6956669a8~mv2.png/v1/crop/x_19,y_19,w_474,h_474/fill/w_300,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/unnamed.png",
        },
      ],
      missing: {
        title: "Votre institution financière ne figure pas parmi les choix ?",
        body: "Contactez-nous sans tarder.",
        cta: "Parler à un courtier",
      },
    },

    tools: {
      hero: {
        eyebrow: "Ressources",
        title: "Outils & ressources",
        subtitle:
          "Tout ce dont vous avez besoin pour structurer votre projet hypothécaire.",
      },
      calc: {
        eyebrow: "Outil",
        title: "Calculateur hypothécaire",
        subtitle:
          "Une estimation rapide selon la formule canadienne (composé semi-annuel).",
        amountLabel: "Montant ($)",
        rateLabel: "Taux (%)",
        yearsLabel: "Durée (ans)",
        resultLabel: "Paiement mensuel",
        disclaimer:
          "Estimation indicative basée sur la formule canadienne semi-annuelle. Les conditions, taux et critères d'admissibilité varient selon le prêteur et le profil de l'emprunteur. Aucune approbation hypothécaire n'est garantie.",
        ctaLabel: "Discuter de votre projet",
        scenariosTitle: "Et si...",
        scenariosSubtitle:
          "Voyez l'impact concret de petites décisions sur votre dossier.",
        scenarioAcceleratedTitle: "Vous payiez 100 $ de plus par mois",
        scenarioShorterTitle: "Vous choisissiez un amortissement de 20 ans",
        scenarioSavingsLabel: "Économie d'intérêts",
        scenarioMonthsSavedLabel: "Mois épargnés",
        scenarioNewPaymentLabel: "Nouveau paiement mensuel",
        scenarioPlusLabel: "+",
        scenarioEqualsLabel: "=",
      },
      guides: {
        eyebrow: "Guides",
        title: "Guides éducatifs",
        subtitle:
          "Des ressources complètes pour comprendre le financement hypothécaire.",
        comingSoonLabel: "Téléchargement bientôt",
        items: [
          {
            title: "Achat d'une première propriété",
            desc: "Tout ce que vous devez savoir pour franchir cette étape importante : mise de fonds, préqualification, RAP, CELIAPP, et programmes d'aide disponibles.",
          },
          {
            title: "Comprendre les taux d'intérêt",
            desc: "Taux fixe ou variable ? Comment les taux sont-ils déterminés ? Quand négocier ? Ce guide démystifie les mécanismes du financement hypothécaire.",
          },
          {
            title: "Investissement immobilier",
            desc: "Stratégies de financement pour immeubles à revenus, multiplex et projets d'investissement. Maximisez votre effet de levier et vos rendements.",
          },
        ],
      },
      tiktok: {
        eyebrow: "Prochainement sur TikTok",
        title: "Nous lançons bientôt une série de capsules éducatives",
        body: "Pour démystifier le monde hypothécaire. Conseils pratiques, explications claires et stratégies de financement vous seront présentés de façon accessible.",
        ctaLabel: "Restez à l'affût de nos publications",
      },
      blog: {
        eyebrow: "Articles en préparation",
        title: "Notre blog sera bientôt disponible",
        body: "Avec des articles approfondis sur les tendances du marché hypothécaire, des stratégies d'optimisation financière et des conseils d'experts pour maximiser votre patrimoine immobilier.",
        ctaLabel: "Revenez bientôt pour nos premiers articles",
      },
      documents: {
        eyebrow: "Téléchargements",
        title: "Documents téléchargeables",
        subtitle: "Checklists, formulaires et documents de référence.",
        comingSoonLabel: "Bientôt disponible",
        items: [
          {
            title: "Liste des documents requis",
            meta: "PDF • 1.2 MB",
          },
          {
            title: "Guide de l'acheteur",
            meta: "PDF • 3.5 MB",
          },
        ],
      },
      finalCta: {
        eyebrow: "Accompagnement",
        title: "Besoin d'accompagnement ?",
        body: "Nos outils sont là pour vous guider. Pour un accompagnement structuré et personnalisé, contactez-nous.",
        button: "Prendre rendez-vous",
      },
    },

    amf: {
      certificateLabel: "Inscrit AMF — Courtier hypothécaire",
      noPromiseDisclaimer:
        "Aucune approbation hypothécaire n'est garantie. Les conditions, taux et critères d'admissibilité varient selon le prêteur et le profil de l'emprunteur.",
    },

    cookies: {
      title: "Vos préférences de témoins (cookies)",
      body: "Nous utilisons des témoins pour le bon fonctionnement du site et, avec votre consentement, pour mesurer notre audience et améliorer votre expérience.",
      accept: "Accepter tout",
      refuse: "Refuser tout",
      learnMore: "En savoir plus",
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
      coverStatement: "A mortgage should never be a mystery.",
      colophon: "Colophon",
      colophonComposed: "Set in Montserrat & Cormorant Garamond",
      colophonPrinted: "Printed in pixels — Cloudflare, Quebec",
      colophonEdition: "Edition Nº 01 — MMXXVI",
      issn: "Andrew Buteau — AMF registered",
    },

    home: {
      hero: {
        eyebrow: "Mortgage brokerage — Planiprêt",
        title: "Mortgage. Differently.",
        subtitle:
          "Structured, professional mortgage strategies. Client experience at the heart of our success.",
        ctaPrimary: "Book an appointment",
        ctaSecondary: "Meet our team",
        issueLabel: "Edition",
        issueNumber: "Nº 01",
        issueDate: "Quebec — MMXXVI",
        issueLocation: "Laval · Quebec",
        scrollHint: "Scroll",
        letterWords: ["Buteau", "Unique", "Transparency", "Expert", "Accessible", "Useful"],
        letterHint: "Hover each letter",
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
        eyebrow: "Letters to the editor",
        title: "What our clients say",
        googleBadgeLabel: "Excellent rating",
        letterDateLabel: "Received",
        letterFromLabel: "From",
        items: [
          {
            quote:
              "A professional and reassuring service for our first home purchase. The team secured exceptional conditions and walked us through every step with great clarity.",
            authorInitial: "M",
            author: "Maxime T.",
            city: "Laval",
            date: "March 12, 2026",
          },
          {
            quote:
              "Outstanding efficiency for our refinancing. Andrew is rigorous and transparent — he took the time to analyze every number to structure a truly advantageous strategy.",
            authorInitial: "C",
            author: "Catherine P.",
            city: "Montreal",
            date: "February 28, 2026",
          },
          {
            quote:
              "Incredible availability — they really do things differently. File follow-up with Abygaèle and Alexis was flawless. We felt in good hands from start to finish. Highly recommended.",
            authorInitial: "J",
            author: "Jonathan D.",
            city: "Boisbriand",
            date: "February 5, 2026",
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
        eyebrow: "The team",
        title: "Our team",
        subtitle:
          "A team of dedicated mortgage brokers, structuring your financial success with rigor and humanity.",
      },
      members: [
        {
          name: "Andrew Buteau",
          role: "Mortgage broker & Founder",
          photo: "https://i.imgur.com/k4bZmLl.jpg",
          bio: "Driven by performance and the desire to do things differently, Andrew founded Équipe BUTEAU with a clear vision: deliver a transparent, structured and results-oriented mortgage experience. Known for his rigor and professionalism, he supported 200+ families across the province in 2025.",
        },
        {
          name: "Abygaèle Gagné",
          role: "Executive coordinator",
          photo:
            "https://ugc.production.linktr.ee/5iBsvLTR0iXiJgoKotJw_I4Qhjq9XsUtz0u6v?io=true&size=avatar-v3_0",
          bio: "Organized, creative and deeply involved, Abygaèle ensures the coordination and smooth operation of Équipe BUTEAU. She oversees administration, client service and the brand-image development — including content creation and social media management.",
        },
        {
          name: "Alexis Buteau",
          role: "Mortgage management assistant",
          photo: "https://i.imgur.com/MUD07Kc.jpg",
          bio: "Calm, rigorous and detail-oriented, Alexis serves as Mortgage Management Assistant. He handles document management, administrative support, and the analysis of materials essential to building every file. Currently in the final stretch of his mortgage broker training.",
        },
      ],
      method: {
        eyebrow: "Our method",
        title: "Three pillars, one execution",
        intro:
          "Every file is treated with the same rigor and structure. Our team works in close collaboration to analyze your situation, identify the best options, and execute a clear financing strategy tailored to your goals.",
        items: [
          {
            label: "Collaboration",
            desc: "Every team member contributes to your file's success. From initial analysis to closing, we work together to ensure consistency and efficiency.",
          },
          {
            label: "Analysis",
            desc: "We examine your financial situation in depth to identify the most appropriate solutions. No assumptions — only concrete, verified data.",
          },
          {
            label: "Execution",
            desc: "Once the strategy is defined, we execute with speed and precision. Every step is rigorously tracked through to project completion.",
          },
        ],
      },
    },

    cta: {
      title: "Ready to structure your project?",
      subtitle: "Clear decisions. Structured execution. Concrete results.",
      button: "Book an appointment",
    },

    territory: {
      eyebrow: "Service area",
      title: "Across all of Quebec.",
      subtitle:
        "Andrew Buteau supports clients via video conference or in person across five primary regions. Every file receives the same rigor — wherever you are.",
      regions: [
        { name: "Laval", note: "Head office — 2300 Saint-Martin East" },
        { name: "Montreal", note: "Island + suburbs" },
        { name: "North Shore", note: "Laurentides + Lanaudière" },
        { name: "South Shore", note: "Montérégie" },
        { name: "Province", note: "Rest of Quebec — video conference" },
      ],
      footnote:
        "Got a question outside these regions? Reach out. Distance is never a blocker.",
    },

    letter: {
      eyebrow: "A note from the broker",
      heading: "Hello,",
      bodyP1: "I'm often asked what sets our approach apart. My answer is simple:",
      bodyP1Emphasis: "the time we take to understand your file before signing anything.",
      bodyP2:
        "A mortgage isn't a product. It's a financial decision that binds you for 25 years. My role isn't to sell you the lowest advertised rate — it's to structure a file you understand, with a lender that fits your profile.",
      bodyP3:
        "If we work together, here's my promise: no grey areas. You'll know every number, every clause, every consequence. And when the market moves, you'll have me on the line.",
      closing: "Until soon,",
      role: "Andrew Buteau, mortgage broker",
    },

    form: {
      fullNameLabel: "Full name",
      emailLabel: "Email",
      phoneLabel: "Phone (optional)",
      messageLabel: "Your project (optional)",
      submitLabel: "Send my request",
      submitting: "Sending...",
      consentLabel:
        "I agree that my information will be used by Équipe Buteau to respond to my request, in accordance with the",
      consentLinkLabel: "privacy policy",
      successTitle: "Request received",
      successBody:
        "Thank you. We'll get back to you shortly to structure your mortgage project.",
      errors: {
        consent_required: "You must accept the privacy policy to submit.",
        name_invalid: "Please enter your full name (minimum 2 characters).",
        name_too_long: "Name is too long.",
        email_invalid: "Invalid email address.",
        email_too_long: "Email address is too long.",
        phone_too_long: "Phone number is too long.",
        message_too_long: "Message is too long.",
        invalid_json: "Invalid data.",
        rate_limited: "Too many attempts. Please wait a moment before retrying.",
        db_error: "Server error. Please try again in a moment.",
        network_error: "Connection failed. Check your internet and retry.",
        unknown_error: "An error occurred.",
      },
    },

    institutions: {
      hero: {
        eyebrow: "Lender addresses",
        title: "Insurance addresses",
        subtitle: "Important information for your home insurance proof.",
      },
      reassurance:
        "We work with a wide range of lenders to deliver the best financing conditions tailored to your situation.",
      insurance: {
        eyebrow: "Important",
        title: "Valid home insurance proof",
        bodyP1:
          "You must have a valid home insurance proof effective from the date of the deed of sale.",
        attentionLabel: "Important",
        attentionP1:
          "The name and full address of the financial institution must appear on the insurance proof.",
        attentionP2:
          "For a refinance, you must still notify your insurer: even if there's no change to the policy or insured property, your proof must show the correct creditor.",
      },
      lendersSectionTitle: "Financial institution addresses",
      addressVariesNote: "Address varies by selected Caisse branch.",
      lenders: [
        {
          name: "Banque Nationale",
          address: "800, rue Saint-Jacques",
          city: "Montréal (Québec) H3C 1A3",
          logo: "https://static.wixstatic.com/media/60fa64_ef3269be7b644d2eb233adfb8f1ce3d4~mv2.jpg/v1/fill/w_300,h_300,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/bn_vid_hero_dark_fr.jpg",
        },
        {
          name: "MCAP Service Corporation",
          address: "200 King Street West, Suite 400",
          city: "Toronto (Ontario) M5H 3T4",
          logo: "https://static.wixstatic.com/media/60fa64_bcf3ebc0984a426ca2bccc5ddfd9323a~mv2.webp/v1/fill/w_300,h_300,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/mcap-lg.webp",
        },
        {
          name: "First National",
          address: "2000 Peel Street, Suite 200",
          city: "Montréal (Québec) H3A 2W5",
          logo: "https://static.wixstatic.com/media/60fa64_596e739841a5440eb4ffe7cc1b894de0~mv2.png/v1/fill/w_300,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/first-national-financial-corporation--600.png",
        },
        {
          name: "CIBC",
          address: "81 Bay Street",
          city: "Toronto (Ontario) M5J 0E7",
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/CIBC_logo.svg/2560px-CIBC_logo.svg.png",
        },
        {
          name: "CMLS",
          address: "530 – 8th Avenue SW, Suite 1000",
          city: "Calgary (Alberta) T2P 3S8",
          logo: "https://b2b2c.ca/wp-content/uploads/2021/04/CMLS-Financial.png",
        },
        {
          name: "Toronto-Dominion Bank",
          address: "1350 René-Lévesque Boulevard West",
          city: "Montréal (Québec) H3G 1T4",
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Toronto-Dominion_Bank_logo.svg/2048px-Toronto-Dominion_Bank_logo.svg.png",
        },
        {
          name: "Scotiabank",
          address: "44 King Street West",
          city: "Toronto (Ontario) M5H 1H1",
          logo: "https://static.wixstatic.com/media/60fa64_73e0863852c24c888713e4b252db98bb~mv2.png/v1/fill/w_300,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Scotiabank-1024x1024.png",
        },
        {
          name: "Manulife Financial",
          address: "200 Bloor Street East",
          city: "Toronto (Ontario) M4W 1E5",
          logo: "https://logos-world.net/wp-content/uploads/2021/09/Manulife-Logo.png",
        },
        {
          name: "Desjardins",
          address: "Address varies by selected Caisse branch.",
          city: "",
          logo: "https://static.wixstatic.com/media/60fa64_4018f458f5d54d0685b0fae6956669a8~mv2.png/v1/crop/x_19,y_19,w_474,h_474/fill/w_300,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/unnamed.png",
        },
      ],
      missing: {
        title: "Your financial institution isn't on the list?",
        body: "Contact us right away.",
        cta: "Talk to a broker",
      },
    },

    tools: {
      hero: {
        eyebrow: "Resources",
        title: "Tools & resources",
        subtitle: "Everything you need to structure your mortgage project.",
      },
      calc: {
        eyebrow: "Tool",
        title: "Mortgage calculator",
        subtitle: "A quick estimate using the Canadian semi-annual compounded formula.",
        amountLabel: "Amount ($)",
        rateLabel: "Rate (%)",
        yearsLabel: "Term (years)",
        resultLabel: "Monthly payment",
        disclaimer:
          "Indicative estimate based on the Canadian semi-annual compounding formula. Conditions, rates and eligibility criteria vary depending on the lender and borrower profile. No mortgage approval is guaranteed.",
        ctaLabel: "Discuss your project",
        scenariosTitle: "What if...",
        scenariosSubtitle: "See the real impact of small choices on your file.",
        scenarioAcceleratedTitle: "You paid $100 more each month",
        scenarioShorterTitle: "You chose a 20-year amortization",
        scenarioSavingsLabel: "Interest savings",
        scenarioMonthsSavedLabel: "Months saved",
        scenarioNewPaymentLabel: "New monthly payment",
        scenarioPlusLabel: "+",
        scenarioEqualsLabel: "=",
      },
      guides: {
        eyebrow: "Guides",
        title: "Educational guides",
        subtitle: "Comprehensive resources to understand mortgage financing.",
        comingSoonLabel: "Download coming soon",
        items: [
          {
            title: "Buying your first home",
            desc: "Everything you need to know to take this important step: down payment, pre-qualification, HBP, FHSA (CELIAPP), and available assistance programs.",
          },
          {
            title: "Understanding interest rates",
            desc: "Fixed or variable? How are rates determined? When to negotiate? This guide demystifies mortgage financing mechanics.",
          },
          {
            title: "Real-estate investment",
            desc: "Financing strategies for income properties, plexes and investment projects. Maximize your leverage and returns.",
          },
        ],
      },
      tiktok: {
        eyebrow: "Coming soon on TikTok",
        title: "We're launching a series of educational shorts",
        body: "To demystify the world of mortgages. Practical tips, clear explanations and financing strategies — presented in an accessible way.",
        ctaLabel: "Stay tuned for our publications",
      },
      blog: {
        eyebrow: "Articles in preparation",
        title: "Our blog is coming soon",
        body: "With deep-dive articles on mortgage market trends, financial optimization strategies and expert advice to grow your real-estate wealth.",
        ctaLabel: "Come back soon for our first articles",
      },
      documents: {
        eyebrow: "Downloads",
        title: "Downloadable documents",
        subtitle: "Checklists, forms and reference documents.",
        comingSoonLabel: "Coming soon",
        items: [
          { title: "Required documents checklist", meta: "PDF • 1.2 MB" },
          { title: "Buyer's guide", meta: "PDF • 3.5 MB" },
        ],
      },
      finalCta: {
        eyebrow: "Support",
        title: "Need guidance?",
        body: "Our tools are here to guide you. For structured, personalized support, get in touch.",
        button: "Book an appointment",
      },
    },

    amf: {
      certificateLabel: "AMF registered — Mortgage broker",
      noPromiseDisclaimer:
        "No mortgage approval is guaranteed. Conditions, rates and eligibility criteria vary based on the lender and borrower profile.",
    },

    cookies: {
      title: "Your cookie preferences",
      body: "We use cookies to ensure the site works properly and, with your consent, to measure our audience and improve your experience.",
      accept: "Accept all",
      refuse: "Refuse all",
      learnMore: "Learn more",
    },
  },
} as const satisfies Record<Lang, BilingualLax>;
