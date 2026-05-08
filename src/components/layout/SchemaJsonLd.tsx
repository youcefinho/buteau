/**
 * SchemaJsonLd — inject JSON-LD inline pour SEO per-route.
 *
 * Pattern : utilise dangerouslySetInnerHTML pour serialiser l'objet en JSON-LD
 * dans une balise <script type="application/ld+json">. GoogleBot execute le JS
 * et lit le schema (SPA-friendly).
 *
 * Pour les schemas globaux (LocalBusiness + WebSite), voir le @graph dans index.html.
 *
 * Audit HI-01 fix : `safeJsonLd` echappe `</script>`, `<!--`, `<![CDATA[` et separateurs
 * Unicode pour eviter qu'un champ dynamique (ex: bio CMS, review user) puisse casser le
 * <script> tag et injecter du HTML/JS arbitraire (XSS stocke).
 */
function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

type SchemaJsonLdProps = {
  schema: object | object[];
};

export function SchemaJsonLd({ schema }: SchemaJsonLdProps) {
  const json = Array.isArray(schema)
    ? { "@context": "https://schema.org", "@graph": schema }
    : schema;

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safeJsonLd(json) }}
    />
  );
}

/**
 * Helper : génère un BreadcrumbList Schema.org pour un fil d'Ariane.
 */
export function buildBreadcrumbList(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

const SITE_URL = "https://equipe-buteau.intralysqc.workers.dev";

/**
 * Convenience factories pour les routes.
 */
export const breadcrumbs = {
  team: (lang: "fr" | "en") =>
    buildBreadcrumbList([
      { name: lang === "fr" ? "Accueil" : "Home", url: `${SITE_URL}/` },
      { name: lang === "fr" ? "Équipe" : "Team", url: `${SITE_URL}/equipe` },
    ]),
  institutions: (lang: "fr" | "en") =>
    buildBreadcrumbList([
      { name: lang === "fr" ? "Accueil" : "Home", url: `${SITE_URL}/` },
      { name: lang === "fr" ? "Institutions" : "Lenders", url: `${SITE_URL}/institutions` },
    ]),
  tools: (lang: "fr" | "en") =>
    buildBreadcrumbList([
      { name: lang === "fr" ? "Accueil" : "Home", url: `${SITE_URL}/` },
      { name: lang === "fr" ? "Outils" : "Tools", url: `${SITE_URL}/outils` },
    ]),
  lexique: (lang: "fr" | "en") =>
    buildBreadcrumbList([
      { name: lang === "fr" ? "Accueil" : "Home", url: `${SITE_URL}/` },
      { name: lang === "fr" ? "Lexique" : "Glossary", url: `${SITE_URL}/lexique` },
    ]),
  mentionsLegales: (lang: "fr" | "en") =>
    buildBreadcrumbList([
      { name: lang === "fr" ? "Accueil" : "Home", url: `${SITE_URL}/` },
      { name: lang === "fr" ? "Mentions légales" : "Legal notice", url: `${SITE_URL}/mentions-legales` },
    ]),
  confidentialite: (lang: "fr" | "en") =>
    buildBreadcrumbList([
      { name: lang === "fr" ? "Accueil" : "Home", url: `${SITE_URL}/` },
      { name: lang === "fr" ? "Confidentialité" : "Privacy", url: `${SITE_URL}/confidentialite` },
    ]),
};

/**
 * FAQPage schema — pour la section FAQ de l'Accueil.
 */
export function buildFaqPage(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/**
 * Service entities — pour les 4 services Buteau.
 */
export function buildServices(
  services: Array<{ title: string; desc: string }>,
  lang: "fr" | "en",
) {
  return services.map((s, idx) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#service-${idx + 1}`,
    name: s.title,
    description: s.desc,
    serviceType: "Mortgage brokerage",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "AdministrativeArea", name: "Quebec" },
    inLanguage: lang === "fr" ? "fr-CA" : "en-CA",
  }));
}

/**
 * Person entity — pour un membre d'équipe.
 */
export function buildPerson(member: {
  name: string;
  role: string;
  bio: string;
  photo: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    image: member.photo,
    worksFor: { "@id": `${SITE_URL}/#business` },
  };
}
