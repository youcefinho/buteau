#!/usr/bin/env node
/**
 * One-shot — ajoute photo Andrew podcast/entrevue pour BrokerLetter signature col.
 * Source : Downloads/DSC01641.jpeg (cinematic chiaroscuro through doorframe)
 * Target : public/equipe/andrew-podcast.{avif,webp,jpg}
 *
 * Format portrait 800x1200 (3:4.5 ratio), smart-crop sur visage.
 * Pas de master jpeg ici (asset secondaire, pas besoin de version haute qualite).
 */
const path = require("node:path");
const sharp = require("sharp");

const SRC = "C:/Users/rochdi/Downloads/DSC01641.jpeg";
const OUT_DIR = path.join(__dirname, "..", "public", "equipe");

async function main() {
  console.log(`[andrew-podcast] Source: ${SRC}`);

  // Web JPG portrait 800x1200
  await sharp(SRC)
    .resize(800, 1200, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 85, progressive: true, mozjpeg: true })
    .toFile(path.join(OUT_DIR, "andrew-podcast.jpg"));
  console.log("[andrew-podcast] ✓ andrew-podcast.jpg");

  // WebP
  await sharp(SRC)
    .resize(800, 1200, { fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: 80, effort: 6 })
    .toFile(path.join(OUT_DIR, "andrew-podcast.webp"));
  console.log("[andrew-podcast] ✓ andrew-podcast.webp");

  // AVIF
  await sharp(SRC)
    .resize(800, 1200, { fit: "cover", position: sharp.strategy.attention })
    .avif({ quality: 60, effort: 6 })
    .toFile(path.join(OUT_DIR, "andrew-podcast.avif"));
  console.log("[andrew-podcast] ✓ andrew-podcast.avif");

  console.log("\n[andrew-podcast] Done. Integre dans BrokerLetter signature col.");
}

main().catch((err) => {
  console.error("[andrew-podcast] ERROR:", err);
  process.exit(1);
});
