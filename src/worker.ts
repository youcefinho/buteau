/**
 * Cloudflare Worker — Équipe Buteau
 *
 * Phase 1 (placeholder) : sert uniquement les assets dist/ via le binding `assets`.
 * Phase 7 enrichira ce worker avec :
 *   - POST /api/lead (honeypot + timing + rate limit D1 + INSERT D1 + ctx.waitUntil(GHL POST))
 *   - CSP headers worker-applied
 *   - Rate limit 30s par IP via D1 table `rate_limits`
 *
 * Cf. skills `intralys-v6-pipeline` et `intralys-form-honeypot`.
 */

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  // DB: D1Database; — sera ajouté Phase 7
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Phase 7 — endpoints API
    if (url.pathname.startsWith("/api/")) {
      return new Response(
        JSON.stringify({ error: "API non implémentée — Phase 7" }),
        { status: 501, headers: { "Content-Type": "application/json" } },
      );
    }

    // Tout le reste → assets statiques (SPA fallback géré par wrangler config)
    return env.ASSETS.fetch(request);
  },
};
