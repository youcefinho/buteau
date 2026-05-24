#!/usr/bin/env node
/**
 * One-shot script — genere les variants AVIF + WebP + JPG pour Felix
 * a partir du seul felix.jpeg (manquant variants vs Andrew/Aby/Alexis).
 *
 * Run : node scripts/gen-felix-variants.cjs
 */
const path = require("node:path");
const sharp = require("sharp");

const PUB = path.join(__dirname, "..", "public", "equipe");
const SRC = path.join(PUB, "felix.jpeg");

async function main() {
  const img = sharp(SRC).resize(1200, 1200, { fit: "cover", position: "center" });

  // AVIF — best compression, modern browsers
  await img
    .clone()
    .avif({ quality: 65, effort: 6 })
    .toFile(path.join(PUB, "felix.avif"));

  // WebP — wider support
  await img
    .clone()
    .webp({ quality: 80, effort: 5 })
    .toFile(path.join(PUB, "felix.webp"));

  // JPG fallback — universal
  await img
    .clone()
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(PUB, "felix.jpg"));

  console.log("✓ Felix variants generated: felix.avif + felix.webp + felix.jpg");
}

main().catch((err) => {
  console.error("Felix variants generation failed:", err);
  process.exit(1);
});
