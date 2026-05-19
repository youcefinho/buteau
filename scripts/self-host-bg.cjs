#!/usr/bin/env node
/**
 * One-shot script — self-host les 2 backgrounds imgur utilises sur la home Buteau.
 *
 * Source : audit UI-REVIEW-2026-05-19.md (BLOCKER #2 single point of failure).
 *  - https://i.imgur.com/Bw7Zyf4.jpg  : utilise 9x (Faq, GuidesGrid, ToolsTeaser,
 *    ToolsFinalCta, BlogTeaser, CtaBlock, Mission, ValueTicker, etc.) → bg generique
 *  - https://i.imgur.com/YsueQT3.jpg  : utilise 1x (TeamTeaser) → bg specifique
 *
 * Output :
 *  - /public/texture-navy-fixed.{avif,webp,jpg}
 *  - /public/texture-team-fixed.{avif,webp,jpg}
 *
 * Pattern image-set() comme Hero (cf. Hero.tsx:53).
 * Run UNE FOIS. Idempotent : skip si fichiers existent deja.
 */
const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");
const sharp = require("sharp");

const PUB = path.join(__dirname, "..", "public");

const SOURCES = [
  { url: "https://i.imgur.com/Bw7Zyf4.jpg", basename: "texture-navy-fixed" },
  { url: "https://i.imgur.com/YsueQT3.jpg", basename: "texture-team-fixed" },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          fs.unlink(dest, () => {});
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function processOne({ url, basename }) {
  const jpg = path.join(PUB, `${basename}.jpg`);
  const webp = path.join(PUB, `${basename}.webp`);
  const avif = path.join(PUB, `${basename}.avif`);
  const tmp = path.join(PUB, `${basename}.tmp`);

  // 1. Download original
  if (!fs.existsSync(jpg)) {
    console.log(`[self-host-bg] Downloading ${url}...`);
    await download(url, tmp);
    // Re-encode in JPG quality 80 (smaller fallback)
    await sharp(tmp).jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(jpg);
    fs.unlinkSync(tmp);
  } else {
    console.log(`[self-host-bg] ${basename}.jpg exists, skip download.`);
  }

  // 2. WebP
  if (!fs.existsSync(webp)) {
    console.log(`[self-host-bg] Generating ${basename}.webp...`);
    await sharp(jpg).webp({ quality: 80, effort: 6 }).toFile(webp);
  }

  // 3. AVIF
  if (!fs.existsSync(avif)) {
    console.log(`[self-host-bg] Generating ${basename}.avif...`);
    await sharp(jpg).avif({ quality: 65, effort: 6 }).toFile(avif);
  }

  const sizes = {
    jpg: fs.statSync(jpg).size,
    webp: fs.statSync(webp).size,
    avif: fs.statSync(avif).size,
  };
  console.log(`\n[self-host-bg] ${basename} sizes :`);
  console.log(`  JPG  ${(sizes.jpg / 1024).toFixed(1)} KB  (fallback)`);
  console.log(`  WebP ${(sizes.webp / 1024).toFixed(1)} KB  (-${(((1 - sizes.webp / sizes.jpg) * 100)).toFixed(1)}% vs JPG)`);
  console.log(`  AVIF ${(sizes.avif / 1024).toFixed(1)} KB  (-${(((1 - sizes.avif / sizes.jpg) * 100)).toFixed(1)}% vs JPG)`);
}

async function main() {
  for (const src of SOURCES) {
    await processOne(src);
  }
  console.log("\n[self-host-bg] Done. Replace imgur URLs in components with image-set().");
}

main().catch((err) => {
  console.error("[self-host-bg] ERROR:", err);
  process.exit(1);
});
