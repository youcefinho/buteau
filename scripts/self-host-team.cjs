#!/usr/bin/env node
/**
 * One-shot script — self-host les 3 photos equipe externes (imgur + linktr.ee).
 *
 * Source : audit UI-REVIEW-2026-05-19 + session 2026-05-19.
 *  - Andrew  https://i.imgur.com/k4bZmLl.jpg
 *  - Alexis  https://i.imgur.com/MUD07Kc.jpg
 *  - Abygaele https://ugc.production.linktr.ee/...
 *
 * Output :
 *  - /public/equipe/andrew.{avif,webp,jpg}
 *  - /public/equipe/alexis.{avif,webp,jpg}
 *  - /public/equipe/abygaele.{avif,webp,jpg}
 *
 * Run UNE FOIS. Idempotent : skip si fichiers existent deja.
 * Apres : update config.ts teamPhotos + clean CSP worker.ts (retirer
 * i.imgur.com + ugc.production.linktr.ee).
 */
const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");
const sharp = require("sharp");

const PUB = path.join(__dirname, "..", "public", "equipe");

const SOURCES = [
  { url: "https://i.imgur.com/k4bZmLl.jpg", basename: "andrew" },
  { url: "https://i.imgur.com/MUD07Kc.jpg", basename: "alexis" },
  { url: "https://ugc.production.linktr.ee/5iBsvLTR0iXiJgoKotJw_I4Qhjq9XsUtz0u6v?io=true&size=avatar-v3_0", basename: "abygaele" },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    function get(currentUrl, redirects = 0) {
      if (redirects > 5) {
        reject(new Error(`Too many redirects for ${url}`));
        return;
      }
      https
        .get(currentUrl, (res) => {
          // Handle redirects
          if ([301, 302, 303, 307, 308].includes(res.statusCode || 0)) {
            const next = res.headers.location;
            if (!next) {
              reject(new Error(`Redirect without location for ${currentUrl}`));
              return;
            }
            get(next, redirects + 1);
            return;
          }
          if (res.statusCode !== 200) {
            fs.unlink(dest, () => {});
            reject(new Error(`HTTP ${res.statusCode} for ${currentUrl}`));
            return;
          }
          res.pipe(file);
          file.on("finish", () => file.close(resolve));
        })
        .on("error", (err) => {
          fs.unlink(dest, () => {});
          reject(err);
        });
    }
    get(url);
  });
}

async function processOne({ url, basename }) {
  const jpg = path.join(PUB, `${basename}.jpg`);
  const webp = path.join(PUB, `${basename}.webp`);
  const avif = path.join(PUB, `${basename}.avif`);
  const tmp = path.join(PUB, `${basename}.tmp`);

  if (!fs.existsSync(jpg)) {
    console.log(`[self-host-team] Downloading ${url}...`);
    await download(url, tmp);
    await sharp(tmp).jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(jpg);
    fs.unlinkSync(tmp);
  } else {
    console.log(`[self-host-team] ${basename}.jpg exists, skip download.`);
  }

  if (!fs.existsSync(webp)) {
    console.log(`[self-host-team] Generating ${basename}.webp...`);
    await sharp(jpg).webp({ quality: 80, effort: 6 }).toFile(webp);
  }

  if (!fs.existsSync(avif)) {
    console.log(`[self-host-team] Generating ${basename}.avif...`);
    await sharp(jpg).avif({ quality: 65, effort: 6 }).toFile(avif);
  }

  const sizes = {
    jpg: fs.statSync(jpg).size,
    webp: fs.statSync(webp).size,
    avif: fs.statSync(avif).size,
  };
  console.log(`\n[self-host-team] ${basename} sizes :`);
  console.log(`  JPG  ${(sizes.jpg / 1024).toFixed(1)} KB`);
  console.log(`  WebP ${(sizes.webp / 1024).toFixed(1)} KB  (-${(((1 - sizes.webp / sizes.jpg) * 100)).toFixed(1)}% vs JPG)`);
  console.log(`  AVIF ${(sizes.avif / 1024).toFixed(1)} KB  (-${(((1 - sizes.avif / sizes.jpg) * 100)).toFixed(1)}% vs JPG)`);
}

async function main() {
  if (!fs.existsSync(PUB)) {
    fs.mkdirSync(PUB, { recursive: true });
  }
  for (const src of SOURCES) {
    await processOne(src);
  }
  console.log("\n[self-host-team] Done. Update config.ts teamPhotos paths + clean CSP worker.ts.");
}

main().catch((err) => {
  console.error("[self-host-team] ERROR:", err);
  process.exit(1);
});
