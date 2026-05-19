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
      smsLabel: "Texto direct",
      smsBody:
        "Bonjour Andrew, je suis interesse(e) par vos services de courtier hypothecaire. Pouvez-vous me rappeler ?",
      contactCta: "Démarrer mon parcours",
      whatsappMessage:
        "Bonjour Andrew, je suis interesse(e) par vos services de courtier hypothecaire.",
      whatsappTooltip: "Écrivez-nous sur WhatsApp",
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
      journal: "Journal",
      capsules: "Capsules",
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
          "Première fois ou renouvellement stressant ? On commence par écouter — pas par juger votre dossier. 200 familles accompagnées en 2025, même rigueur pour chacune.",
        ctaPrimary: "Estimer mon paiement en 60 secondes",
        ctaSecondary: "Découvrir notre équipe",
        // CTAs personnalisés selon le tier du quiz (sauvé en localStorage).
        // Active si le user a complété le PreQualQuiz, sinon ctaPrimary par défaut.
        ctaByTier: {
          primo: "Démarrer mon premier dossier",
          refi: "Magasiner mes options",
          investor: "Discuter ma stratégie",
          explorer: "Prendre 20 minutes avec Andrew",
        },
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
        title: "Quatre pros, une seule rigueur",
        andrewName: "Andrew Buteau",
        andrewRole: "Courtier hypothécaire & Fondateur",
        abygaeleName: "Abygaèle Gagné",
        abygaeleRole: "Coordonnatrice exécutive",
        alexisName: "Alexis Buteau",
        alexisRole: "Assistant en gestion hypothécaire",
        felixName: "Felix",
        felixRole: "Coordonnateur des opérations",
        cta: "Rencontrer Andrew, Abygaèle, Alexis & Felix",
      },

      services: {
        eyebrow: "Nos services",
        title: "Cinq services, une seule philosophie",
        items: [
          {
            title: "Renouvellement",
            desc: "Analyse de marché 120 jours avant l'échéance et négociation pour obtenir les meilleures conditions — avec ou sans changement de banque.",
          },
          {
            title: "Refinancement",
            desc: "Restructuration de votre financement pour optimiser vos liquidités, libérer de l'équité ou financer un projet de rénovation, d'études ou d'investissement.",
          },
          {
            title: "Consolidation de dettes",
            desc: "Regroupement de vos dettes à taux élevé (cartes, marges, prêts) dans votre hypothèque pour réduire vos paiements mensuels et reprendre le contrôle.",
          },
          {
            title: "Achat d'une propriété",
            desc: "Stratégie de A à Z pour l'acquisition d'une première propriété, d'une 2e propriété, d'un upgrade familial ou d'une résidence secondaire.",
          },
          {
            title: "Investissement",
            desc: "Stratégies de financement structurées pour développer votre portefeuille immobilier — multiplex, immeubles à revenus, effet de levier sur l'équité existante.",
          },
        ],
      },

      mission: {
        eyebrow: "Notre mission",
        title: "Notre raison d'être",
        bodyP1Lead: "Chez ",
        bodyP1Brand: "L'Équipe BUTEAU",
        bodyP1Continued:
          ", notre priorité est d'offrir un service rapide, efficace et humain. Notre mission est de simplifier le processus de financement, d'éliminer les zones grises et de créer des stratégies personnalisées qui s'adaptent à vos besoins uniques.",
        bodyP2Lead: "En ",
        bodyP2Year: "2025",
        bodyP2Continued: ", nous avons accompagné plus de ",
        bodyP2Stat: "familles",
        bodyP2End:
          " à travers le Québec. Avec méthode et disponibilité, nous propulsons chaque projet vers la réussite.",
        values: [
          {
            title: "Analyse des données",
            desc: "Approche structurée basée sur vos chiffres pour des décisions optimales.",
          },
          {
            title: "Expérience étendue",
            desc: "Plus de 200 familles en 2025. Toutes les régions. Tous les profils.",
          },
          {
            title: "Équipe professionnelle",
            desc: "Courtiers méthodiques et disponibles à chaque étape — du premier appel à la signature.",
          },
          {
            title: "Éventail de prêteurs",
            desc: "Accès à plusieurs institutions pour trouver le meilleur taux et conditions.",
          },
        ],
      },

      guidesShelf: {
        eyebrow: "Bibliothèque",
        title: "Guides & documents à votre disposition.",
        subtitle:
          "Une sélection d'outils éducatifs et de références téléchargeables pour structurer votre dossier en confiance — disponibles progressivement.",
        ctaFull: "Toute la bibliothèque",
        comingSoon: "Bientôt",
        // Items extraits de tools.guides + tools.documents pour preview unifié
        items: [
          {
            kind: "guide",
            title: "Renouvellement & refinancement",
            excerpt: "Quand magasiner, comment négocier, libérer de l'équité ou consolider des dettes.",
            tag: "Guide",
          },
          {
            kind: "guide",
            title: "Comprendre les taux d'intérêt",
            excerpt: "Fixe, variable, hybride. Comment les taux sont déterminés. Quand fixer.",
            tag: "Guide",
          },
          {
            kind: "guide",
            title: "Achat d'une première propriété",
            excerpt: "Mise de fonds, préapprobation, RAP, CELIAPP, programmes d'aide.",
            tag: "Guide",
          },
          {
            kind: "guide",
            title: "Investissement immobilier",
            excerpt: "Stratégies de financement pour immeubles à revenus et multiplex.",
            tag: "Guide",
          },
          {
            kind: "doc",
            title: "Liste des documents requis",
            excerpt: "Checklist exhaustive pour préparer votre dossier hypothécaire.",
            tag: "Document",
          },
        ],
      },

      valueTicker: {
        items: [
          "200 dossiers fermés en 2025",
          "9+ institutions financières partenaires",
          "Inscrit AMF — Cabinet Planiprêt",
          "L'hypothèque autrement",
          "Premier achat · Refinancement · Renouvellement · Investissement",
          "Tout le Québec — siège à Laval",
          "Andrew Buteau, courtier hypothécaire",
        ],
      },

      capsulesPreview: {
        eyebrow: "30 secondes top chrono",
        title: "L'hypothèque expliquée en capsules.",
        subtitle:
          "Mythes, calculs rapides, programmes méconnus, pièges à éviter — sans jargon, sans détour. Voici 5 capsules vedettes parmi 30+ disponibles.",
        ctaFull: "Voir toutes les capsules",
        // categoryId : ancre vers la rubrique correspondante sur /capsules#${id} (fix MEDIUM)
        items: [
          { categoryId: "mise-de-fonds", title: "Le RAP — utiliser ton REER pour acheter", hook: "Y'a pas juste Eminem qui peut rapper… toi aussi tu peux. Mais c'est pas le même RAP." },
          { categoryId: "dettes-couts", title: "La Golf GTI vs ta maison", hook: "Tu veux t'acheter une Golf GTI ? Parfait. Mais ça pourrait te coûter un garage." },
          { categoryId: "credit-dossier", title: "Faillite = plus jamais propriétaire ? Faux.", hook: "Tu as fait faillite ? C'est complètement faux. Une faillite, c'est un chapitre, pas la fin de l'histoire." },
          { categoryId: "taux-refi", title: "Les paiements accélérés — sauver temps et intérêts", hook: "Diviser ton paiement en deux = 3 ans plus tôt + ~45 000 $ d'intérêts économisés." },
          { categoryId: "lifestyle", title: "Girl Math ton hypothèque", hook: "Si on peut girl math un sac à 1 200 $, on peut DEFINITIVEMENT girl math une maison." },
        ],
      },

      calcPreview: {
        eyebrow: "Calculer en direct",
        title: "Combien va vous coûter votre hypothèque ?",
        subtitle:
          "Estimation instantanée selon la formule canadienne semi-annuelle. Pour la courbe d'amortissement complète + les scénarios « Et si... », rendez-vous sur la page Outils.",
        amountLabel: "Montant",
        rateLabel: "Taux",
        yearsLabel: "Durée",
        resultLabel: "Paiement mensuel",
        ctaFull: "Calculateur complet + scénarios",
        ctaTools: "Explorer la boîte à outils complète",
      },

      // AdPage — pleine page édito style "publicité magazine luxe" (Cereal vol.18).
      // Statement dérivé du copy existant (4 pros teamTeaser + 5 services + valeur rigueur Mission).
      adPage: {
        statement: "Quatre pros. Cinq services. Une signature.",
        attribution: "L'Équipe Buteau",
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
        googleBadgeLabel: "111 avis 5 étoiles Google",
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
            q: "Combien de temps prend un dossier hypothécaire ?",
            a: "Généralement, comptez 30 à 45 jours du moment où l'offre d'achat est acceptée jusqu'à la clôture. Notre équipe travaille pour minimiser ce délai grâce à nos relations privilégiées avec les prêteurs.",
          },
          {
            q: "Quelle est la mise de fonds minimale requise ?",
            a: "La mise de fonds minimale est généralement de 5 % pour l'achat d'une première propriété. Pour les investissements ou les propriétés de luxe, elle peut être plus élevée. Nous vous aiderons à explorer les options comme le RAP ou le CELIAPP pour réduire vos coûts initiaux.",
          },
          {
            q: "Taux fixe ou taux variable : lequel choisir ?",
            a: "Le choix dépend de votre situation et de votre tolérance au risque. Un taux fixe offre une stabilité prévisible, tandis qu'un taux variable peut être avantageux en période de baisse des taux. Notre équipe analysera vos options pour recommander la stratégie qui colle à votre profil.",
          },
          {
            q: "Y a-t-il des frais cachés ?",
            a: "Non. Nous croyons à la transparence totale. Tous les frais vous sont communiqués dès le départ et expliqués clairement. Notre rôle est de vous accompagner sans surprise, en sachant exactement ce que vous devez payer.",
          },
          {
            q: "Pouvez-vous refinancer ma propriété actuelle ?",
            a: "Absolument. Le refinancement est l'une de nos spécialités. Que ce soit pour réduire vos paiements, libérer de l'équité ou consolider vos dettes, nous trouvons la solution adaptée à votre situation financière.",
          },
          {
            q: "Comment puis-je améliorer mon score de crédit ?",
            a: "Plusieurs actions peuvent améliorer votre score : payer vos factures à temps, réduire vos soldes de cartes de crédit, et éviter les nouvelles demandes de crédit inutiles. Nous pouvons vous conseiller sur des stratégies pour optimiser votre profil de crédit.",
          },
          {
            q: "Quand devrais-je préparer mon renouvellement hypothécaire ?",
            a: "Idéalement, 4 à 6 mois avant l'échéance. La majorité des emprunteurs acceptent par défaut l'offre de leur prêteur actuel — souvent sans magasiner. Préparer en avance permet de mettre votre dossier en concurrence auprès de plusieurs institutions, d'obtenir un meilleur taux et d'évaluer si une restructuration (consolidation, refinancement) serait avantageuse. Un renouvellement n'est pas qu'une signature de routine, c'est un point de levier financier.",
          },
        ],
      },
    },

    team: {
      hero: {
        eyebrow: "L'équipe",
        title: "Notre équipe",
        subtitle:
          "Quatre courtiers hypothécaires passionnés, dédiés à structurer votre réussite financière avec méthode et humanité.",
      },
      marginalia: ["fondateur", "coordo.", "assist.", "opérations"],
      members: [
        {
          name: "Andrew Buteau",
          role: "Courtier hypothécaire & Fondateur",
          photo: "https://i.imgur.com/k4bZmLl.jpg",
          bio: "Andrew Buteau est courtier hypothécaire à Laval, sous le cabinet Planiprêt. Sa philosophie : « En agissant avec intégrité et transparence, je m'assure que mes clients auront toute l'information pour faire un choix éclairé. » Il fournit les outils de planification nécessaires pour sélectionner le prêt hypothécaire qui répond le mieux aux besoins de chaque dossier. En 2025, son équipe a accompagné plus de 200 familles à travers le Québec — avec rigueur, disponibilité, et l'énergie de faire les choses autrement.",
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
          bio: "Calme, méthodique et perfectionniste, Alexis seconde l'équipe au quotidien : préparation des dossiers, soutien administratif et analyse des documents essentiels au montage de chaque requête. Actuellement dans les derniers milles de sa formation de courtier hypothécaire.",
        },
        {
          name: "Felix",
          role: "Coordonnateur des opérations de courtage hypothécaire",
          photo: "/equipe/felix.jpeg",
          bio: "Felix rejoint l'Équipe Buteau comme coordonnateur des opérations de courtage hypothécaire. Sa biographie complète sera publiée prochainement — en attendant, son rôle au sein de l'équipe est d'assurer que chaque dossier avance dans les délais et que la communication entre clients, prêteurs et notaires reste fluide.",
        },
      ],
      method: {
        eyebrow: "Notre méthode",
        title: "Trois piliers, une exécution",
        intro:
          "Chaque dossier est traité avec la même méthode et la même structure. Nous travaillons en collaboration étroite pour analyser votre situation, identifier les options les plus pertinentes et exécuter une stratégie de financement claire et adaptée à vos objectifs.",
        items: [
          {
            label: "Collaboration",
            desc: "Chaque membre apporte son expertise — analyse, négociation, exécution. De la première rencontre à la finalisation, nous travaillons ensemble pour assurer cohérence et efficacité.",
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
      eyebrow: "Prochaine étape",
      title: "Prêt à structurer votre projet ?",
      subtitle: "Des décisions claires. Une exécution structurée. Des résultats concrets.",
      button: "Prendre rendez-vous",
    },

    journal: {
      eyebrow: "Le journal",
      title: "Réflexions de l'Équipe Buteau.",
      subtitle:
        "Chroniques, analyses de marché et explications éclairantes — publiées au rythme des tendances et des questions reçues. Cliquez un titre pour ouvrir l'article complet.",
      readingLabel: "min de lecture",
      readMoreLabel: "Lire l'article",
      hideLabel: "Replier",
      categoryLabel: "Catégorie",
      footnote: "Suivez nos capsules pour les sorties intermédiaires.",
      articles: [
        {
          slug: "preapprobation-hypothecaire-2026",
          category: "Préapprobation",
          date: "1er mai 2026",
          dateIso: "2026-05-01",
          readingTime: 8,
          title: "Préapprobation hypothécaire 2026 : obtenez votre lettre en 24 h.",
          lead: "Une préapprobation hypothécaire est un engagement écrit officiel d'un prêteur confirmant votre capacité d'emprunt maximale. Elle permet de bloquer un taux d'intérêt pour une période de 90 à 120 jours, vous protégeant ainsi des hausses du marché pendant vos recherches immobilières au Québec.",
          excerpt:
            "Maximisez vos chances d'achat ce printemps. Obtenez une préapprobation rapide avec L'Équipe Buteau — accès à 20+ banques et institutions financières.",
          pullQuote:
            "Dans un marché compétitif, une lettre de préapprobation envoie un signal qui peut faire une vraie différence.",
          // bodyHtml injecte cote client par routes/journal.tsx (match slug) — l'HTML brut
          // ne peut pas vivre ici car le worker SSR (esbuild) ne sait pas resoudre ?raw.
        },
      ],
    },

    courrier: {
      subtitle:
        "Sélection de témoignages reçus par courriel, en personne ou via Google. Chaque lettre est publiée avec l'autorisation de son auteur.",
      letterDateLabel: "Reçu le",
      letterFromLabel: "De",
      googleLinkLabel: "Voir tous les avis sur Google",
      footnote: "Présentées de la plus récente à la plus ancienne.",
      // Lettres étendues — extension de home.reviews.items + 6 lettres additionnelles
      additionalLetters: [
        {
          quote:
            "Nous avons changé de banque pour le renouvellement et l'écart de taux nous fait économiser plus de 12 000 $ sur 5 ans. Andrew a tout négocié sans qu'on ait à magasiner nous-mêmes — c'est ça la vraie valeur d'un courtier.",
          authorInitial: "S",
          author: "Sophie L.",
          city: "Mirabel",
          date: "22 janvier 2026",
        },
        {
          quote:
            "Premier multiplex acheté grâce à la stratégie de levier d'Andrew. Il m'a expliqué chaque ratio, chaque scénario. Pas de surprises au notaire.",
          authorInitial: "F",
          author: "François R.",
          city: "Saint-Eustache",
          date: "8 janvier 2026",
        },
        {
          quote:
            "Andrew a pris 45 minutes au téléphone pour comprendre notre situation avant de proposer quoi que ce soit. Personne d'autre n'avait fait ça.",
          authorInitial: "M",
          author: "Marie-Pierre G.",
          city: "Terrebonne",
          date: "14 décembre 2025",
        },
        {
          quote:
            "Refinancement de notre RBC pour consolider une marge et un prêt auto. Le tableau d'amortissement qu'Andrew nous a remis avant signature était parfaitement clair.",
          authorInitial: "É",
          author: "Étienne B.",
          city: "Repentigny",
          date: "30 novembre 2025",
        },
        {
          quote:
            "Notre courtière précédente avait abandonné notre dossier. Abygaèle a repris le dossier, nous a tenus informés à chaque étape. Closing dans les délais.",
          authorInitial: "K",
          author: "Karine T.",
          city: "Blainville",
          date: "18 novembre 2025",
        },
        {
          quote:
            "J'avais 30 ans et zéro idée comment fonctionnait une hypothèque. Andrew m'a tout expliqué — ratios, taux fixes vs variable, RAP, CELIAPP. Aujourd'hui je suis propriétaire.",
          authorInitial: "L",
          author: "Lucas M.",
          city: "Boisbriand",
          date: "5 octobre 2025",
        },
      ],
    },

    merci: {
      eyebrow: "Demande reçue",
      title: "Merci.",
      subtitle:
        "Andrew a bien reçu votre demande et reviendra vers vous personnellement sous peu. Aucune zone grise — vous saurez exactement où vous en êtes.",
      footnote: "Reçu le · Andrew Buteau · Inscrit AMF",
      nextStepsLabel: "Pendant que vous attendez",
      nextStepCalc: "Explorer le calculateur",
      nextStepLexique: "Parcourir le lexique",
      nextStepBack: "Retour à l'accueil",
      // Personnalisations selon tier (si quiz fait)
      tierMessages: {
        primo: "Votre dossier de premier achat est ma priorité — je vous appelle dans les 24 heures pour démarrer la préapprobation.",
        refi: "Votre situation actuelle mérite une analyse complète — je vous appelle dans les 24 heures avec mes premières observations.",
        investor: "Votre projet d'investissement est analysé — je vous appelle dans les 24 heures pour discuter votre stratégie de levier.",
        explorer: "Pas de pression — je vous appelle dans les 24 heures pour clarifier votre situation, sans engagement.",
      },
    },

    notFound: {
      eyebrow: "Égaré ?",
      title: "Cette page n'existe pas dans notre édition.",
      subtitle:
        "Peut-être qu'un lien a été déplacé, ou que vous cherchez quelque chose de spécifique. Nous pouvons vous remettre sur la bonne voie.",
      ctaHome: "Retour à l'accueil",
      ctaCall: "Appeler Andrew",
      footnote: "Code 404 · Quebec · MMXXVI",
    },

    capsules: {
      eyebrow: "30 secondes top chrono",
      title: "L'hypothèque, en capsules courtes.",
      subtitle:
        "Andrew répond aux questions hypothécaires sans détour. Mythes, calculs rapides, programmes méconnus, pièges à éviter — dans la voix qu'on lui connaît.",
      ctaTikTok: "Voir tout sur TikTok",
      followLine: "Suivre @equipebuteau pour ne rien manquer.",
      hookLabel: "Hook",
      footnote:
        "Capsules tournées en continu. Les hypothèses chiffrées sont à titre éducatif — validez votre cas avec un courtier avant toute décision.",
      categories: [
        {
          id: "mise-de-fonds",
          eyebrow: "Mise de fonds & financement",
          intro: "Tout ce qui touche le cash à mettre — minimum, maximum, sources créatives, exceptions. Ce que ton mononcle t'a dit, et ce qui est vrai.",
          items: [
            { title: "Le minimum de mise de fonds — calcul rapide", hook: "Tu te demandes quel est le minimum pour acheter ? ET non, ce n'est pas automatiquement 5 %. Je te le calcule." },
            { title: "5 % de mise de fonds — pas juste pour le 1er achat", hook: "Ton mononcle t'a dit que le 5 % c'était juste pour ton premier achat ? C'est complètement faux." },
            { title: "Le RAP — utiliser ton REER pour acheter", hook: "Y'a pas juste Eminem qui peut rapper… toi aussi tu peux. Mais c'est pas le même RAP." },
            { title: "Le CELIAPP — pourquoi déposer même si tu achètes bientôt", hook: "Tout le monde te dit « mets-en dedans même si tu achètes la semaine prochaine ». Mais pourquoi ? Qu'est-ce que ça change pour toi ?" },
            { title: "Acheter sans mise de fonds — 3 situations possibles", hook: "Pas beaucoup de liquidités ? Tu penses que la banque exige toujours une mise de fonds économisée ? Pas nécessairement. 3 situations te le permettent." },
            { title: "Acheter la maison de la famille sans mise de fonds", hook: "Ta grand-mère décide enfin de te vendre LA maison. Et si tu n'avais pas besoin de sortir un seul dollar de tes poches ?" },
            { title: "Acheter une 2e propriété avec 5 % — c'est possible", hook: "T'as déjà une maison, tu veux la garder et en acheter une autre. Tu penses que le 5 %, c'est impossible ? Eh bien c'est faux." },
          ],
        },
        {
          id: "credit-dossier",
          eyebrow: "Crédit & dossier",
          intro: "Comment la banque lit ton dossier. Ce qui aide, ce qui nuit, ce qu'on peut corriger — et pourquoi un refus aujourd'hui ne veut pas dire un non pour toujours.",
          items: [
            { title: "Ta carte débit ne bâtit aucun crédit", hook: "T'es fier de jamais utiliser ta carte de crédit ? Félicitations… tu viens d'aider ton dossier de 0. Zéro. Nada. Rien." },
            { title: "Buy Now Pay Later — le piège silencieux", hook: "Les Buy Now Pay Later, ça a l'air cute. Mais dans la vraie vie, ton dossier de crédit, lui, il paye tout de suite." },
            { title: "Ta cote de crédit : moins élevée que tu penses", hook: "Combien tu penses que ta cote doit être pour acheter ? La réalité est beaucoup plus basse que tu crois." },
            { title: "Faillite = plus jamais propriétaire ? Faux.", hook: "Tu as fait faillite et tu penses que tu ne pourras plus jamais acheter ? C'est complètement faux. Une faillite, c'est un chapitre, pas la fin de l'histoire." },
            { title: "Pourquoi la banque préfère parfois une faillite à une proposition", hook: "Ça semble pas logique, mais une faillite de 100 000 $ peut parfois être mieux vue qu'une proposition consommateur de 12 000 $." },
            { title: "Ta préqualification expire plus vite que tu penses", hook: "Une préqualification a une date d'expiration. Mais ça arrive beaucoup plus vite que tu penses." },
            { title: "Ta préqualification de 2025 est peut-être dépassée — vers le haut", hook: "De décembre à janvier, ta préqualification pourrait avoir augmenté sans que tu le saches. Les banques travaillent avec les années fiscales." },
            { title: "Les 3 facteurs qui influencent ta capacité d'emprunt", hook: "Tu penses que tu ne qualifies pas ? 3 facteurs — et surtout, tout peut se corriger. Rien n'est permanent." },
          ],
        },
        {
          id: "revenus",
          eyebrow: "Revenus & profils particuliers",
          intro: "Pourboires, allocations familiales, travailleurs autonomes, couples — la banque ne voit pas tout pareil. Et certaines vont te dire oui là où d'autres t'ont dit non.",
          items: [
            { title: "Le TIP — ton pourboire compte (autodéclaration)", hook: "Tu es serveuse, coiffeuse ou barman et tu penses que tu ne pourras jamais te qualifier parce que ton vrai salaire, c'est ton TIP ? Je t'annonce que oui, ton pourboire peut compter." },
            { title: "Avoir des enfants & se qualifier", hook: "Ouff, je vais me faire lancer des roches. Tu as des enfants et tu penses que ça peut bloquer ? La réponse est oui… mais pas comme tu le penses." },
            { title: "Tu gagnes 70 000 $ — combien tu peux acheter", hook: "Tu gagnes 70 000 $/an et tu te demandes ce que tu peux te permettre ? Voici les vrais chiffres — pas une estimation TikTok." },
            { title: "Tu gagnes 100 000 $ — voici ton vrai pouvoir d'achat", hook: "Tu gagnes 100 000 $/an. Seul, ou avec ton ou ta partenaire ? Je te donne les chiffres réels par région." },
            { title: "Les critères des banques — ce n'est pas toi, c'est elle", hook: "Tu penses que toutes les banques veulent ton dossier ? Vérité : une banque te refuse pour des détails qu'une autre n'aurait même pas considéré." },
          ],
        },
        {
          id: "dettes-couts",
          eyebrow: "Dettes & coûts cachés",
          intro: "Auto, café, taxe de bienvenue, BNPL — ce qui mange ton budget de maison sans que tu le voies. Aux yeux de la banque, chaque 100 $/mois de dette = 15 000 à 20 000 $ de pouvoir d'achat en moins.",
          items: [
            { title: "La Golf GTI vs ta maison", hook: "Tu veux t'acheter une Golf GTI ? Parfait. Mais ça pourrait te coûter un garage." },
            { title: "Ton auto à 800 $/mois te coûte une maison", hook: "Tu paies 800 $/mois pour ton char ? Aux yeux de la banque, ce 800 $ c'est une dette fixe — et ça peut te coûter entre 120 000 $ et 160 000 $ de budget de maison." },
            { title: "Ton Starbucks quotidien te bloque-t-il vraiment ?", hook: "Avec la sweet cold foam svp. Ton Starbucks quotidien pourrait-il vraiment t'empêcher d'acheter ta maison ? On regarde ça ensemble." },
            { title: "Combien coûte la taxe de bienvenue ?", hook: "Tu viens d'acheter et tu te demandes combien va te coûter la taxe de bienvenue ? On la calcule en 30 secondes — paliers 0,5 / 1 / 1,5 %." },
          ],
        },
        {
          id: "strategies",
          eyebrow: "Stratégies & investissement",
          intro: "Faire travailler ta maison, monter un plex, choisir tes partenaires intelligemment. L'investissement immobilier, c'est pas juste le bâtiment — c'est avec qui et comment tu l'achètes.",
          items: [
            { title: "Ta maison peut t'aider à acheter un plex", hook: "Tu veux acheter un plex et tu penses que ta maison te tire dans le pied ? Et si je te disais que c'était ton meilleur atout ?" },
            { title: "Duplex vs triplex — un monde de différence", hook: "Tu hésites entre un duplex et un triplex ? À tes yeux, c'est une porte de plus. Aux yeux de la banque, un monde de différence — et ça peut te coûter cher." },
            { title: "Pourquoi garder le même partenaire d'investissement au début", hook: "Tu veux investir avec d'autres partenaires que les premiers ? Aux yeux de la banque, ça peut tirer tout le monde vers le bas." },
            { title: "Les maisons bi-générations — pourquoi tout le monde en parle", hook: "Les maisons bi-générations, c'est rendu populaire. C'est pas moi qui le dis. Et ce n'est pas un hasard." },
          ],
        },
        {
          id: "taux-refi",
          eyebrow: "Refinancement & taux",
          intro: "Quand casser, quand fixer, quand accélérer. Les vraies réponses chiffrées — pas des conseils vagues.",
          items: [
            { title: "Ton taux est au-dessus de 5 % ? Écoute bien.", hook: "Ton taux est au-dessus de 5 % ? Casser ton prêt peut parfois coûter MOINS que les économies d'intérêts à venir — et te faire sauver énormément." },
            { title: "Les paiements accélérés — sauver temps et intérêts", hook: "Tu veux payer ton hypothèque plus vite sans t'en rendre compte ? Diviser ton paiement en deux = 3 ans plus tôt + ~45 000 $ d'intérêts économisés." },
            { title: "Fixe, variable, hybride : que choisir en 2026", hook: "Renouveler à fixe, variable ou hybride en 2026 ? Pas de bonne ou mauvaise réponse universelle. Mais une méthode pour décider selon TON profil." },
          ],
        },
        {
          id: "lifestyle",
          eyebrow: "Storytelling & lifestyle",
          intro: "L'humain derrière le dossier. Anecdotes vraies, mythes drôles, bons coups — la voix d'Andrew, sans filtre.",
          items: [
            { title: "Girl Math ton hypothèque", hook: "On va girl math ton hypothèque. Ben oui. Si on peut girl math un sac à 1 200 $, on peut DEFINITIVEMENT girl math une maison." },
            { title: "La commission du courtier — version charade", hook: "Je vaux cher mais je ne coûte rien. Je travaille fort mais tu ne me paies pas. Je magasine pour toi mais je ne t'envoie jamais de facture. Qui suis-je ?" },
            { title: "Les clients qui se marient pour acheter", hook: "Et après ils disent que les hommes ont peur de l'engagement… J'ai 2 clients qui ont vraiment décidé de se marier pour reprendre un logement. Histoire vraie." },
          ],
        },
      ],
    },

    media: {
      eyebrow: "Vu & engagé",
      title: "Andrew dans les médias et dans la communauté.",
      subtitle:
        "Le courtage hypothécaire ne se résume pas à un dossier de prêt. C'est aussi des plateaux de télé, des soirées caritatives et des conversations en région — partout où les gens parlent argent, projets et avenir.",
      tvEyebrow: "Sur les ondes",
      tvTitle: "Andrew Buteau à l'émission « Art de Réussir »",
      tvVideoTitle: "Andrew Buteau à Art de Réussir",
      tvShowName: "Janvier 2026 — Diffusé sur Art de Réussir",
      tvCaptionLines: [
        "Une discussion franche sur le courtage hypothécaire au Québec : ce qui distingue un courtier d'une banque, comment magasiner un renouvellement sans paniquer, et pourquoi la « clarté » devrait être le premier critère de choix d'un courtier.",
        "Andrew y partage sa vision d'un service hypothécaire qui ressemble plus à un accompagnement qu'à une transaction.",
      ],
      eventEyebrow: "Engagement communautaire",
      eventTitle: "Soirée-bénéfice « Dans la rue »",
      eventDate: "Novembre 2025 — Montréal",
      eventCaptionLines: [
        "L'organisme Dans la rue accompagne les jeunes en situation d'itinérance à Montréal depuis plus de 35 ans. L'Équipe Buteau a contribué financièrement et sur place lors de la soirée-bénéfice de novembre 2025.",
        "Une mission alignée avec la nôtre : redonner de la stabilité, un toit, un point d'ancrage à ceux qui en ont le plus besoin.",
      ],
    },

    quiz: {
      eyebrow: "Pré-qualification éclair",
      title: "Trois questions. Un dossier sur mesure.",
      subtitle:
        "Répondez en 30 secondes pour découvrir le parcours qui correspond à votre situation — sans engagement.",
      progressLabel: "Question",
      ofLabel: "sur",
      nextLabel: "Continuer",
      backLabel: "Retour",
      restartLabel: "Refaire le test",
      questions: [
        {
          q: "Quel est votre projet hypothécaire ?",
          options: [
            { label: "Renouvellement, refinancement ou consolidation de dettes", tier: "refi" },
            { label: "Acheter ma première propriété", tier: "primo" },
            { label: "Acheter une 2e propriété ou faire un upgrade familial", tier: "explorer" },
            { label: "Investir dans un immeuble à revenus ou multiplex", tier: "investor" },
          ],
        },
        {
          q: "Où en êtes-vous dans le processus ?",
          options: [
            { label: "J'ai déjà une hypothèque, je veux l'optimiser", tier: "refi" },
            { label: "Je magasine activement (pré-approuvé)", tier: "primo" },
            { label: "J'évalue mes options sans urgence", tier: "explorer" },
            { label: "J'ai déjà plusieurs propriétés", tier: "investor" },
          ],
        },
        {
          q: "Qu'est-ce qui compte le plus pour vous ?",
          options: [
            { label: "Réduire mes paiements ou consolider mes dettes", tier: "refi" },
            { label: "Avoir un courtier disponible et patient", tier: "primo" },
            { label: "Comprendre chaque étape avant de décider", tier: "explorer" },
            { label: "Maximiser mon effet de levier", tier: "investor" },
          ],
        },
      ],
      results: {
        primo: {
          eyebrow: "Profil — Premier achat",
          title: "Vous êtes prêt à structurer votre premier dossier.",
          body: "RAP (jusqu'à 35 000 $ de votre REER sans impôt), CELIAPP (jusqu'à 40 000 $ à vie), taxe de bienvenue, mise de fonds 5 % — Andrew vous guide étape par étape, aucune zone grise, aucun jargon non expliqué.",
          ctaLabel: "Démarrer mon dossier",
        },
        refi: {
          eyebrow: "Profil — Refi, renouvellement ou consolidation",
          title: "Votre hypothèque actuelle peut probablement travailler plus fort.",
          body: "25 000 $ de carte de crédit à 19,99 % coûtent ~416 $/mois en intérêts seulement. Intégrés à votre hypothèque à ~4,5 %, ça tombe à ~85 $/mois — soit 320 $ libérés chaque mois. Andrew analyse votre dossier parmi 9+ prêteurs et négocie les meilleures conditions, avec ou sans changement de banque.",
          ctaLabel: "Comparer mes options",
        },
        investor: {
          eyebrow: "Profil — Investisseur",
          title: "Une stratégie de financement qui fait travailler votre équité.",
          body: "Multiplex, immeubles à revenus, refi par effet de levier sur l'équité existante. Andrew structure des dossiers complexes avec les ~9 prêteurs qui comprennent vraiment l'investissement immobilier — pas juste ceux qui acceptent un dossier résidentiel standard.",
          ctaLabel: "Discuter ma stratégie",
        },
        explorer: {
          eyebrow: "Profil — Upgrade ou exploration",
          title: "Une 2e propriété, un upgrade familial, ou simplement clarifier vos options.",
          body: "Vendre pour acheter plus grand, garder votre maison actuelle en location, déménager, racheter une part suite à séparation — ou juste comprendre vos vraies marges de manœuvre. Andrew prend 20 minutes pour vous donner l'heure juste, sans engagement, avec des chiffres clairs.",
          ctaLabel: "Prendre 20 minutes avec Andrew",
        },
      },
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
        consent_required:
          "Pour qu'on puisse vous répondre, on a besoin de votre permission — cochez la case ci-dessus.",
        name_invalid: "Pouvez-vous écrire votre nom au complet ? (au moins 2 lettres)",
        name_too_long: "Votre nom semble un peu long — vérifiez s'il vous plaît.",
        email_invalid: "On ne reconnaît pas le format de votre courriel — voulez-vous le corriger ?",
        email_too_long: "Votre adresse courriel semble très longue — vérifiez s'il vous plaît.",
        phone_too_long: "Votre numéro semble trop long — vérifiez le format.",
        message_too_long: "Votre message est très long — voulez-vous le raccourcir un peu ?",
        invalid_json: "Hum, quelque chose n'a pas fonctionné. Voulez-vous réessayer ?",
        rate_limited:
          "On a bien reçu vos tentatives. Patientez quelques secondes avant de retenter — c'est juste une protection technique.",
        db_error:
          "Notre serveur fait une petite pause. Réessayez dans un instant — vos infos sont en sécurité.",
        network_error:
          "On dirait que la connexion a sauté. Vérifiez votre internet et réessayez.",
        unknown_error:
          "Quelque chose a buggé de notre côté. Réessayez, ou écrivez-nous directement à andrew@equipebuteau.com.",
      },
    },

    institutions: {
      hero: {
        eyebrow: "Référence pratique",
        title: "Adresses pour vos preuves d'assurance",
        subtitle:
          "Informations importantes pour votre preuve d'assurance habitation.",
      },
      reassurance:
        "Nous travaillons avec un large éventail de prêteurs pour vous offrir les meilleures conditions de financement adaptées à votre situation.",
      insurance: {
        eyebrow: "Informations clés",
        title: "Preuves d'assurance habitation valide",
        bodyP1:
          "Vous devrez avoir une preuve d'assurance habitation valide à compter de la date de l'acte de vente.",
        attentionLabel: "Attention",
        attentionP1:
          "Le nom et l'adresse complète de l'institution financière doivent y apparaître.",
        attentionP2:
          "Pour un refinancement, avertissez aussi votre assureur : même sans changement de police, le créancier doit être à jour.",
      },
      lendersSectionTitle: "Liste des prêteurs",
      addressVariesNote: "L'adresse varie selon la Caisse choisie.",
      lenders: [
        {
          name: "Banque Nationale",
          address: "800, rue Saint-Jacques",
          city: "Montréal (Québec) H3C 1A3",
          logo: "/institutions/banque-nationale.jpg",
        },
        {
          name: "Société de services MCAP",
          address: "200, rue King Ouest, bureau 400",
          city: "Toronto (Ontario) M5H 3T4",
          logo: "/institutions/mcap.webp",
        },
        {
          name: "First National",
          address: "2000, rue Peel, bureau 200",
          city: "Montréal (Québec) H3A 2W5",
          logo: "/institutions/first-national.png",
        },
        {
          name: "CIBC",
          address: "81, rue Bay",
          city: "Toronto (Ontario) M5J 0E7",
          logo: "/institutions/cibc.svg",
        },
        {
          name: "CMLS",
          address: "530 – 8e Avenue Sud-Ouest, Bureau 1000",
          city: "Calgary (Alberta) T2P 3S8",
          logo: "/institutions/cmls.svg",
        },
        {
          name: "Banque Toronto-Dominion",
          address: "1350, boulevard René-Lévesque Ouest",
          city: "Montréal (Québec) H3G 1T4",
          logo: "/institutions/td.svg",
        },
        {
          name: "Banque Scotia",
          address: "44, rue King Ouest",
          city: "Toronto (Ontario) M5H 1H1",
          logo: "/institutions/scotia.png",
        },
        {
          name: "La financière Manuvie",
          address: "200 Bloor Street East",
          city: "Toronto (Ontario) M4W 1E5",
          logo: "/institutions/manuvie.svg",
        },
        {
          name: "Caisses Desjardins",
          address: "L'adresse varie selon la Caisse choisie.",
          city: "",
          logo: "/institutions/desjardins.svg",
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
        eyebrow: "La boîte à outils",
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
        shareLabel: "Partager ce scénario",
        shareCopiedLabel: "Lien copié",
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
        eyebrow: "30 secondes top chrono",
        title: "L'hypothèque expliquée en capsules courtes",
        body: "Andrew répond à toutes les questions hypothécaires — mythes, calculs rapides, programmes méconnus, pièges à éviter. Sans jargon, sans détour.",
        ctaCollection: "Voir la collection complète",
        ctaTikTok: "Suivre sur TikTok",
      },
      blog: {
        eyebrow: "Le journal",
        title: "Articles et analyses du marché hypothécaire",
        body: "Notre journal regroupe nos articles complets — préapprobation, refinancement, stratégies de taux, achat d'un immeuble locatif. Tous rédigés pour aider à mieux décider avant de signer.",
        ctaLabel: "Lire les articles",
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
        eyebrow: "Au-delà des outils",
        title: "Besoin d'un humain ?",
        body: "Les outils ouvrent une porte. Andrew et son équipe vous aident à la franchir — sans pression, avec une stratégie chiffrée.",
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

    exitIntent: {
      eyebrow: "Avant de partir",
      title: "Un dossier hypothécaire, ça se prépare.",
      titleAccent: "Une seule conversation suffit.",
      body: "On structure votre financement sans pression. Vingt minutes au téléphone, c'est suffisant pour clarifier votre dossier — achat, refinancement ou renouvellement.",
      ctaCall: "Appeler maintenant",
      ctaContact: "Aller au formulaire",
      decline: "Plus tard",
      close: "Fermer",
    },
  },

  en: {
    common: {
      brand: "Équipe Buteau",
      tagline: "Mortgage. Differently.",
      cabinet: "Planiprêt",
      callUs: "Reach us",
      smsLabel: "Direct text",
      smsBody:
        "Hello Andrew, I am interested in your mortgage broker services. Could you call me back?",
      contactCta: "Start my journey",
      whatsappMessage:
        "Hello Andrew, I am interested in your mortgage broker services.",
      whatsappTooltip: "Message us on WhatsApp",
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
      journal: "Journal",
      capsules: "Capsules",
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
          "First-time or stressful renewal? We start by listening — not by judging your file. 200 families supported in 2025, same rigor for each.",
        ctaPrimary: "See my payment in 60 seconds",
        ctaSecondary: "Meet our team",
        ctaByTier: {
          primo: "Start my first file",
          refi: "Compare my options",
          investor: "Discuss my strategy",
          explorer: "Take 20 minutes with Andrew",
        },
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
        title: "Four pros, one rigor",
        andrewName: "Andrew Buteau",
        andrewRole: "Mortgage broker & Founder",
        abygaeleName: "Abygaèle Gagné",
        abygaeleRole: "Executive coordinator",
        alexisName: "Alexis Buteau",
        alexisRole: "Mortgage management assistant",
        felixName: "Felix",
        felixRole: "Brokerage operations coordinator",
        cta: "Meet Andrew, Abygaèle, Alexis & Felix",
      },

      services: {
        eyebrow: "Our services",
        title: "Five services, one philosophy",
        items: [
          {
            title: "Renewal",
            desc: "Market analysis 120 days before maturity and negotiation to secure the best conditions — with or without switching banks.",
          },
          {
            title: "Refinancing",
            desc: "Restructure your financing to optimize liquidity, unlock equity, or fund a renovation, education or investment project.",
          },
          {
            title: "Debt consolidation",
            desc: "Roll high-interest debts (cards, lines, loans) into your mortgage to lower monthly payments and regain control.",
          },
          {
            title: "Property purchase",
            desc: "Strategy from A to Z for buying a first home, a 2nd property, a family upgrade, or a secondary residence.",
          },
          {
            title: "Investment",
            desc: "Structured financing strategies to grow your real-estate portfolio — multi-units, income properties, leverage on existing equity.",
          },
        ],
      },

      mission: {
        eyebrow: "Our mission",
        title: "Why we exist",
        bodyP1Lead: "At ",
        bodyP1Brand: "Équipe BUTEAU",
        bodyP1Continued:
          ", our priority is to deliver a fast, efficient and human service. Our mission is to simplify the financing process, eliminate grey areas, and design personalized strategies that fit your unique needs.",
        bodyP2Lead: "In ",
        bodyP2Year: "2025",
        bodyP2Continued: ", we supported more than ",
        bodyP2Stat: "families",
        bodyP2End:
          " across Quebec. With method and availability, we move every project toward success.",
        values: [
          {
            title: "Data-driven analysis",
            desc: "A structured approach grounded in your numbers for optimal decisions.",
          },
          {
            title: "Extensive experience",
            desc: "200+ families in 2025. All regions. All profiles.",
          },
          {
            title: "Professional team",
            desc: "Methodical, available brokers at every step — from the first call to the signature.",
          },
          {
            title: "Wide lender network",
            desc: "Access to multiple institutions for the best rate and conditions.",
          },
        ],
      },

      guidesShelf: {
        eyebrow: "Library",
        title: "Guides & documents at your disposal.",
        subtitle:
          "A curated selection of educational tools and downloadable references to confidently structure your file — released progressively.",
        ctaFull: "Browse the library",
        comingSoon: "Soon",
        items: [
          {
            kind: "guide",
            title: "Renewal & refinancing",
            excerpt: "When to shop, how to negotiate, unlock equity or consolidate debts.",
            tag: "Guide",
          },
          {
            kind: "guide",
            title: "Understanding interest rates",
            excerpt: "Fixed, variable, hybrid. How rates are set. When to lock in.",
            tag: "Guide",
          },
          {
            kind: "guide",
            title: "Buying your first home",
            excerpt: "Down payment, pre-approval, HBP, FHSA, assistance programs.",
            tag: "Guide",
          },
          {
            kind: "guide",
            title: "Real-estate investment",
            excerpt: "Financing strategies for income properties and multi-units.",
            tag: "Guide",
          },
          {
            kind: "doc",
            title: "Required documents checklist",
            excerpt: "Comprehensive list to prepare your mortgage file.",
            tag: "Document",
          },
        ],
      },

      valueTicker: {
        items: [
          "200 files closed in 2025",
          "9+ partner financial institutions",
          "AMF-registered — Planiprêt firm",
          "Mortgage, differently",
          "First purchase · Refinancing · Renewal · Investment",
          "All of Quebec — head office in Laval",
          "Andrew Buteau, mortgage broker",
        ],
      },

      capsulesPreview: {
        eyebrow: "30 seconds, top chrono",
        title: "Mortgage explained in capsules.",
        subtitle:
          "Myths, quick math, hidden programs, traps to avoid — no jargon, no detours. Here are 5 featured capsules from 30+ available.",
        ctaFull: "View all capsules",
        items: [
          { categoryId: "down-payment", title: "The HBP — using your RRSP to buy", hook: "Eminem isn't the only one who can RAP… you can too. But it's not the same RAP." },
          { categoryId: "debt-costs", title: "The Golf GTI vs your house", hook: "Want a Golf GTI ? Fine. But it might cost you a garage." },
          { categoryId: "credit-file", title: "Bankruptcy = never an owner again ? False.", hook: "Filed bankruptcy ? Completely false. Bankruptcy is a chapter, not the end of the story." },
          { categoryId: "rate-refi", title: "Accelerated payments — save time & interest", hook: "Splitting your payment in two = 3 years sooner + ~$45k saved in interest." },
          { categoryId: "lifestyle", title: "Girl Math your mortgage", hook: "If we can girl math a $1,200 bag, we can DEFINITELY girl math a house." },
        ],
      },

      calcPreview: {
        eyebrow: "Live estimate",
        title: "How much will your mortgage cost?",
        subtitle:
          "Instant estimate using the Canadian semi-annual formula. For the full amortization curve + the «What if...» scenarios, head to the Tools page.",
        amountLabel: "Amount",
        rateLabel: "Rate",
        yearsLabel: "Term",
        resultLabel: "Monthly payment",
        ctaFull: "Full calculator + scenarios",
        ctaTools: "Explore the full toolkit",
      },

      // AdPage — full-bleed editorial spread (Cereal vol.18 style).
      adPage: {
        statement: "Four pros. Five services. One signature.",
        attribution: "Équipe Buteau",
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
        googleBadgeLabel: "111 reviews 5 stars Google",
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
            q: "How long does a mortgage file take?",
            a: "Generally, count on 30 to 45 days from accepted offer to closing. Our team works to minimize that delay through strong lender relationships.",
          },
          {
            q: "What's the minimum down payment?",
            a: "The minimum down payment is generally 5% for a first home purchase. For investment or luxury properties, it may be higher. We help explore options like HBP (RRSP) or FHSA (CELIAPP) to reduce your initial cost.",
          },
          {
            q: "Fixed or variable rate — which to choose?",
            a: "It depends on your situation and risk tolerance. A fixed rate offers predictable stability; a variable rate can pay off in falling-rate environments. We analyze your options and recommend the strategy that fits you.",
          },
          {
            q: "Are there hidden fees?",
            a: "No. We believe in total transparency. All fees are disclosed and explained from day one. Our role is to support you with no surprises — you know exactly what you owe.",
          },
          {
            q: "Can you refinance my current property?",
            a: "Absolutely. Refinancing is one of our specialties. Whether to reduce your payments, free up equity, or consolidate debts, we find the right fit for your financial situation.",
          },
          {
            q: "How can I improve my credit score?",
            a: "Several actions help: paying bills on time, reducing credit-card balances, avoiding unnecessary new credit applications. We can advise on strategies to optimize your credit profile.",
          },
          {
            q: "When should I prepare my mortgage renewal?",
            a: "Ideally 4 to 6 months before maturity. Most borrowers accept their lender's renewal offer by default — often without shopping around. Preparing in advance lets us put your file in competition across multiple institutions, secure a better rate, and assess whether restructuring (consolidation, refinancing) could be advantageous. A renewal isn't a routine signature, it's a financial leverage point.",
          },
        ],
      },
    },

    team: {
      hero: {
        eyebrow: "The team",
        title: "Our team",
        subtitle:
          "Four dedicated mortgage brokers, structuring your financial success with method and humanity.",
      },
      marginalia: ["founder", "coord.", "assist.", "operations"],
      members: [
        {
          name: "Andrew Buteau",
          role: "Mortgage broker & Founder",
          photo: "https://i.imgur.com/k4bZmLl.jpg",
          bio: "Andrew Buteau is a mortgage broker in Laval, under the Planiprêt licence. His philosophy: « By acting with integrity and transparency, I make sure my clients have all the information to make an informed choice. » He provides the planning tools needed to select the mortgage that truly fits each file's needs. In 2025, his team supported 200+ families across Quebec — with rigor, availability, and the energy to do things differently.",
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
          bio: "Calm, methodical and detail-oriented, Alexis backs the team daily: file preparation, administrative support, and analysis of the materials essential to building every file. Currently in the final stretch of his mortgage broker training.",
        },
        {
          name: "Felix",
          role: "Brokerage operations coordinator",
          photo: "/equipe/felix.jpeg",
          bio: "Felix joins Équipe Buteau as brokerage operations coordinator. His full biography will be published soon — meanwhile, his role within the team is to keep every file on time and the communication between clients, lenders and notaries flowing smoothly.",
        },
      ],
      method: {
        eyebrow: "Our method",
        title: "Three pillars, one execution",
        intro:
          "Every file is treated with the same method and structure. We work in close collaboration to analyze your situation, identify the most relevant options, and execute a clear financing strategy tailored to your goals.",
        items: [
          {
            label: "Collaboration",
            desc: "Each member brings their expertise — analysis, negotiation, execution. From the first meeting to closing, we work together to ensure consistency and efficiency.",
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
      eyebrow: "Next step",
      title: "Ready to structure your project?",
      subtitle: "Clear decisions. Structured execution. Concrete results.",
      button: "Book an appointment",
    },

    journal: {
      eyebrow: "The journal",
      title: "Reflections from Équipe Buteau.",
      subtitle:
        "Columns, market analyses and clarifying explanations — published at the rhythm of trends and questions received. Click a title to open the full article.",
      readingLabel: "min read",
      readMoreLabel: "Read article",
      hideLabel: "Collapse",
      categoryLabel: "Category",
      footnote: "Follow our capsules for in-between drops.",
      articles: [
        {
          slug: "preapprobation-hypothecaire-2026",
          category: "Pre-approval",
          date: "May 1, 2026",
          dateIso: "2026-05-01",
          readingTime: 8,
          title: "Mortgage Pre-approval 2026: Get Your Letter in 24h.",
          lead: "A mortgage pre-approval is an official written commitment from a lender confirming your maximum borrowing capacity. It locks in an interest rate for 90 to 120 days, protecting you from market hikes while you search for property in Quebec.",
          excerpt:
            "Maximize your buying power this spring. Get a fast pre-approval with L'Équipe Buteau — access to 20+ banks and financial institutions.",
          pullQuote:
            "In a competitive market, a pre-approval letter sends a signal that can make a real difference.",
          // bodyHtml injecte cote client (FR-only HTML, affiche meme en EN) — cf. routes/journal.tsx.
        },
      ],
    },

    courrier: {
      subtitle:
        "A selection of testimonials received by email, in person, or via Google. Each letter is published with the author's permission.",
      letterDateLabel: "Received",
      letterFromLabel: "From",
      googleLinkLabel: "See all reviews on Google",
      footnote: "Newest first.",
      additionalLetters: [
        {
          quote:
            "We switched banks at renewal and the rate spread is saving us over $12,000 over 5 years. Andrew negotiated everything without us having to shop around — that's the real value of a broker.",
          authorInitial: "S",
          author: "Sophie L.",
          city: "Mirabel",
          date: "January 22, 2026",
        },
        {
          quote:
            "First multi-unit purchased thanks to Andrew's leverage strategy. He explained every ratio, every scenario. No surprises at the notary.",
          authorInitial: "F",
          author: "François R.",
          city: "Saint-Eustache",
          date: "January 8, 2026",
        },
        {
          quote:
            "Andrew took 45 minutes on the phone to understand our situation before proposing anything. No one else had done that.",
          authorInitial: "M",
          author: "Marie-Pierre G.",
          city: "Terrebonne",
          date: "December 14, 2025",
        },
        {
          quote:
            "Refinanced our RBC to consolidate a line of credit and a car loan. The amortization table Andrew gave us before signing was perfectly clear.",
          authorInitial: "É",
          author: "Étienne B.",
          city: "Repentigny",
          date: "November 30, 2025",
        },
        {
          quote:
            "Our previous broker had abandoned our file. Abygaèle picked it up, kept us informed every step. Closing on time.",
          authorInitial: "K",
          author: "Karine T.",
          city: "Blainville",
          date: "November 18, 2025",
        },
        {
          quote:
            "I was 30 with zero idea how a mortgage worked. Andrew explained everything — ratios, fixed vs variable, HBP, FHSA. Today I'm a homeowner.",
          authorInitial: "L",
          author: "Lucas M.",
          city: "Boisbriand",
          date: "October 5, 2025",
        },
      ],
    },

    merci: {
      eyebrow: "Request received",
      title: "Thank you.",
      subtitle:
        "Andrew has received your request and will personally get back to you shortly. No grey areas — you'll know exactly where things stand.",
      footnote: "Received · Andrew Buteau · AMF registered",
      nextStepsLabel: "While you wait",
      nextStepCalc: "Explore the calculator",
      nextStepLexique: "Browse the glossary",
      nextStepBack: "Back to home",
      tierMessages: {
        primo: "Your first-time buyer file is my priority — I'll call you within 24 hours to start the pre-approval.",
        refi: "Your current situation deserves a full review — I'll call you within 24 hours with my first observations.",
        investor: "Your investment project is being analyzed — I'll call you within 24 hours to discuss your leverage strategy.",
        explorer: "No pressure — I'll call you within 24 hours to clarify your situation, no commitment.",
      },
    },

    notFound: {
      eyebrow: "Lost?",
      title: "This page doesn't exist in our edition.",
      subtitle:
        "Perhaps a link has moved, or you're searching for something specific. We can guide you back on track.",
      ctaHome: "Back to home",
      ctaCall: "Call Andrew",
      footnote: "Code 404 · Quebec · MMXXVI",
    },

    capsules: {
      eyebrow: "30 seconds, top chrono",
      title: "Mortgage, in short capsules.",
      subtitle:
        "Andrew tackles every mortgage question, no detours. Myths, quick math, hidden programs, traps to avoid — in his unmistakable voice.",
      ctaTikTok: "Watch all on TikTok",
      followLine: "Follow @equipebuteau so you don't miss anything.",
      hookLabel: "Hook",
      footnote:
        "Capsules filmed continuously. Numerical examples are educational — validate your case with a broker before deciding.",
      categories: [
        {
          id: "down-payment",
          eyebrow: "Down payment & financing",
          intro: "Everything about the cash you put in — minimum, maximum, creative sources, exceptions. What your uncle told you, and what's actually true.",
          items: [
            { title: "Minimum down payment — quick math", hook: "Wondering what the minimum is to buy ? AND no, it's not automatically 5%. Let me calculate it for you." },
            { title: "5% down — not just for first-time buyers", hook: "Your uncle told you 5% was just for the first purchase ? Completely false." },
            { title: "The HBP — using your RRSP to buy", hook: "Eminem isn't the only one who can RAP… you can too. But it's not the same RAP." },
            { title: "The FHSA — why deposit even if you buy soon", hook: "Everyone tells you « put money in even if you buy next week ». But why ? What does it actually change for you ?" },
            { title: "Buying with no down payment — 3 possible situations", hook: "Low on cash ? You think the bank always requires a saved down payment ? Not necessarily. 3 situations let you buy anyway." },
            { title: "Buying the family home with no down payment", hook: "Your grandmother finally decides to sell you THE house. What if you didn't need to pull a single dollar out of your pockets ?" },
            { title: "Buying a 2nd property with 5% — it's possible", hook: "You already own a home, you want to keep it AND buy another. You think 5% is impossible ? Wrong." },
          ],
        },
        {
          id: "credit-file",
          eyebrow: "Credit & file",
          intro: "How the bank reads your file. What helps, what hurts, what we can fix — and why a no today doesn't mean no forever.",
          items: [
            { title: "Your debit card builds zero credit", hook: "Proud you never use your credit card ? Congrats… you just helped your file by zero. Zero. Nada." },
            { title: "Buy Now Pay Later — the silent trap", hook: "BNPL looks cute. But in real life, your credit file pays right now." },
            { title: "Your credit score : lower than you think", hook: "How high do you think your score must be to buy ? Reality is much lower than you think." },
            { title: "Bankruptcy = never an owner again ? False.", hook: "You filed bankruptcy and think you'll never buy ? Completely false. Bankruptcy is a chapter, not the end of the story." },
            { title: "Why the bank sometimes prefers a $100k bankruptcy", hook: "Doesn't seem logical, but a $100k bankruptcy can sometimes be viewed better than a $12k consumer proposal." },
            { title: "Your pre-qualification expires faster than you think", hook: "A pre-qualification has an expiry date. But it happens way faster than you think." },
            { title: "Your 2025 pre-qual may already be outdated — upward", hook: "From December to January, your pre-qual may have grown without you noticing. Banks work with fiscal years." },
            { title: "The 3 factors that drive your borrowing capacity", hook: "Think you don't qualify ? 3 factors — and most importantly, everything can be fixed. Nothing is permanent." },
          ],
        },
        {
          id: "income",
          eyebrow: "Income & special profiles",
          intro: "Tips, child benefits, self-employed, couples — the bank doesn't see them all the same. And some lenders will say yes where others said no.",
          items: [
            { title: "The TIP — your tips count (self-declaration)", hook: "You're a server, hairdresser or bartender and think you'll never qualify because your real salary is your TIPS ? Good news — yes, your tips can count." },
            { title: "Having kids & qualifying", hook: "Oof, I'm gonna get rocks thrown at me. You have kids and think it can block you ? Yes… but not how you think." },
            { title: "You earn $70k — how much can you buy", hook: "$70k/year and wondering what you can afford ? Here's the real number — not a TikTok estimate." },
            { title: "You earn $100k — your real buying power", hook: "$100k/year. Solo, or with your partner ? Real numbers by region." },
            { title: "Bank criteria — it's not you, it's them", hook: "Think every bank wants your file ? Truth : one bank refuses you for details another wouldn't even check." },
          ],
        },
        {
          id: "debt-costs",
          eyebrow: "Debts & hidden costs",
          intro: "Car, coffee, welcome tax, BNPL — what eats your home budget without you seeing it. To the bank, every $100/month of debt = $15k–$20k of buying power lost.",
          items: [
            { title: "The Golf GTI vs your house", hook: "Want a Golf GTI ? Fine. But it might cost you a garage." },
            { title: "Your $800/month car costs you a house", hook: "Paying $800/month for your car ? To the bank, that $800 is a fixed debt — and it can cost you between $120k and $160k of home budget." },
            { title: "Is your daily Starbucks really blocking you ?", hook: "Sweet cold foam please. Could your daily Starbucks really stop you from buying a house ? Let's see together." },
            { title: "How much is the welcome tax ?", hook: "You bought and want to know the welcome tax bill ? Let's calculate in 30 seconds — tiers 0.5 / 1 / 1.5%." },
          ],
        },
        {
          id: "strategies",
          eyebrow: "Strategies & investment",
          intro: "Make your home work for you, build a plex, choose your partners wisely. Real-estate investment isn't just the building — it's who and how you buy with.",
          items: [
            { title: "Your house can help you buy a plex", hook: "Want to buy a plex and think your house holds you back ? What if it was your best asset ?" },
            { title: "Duplex vs triplex — a world of difference", hook: "Hesitating between a duplex and a triplex ? To you, one more door. To the bank, a world of difference — and it can cost you." },
            { title: "Why keep the same investment partner at the start", hook: "Want to invest with different partners than the first ones ? To the bank, it can drag everyone down." },
            { title: "Bi-generational homes — why everyone's talking", hook: "Bi-generational homes are now popular. It's not just me saying it. And it's no accident." },
          ],
        },
        {
          id: "rate-refi",
          eyebrow: "Refinancing & rates",
          intro: "When to break, when to lock, when to accelerate. Real numbers — not vague advice.",
          items: [
            { title: "Your rate is above 5% ? Listen up.", hook: "Your rate above 5% ? Breaking your loan can sometimes cost LESS than future interest savings — and save you a ton." },
            { title: "Accelerated payments — save time & interest", hook: "Want to pay your mortgage faster without noticing ? Splitting your payment in two = 3 years sooner + ~$45k saved in interest." },
            { title: "Fixed, variable, hybrid : what to pick in 2026", hook: "Renew at fixed, variable or hybrid in 2026 ? No universal right answer. But a method to decide for YOUR profile." },
          ],
        },
        {
          id: "lifestyle",
          eyebrow: "Storytelling & lifestyle",
          intro: "The human behind the file. True anecdotes, funny myths, real wins — Andrew's voice, unfiltered.",
          items: [
            { title: "Girl Math your mortgage", hook: "Let's girl math your mortgage. Yes, really. If we can girl math a $1,200 bag, we can DEFINITELY girl math a house." },
            { title: "Broker commission — riddle version", hook: "I'm worth a lot but cost nothing. I work hard but you don't pay me. I shop for you but never send you a bill. Who am I ?" },
            { title: "Clients who marry to buy", hook: "And then they say men fear commitment… I have 2 clients who actually decided to get married to take back a unit. True story." },
          ],
        },
      ],
    },

    media: {
      eyebrow: "Featured & engaged",
      title: "Andrew in the media and in the community.",
      subtitle:
        "Mortgage brokerage isn't just a file. It's also TV sets, charity nights and regional conversations — wherever people talk money, projects and the future.",
      tvEyebrow: "On air",
      tvTitle: "Andrew Buteau on the show « Art de Réussir »",
      tvVideoTitle: "Andrew Buteau on Art de Réussir",
      tvShowName: "January 2026 — Aired on Art de Réussir",
      tvCaptionLines: [
        "A candid conversation about mortgage brokerage in Quebec: what sets a broker apart from a bank, how to shop a renewal without panic, and why « clarity » should be the first criterion when choosing a broker.",
        "Andrew shares his vision of mortgage service that feels more like support than a transaction.",
      ],
      eventEyebrow: "Community engagement",
      eventTitle: "Charity evening « Dans la rue »",
      eventDate: "November 2025 — Montreal",
      eventCaptionLines: [
        "The organization Dans la rue has supported young people experiencing homelessness in Montreal for over 35 years. Équipe Buteau contributed financially and on-site at the November 2025 charity evening.",
        "A mission aligned with ours: returning stability, a roof, a point of anchor to those who need it most.",
      ],
    },

    quiz: {
      eyebrow: "Quick pre-qualification",
      title: "Three questions. A tailored file.",
      subtitle:
        "Answer in 30 seconds to discover the path that fits your situation — no commitment.",
      progressLabel: "Question",
      ofLabel: "of",
      nextLabel: "Continue",
      backLabel: "Back",
      restartLabel: "Retake the quiz",
      questions: [
        {
          q: "What's your mortgage project?",
          options: [
            { label: "Renewal, refinancing or debt consolidation", tier: "refi" },
            { label: "Buying my first property", tier: "primo" },
            { label: "Buying a 2nd property or family upgrade", tier: "explorer" },
            { label: "Investing in an income property or multi-unit", tier: "investor" },
          ],
        },
        {
          q: "Where are you in the process?",
          options: [
            { label: "I already have a mortgage — I want to optimize it", tier: "refi" },
            { label: "Actively shopping (pre-approved)", tier: "primo" },
            { label: "Evaluating my options without urgency", tier: "explorer" },
            { label: "I already own multiple properties", tier: "investor" },
          ],
        },
        {
          q: "What matters most to you?",
          options: [
            { label: "Lower my payments or consolidate my debts", tier: "refi" },
            { label: "Have a broker who's available and patient", tier: "primo" },
            { label: "Understand every step before deciding", tier: "explorer" },
            { label: "Maximize my leverage", tier: "investor" },
          ],
        },
      ],
      results: {
        primo: {
          eyebrow: "Profile — First purchase",
          title: "You're ready to structure your first file.",
          body: "HBP (up to $35,000 from your RRSP tax-free), FHSA (up to $40,000 lifetime), welcome tax, 5% down payment — Andrew guides you step by step. No grey areas, no unexplained jargon.",
          ctaLabel: "Start my file",
        },
        refi: {
          eyebrow: "Profile — Refi, renewal or consolidation",
          title: "Your current mortgage can probably work harder.",
          body: "$25,000 of credit card debt at 19.99% costs ~$416/month in interest alone. Rolled into your mortgage at ~4.5%, it drops to ~$85/month — that's $320 freed up every month. Andrew reviews your file across 9+ lenders and negotiates the best conditions, with or without switching banks.",
          ctaLabel: "Compare my options",
        },
        investor: {
          eyebrow: "Profile — Investor",
          title: "A financing strategy that puts your equity to work.",
          body: "Multi-units, income properties, leverage refi on existing equity. Andrew structures complex files with the ~9 lenders who truly understand real-estate investment — not just those who accept a standard residential file.",
          ctaLabel: "Discuss my strategy",
        },
        explorer: {
          eyebrow: "Profile — Upgrade or exploring",
          title: "A 2nd property, a family upgrade, or simply clarifying your options.",
          body: "Sell to buy bigger, keep your current home as a rental, relocate, buy out a share post-separation — or just understand your real margins. Andrew takes 20 minutes to give you the straight numbers, no commitment, with clarity.",
          ctaLabel: "Take 20 minutes with Andrew",
        },
      },
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
        consent_required:
          "So we can reply, we just need your permission — check the box above please.",
        name_invalid: "Could you write your full name? (at least 2 letters)",
        name_too_long: "Your name looks a bit long — could you double-check?",
        email_invalid: "We don't recognize this email format — would you like to fix it?",
        email_too_long: "Your email address looks very long — please double-check.",
        phone_too_long: "Your phone number looks too long — please check the format.",
        message_too_long: "Your message is quite long — would you like to shorten it a bit?",
        invalid_json: "Hmm, something didn't go through. Want to try again?",
        rate_limited:
          "We received your attempts. Please wait a few seconds before retrying — it's just a technical safety.",
        db_error: "Our server is taking a short break. Try again in a moment — your info is safe.",
        network_error:
          "Looks like the connection dropped. Check your internet and retry.",
        unknown_error:
          "Something glitched on our side. Try again, or write us directly at andrew@equipebuteau.com.",
      },
    },

    institutions: {
      hero: {
        eyebrow: "Practical reference",
        title: "Addresses for your insurance proof",
        subtitle: "Important information for your home insurance proof.",
      },
      reassurance:
        "We work with a wide range of lenders to deliver the best financing conditions tailored to your situation.",
      insurance: {
        eyebrow: "Key information",
        title: "Valid home insurance proof",
        bodyP1:
          "You must have a valid home insurance proof effective from the date of the deed of sale.",
        attentionLabel: "Heads up",
        attentionP1:
          "The name and full address of the financial institution must appear on it.",
        attentionP2:
          "For a refinance, notify your insurer too: even without changing the policy, the creditor on file must stay current.",
      },
      lendersSectionTitle: "List of lenders",
      addressVariesNote: "Address varies by selected Caisse branch.",
      lenders: [
        {
          name: "Banque Nationale",
          address: "800, rue Saint-Jacques",
          city: "Montréal (Québec) H3C 1A3",
          logo: "/institutions/banque-nationale.jpg",
        },
        {
          name: "MCAP Service Corporation",
          address: "200 King Street West, Suite 400",
          city: "Toronto (Ontario) M5H 3T4",
          logo: "/institutions/mcap.webp",
        },
        {
          name: "First National",
          address: "2000 Peel Street, Suite 200",
          city: "Montréal (Québec) H3A 2W5",
          logo: "/institutions/first-national.png",
        },
        {
          name: "CIBC",
          address: "81 Bay Street",
          city: "Toronto (Ontario) M5J 0E7",
          logo: "/institutions/cibc.svg",
        },
        {
          name: "CMLS",
          address: "530 – 8th Avenue SW, Suite 1000",
          city: "Calgary (Alberta) T2P 3S8",
          logo: "/institutions/cmls.svg",
        },
        {
          name: "Toronto-Dominion Bank",
          address: "1350 René-Lévesque Boulevard West",
          city: "Montréal (Québec) H3G 1T4",
          logo: "/institutions/td.svg",
        },
        {
          name: "Scotiabank",
          address: "44 King Street West",
          city: "Toronto (Ontario) M5H 1H1",
          logo: "/institutions/scotia.png",
        },
        {
          name: "Manulife Financial",
          address: "200 Bloor Street East",
          city: "Toronto (Ontario) M4W 1E5",
          logo: "/institutions/manuvie.svg",
        },
        {
          name: "Desjardins",
          address: "Address varies by selected Caisse branch.",
          city: "",
          logo: "/institutions/desjardins.svg",
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
        eyebrow: "The toolkit",
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
        shareLabel: "Share this scenario",
        shareCopiedLabel: "Link copied",
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
        eyebrow: "30 seconds, top chrono",
        title: "Mortgage explained in short capsules",
        body: "Andrew tackles every mortgage question — myths, quick math, hidden programs, traps to avoid. No jargon, no detours.",
        ctaCollection: "View the full collection",
        ctaTikTok: "Follow on TikTok",
      },
      blog: {
        eyebrow: "The journal",
        title: "Articles and mortgage market analyses",
        body: "Our journal collects our long-form articles — pre-approval, refinancing, rate strategies, buying a rental property. All written to help you decide better before signing.",
        ctaLabel: "Read the articles",
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
        eyebrow: "Beyond the tools",
        title: "Need a human?",
        body: "Tools open a door. Andrew and the team help you walk through it — no pressure, with a numbered strategy.",
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

    exitIntent: {
      eyebrow: "Before you go",
      title: "A mortgage file deserves preparation.",
      titleAccent: "One conversation is enough.",
      body: "We structure your financing without pressure. Twenty minutes on the phone is enough to clarify your file — purchase, refinance or renewal.",
      ctaCall: "Call now",
      ctaContact: "Go to form",
      decline: "Later",
      close: "Close",
    },
  },
} as const satisfies Record<Lang, BilingualLax>;
