#!/usr/bin/env node
/**
 * One-shot script — genere l'OG image 1200x630 pour Equipe Buteau.
 *
 * Source : audit UI-REVIEW-2026-05-19 + guide identite visuelle 2026-05-19.
 *
 * V2 (2026-05-19) : utilise le logo SVG officiel /public/logo-buteau-white.svg
 * au lieu du texte synthetique. Composite via sharp (SVG -> PNG -> composite).
 *
 * Design luxury magazine :
 *  - Background navy #0E2442 (couleur guide officiel)
 *  - Logo SVG officiel centre vertical, 800px largeur (margins 200px chaque cote)
 *  - Filigrane "&" Cormorant XL en arriere-plan (opacite 5%)
 *  - Eyebrow folio "N° 01 / QUEBEC — MMXXVI" en haut
 *  - Footer eyebrow "COURTAGE HYPOTHECAIRE · PLANIPRET · QUEBEC"
 *
 * Output : /public/og-buteau.{png,jpg,webp,avif}
 *
 * Run UNE FOIS. Override les fichiers existants (idempotent : fait fresh a chaque run).
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const PUB = path.join(__dirname, "..", "public");

const W = 1200;
const H = 630;

// Couleurs palette Buteau guide officiel
const NAVY = "#0E2442";       // navy guide
const CREAM = "#f9f9f9";
const TAUPE = "#b8af9f";
const BRONZE = "#C69C6D";

// Logo source (SVG officiel deja dans public/)
const LOGO_SVG_PATH = path.join(PUB, "logo-buteau-white.svg");

// Couche 1 : background + eyebrows + filigrane (sans le logo)
const bgSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${NAVY}"/>

  <defs>
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${NAVY}" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.4"/>
    </radialGradient>
  </defs>

  <!-- Filigrane "&" Cormorant XL en arriere-plan -->
  <text x="${W / 2}" y="560" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="680" fill="${TAUPE}" opacity="0.05" text-anchor="middle" font-weight="300">&amp;</text>

  <!-- Eyebrow folio magazine en haut -->
  <text x="${W / 2}" y="120" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" fill="${TAUPE}" letter-spacing="6" text-anchor="middle" font-weight="600">N° 01 / QUEBEC — MMXXVI</text>

  <!-- Hairline bronze sous eyebrow -->
  <line x1="${W / 2 - 60}" y1="140" x2="${W / 2 + 60}" y2="140" stroke="${BRONZE}" stroke-width="1"/>

  <!-- Footer eyebrow institutionnel -->
  <text x="${W / 2}" y="570" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" fill="${TAUPE}" opacity="0.7" letter-spacing="4" text-anchor="middle" font-weight="600">COURTAGE HYPOTHÉCAIRE · PLANIPRÊT · QUEBEC</text>

  <!-- Vignette overlay -->
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
</svg>`;

// Logo target : 800px wide, hauteur proportionnelle au ratio 1267/368 = 232px
const LOGO_WIDTH = 800;
const LOGO_HEIGHT = Math.round(LOGO_WIDTH * 368 / 1267); // ~232px
const LOGO_X = Math.round((W - LOGO_WIDTH) / 2); // 200
const LOGO_Y = Math.round((H - LOGO_HEIGHT) / 2); // 199

async function main() {
  if (!fs.existsSync(LOGO_SVG_PATH)) {
    console.error(`[gen-og-image] Logo SVG missing: ${LOGO_SVG_PATH}`);
    process.exit(1);
  }

  const png = path.join(PUB, "og-buteau.png");
  const jpg = path.join(PUB, "og-buteau.jpg");
  const webp = path.join(PUB, "og-buteau.webp");
  const avif = path.join(PUB, "og-buteau.avif");

  console.log("[gen-og-image] Rendering background SVG (1200x630)...");
  const bgPng = await sharp(Buffer.from(bgSvg)).png().toBuffer();

  console.log("[gen-og-image] Rendering logo SVG (800px wide)...");
  const logoSvgContent = fs.readFileSync(LOGO_SVG_PATH);
  const logoPng = await sharp(logoSvgContent)
    .resize({ width: LOGO_WIDTH, height: LOGO_HEIGHT, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  console.log("[gen-og-image] Compositing logo on background...");
  await sharp(bgPng)
    .composite([{ input: logoPng, top: LOGO_Y, left: LOGO_X }])
    .png()
    .toFile(png);

  console.log("[gen-og-image] PNG -> JPG (quality 85)...");
  await sharp(png).jpeg({ quality: 85, progressive: true, mozjpeg: true }).toFile(jpg);

  console.log("[gen-og-image] PNG -> WebP (quality 88)...");
  await sharp(png).webp({ quality: 88, effort: 6 }).toFile(webp);

  console.log("[gen-og-image] PNG -> AVIF (quality 70)...");
  await sharp(png).avif({ quality: 70, effort: 6 }).toFile(avif);

  const sizes = {
    png: fs.statSync(png).size,
    jpg: fs.statSync(jpg).size,
    webp: fs.statSync(webp).size,
    avif: fs.statSync(avif).size,
  };
  console.log("\n[gen-og-image] Sizes :");
  console.log(`  PNG  ${(sizes.png / 1024).toFixed(1)} KB  (master)`);
  console.log(`  JPG  ${(sizes.jpg / 1024).toFixed(1)} KB  (og:image fallback)`);
  console.log(`  WebP ${(sizes.webp / 1024).toFixed(1)} KB`);
  console.log(`  AVIF ${(sizes.avif / 1024).toFixed(1)} KB`);
  console.log("\n[gen-og-image] Done. og:image meta points already to /og-buteau.jpg.");
}

main().catch((err) => {
  console.error("[gen-og-image] ERROR:", err);
  process.exit(1);
});
