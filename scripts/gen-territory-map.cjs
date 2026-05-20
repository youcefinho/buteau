#!/usr/bin/env node
/**
 * Generate territory map background — fetches 9 OSM tiles at z=8 covering
 * Greater Montreal / Laurentides, composes into single PNG via sharp,
 * applies sepia + desaturation + low opacity for "real map in background"
 * effect under the stylized SVG silhouette.
 *
 * OSM usage policy compliance :
 *  - Custom User-Agent identifying app (mandatory)
 *  - Single batch fetch (9 tiles only, no bulk)
 *  - Stored locally (no runtime hot-linking)
 *  - Attribution "© OpenStreetMap contributors" added in TerritoryMap.tsx
 *
 * Output : /public/territory-map-bg.{avif,webp,jpg}
 */
const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");
const sharp = require("sharp");

const PUB = path.join(__dirname, "..", "public");

// Center tile at z=8 for Laval area (lat 45.8, lon -73.9)
// 3x3 grid = covers Quebec south + Greater Montreal + parts of Laurentides
const Z = 8;
const X_CENTER = 75;
const Y_CENTER = 91;
const TILE_SIZE = 256;

const tiles = [];
for (let dy = -1; dy <= 1; dy++) {
  for (let dx = -1; dx <= 1; dx++) {
    tiles.push({ x: X_CENTER + dx, y: Y_CENTER + dy, dx, dy });
  }
}

function fetchTile({ x, y }) {
  return new Promise((resolve, reject) => {
    const url = `https://tile.openstreetmap.org/${Z}/${x}/${y}.png`;
    https
      .get(
        url,
        {
          headers: {
            "User-Agent": "EquipeButeau-StaticAsset/1.0 (https://equipe-buteau.intralysqc.workers.dev; contact@equipebuteau.com)",
          },
        },
        (res) => {
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks)));
          res.on("error", reject);
        },
      )
      .on("error", reject);
  });
}

async function main() {
  console.log(`[gen-territory] Fetching 9 OSM tiles at z=${Z} centered (${X_CENTER},${Y_CENTER})...`);

  // Fetch sequentially (respect OSM policy — no parallel hammering)
  const buffers = [];
  for (const tile of tiles) {
    process.stdout.write(`  ${tile.x},${tile.y}... `);
    const buf = await fetchTile(tile);
    console.log(`${(buf.length / 1024).toFixed(1)} KB`);
    buffers.push({ ...tile, buf });
  }

  // Composite 9 tiles into single 768x768 PNG
  console.log("[gen-territory] Compositing 9 tiles -> 768x768...");
  const composite = buffers.map((t) => ({
    input: t.buf,
    top: (t.dy + 1) * TILE_SIZE,
    left: (t.dx + 1) * TILE_SIZE,
  }));

  const raw = await sharp({
    create: {
      width: TILE_SIZE * 3,
      height: TILE_SIZE * 3,
      channels: 3,
      background: { r: 248, g: 244, b: 238 },
    },
  })
    .composite(composite)
    .png()
    .toBuffer();

  // Apply sepia + desaturate + slight darken to harmonize with cream theme.
  // Recipe matches the Buteau editorial palette (taupe/bronze territory).
  console.log("[gen-territory] Applying sepia treatment...");
  const processed = await sharp(raw)
    .modulate({ saturation: 0.25, brightness: 1.05 })
    .tint({ r: 240, g: 220, b: 195 }) // Warm sepia toward cream/bronze
    .toBuffer();

  const avif = path.join(PUB, "territory-map-bg.avif");
  const webp = path.join(PUB, "territory-map-bg.webp");
  const jpg = path.join(PUB, "territory-map-bg.jpg");

  await sharp(processed).avif({ quality: 55, effort: 6 }).toFile(avif);
  await sharp(processed).webp({ quality: 72, effort: 6 }).toFile(webp);
  await sharp(processed).jpeg({ quality: 78, progressive: true, mozjpeg: true }).toFile(jpg);

  // Cleanup temp
  const raw1 = path.join(PUB, "territory-map-raw.png");
  if (fs.existsSync(raw1)) fs.unlinkSync(raw1);

  console.log("\n[gen-territory] Sizes :");
  console.log(`  AVIF ${(fs.statSync(avif).size / 1024).toFixed(1)} KB`);
  console.log(`  WebP ${(fs.statSync(webp).size / 1024).toFixed(1)} KB`);
  console.log(`  JPG  ${(fs.statSync(jpg).size / 1024).toFixed(1)} KB`);
  console.log("\n[gen-territory] Done. Update TerritoryMap.tsx <image> + attribution.");
}

main().catch((err) => {
  console.error("[gen-territory] ERROR:", err);
  process.exit(1);
});
