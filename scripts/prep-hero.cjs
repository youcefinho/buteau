#!/usr/bin/env node
/**
 * One-shot script — convertit public/hero-buteau.jpg (en realite PNG 683x1080
 * downloade depuis imgur) en :
 *  - public/hero-buteau.jpg (JPG quality 80, fallback)
 *  - public/hero-buteau.webp (qual 80)
 *  - public/hero-buteau.avif (qual 65)
 *
 * Run UNE FOIS apres download initial. Idempotent : skip si .avif/.webp existent.
 *
 * Apres : commit les 3 fichiers en git, retire imgur du Hero.tsx, build, deploy.
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const PUB = path.join(__dirname, "..", "public");
const SRC = path.join(PUB, "hero-buteau.jpg"); // PNG saved as .jpg

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error("[prep-hero] Source missing:", SRC);
    process.exit(1);
  }

  const tmpJpg = path.join(PUB, "hero-buteau.tmp.jpg");
  const webp = path.join(PUB, "hero-buteau.webp");
  const avif = path.join(PUB, "hero-buteau.avif");

  // 1. Re-encode PNG → JPG quality 80 (smaller fallback)
  console.log("[prep-hero] Re-encoding source → JPG quality 80...");
  await sharp(SRC).jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(tmpJpg);
  fs.renameSync(tmpJpg, SRC); // overwrite

  // 2. WebP
  if (!fs.existsSync(webp)) {
    console.log("[prep-hero] Generating WebP qual 80...");
    await sharp(SRC).webp({ quality: 80, effort: 6 }).toFile(webp);
  } else console.log("[prep-hero] WebP exists, skip.");

  // 3. AVIF
  if (!fs.existsSync(avif)) {
    console.log("[prep-hero] Generating AVIF qual 65...");
    await sharp(SRC).avif({ quality: 65, effort: 6 }).toFile(avif);
  } else console.log("[prep-hero] AVIF exists, skip.");

  // Report sizes
  const sizes = {
    jpg: fs.statSync(SRC).size,
    webp: fs.statSync(webp).size,
    avif: fs.statSync(avif).size,
  };
  console.log("\n[prep-hero] Sizes :");
  console.log(`  JPG  ${(sizes.jpg / 1024).toFixed(1)} KB  (fallback)`);
  console.log(`  WebP ${(sizes.webp / 1024).toFixed(1)} KB  (-${(((1 - sizes.webp / sizes.jpg) * 100)).toFixed(1)}% vs JPG)`);
  console.log(`  AVIF ${(sizes.avif / 1024).toFixed(1)} KB  (-${(((1 - sizes.avif / sizes.jpg) * 100)).toFixed(1)}% vs JPG)`);
}

main().catch((err) => {
  console.error("[prep-hero] ERROR:", err);
  process.exit(1);
});
