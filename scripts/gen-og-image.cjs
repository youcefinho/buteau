#!/usr/bin/env node
/**
 * One-shot script — genere l'OG image 1200x630 pour Equipe Buteau.
 *
 * Source : audit UI-REVIEW-2026-05-19 + session 2026-05-19 (assets.ogImage vide).
 *
 * Design luxury magazine :
 *  - Background navy oklch(0.252 0.067 256) = #10223d
 *  - Eyebrow Montserrat uppercase tracking-wide
 *  - Hairline bronze
 *  - Monogramme BUTEAU sans-serif extrabold cream
 *  - Tagline italic serif "L'hypothèque autrement" taupe
 *  - Filigrane "&" Cormorant XL en arriere-plan (opacite 5%)
 *  - Footer eyebrow "EQUIPE BUTEAU · COURTAGE HYPOTHECAIRE · PLANIPRET"
 *
 * Output : /public/og-buteau.{png,jpg,webp,avif}
 *
 * Run UNE FOIS. Idempotent : skip si fichiers existent.
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const PUB = path.join(__dirname, "..", "public");

const W = 1200;
const H = 630;

// Couleurs palette Buteau (HEX equivalents oklch)
const NAVY = "#10223d";      // surface navy
const CREAM = "#f9f9f9";     // texte principal
const TAUPE = "#b8af9f";     // accent neutre
const BRONZE = "#C69C6D";    // accent bronze caramel

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background navy -->
  <rect width="${W}" height="${H}" fill="${NAVY}"/>

  <!-- Vignette subtile -->
  <defs>
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${NAVY}" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.35"/>
    </radialGradient>
  </defs>

  <!-- Filigrane "&" Cormorant XL en arriere-plan (5% opacity taupe) -->
  <text x="${W / 2}" y="540" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="640" fill="${TAUPE}" opacity="0.06" text-anchor="middle" font-weight="300">&amp;</text>

  <!-- Eyebrow folio magazine -->
  <text x="${W / 2}" y="180" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" fill="${TAUPE}" letter-spacing="6" text-anchor="middle" font-weight="600">N° 01 / QUEBEC — MMXXVI</text>

  <!-- Hairline bronze sous eyebrow -->
  <line x1="${W / 2 - 60}" y1="200" x2="${W / 2 + 60}" y2="200" stroke="${BRONZE}" stroke-width="1"/>

  <!-- Brand mark BUTEAU XL -->
  <text x="${W / 2}" y="350" font-family="'Helvetica Neue', Arial, sans-serif" font-size="120" font-weight="800" fill="${CREAM}" letter-spacing="22" text-anchor="middle">BUTEAU</text>

  <!-- Hairline bronze sous brand -->
  <line x1="${W / 2 - 50}" y1="385" x2="${W / 2 + 50}" y2="385" stroke="${BRONZE}" stroke-width="1"/>

  <!-- Tagline italic serif -->
  <text x="${W / 2}" y="445" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="32" fill="${TAUPE}" text-anchor="middle">L'hypothèque autrement</text>

  <!-- Footer eyebrow institutionnel -->
  <text x="${W / 2}" y="560" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" fill="${TAUPE}" opacity="0.7" letter-spacing="4" text-anchor="middle" font-weight="600">COURTAGE HYPOTHÉCAIRE · PLANIPRÊT · QUEBEC</text>

  <!-- Vignette overlay -->
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
</svg>`;

async function main() {
  const png = path.join(PUB, "og-buteau.png");
  const jpg = path.join(PUB, "og-buteau.jpg");
  const webp = path.join(PUB, "og-buteau.webp");
  const avif = path.join(PUB, "og-buteau.avif");

  if (fs.existsSync(jpg)) {
    console.log("[gen-og-image] og-buteau.jpg exists, skip generation.");
    return;
  }

  console.log("[gen-og-image] Rendering SVG -> PNG (1200x630)...");
  await sharp(Buffer.from(svg)).png().toFile(png);

  console.log("[gen-og-image] PNG -> JPG quality 85 (fallback compatibilite max)...");
  await sharp(png).jpeg({ quality: 85, progressive: true, mozjpeg: true }).toFile(jpg);

  console.log("[gen-og-image] PNG -> WebP quality 88...");
  await sharp(png).webp({ quality: 88, effort: 6 }).toFile(webp);

  console.log("[gen-og-image] PNG -> AVIF quality 70...");
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
  console.log("\n[gen-og-image] Done. Update index.html og:image -> /og-buteau.jpg.");
}

main().catch((err) => {
  console.error("[gen-og-image] ERROR:", err);
  process.exit(1);
});
