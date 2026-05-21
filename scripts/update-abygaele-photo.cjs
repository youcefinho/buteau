#!/usr/bin/env node
/**
 * One-shot — replace Abygaele photo with new client-provided version.
 * Source : Downloads/Untitled-Session0247-1.jpeg (4544x5680, ~3.4 MB)
 * Target : public/equipe/abygaele.{avif,webp,jpg,jpeg}
 *
 * Format cible 1080x1080 square, smart-crop sur visage via sharp attention strategy.
 * Master .jpeg conservé en haute qualité (1920x1920 quality 90).
 */
const path = require("node:path");
const sharp = require("sharp");

const SRC = "C:/Users/rochdi/Downloads/Untitled-Session0247-1.jpeg";
const OUT_DIR = path.join(__dirname, "..", "public", "equipe");

async function main() {
  console.log(`[abygaele] Source: ${SRC}`);

  // Master JPEG haute qualité (1920x1920, quality 90)
  await sharp(SRC)
    .resize(1920, 1920, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 90, progressive: true, mozjpeg: true })
    .toFile(path.join(OUT_DIR, "abygaele.jpeg"));
  console.log("[abygaele] ✓ abygaele.jpeg (master 1920x1920)");

  // Web JPG (1080x1080, quality 85)
  await sharp(SRC)
    .resize(1080, 1080, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 85, progressive: true, mozjpeg: true })
    .toFile(path.join(OUT_DIR, "abygaele.jpg"));
  console.log("[abygaele] ✓ abygaele.jpg (web 1080x1080)");

  // WebP (1080x1080, quality 80)
  await sharp(SRC)
    .resize(1080, 1080, { fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: 80, effort: 6 })
    .toFile(path.join(OUT_DIR, "abygaele.webp"));
  console.log("[abygaele] ✓ abygaele.webp");

  // AVIF (1080x1080, quality 60)
  await sharp(SRC)
    .resize(1080, 1080, { fit: "cover", position: sharp.strategy.attention })
    .avif({ quality: 60, effort: 6 })
    .toFile(path.join(OUT_DIR, "abygaele.avif"));
  console.log("[abygaele] ✓ abygaele.avif");

  console.log("\n[abygaele] All formats generated. Verify visuellement après deploy.");
}

main().catch((err) => {
  console.error("[abygaele] ERROR:", err);
  process.exit(1);
});
