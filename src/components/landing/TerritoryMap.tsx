import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { ta, translations } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * TerritoryMap — silhouette QC sud + carte OSM reelle en fond + markers
 * positionnes aux VRAIES coordonnees lat/lng des regions desservies.
 *
 * Embellissements 2026-05-20 (user "tout" - tier A+B+C+D) :
 *  A) Atlas magazine : compass rose + scale bar calibree + double-line frame
 *     + corner accents bronze + ★ Siege micro-badge sous Laval
 *     + etiquettes distance reelles (12/30 km) sur lignes reseau au hover
 *  B) Markers repositionnes aux VRAIES coordonnees lat/lng (alignes sur la
 *     carte OSM reelle). Silhouette redessinee pour framer les positions reelles.
 *     Scale bar recalibree (47 units = ≈ 30 km au lat 45.7°N).
 *  C) Halo radial qui SUIT le marker actif (au lieu de fixe sur Laval seul).
 *     Pulse halo sur n'importe quel marker actif (pas juste Laval).
 *     Inner shadow SVG filter sur silhouette = effet "decoupe magazine" profonde.
 *  D) Polish magazine : paper grain pattern overlay + coordinate ticks lat/lng
 *     sur les bords (atlas signature) + mini-stats summary sous la carte.
 *
 * Conversion lat/lng -> viewBox (precomputed via mercator projection) :
 *   OSM image z=8, tuiles (74-76, 90-92), bbox 44.26-47.06°N x -75.94 a -71.72°W
 *   Image 768x768 -> viewBox 400x480 via preserveAspectRatio="xMidYMid slice"
 *   = visible area lat 44.26-47.06°N, lng -75.51 a -72.15°W = 260x310 km
 */

type RegionPos = { key: string; x: number; y: number; siège?: boolean };

// Coords REELLES lat/lng -> pixels viewBox (mercator projection precomputee).
// User 2026-05-20 v2 : recalcul precis apres verif visuelle (markers etaient
// compresses ~50% verticalement). Methode : pixel_in_tile + offset grid + scale viewBox.
//
// Formule mercator slippy-map :
//   pixel_y = ((1 - asinh(tan(lat_rad))/π) / 2 * 2^z - tile_y) * 256
//   pixel_x = ((lng+180)/360 * 2^z - tile_x) * 256
// Puis viewBox_y = (pixel_grid_y) * (480/768),
//      viewBox_x = (pixel_grid_x - 64) * (400/640).
const REGIONS_POSITIONS: ReadonlyArray<RegionPos> = [
  { key: "laval", x: 208, y: 228, siège: true }, // 45.612°N, -73.687°W (siege Andrew)
  { key: "montreal", x: 230, y: 253 },           // 45.501°N, -73.567°W (centre-ville)
  { key: "rive-nord", x: 180, y: 209 },          // 45.781°N, -74.000°W (Saint-Jerome)
  { key: "rive-sud", x: 249, y: 264 },           // 45.456°N, -73.451°W (Brossard)
];

const LAVAL_POS = REGIONS_POSITIONS[0];
const NETWORK_LINES = REGIONS_POSITIONS.slice(1).map((pos) => {
  const dx = pos.x - LAVAL_POS.x;
  const dy = pos.y - LAVAL_POS.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  // Distance reelle approximative (km) : 400 viewBox-units = 260 km au lat 45.7°N
  const distKm = Math.round((length / 400) * 260);
  return { to: pos, length, distKm };
});

// Silhouette redessinee : trace approximatif sud-Quebec qui frame les
// markers reels positionnes dans le centre du viewBox.
const SILHOUETTE_PATH =
  "M 92 215 L 112 145 L 195 105 L 305 140 L 360 195 L 372 270 L 320 312 L 220 322 L 138 302 L 90 240 Z";

export function TerritoryMap() {
  const { t, lang } = useLanguage();
  const [activeIdx, setActiveIdx] = useState<number | null>(0);
  const { ref: mapWrapRef, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  const regions = ta<Array<{ name: string; note: string }>>(
    translations[lang],
    "territory.regions",
  );

  // C - Position du marker actif pour halo qui suit. Fallback Laval si null
  // OU si activeIdx pointe vers la liste regions (idx 4 = Province, sans marker
  // carte = REGIONS_POSITIONS[4] undefined -> crash sur .x). Fix 2026-05-20.
  const activePos = (activeIdx !== null && REGIONS_POSITIONS[activeIdx]) || LAVAL_POS;

  return (
    <section id="territoire" className="relative py-[clamp(4rem,9vw,8rem)] surface-cream overflow-hidden">
      {/* Filigrane "QC" Cormorant  arriere-plan */}
      <span
        aria-hidden="true"
        className="absolute -bottom-16 -right-8 font-[family-name:var(--font-editorial)]  text-[color:var(--color-taupe)]/10 text-[24rem] leading-none pointer-events-none select-none"
      >
        QC
      </span>

      <Container size="xl" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(2.5rem,5vw,4rem)] items-center">
          {/* Map column - col 7. ref scroll-reveal pour orchestrer cinematic */}
          <div ref={mapWrapRef} className="lg:col-span-7 relative">
            <svg
              viewBox="0 0 400 480"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto block"
              role="img"
              aria-label={t("territory.title")}
            >
              <defs>
                {/* Silhouette path defini UNE fois, reutilise via <use> pour fill + mask */}
                <path id="qc-path" d={SILHOUETTE_PATH} />

                <linearGradient id="qc-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.704 0.077 56 / 0.10)" />
                  <stop offset="100%" stopColor="oklch(0.704 0.077 56 / 0.04)" />
                </linearGradient>

                {/* C - Halo radial qui SUIT marker actif (centre dynamique via cx/cy) */}
                <radialGradient
                  id="qc-glow-follow"
                  cx={activePos.x}
                  cy={activePos.y}
                  r="100"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="oklch(0.704 0.077 56 / 0.30)" />
                  <stop offset="55%" stopColor="oklch(0.704 0.077 56 / 0.10)" />
                  <stop offset="100%" stopColor="oklch(0.704 0.077 56 / 0)" />
                </radialGradient>

                {/* Mask feather identique - applique au path partage via use */}
                <mask id="qc-mask">
                  <rect x="0" y="0" width="400" height="480" fill="black" />
                  <use href="#qc-path" fill="white" filter="url(#qc-feather)" />
                </mask>
                <filter id="qc-feather" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" />
                </filter>

                {/* C - Inner shadow SVG filter (effet "decoupe magazine" profonde) */}
                <filter id="qc-inner-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
                  <feOffset dy="1.5" result="shadow" />
                  <feFlood floodColor="#0E2442" floodOpacity="0.28" />
                  <feComposite in2="shadow" operator="in" />
                  <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowResult" />
                  <feMerge>
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode in="shadowResult" />
                  </feMerge>
                </filter>

                {/* D - Paper grain pattern overlay (texture magazine subtle) */}
                <pattern id="paper-grain" patternUnits="userSpaceOnUse" width="8" height="8">
                  <rect width="8" height="8" fill="transparent" />
                  <circle cx="2" cy="2" r="0.3" fill="oklch(0.55 0.025 80)" opacity="0.18" />
                  <circle cx="6" cy="6" r="0.25" fill="oklch(0.55 0.025 80)" opacity="0.12" />
                  <circle cx="6" cy="2" r="0.18" fill="oklch(0.55 0.025 80)" opacity="0.08" />
                </pattern>
              </defs>

              {/* LAYER 1 - OSM contexte full-bg, fade-in */}
              <image
                href="/territory-map-bg.webp"
                x="0"
                y="0"
                width="400"
                height="480"
                preserveAspectRatio="xMidYMid slice"
                style={{ opacity: isVisible ? 0.28 : 0, transition: "opacity 900ms ease-out 100ms" }}
              />

              {/* LAYER 2 - OSM amplified dans silhouette (mask feather) */}
              <image
                href="/territory-map-bg.webp"
                x="0"
                y="0"
                width="400"
                height="480"
                mask="url(#qc-mask)"
                preserveAspectRatio="xMidYMid slice"
                style={{ opacity: isVisible ? 0.70 : 0, transition: "opacity 900ms ease-out 250ms" }}
              />

              {/* D - Paper grain overlay subtle (toute la zone map) */}
              <rect
                x="0"
                y="0"
                width="400"
                height="480"
                fill="url(#paper-grain)"
                opacity="0.35"
                pointerEvents="none"
                style={{ opacity: isVisible ? 0.35 : 0, transition: "opacity 900ms ease-out 600ms" }}
              />

              {/* Silhouette + inner shadow */}
              <use
                href="#qc-path"
                fill="url(#qc-fill)"
                stroke="oklch(0.55 0.025 80 / 0.75)"
                strokeWidth="1.8"
                strokeDasharray="4 5"
                filter="url(#qc-inner-shadow)"
                style={{ opacity: isVisible ? 1 : 0, transition: "opacity 800ms ease-out 500ms" }}
              />

              {/* C - Halo radial qui SUIT marker actif (full-bg fill via gradient userSpace) */}
              <rect
                x="0"
                y="0"
                width="400"
                height="480"
                fill="url(#qc-glow-follow)"
                pointerEvents="none"
                style={{ opacity: isVisible ? 1 : 0, transition: "opacity 700ms ease-out 800ms" }}
              />

              {/* B - Network lines + A - etiquettes distance au hover */}
              <g style={{ pointerEvents: "none" }}>
                {NETWORK_LINES.map((line, idx) => {
                  const targetIdx = idx + 1;
                  const isTargetActive = activeIdx === targetIdx;
                  const midX = (LAVAL_POS.x + line.to.x) / 2;
                  const midY = (LAVAL_POS.y + line.to.y) / 2;
                  return (
                    <g key={`net-${line.to.key}`}>
                      <line
                        x1={LAVAL_POS.x}
                        y1={LAVAL_POS.y}
                        x2={line.to.x}
                        y2={line.to.y}
                        stroke="oklch(0.704 0.077 56 / 0.55)"
                        strokeWidth={isTargetActive ? "1.4" : "0.8"}
                        strokeDasharray={String(line.length)}
                        strokeDashoffset={isVisible ? 0 : line.length}
                        style={{
                          transition: `stroke-dashoffset 800ms cubic-bezier(.45,.05,.55,.95) ${900 + idx * 150}ms, stroke-width 250ms ease`,
                        }}
                      />
                      {/* A - Etiquette distance reelle au hover du target */}
                      {isTargetActive && line.distKm > 0 && (
                        <g style={{ pointerEvents: "none" }}>
                          <rect
                            x={midX - 11}
                            y={midY - 6}
                            width="22"
                            height="11"
                            rx="2"
                            fill="oklch(0.978 0 0)"
                            stroke="oklch(0.704 0.077 56 / 0.5)"
                            strokeWidth="0.4"
                          />
                          <text
                            x={midX}
                            y={midY + 2.5}
                            fontSize="6"
                            fontFamily="Georgia, serif"
                            fontStyle=""
                            fill="oklch(0.55 0.025 80)"
                            textAnchor="middle"
                          >
                            {line.distKm} km
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* C - Markers (pulse halo sur n'importe quel actif) + A - ★ Siege badge */}
              {REGIONS_POSITIONS.map((pos, idx) => {
                const isActive = activeIdx === idx;
                const isMain = idx === 0;
                const noteRaw = regions[idx]?.note || "";
                const noteDisplay = noteRaw.length > 26 ? noteRaw.slice(0, 24) + "…" : noteRaw;
                return (
                  <g
                    key={pos.key}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveIdx(idx)}
                    onFocus={() => setActiveIdx(idx)}
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: `opacity 500ms ease-out ${1100 + idx * 130}ms`,
                    }}
                  >
                    {/* C - Pulse halo sur n'importe quel marker actif (pas juste Laval) */}
                    {isActive && (
                      <circle r="14" fill="oklch(0.704 0.077 56 / 0.3)">
                        <animate attributeName="r" from="10" to="22" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Outer ring */}
                    <circle
                      r={isActive ? 9 : 7}
                      fill="none"
                      stroke="oklch(0.704 0.077 56)"
                      strokeWidth="1.5"
                      style={{ transition: "r 280ms ease" }}
                    />
                    {/* Inner dot */}
                    <circle r={isMain ? 4 : 3} fill="oklch(0.704 0.077 56)" />

                    {/* A - Micro-badge ★ Siege sous Laval (visible quand pas actif) */}
                    {isMain && !isActive && (
                      <text
                        x="0"
                        y="20"
                        fontSize="6"
                        fontFamily="Georgia, serif"
                        fontStyle=""
                        fill="oklch(0.252 0.067 256)"
                        textAnchor="middle"
                        opacity="0.85"
                        pointerEvents="none"
                      >
                        ★ Siège
                      </text>
                    )}

                    {/* C - Numero magazine 01-04 (hidden au active = mini-card prend place) */}
                    <text
                      x="11"
                      y="-2"
                      fontSize="7"
                      fontFamily="Georgia, serif"
                      fontStyle=""
                      fill="oklch(0.55 0.025 80)"
                      opacity={isActive ? 0 : 0.75}
                      style={{ transition: "opacity 200ms ease" }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </text>

                    {/* C - Mini-card actif (NAME bold + NOTE , cream bg + border bronze) */}
                    {isActive && (
                      <g style={{ pointerEvents: "none" }}>
                        <line
                          x1="0"
                          y1="-9"
                          x2="0"
                          y2="-24"
                          stroke="oklch(0.704 0.077 56)"
                          strokeWidth="1"
                        />
                        <rect
                          x="-50"
                          y="-54"
                          width="100"
                          height="30"
                          rx="2"
                          ry="2"
                          fill="oklch(0.978 0 0)"
                          stroke="oklch(0.704 0.077 56 / 0.45)"
                          strokeWidth="0.6"
                        />
                        <text
                          x="0"
                          y="-42"
                          fontSize="9"
                          fontFamily="Montserrat, system-ui"
                          fontWeight="700"
                          fill="oklch(0.252 0.067 256)"
                          textAnchor="middle"
                          letterSpacing="1.2"
                          style={{ textTransform: "uppercase" }}
                        >
                          {regions[idx]?.name?.toUpperCase()}
                        </text>
                        <text
                          x="0"
                          y="-31"
                          fontSize="6.5"
                          fontFamily="Georgia, serif"
                          fontStyle=""
                          fill="oklch(0.55 0.025 80)"
                          textAnchor="middle"
                        >
                          {noteDisplay}
                        </text>
                      </g>
                    )}

                    <circle r="20" fill="transparent" />
                    <title>{regions[idx]?.name}</title>
                  </g>
                );
              })}

              {/* A - Compass rose top-right (atlas magazine signature) */}
              <g
                transform="translate(355, 60)"
                style={{ opacity: isVisible ? 0.55 : 0, transition: "opacity 700ms ease-out 700ms" }}
                aria-hidden="true"
              >
                <circle r="13" fill="none" stroke="oklch(0.55 0.025 80)" strokeWidth="0.6" />
                <line x1="0" y1="-8" x2="0" y2="8" stroke="oklch(0.55 0.025 80)" strokeWidth="0.4" />
                <line x1="-8" y1="0" x2="8" y2="0" stroke="oklch(0.55 0.025 80)" strokeWidth="0.4" />
                <path d="M 0 -11 L -3.5 3 L 0 0 L 3.5 3 Z" fill="oklch(0.704 0.077 56)" />
                <text
                  x="0"
                  y="-15.5"
                  fontSize="6"
                  fontFamily="Georgia, serif"
                  fontStyle=""
                  textAnchor="middle"
                  fill="oklch(0.55 0.025 80)"
                >
                  N
                </text>
              </g>

              {/* A - Scale bar bottom-right (47 units = ≈ 30 km au lat 45.7°N, calibre B) */}
              <g
                transform="translate(290, 445)"
                style={{ opacity: isVisible ? 0.6 : 0, transition: "opacity 700ms ease-out 800ms" }}
                aria-hidden="true"
              >
                <line x1="0" y1="0" x2="47" y2="0" stroke="oklch(0.55 0.025 80)" strokeWidth="1.1" />
                <line x1="0" y1="-3" x2="0" y2="3" stroke="oklch(0.55 0.025 80)" strokeWidth="1" />
                <line x1="23.5" y1="-2" x2="23.5" y2="2" stroke="oklch(0.55 0.025 80)" strokeWidth="0.7" />
                <line x1="47" y1="-3" x2="47" y2="3" stroke="oklch(0.55 0.025 80)" strokeWidth="1" />
                <text
                  x="23.5"
                  y="13"
                  fontSize="6.5"
                  fontFamily="Georgia, serif"
                  fontStyle=""
                  textAnchor="middle"
                  fill="oklch(0.55 0.025 80)"
                >
                  30 km
                </text>
              </g>

              {/* D - Atlas double-line frame autour du SVG (vintage editorial) */}
              <g
                style={{ opacity: isVisible ? 0.55 : 0, transition: "opacity 800ms ease-out 600ms" }}
                aria-hidden="true"
                pointerEvents="none"
              >
                <rect x="6" y="6" width="388" height="468" fill="none" stroke="oklch(0.55 0.025 80)" strokeWidth="0.8" />
                <rect x="10" y="10" width="380" height="460" fill="none" stroke="oklch(0.55 0.025 80)" strokeWidth="0.3" />
                {/* Corner accents bronze (atlas vintage) */}
                <g fill="oklch(0.704 0.077 56)">
                  <circle cx="10" cy="10" r="1.4" />
                  <circle cx="390" cy="10" r="1.4" />
                  <circle cx="10" cy="470" r="1.4" />
                  <circle cx="390" cy="470" r="1.4" />
                </g>
              </g>

              {/* D - Coordinate ticks lat/lng (atlas signature) */}
              <g
                style={{ opacity: isVisible ? 0.5 : 0, transition: "opacity 700ms ease-out 900ms" }}
                aria-hidden="true"
                pointerEvents="none"
              >
                {/* Lat ticks gauche : 46°N a ~170, 45°N a ~342 (calcul mercator pour bbox) */}
                <g transform="translate(12, 170)">
                  <line x1="0" y1="0" x2="6" y2="0" stroke="oklch(0.55 0.025 80)" strokeWidth="0.5" />
                  <text x="20" y="2" fontSize="5" fontFamily="Georgia, serif" fontStyle="" fill="oklch(0.55 0.025 80)">46°N</text>
                </g>
                <g transform="translate(12, 342)">
                  <line x1="0" y1="0" x2="6" y2="0" stroke="oklch(0.55 0.025 80)" strokeWidth="0.5" />
                  <text x="20" y="2" fontSize="5" fontFamily="Georgia, serif" fontStyle="" fill="oklch(0.55 0.025 80)">45°N</text>
                </g>
                {/* Lng ticks bas : -74°W a ~165, -73°W a ~285 */}
                <g transform="translate(165, 468)">
                  <line x1="0" y1="0" x2="0" y2="-6" stroke="oklch(0.55 0.025 80)" strokeWidth="0.5" />
                  <text x="0" y="-9" fontSize="5" fontFamily="Georgia, serif" fontStyle="" textAnchor="middle" fill="oklch(0.55 0.025 80)">74°W</text>
                </g>
                <g transform="translate(285, 468)">
                  <line x1="0" y1="0" x2="0" y2="-6" stroke="oklch(0.55 0.025 80)" strokeWidth="0.5" />
                  <text x="0" y="-9" fontSize="5" fontFamily="Georgia, serif" fontStyle="" textAnchor="middle" fill="oklch(0.55 0.025 80)">73°W</text>
                </g>
              </g>
            </svg>

            {/* D - Mini-stats summary editorial sous la carte */}
            <p className="mt-4 text-[10px] font-[family-name:var(--font-display)] tracking-[0.15em] uppercase text-[color:var(--color-taupe-dark)]/85 text-center lg:text-left">
              {lang === "fr"
                ? "4 régions desservies · 1 siège à Laval · 200 dossiers fermés en 2025"
                : "4 regions served · 1 head office in Laval · 200 closed cases in 2025"}
            </p>

            {/* Footnote + attribution OSM */}
            <p className="mt-3 text-xs  text-[color:var(--color-taupe-dark)] text-center lg:text-left">
              {t("territory.footnote")}
            </p>
            <p className="mt-2 text-[10px] text-[color:var(--color-taupe-dark)]/70 text-center lg:text-left">
              {lang === "fr" ? "Fond cartographique : " : "Map data: "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2 hover:text-[color:var(--color-navy)] transition-colors"
              >
                © OpenStreetMap contributors
              </a>
            </p>
          </div>

          {/* Liste regions column - col 5, INCHANGE */}
          <div className="lg:col-span-5 space-y-7">
            <div>
              <p className="eyebrow text-[color:var(--color-taupe-dark)] inline-flex items-center gap-3 mb-5">
                <span className="inline-block w-6 h-px bg-[color:var(--color-orange)]" />
                {t("territory.eyebrow")}
              </p>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.875rem,3vw,2.25rem)] uppercase tracking-[0.04em] leading-[1.1] mb-5 text-balance">
                {t("territory.title")}
              </h2>
              <div className="w-12 h-px bg-[color:var(--color-bronze)] mb-6" />
              <p className="text-base leading-[1.65] text-[color:var(--color-navy-deep)]/80 text-pretty">
                {t("territory.subtitle")}
              </p>
            </div>

            <ul className="space-y-3 pt-3">
              {regions.map((r, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <li
                    key={r.name}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onFocus={() => setActiveIdx(idx)}
                    tabIndex={0}
                    className={`group cursor-pointer flex items-baseline gap-4 py-3 border-b border-[color:var(--color-taupe)]/30 transition-all duration-300 ${
                      isActive ? "border-[color:var(--color-bronze)]" : ""
                    }`}
                  >
                    <span
                      className={`font-[family-name:var(--font-editorial)]  text-2xl tabular-nums shrink-0 transition-colors duration-300 ${
                        isActive
                          ? "text-[color:var(--color-navy)]"
                          : "text-[color:var(--color-taupe)]"
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-[family-name:var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[0.04em] leading-snug">
                        {r.name}
                      </p>
                      <p className="text-xs  text-[color:var(--color-taupe-dark)] mt-1">
                        {r.note}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
