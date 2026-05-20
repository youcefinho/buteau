#!/usr/bin/env node
/**
 * One-shot script — genere favicon Buteau depuis le "B" seul du logo officiel.
 *
 * Source : guide identite visuelle 2026-05-19 confirme que le "B" seul est
 * un usage valide pour les espaces restreints (favicon, social avatar, etc.).
 *
 * Le path SVG du "B" en grand est dans logo-buteau-navy.svg :
 *   M321.781,756.962C321.781,769.003 ... Z (coords ~147,598 a ~322,812)
 *   Soit un rect ~175x214 dans le viewBox 1563x1563
 *
 * Strategie : creer un SVG composite carre avec juste le "B" centre,
 * fond navy. Sharp rasterize -> PNG 32/192/512 + favicon.ico.
 *
 * Output :
 *  - /public/favicon.svg (vectoriel, source de verite, fond navy)
 *  - /public/favicon.ico (32x32 multi-res, browsers legacy)
 *  - /public/icon-192.png (PWA manifest)
 *  - /public/icon-512.png (PWA manifest splash)
 *  - /public/apple-touch-icon.png (180x180, iOS Home Screen)
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const PUB = path.join(__dirname, "..", "public");

const NAVY = "#0E2442"; // guide officiel

// Path du "B" extrait du logo officiel. Coords source viewBox 1563x1563.
// On le centre et on l'agrandit dans un viewBox 512x512 pour favicon.
// B source : x=[147, 322], y=[598, 812] dans le 1563x1563.
// Centre source : x=234.5, y=705 ; dimensions ~175x214.
// Target : centre 256, scale ~2x pour remplir 380x460 dans 512x512 (padding 16%).

const FAVICON_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Fond navy guide officiel -->
  <rect width="512" height="512" fill="${NAVY}" rx="64" ry="64"/>
  <!-- "B" path extrait du logo officiel, blanc, centre + agrandi -->
  <!-- Transform : translate viewBox source center -> target center, scale fit -->
  <g transform="translate(46, 6) scale(2.4)">
    <path d="M321.781,756.962C321.781,769.003 318.609,779.084 312.267,787.203C305.925,795.322 297.404,801.468 286.703,805.641C276.002,809.815 264.21,811.901 251.324,811.901L147.853,811.901L147.853,598.109L263.966,598.109C274.004,598.109 282.686,600.769 290.013,606.089C297.34,611.408 302.961,618.261 306.875,626.647C310.79,635.033 312.747,643.742 312.747,652.776C312.747,662.882 310.143,672.53 304.935,681.721C299.726,690.911 292.092,697.769 282.033,702.295C294.279,705.909 303.965,712.389 311.091,721.736C318.217,731.083 321.781,742.825 321.781,756.962ZM192.433,636.247L192.433,686.303L245.001,686.303C249.317,686.303 253.24,685.335 256.77,683.398C260.3,681.461 263.16,678.615 265.35,674.861C267.539,671.106 268.634,666.572 268.634,661.259C268.634,655.986 267.668,651.523 265.735,647.869C263.803,644.214 261.2,641.364 257.925,639.317C254.651,637.271 250.945,636.247 246.808,636.247L192.433,636.247ZM276.566,748.149C276.566,743.19 275.555,738.705 273.532,734.693C271.508,730.682 268.787,727.469 265.368,725.055C261.95,722.642 257.971,721.435 253.432,721.435L192.433,721.435L192.433,774.097L251.324,774.097C256.064,774.097 260.344,772.946 264.164,770.644C267.984,768.341 271.007,765.235 273.23,761.323C275.454,757.412 276.566,753.021 276.566,748.149Z" fill="white" transform="translate(-147, -598)"/>
  </g>
</svg>`;

async function main() {
  const svg = path.join(PUB, "favicon.svg");
  const ico = path.join(PUB, "favicon.ico");
  const png192 = path.join(PUB, "icon-192.png");
  const png512 = path.join(PUB, "icon-512.png");
  const apple = path.join(PUB, "apple-touch-icon.png");

  console.log("[gen-favicon] Writing favicon.svg (vectoriel source)...");
  fs.writeFileSync(svg, FAVICON_SVG);

  console.log("[gen-favicon] SVG -> PNG 32x32 (favicon.ico equivalent)...");
  const png32 = await sharp(Buffer.from(FAVICON_SVG)).resize(32, 32).png().toBuffer();
  // Sharp ne gere pas ICO natively. On utilise un PNG renomme ico (la plupart des
  // browsers acceptent PNG dans favicon.ico, et la plupart utilisent favicon.svg
  // de toute facon).
  fs.writeFileSync(ico, png32);

  console.log("[gen-favicon] SVG -> PNG 192x192 (PWA manifest)...");
  await sharp(Buffer.from(FAVICON_SVG)).resize(192, 192).png().toFile(png192);

  console.log("[gen-favicon] SVG -> PNG 512x512 (PWA splash)...");
  await sharp(Buffer.from(FAVICON_SVG)).resize(512, 512).png().toFile(png512);

  console.log("[gen-favicon] SVG -> PNG 180x180 (iOS Apple Touch Icon)...");
  await sharp(Buffer.from(FAVICON_SVG)).resize(180, 180).png().toFile(apple);

  console.log("\n[gen-favicon] Sizes :");
  console.log(`  favicon.svg          ${(fs.statSync(svg).size / 1024).toFixed(1)} KB`);
  console.log(`  favicon.ico (PNG32)  ${(fs.statSync(ico).size / 1024).toFixed(1)} KB`);
  console.log(`  icon-192.png         ${(fs.statSync(png192).size / 1024).toFixed(1)} KB`);
  console.log(`  icon-512.png         ${(fs.statSync(png512).size / 1024).toFixed(1)} KB`);
  console.log(`  apple-touch-icon.png ${(fs.statSync(apple).size / 1024).toFixed(1)} KB`);
  console.log("\n[gen-favicon] Done. Check index.html <link rel='icon'> + manifest.json.");
}

main().catch((err) => {
  console.error("[gen-favicon] ERROR:", err);
  process.exit(1);
});
