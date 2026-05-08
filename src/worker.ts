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
 *
 * GHL = placeholders pour Phase 9 (locationId / trackingId fournis par client).
 */

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  DB?: D1Database; // optionnel tant que D1 pas provisionne (Phase 9 client setup)
  GHL_LOCATION_ID?: string;
  GHL_TRACKING_ID?: string;
}

// Limites + format
const RATE_LIMIT_WINDOW_MS = 30_000;          // 30 secondes
const MIN_FORM_FILL_TIME_MS = 3_000;           // < 3s = bot
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
      return withSecurityHeaders(await handleLead(request, env, ctx));
    }

    if (url.pathname.startsWith("/api/")) {
      return withSecurityHeaders(
        new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    // ===== Static assets (SPA fallback géré par wrangler config) =====
    return withSecurityHeaders(await env.ASSETS.fetch(request));
  },
};

// ============================================================
// /api/lead — pipeline V6 4 couches défense
// ============================================================

async function handleLead(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  // Pre-check : D1 doit etre provisionne (Phase 9 par le client).
  // Tant qu'absent, on accepte silencieusement pour ne pas exposer l'absence d'infra.
  if (!env.DB) {
    console.warn("[/api/lead] DB binding manquante — Phase 9 D1 a configurer");
    return jsonOk({ status: "received" });
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
  // Phase 9 : remplir GHL_LOCATION_ID + GHL_TRACKING_ID via wrangler secret put
  if (env.GHL_LOCATION_ID && env.GHL_TRACKING_ID) {
    ctx.waitUntil(pushToGhl(env, lead, createdAt));
  } else {
    console.log("[GHL] Push skipped — GHL_LOCATION_ID or GHL_TRACKING_ID missing (Phase 9)");
  }

  return jsonOk({ status: "received" });
}

// ============================================================
// GHL push (External Tracking V6)
// ============================================================

async function pushToGhl(
  env: Env,
  lead: { full_name: string; email: string; phone: string | null; message: string | null; source: string },
  createdAt: string,
): Promise<void> {
  try {
    // Endpoint GHL External Tracking (cf. skill intralys-v6-pipeline).
    // Format : POST https://services.leadconnectorhq.com/external-tracking/events
    // sans auth header (public). Body inclut locationId + trackingId + custom_data.
    const body = {
      locationId: env.GHL_LOCATION_ID,
      trackingId: env.GHL_TRACKING_ID,
      eventType: "Lead",
      eventName: "FormSubmission",
      data: {
        first_name: lead.full_name.split(" ")[0] ?? "",
        last_name: lead.full_name.split(" ").slice(1).join(" "),
        email: lead.email,
        phone: lead.phone ?? "",
        // custom fields à ajouter ici quand GHL fournit les IDs (Phase 9)
        // formId: "<placeholder>",
      },
      timestamp: createdAt,
    };

    const res = await fetch("https://services.leadconnectorhq.com/external-tracking/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  // CSP — autorise les sources nécessaires : Google Fonts, Wix images mockup, Imgur, GHL.
  // À durcir Phase 9 quand on aura les domaines exacts (tracking pixels, CDN final, etc.).
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://www.clarity.ms",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https://i.imgur.com https://static.wixstatic.com https://upload.wikimedia.org https://b2b2c.ca https://logos-world.net https://ugc.production.linktr.ee https://storage.googleapis.com https://assets.cdn.filesafe.space https://www.google-analytics.com https://www.facebook.com",
      "connect-src 'self' https://services.leadconnectorhq.com https://www.google-analytics.com https://www.clarity.ms https://*.facebook.com",
      "frame-src 'self' https://api.leadconnectorhq.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );

  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
