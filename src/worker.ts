/**
 * Cloudflare Worker — Équipe Buteau
 *
 * Pipeline V6 Intralys (cf. skill `intralys-v6-pipeline`) :
 * - Sert les assets dist/ (SPA fallback géré par wrangler)
 * - Endpoint POST /api/lead avec défense en profondeur 4 couches :
 *     1. Honeypot field caché
 *     2. Timing detection (elapsed_ms < 3000ms = bot)
 *     3. Rate limit D1 30s par IP
 *     4. Server-side validation (email + maxLen + consent + sanitization)
 * - INSERT D1 + ctx.waitUntil(GHL POST) — non-bloquant pour le client
 * - CSP headers worker-applied sur toutes les réponses
 * - HTMLRewriter SSR meta + Schema.org per route (cf. injectRouteMeta)
 *
 * GHL = placeholders pour Phase 9 (locationId / trackingId fournis par client).
 */

import { glossary } from "./lib/glossary";
import { translations as i18n } from "./lib/translations";

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  DB?: D1Database; // optionnel tant que D1 pas provisionne (Phase 9 client setup)
}

// Limites + format
const RATE_LIMIT_WINDOW_MS = 30_000;          // 30 secondes
const MIN_FORM_FILL_TIME_MS = 1_500;           // < 1.5s = bot (harmonisation cross-sites Intralys 2026-05-10)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LEN = {
  full_name: 200,
  email: 320,
  phone: 50,
  message: 2_000,
  source: 100,
};

interface LeadPayload {
  full_name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  consent: boolean;
  honeypot?: string;
  form_started_at?: number; // timestamp ms côté client (pour timing detection)
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // ===== API Routes =====
    if (url.pathname === "/api/lead" && request.method === "POST") {
      return withSecurityHeaders(await handleLead(request, env, ctx), request);
    }

    if (url.pathname.startsWith("/api/")) {
      return withSecurityHeaders(
        new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }),
        request,
      );
    }

    // ===== Static assets (SPA fallback géré par wrangler config) =====
    // HTMLRewriter swap title/description/og + Schema.org per route SSR-style.
    const assetResponse = await env.ASSETS.fetch(request);
    const withMeta = await injectRouteMeta(assetResponse, url.pathname, request);
    return withSecurityHeaders(withMeta, request);
  },
};

// ═══════════════════════════════════════════════════════════
// SSR meta tags + Schema.org per route via HTMLRewriter
// ═══════════════════════════════════════════════════════════
// Buteau n'a pas de RouteMeta côté React — toutes les routes héritent
// du title statique de index.html. HTMLRewriter swap title/description/og
// + injecte Schema.org page-specific. FR-CA par défaut.

// ── Noscript fallback HTML helpers (Option 1 polish 2026-05-10) ─
// Pour bots non-JS (SemRush/Ahrefs/Moz/vieux scrapers FB) qui ignorent React.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface NoscriptItem { name: string; url: string; }

function carnetNoscriptItems(lang: "fr" | "en"): NoscriptItem[] {
  return [
    { name: lang === "fr" ? "AMF — Autorité des marchés financiers" : "AMF — Quebec Financial Markets Authority", url: "https://lautorite.qc.ca" },
    { name: lang === "fr" ? "SCHL — Société canadienne d'hypothèques et de logement" : "CMHC — Canada Mortgage and Housing Corporation", url: "https://www.cmhc-schl.gc.ca" },
    { name: lang === "fr" ? "ARC — Régime d'accession à la propriété (RAP)" : "CRA — Home Buyers' Plan (HBP)", url: "https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/regime-accession-propriete.html" },
    { name: lang === "fr" ? "ARC — CELIAPP" : "CRA — FHSA", url: "https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/celiapp.html" },
    { name: lang === "fr" ? "Chambre des notaires du Québec" : "Quebec Chamber of Notaries", url: "https://www.cnq.org" },
    { name: lang === "fr" ? "Planiprêt — Cabinet en courtage hypothécaire" : "Planiprêt — Mortgage brokerage firm", url: "https://www.planipret.com" },
  ];
}

// Option 2 polish (2026-05-10) : enrichissement noscript /equipe avec
// les 4 membres extraits depuis translations.team.members.
interface TeamMember { name: string; role: string; bio: string; }
function equipeNoscriptHtml(lang: "fr" | "en"): string {
  const dict = (lang === "fr" ? i18n.fr : i18n.en) as unknown as { team?: { members?: readonly TeamMember[] } };
  const members = dict?.team?.members ?? [];
  if (members.length === 0) return "";
  return `<section><h2>${lang === "fr" ? "Notre équipe" : "Our team"}</h2>${members.map(m => `<article><h3>${escapeHtml(m.name)}</h3><p><em>${escapeHtml(m.role)}</em></p><p>${escapeHtml(m.bio)}</p></article>`).join("")}</section>`;
}

function buildNoscriptInner(path: string, lang: "fr" | "en", title: string, description: string): string {
  const isFr = lang === "fr";
  const isEn = !isFr;
  let body = `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p>`;

  if (path === "/lexique") {
    body += `<dl>${glossary.map((g) => `<dt>${escapeHtml(isFr ? g.term.fr : g.term.en)}</dt><dd>${escapeHtml(isFr ? g.definition.fr : g.definition.en)}</dd>`).join("")}</dl>`;
  } else if (path === "/carnet") {
    const items = carnetNoscriptItems(lang);
    body += `<ul>${items.map(i => `<li><a href="${escapeHtml(i.url)}" rel="noopener nofollow">${escapeHtml(i.name)}</a></li>`).join("")}</ul>`;
  } else if (path === "/equipe") {
    body += equipeNoscriptHtml(lang);
  }

  const navLabel = isEn ? "Site navigation" : "Navigation du site";
  body += `<nav aria-label="${navLabel}"><a href="/">${isEn ? "Home" : "Accueil"}</a> · <a href="/equipe">${isEn ? "Team" : "Équipe"}</a> · <a href="/carnet">${isEn ? "Notebook" : "Carnet"}</a> · <a href="/lexique">${isEn ? "Glossary" : "Lexique"}</a> · <a href="/journal">Articles</a></nav>`;
  return body;
}

interface RouteMetaSSR {
  title: string;
  description: string;
  titleEn?: string;
  descriptionEn?: string;
  ogImage?: string;
  noindex?: boolean;
  schemaJsonLd?: string;
  schemaBuilder?: (lang: "fr" | "en") => string;
}

const SITE_ORIGIN = "https://equipe-buteau.intralysqc.workers.dev";

const ROUTE_META_SSR: Record<string, RouteMetaSSR> = {
  "/carnet": {
    title: "Le carnet de l'emprunteur — programmes, notaires, partenaires | Équipe Buteau",
    titleEn: "The borrower's notebook — programs, notaries, partners | Équipe Buteau",
    description:
      "Carnet vérifié pour emprunteurs hypothécaires Québec — APP/RAP, notaires, inspecteurs, assurances, outils gouvernementaux. Sources officielles signées Équipe Buteau.",
    descriptionEn:
      "Verified notebook for Quebec mortgage borrowers — FHSA/HBP, notaries, inspectors, insurance, government tools. Official sources signed Équipe Buteau.",
    schemaBuilder: (lang) => {
      const items = [
        { name: lang === "fr" ? "AMF — Autorité des marchés financiers" : "AMF — Quebec Financial Markets Authority", url: "https://lautorite.qc.ca" },
        { name: lang === "fr" ? "SCHL — Société canadienne d'hypothèques et de logement" : "CMHC — Canada Mortgage and Housing Corporation", url: "https://www.cmhc-schl.gc.ca" },
        { name: lang === "fr" ? "ARC — Régime d'accession à la propriété (RAP)" : "CRA — Home Buyers' Plan (HBP)", url: "https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/regime-accession-propriete.html" },
        { name: lang === "fr" ? "ARC — CELIAPP" : "CRA — FHSA", url: "https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/celiapp.html" },
        { name: lang === "fr" ? "Chambre des notaires du Québec" : "Quebec Chamber of Notaries", url: "https://www.cnq.org" },
        { name: lang === "fr" ? "Planiprêt — Cabinet en courtage hypothécaire" : "Planiprêt — Mortgage brokerage firm", url: "https://www.planipret.com" },
      ];
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${SITE_ORIGIN}/carnet#carnet`,
        name: lang === "fr"
          ? "Le carnet de l'emprunteur — Équipe Buteau"
          : "The borrower's notebook — Équipe Buteau",
        description: lang === "fr"
          ? "Notaires, programmes APP/RAP, inspecteurs, assurances, outils gouvernementaux — sources vérifiables."
          : "Notaries, FHSA/HBP programs, inspectors, insurance, government tools — verifiable sources.",
        inLanguage: lang === "fr" ? "fr-CA" : "en-CA",
        provider: { "@id": `${SITE_ORIGIN}/#business` },
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          url: item.url,
        })),
      });
    },
  },
  "/colophon": {
    title: "Le colophon — méthode et standards | Équipe Buteau",
    titleEn: "The colophon — method and standards | Équipe Buteau",
    description:
      "L'atelier — typographie, palette, principes éditoriaux et accessibilité du site Équipe Buteau, courtier hypothécaire Planiprêt à Laval.",
    descriptionEn:
      "The atelier — typography, palette, editorial principles and accessibility of Équipe Buteau's site, Planiprêt mortgage broker in Laval.",
    schemaBuilder: (lang) => JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${SITE_ORIGIN}/colophon`,
      name: lang === "fr"
        ? "Le colophon — méthode du cabinet Équipe Buteau"
        : "The colophon — Équipe Buteau firm method",
      description: lang === "fr"
        ? "Typographie, palette, principes éditoriaux, accessibilité, mentions techniques."
        : "Typography, palette, editorial principles, accessibility, technical credits.",
      inLanguage: lang === "fr" ? "fr-CA" : "en-CA",
      isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    }),
  },
  "/lexique": {
    title: "Lexique hypothécaire — 20 termes essentiels Québec | Équipe Buteau",
    titleEn: "Mortgage glossary — 20 essential Quebec terms | Équipe Buteau",
    description:
      "Lexique de 20 termes hypothécaires essentiels au Québec — pré-approbation, mise de fonds, taxe de bienvenue, vice caché. Sources : SCHL, AMF, ARC, Code civil du Québec.",
    descriptionEn:
      "Glossary of 20 essential Quebec mortgage terms — pre-approval, down payment, welcome tax, hidden defects. Sources: CMHC, AMF, CRA, Civil Code of Quebec.",
    // DefinedTermSet COMPLET SSR — généré dynamiquement par schemaBuilder ci-dessous.
    schemaBuilder: (lang) => {
      const isFr = lang === "fr";
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        "@id": `${SITE_ORIGIN}/lexique#termset`,
        name: isFr
          ? "Lexique hypothécaire — Équipe Buteau"
          : "Mortgage glossary — Équipe Buteau",
        description: isFr
          ? "20 termes essentiels pour comprendre votre dossier hypothécaire au Québec."
          : "20 essential terms to understand your mortgage file in Quebec.",
        inLanguage: isFr ? "fr-CA" : "en-CA",
        url: `${SITE_ORIGIN}/lexique`,
        publisher: { "@id": `${SITE_ORIGIN}/#business` },
        hasDefinedTerm: glossary.map((g) => ({
          "@type": "DefinedTerm",
          "@id": `${SITE_ORIGIN}/lexique#${g.slug}`,
          name: isFr ? g.term.fr : g.term.en,
          description: isFr ? g.definition.fr : g.definition.en,
          ...(g.source ? { source: g.source } : {}),
        })),
      });
    },
  },
  "/equipe": {
    title: "Notre équipe — Andrew Buteau et l'équipe Planiprêt à Laval",
    description:
      "Découvrez l'équipe Buteau : Andrew, Abygaèle, Alexis et Felix — courtiers hypothécaires Planiprêt à Laval. Notre méthode, nos valeurs, notre territoire Québec.",
  },
  "/institutions": {
    title: "Nos institutions partenaires — 9 prêteurs hypothécaires | Équipe Buteau",
    description:
      "9 institutions financières partenaires : CIBC, TD, Manuvie, Desjardins, CMLS et autres. Couverture pancanadienne pour vos besoins hypothécaires résidentiels et investissement.",
  },
  "/outils": {
    title: "Outils et calculatrices hypothécaires — capacité, refi, taux | Équipe Buteau",
    description:
      "Calculateurs hypothécaires, simulation de refinancement, capacité d'emprunt, comparaison de scénarios. Outils gratuits offerts par l'Équipe Buteau, Planiprêt Laval.",
  },
  "/journal": {
    title: "Articles — analyses hypothécaires Québec | Équipe Buteau",
    description:
      "Articles factuels sur le marché hypothécaire Québec : refinancement, renouvellement, premier achat, consolidation, investissement. Voix éditoriale signée Andrew Buteau.",
  },
  "/courrier": {
    title: "Le courrier — questions emprunteurs réelles | Équipe Buteau",
    description:
      "Lettres à l'éditeur — questions réelles d'emprunteurs hypothécaires au Québec et réponses détaillées par l'Équipe Buteau. Format magazine, ton transparent.",
  },
  "/capsules": {
    title: "Capsules vidéo — stratégies hypothécaires expliquées | Équipe Buteau",
    description:
      "34 capsules vidéo classées en 7 catégories — stratégies de refinancement, optimisation, primo-acheteur, investissement. Voix Andrew Buteau, courtier hypothécaire Planiprêt.",
  },
  "/mentions-legales": {
    title: "Mentions légales | Équipe Buteau — Planiprêt Laval",
    description:
      "Mentions légales du site Équipe Buteau, courtier hypothécaire Planiprêt à Laval (Québec).",
  },
  "/confidentialite": {
    title: "Politique de confidentialité | Équipe Buteau",
    description:
      "Politique de confidentialité conforme à la Loi 25 (Québec) — Équipe Buteau, courtier hypothécaire Planiprêt.",
  },
  "/merci": {
    title: "Merci — l'Équipe Buteau vous contactera bientôt",
    description:
      "Merci pour votre demande. L'Équipe Buteau vous contactera dans les meilleurs délais pour discuter de votre projet hypothécaire.",
    noindex: true,
  },
};

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function detectLang(request: Request): "fr" | "en" {
  const accept = request.headers.get("Accept-Language") ?? "";
  const first = accept.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("en") ? "en" : "fr";
}

async function injectRouteMeta(response: Response, pathname: string, request: Request): Promise<Response> {
  const cleanPath = normalizePathname(pathname);
  const meta = ROUTE_META_SSR[cleanPath];
  if (!meta) return response;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return response;

  const lang = detectLang(request);
  const isEn = lang === "en";
  const title = isEn && meta.titleEn ? meta.titleEn : meta.title;
  const description = isEn && meta.descriptionEn ? meta.descriptionEn : meta.description;
  const canonicalUrl = `${SITE_ORIGIN}${cleanPath}`;
  const schemaJsonLd = meta.schemaBuilder ? meta.schemaBuilder(lang) : meta.schemaJsonLd;

  const rewriter = new HTMLRewriter()
    .on("html", { element(el) { el.setAttribute("lang", isEn ? "en" : "fr"); } })
    .on("title", { element(el) { el.setInnerContent(title); } })
    .on('meta[name="description"]', {
      element(el) { el.setAttribute("content", description); },
    })
    .on('meta[property="og:title"]', {
      element(el) { el.setAttribute("content", title); },
    })
    .on('meta[property="og:description"]', {
      element(el) { el.setAttribute("content", description); },
    })
    .on('meta[name="twitter:title"]', {
      element(el) { el.setAttribute("content", title); },
    })
    .on('meta[name="twitter:description"]', {
      element(el) { el.setAttribute("content", description); },
    })
    .on('meta[property="og:url"]', {
      element(el) { el.setAttribute("content", canonicalUrl); },
    })
    .on('meta[property="og:locale"]', {
      element(el) { el.setAttribute("content", isEn ? "en_CA" : "fr_CA"); },
    })
    .on('link[rel="canonical"]', {
      element(el) { el.setAttribute("href", canonicalUrl); },
    });

  if (meta.ogImage) {
    rewriter
      .on('meta[property="og:image"]', {
        element(el) { el.setAttribute("content", `${SITE_ORIGIN}${meta.ogImage}`); },
      })
      .on('meta[name="twitter:image"]', {
        element(el) { el.setAttribute("content", `${SITE_ORIGIN}${meta.ogImage}`); },
      });
  }

  // Quickwins SEO 2026-05-10 PM : BreadcrumbList per route interne.
  // Hreflang RETIRE 2026-05-20 (audit Gemini 3 Flash) : le site utilise toggle
  // CSS bilingue sur MEME URL, donc hreflang fr-CA/en-CA pointant vers meme
  // URL = signal SEO confus / penalisant. og:locale fr_CA + en_CA suffisent.
  rewriter.on('link[rel="alternate"][hreflang]', {
    element(el) { el.remove(); },
  });
  const isHome = cleanPath === "/";
  const breadcrumbJsonLd = (!isHome && !meta.noindex)
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: isEn ? "Home" : "Accueil", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: title, item: canonicalUrl },
        ],
      })
    : null;

  rewriter.on("head", {
    element(el) {
      // Hreflang trio RETIRE 2026-05-20 (audit Gemini 3 Flash) :
      // toggle CSS bilingue = MEME URL pour FR/EN, hreflang serait penalisant.
      // og:locale fr_CA primary + og:locale:alternate en_CA suffisent.
      if (meta.noindex) {
        el.append('<meta name="robots" content="noindex, nofollow">', { html: true });
      }
      if (schemaJsonLd) {
        el.append(
          `<script type="application/ld+json">${schemaJsonLd}</script>`,
          { html: true },
        );
      }
      if (breadcrumbJsonLd) {
        el.append(
          `<script type="application/ld+json">${breadcrumbJsonLd}</script>`,
          { html: true },
        );
      }
    },
  });

  // Noscript fallback (Option 1) : contenu lisible pour bots non-JS.
  if (!meta.noindex) {
    const noscriptInner = buildNoscriptInner(cleanPath, lang, title, description);
    rewriter.on("body", {
      element(el) {
        el.append(`<noscript>${noscriptInner}</noscript>`, { html: true });
      },
    });
  }

  const transformed = rewriter.transform(response);
  const newHeaders = new Headers(transformed.headers);
  const existingVary = newHeaders.get("Vary") ?? "";
  if (!existingVary.toLowerCase().includes("accept-language")) {
    newHeaders.set("Vary", existingVary ? `${existingVary}, Accept-Language` : "Accept-Language");
  }
  return new Response(transformed.body, {
    status: transformed.status,
    statusText: transformed.statusText,
    headers: newHeaders,
  });
}

// ============================================================
// CSRF basique : Origin pinning (couche 0)
// ============================================================
// Si Origin absent (same-origin form classique POSTé depuis le site), on laisse
// passer. Si Origin présent ET différent du host courant, rejet 403 explicite
// (pas fake success car CSRF cross-origin n'est jamais un vrai humain).
function originAllowed(request: Request): boolean {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

// ============================================================
// /api/lead — pipeline V6 5 couches défense
//   0. Origin pinning (CSRF basique)
//   1. Honeypot
//   2. Timing detection (form_started_at + MIN_FORM_FILL_TIME_MS)
//   3. Rate limit D1 (ip_hash SHA-256 + 30s window)
//   4. Server-side validation
// ============================================================

async function handleLead(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  // === COUCHE 0 — Origin pinning (CSRF) ===
  // Reject cross-origin POSTs avant toute autre logique (gain de perf + signal clair).
  if (!originAllowed(request)) {
    console.warn("[/api/lead] CSRF block: Origin=%s URL=%s", request.headers.get("Origin"), request.url);
    return jsonError("forbidden", 403);
  }

  // Pre-check : D1 doit etre provisionne (Phase 9 par le client).
  // Si absent, on REFUSE bruyamment (503) — sinon les leads disparaissent silencieusement
  // (audit BL-01 : un succes UI sans persistance = perte totale en prod).
  if (!env.DB) {
    console.error("[/api/lead] DB binding manquante — refus 503. Phase 9 D1 a configurer.");
    return jsonError("service_unavailable", 503);
  }

  const db: D1Database = env.DB;

  // Parse JSON
  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return jsonError("invalid_json", 400);
  }

  // === COUCHE 1 — Honeypot ===
  // Le champ doit être VIDE. S'il contient quoi que ce soit = bot.
  // On accepte silencieusement (200 OK) pour ne pas signaler au bot qu'il est détecté.
  if (payload.honeypot && payload.honeypot.trim() !== "") {
    return jsonOk({ status: "received" });
  }

  // === COUCHE 2 — Timing detection ===
  // Si le formulaire a été rempli en moins de MIN_FORM_FILL_TIME_MS, c'est un bot.
  // Pattern Serujan/EG validé en prod.
  if (payload.form_started_at && typeof payload.form_started_at === "number") {
    const elapsed = Date.now() - payload.form_started_at;
    if (elapsed < MIN_FORM_FILL_TIME_MS) {
      return jsonOk({ status: "received" });
    }
  }

  // === COUCHE 3 — Rate limit D1 (30s par IP) ===
  const ip = getClientIp(request);
  const ipHash = await sha256(ip + "|equipe-buteau-salt");
  const now = new Date();

  const recent = await db
    .prepare("SELECT last_attempt_at FROM rate_limits WHERE ip_hash = ?")
    .bind(ipHash)
    .first<{ last_attempt_at: string }>();

  if (recent) {
    const lastAttempt = new Date(recent.last_attempt_at);
    if (now.getTime() - lastAttempt.getTime() < RATE_LIMIT_WINDOW_MS) {
      return jsonError("rate_limited", 429);
    }
  }

  // === COUCHE 4 — Validation server-side ===
  const validation = validatePayload(payload);
  if (!validation.ok) {
    return jsonError(validation.error, 400);
  }

  // Sanitize + truncate
  const lead = {
    full_name: sanitize(payload.full_name).slice(0, MAX_FIELD_LEN.full_name),
    email: sanitize(payload.email.toLowerCase()).slice(0, MAX_FIELD_LEN.email),
    phone: payload.phone ? sanitize(payload.phone).slice(0, MAX_FIELD_LEN.phone) : null,
    message: payload.message ? sanitize(payload.message).slice(0, MAX_FIELD_LEN.message) : null,
    source: payload.source ? sanitize(payload.source).slice(0, MAX_FIELD_LEN.source) : "unknown",
  };

  const userAgent = request.headers.get("User-Agent")?.slice(0, 500) ?? null;
  const createdAt = now.toISOString();

  // INSERT lead + UPDATE rate_limits dans la même batch transaction
  try {
    await db.batch([
      db
        .prepare(
          `INSERT INTO leads (created_at, email, full_name, phone, message, source, consent_at, ip_hash, user_agent)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          createdAt,
          lead.email,
          lead.full_name,
          lead.phone,
          lead.message,
          lead.source,
          createdAt, // consent_at = same as created_at car consent obligatoire au submit
          ipHash,
          userAgent,
        ),
      db
        .prepare(
          `INSERT INTO rate_limits (ip_hash, last_attempt_at) VALUES (?, ?)
           ON CONFLICT(ip_hash) DO UPDATE SET last_attempt_at = ?`,
        )
        .bind(ipHash, createdAt, createdAt),
    ]);
  } catch (err) {
    console.error("D1 insert failed:", err);
    return jsonError("db_error", 500);
  }

  // === GHL POST non-bloquant (ctx.waitUntil) ===
  // V6 pipeline : trackingId hardcoded ci-dessous dans pushToGhl().
  ctx.waitUntil(pushToGhl(lead, createdAt, request));

  return jsonOk({ status: "received" });
}

// ============================================================
// GHL push (External Tracking V6)
// ============================================================

async function pushToGhl(
  lead: { full_name: string; email: string; phone: string | null; message: string | null; source: string },
  createdAt: string,
  request: Request,
): Promise<void> {
  // V6 pipeline standard (cf. skill intralys-v6-pipeline) : meme pattern que
  // Mathis, Serujan, EG Services Financiers. Endpoint backend.leadconnectorhq.com,
  // body type "external_form_submission", trackingId hardcoded (le worker n'a
  // pas acces au bundle clientConfig).
  const trackingId = "tk_a1730dcac9744515864c001895c485ea";
  // GHL attend formData + formLabels (flat key-value + human labels), pas "data".
  // Pattern aligne avec Mathis/Serujan. Bug originel : "data" est ignore par GHL.
  const nameParts = lead.full_name.trim().split(/\s+/);
  const firstName = nameParts[0] || lead.full_name;
  const lastName = nameParts.slice(1).join(" ") || "";
  const formData: Record<string, string> = {
    email: lead.email.trim().toLowerCase(),
    first_name: firstName,
    Timezone: "America/Toronto",
  };
  const formLabels: Record<string, string> = {
    email: "Courriel",
    first_name: "Prenom",
  };
  if (lastName) {
    formData.last_name = lastName;
    formLabels.last_name = "Nom";
  }
  if (lead.phone) {
    formData.phone = lead.phone;
    formLabels.phone = "Telephone";
  }
  if (lead.message) {
    formData.message = lead.message;
    formLabels.message = "Message";
  }

  const url = request.headers.get("referer") ?? "https://equipe-buteau.intralysqc.workers.dev/";
  const ghlBody = {
    type: "external_form_submission",
    timestamp: Date.now(),
    trackingId,
    locationId: "aTgKP6OstI7SH8PRcKxB",
    sessionId: crypto.randomUUID(),
    contactId: null,
    userId: null,
    formId: lead.source,
    formData,
    formLabels,
    url,
    referrer: "",
    title: "Equipe Buteau",
    path: (() => { try { return new URL(url).pathname || "/"; } catch { return "/"; } })(),
    userAgent: request.headers.get("user-agent") ?? "",
  };

  try {
    const res = await fetch("https://backend.leadconnectorhq.com/external-tracking/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ghlBody),
      signal: AbortSignal.timeout(5000), // fix isolate hung
    });

    if (!res.ok) {
      console.error(`[GHL] Push failed: ${res.status}`, await res.text());
    }
  } catch (err) {
    console.error("[GHL] Push exception:", err);
  }
}

// ============================================================
// Validation + utils
// ============================================================

function validatePayload(p: LeadPayload): { ok: true } | { ok: false; error: string } {
  if (!p.consent || p.consent !== true) {
    return { ok: false, error: "consent_required" };
  }
  if (!p.full_name || typeof p.full_name !== "string" || p.full_name.trim().length < 2) {
    return { ok: false, error: "name_invalid" };
  }
  if (p.full_name.length > MAX_FIELD_LEN.full_name) {
    return { ok: false, error: "name_too_long" };
  }
  if (!p.email || typeof p.email !== "string" || !EMAIL_REGEX.test(p.email)) {
    return { ok: false, error: "email_invalid" };
  }
  if (p.email.length > MAX_FIELD_LEN.email) {
    return { ok: false, error: "email_too_long" };
  }
  if (p.phone && p.phone.length > MAX_FIELD_LEN.phone) {
    return { ok: false, error: "phone_too_long" };
  }
  if (p.message && p.message.length > MAX_FIELD_LEN.message) {
    return { ok: false, error: "message_too_long" };
  }
  return { ok: true };
}

function sanitize(s: string): string {
  // Strip caractères de contrôle (sauf tab, newline) et trim.
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "").trim();
}

function getClientIp(request: Request): string {
  // Cloudflare fournit l'IP via CF-Connecting-IP.
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

async function sha256(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ============================================================
// Réponses JSON helpers
// ============================================================

function jsonOk(data: object): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function jsonError(code: string, status: number): Response {
  return new Response(JSON.stringify({ error: code }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ============================================================
// Security headers — appliqués sur TOUTES les réponses
// ============================================================

function withSecurityHeaders(response: Response, request?: Request): Response {
  const headers = new Headers(response.headers);

  // Cache headers — assets fingerprintés (Vite hash) sont immutables 1 an.
  // HTML routes : stale-while-revalidate pour robustness (E.1 anti-soucis
  // client 2026-05-14). Si serveur down brief, visiteur a derniere version
  // cached + revalidate background.
  if (request) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/assets/")) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        headers.set("Cache-Control", "public, max-age=0, must-revalidate, stale-while-revalidate=86400");
      }
    }
  }

  // CSP — autorise les sources nécessaires : Google Fonts, Wix images mockup, Imgur, GHL.
  // À durcir Phase 9 quand on aura les domaines exacts (tracking pixels, CDN final, etc.).
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://www.clarity.ms",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https://static.wixstatic.com https://upload.wikimedia.org https://b2b2c.ca https://logos-world.net https://storage.googleapis.com https://assets.cdn.filesafe.space https://www.google-analytics.com https://www.facebook.com https://i.ytimg.com",
      "connect-src 'self' https://services.leadconnectorhq.com https://www.google-analytics.com https://www.clarity.ms https://*.facebook.com",
      "frame-src 'self' https://api.leadconnectorhq.com https://www.youtube-nocookie.com https://www.youtube.com",
      // frame-ancestors 'none' : moderne équivalent de X-Frame-Options DENY.
      // Empêche tout site (même same-origin) d'embedder ce site dans une iframe.
      // Anti-clickjacking renforcé.
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  );

  // X-Frame DENY : legacy fallback pour navigateurs anciens qui ne supportent
  // pas frame-ancestors. Aligné avec EG/Serujan/Mathis (harmonisation cross-sites).
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // HSTS preload : éligible pour soumission sur hstspreload.org (navigateurs
  // préchargent la directive avant la 1ère visite). Aligné EG/Serujan/Mathis.
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  // COOP : isole le browsing context (anti tab-napping via window.opener).
  headers.set("Cross-Origin-Opener-Policy", "same-origin");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
