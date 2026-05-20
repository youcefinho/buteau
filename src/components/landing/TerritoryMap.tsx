import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { ta, translations } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * TerritoryMap — silhouette Quebec stylisée + 4 régions desservies cliquables.
 *
 * Embellissements 2026-05-20 (user "tout") :
 *  A) Atlas magazine : compass rose (top-right) + scale bar (bottom-right)
 *  B) Lignes reseau bronze de Laval (siege) vers les 3 autres regions,
 *     animated draw au scroll-reveal (metaphore visuelle "reseau Andrew")
 *  C) Markers numerotes 01/02/03/04 (toujours visibles discrets) + mini-card
 *     au hover montrant NAME + NOTE (cards cream avec border bronze)
 *  D) Reveal cinematic au scroll : maps fade-in -> silhouette -> compass/scale
 *     -> halo Laval -> network lines drawn -> markers staggered fade-in
 */

// Coordonnées approximatives sur le SVG (silhouette QC stylisée).
// Note : "province" (index 4 dans regions list) n'a pas de marker carte car
// pointerait vers une zone forestiere sans ville visible sur la carte OSM reelle.
// Couverte en visio = mention dans la liste a droite uniquement (user 2026-05-20).
const REGIONS_POSITIONS: Array<{ key: string; x: number; y: number }> = [
  { key: "laval", x: 196, y: 305 }, // Laval (siège, gros marker)
  { key: "montreal", x: 200, y: 322 }, // Montréal (au sud de Laval)
  { key: "rive-nord", x: 168, y: 268 }, // Rive-Nord (Laurentides, NW de Laval)
  { key: "rive-sud", x: 226, y: 340 }, // Rive-Sud (au sud de Montréal)
];

// Pre-compute lignes reseau de Laval vers chaque autre marker, avec longueur
// pour anim stroke-dashoffset (drawing effect). Calcul Pythagore une fois.
const LAVAL_POS = REGIONS_POSITIONS[0];
const NETWORK_LINES = REGIONS_POSITIONS.slice(1).map((pos) => {
  const dx = pos.x - LAVAL_POS.x;
  const dy = pos.y - LAVAL_POS.y;
  return { to: pos, length: Math.sqrt(dx * dx + dy * dy) };
});

export function TerritoryMap() {
  const { t, lang } = useLanguage();
  const [activeIdx, setActiveIdx] = useState<number | null>(0);
  // Scroll-reveal hook pour orchestrer toutes les animations cinematic.
  // Respecte prefers-reduced-motion (revele immediatement si user le demande).
  const { ref: mapWrapRef, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  const regions = ta<Array<{ name: string; note: string }>>(
    translations[lang],
    "territory.regions",
  );

  return (
    <section id="territoire" className="relative py-[clamp(4rem,9vw,8rem)] surface-cream overflow-hidden">
      {/* Atmospheric continuity — embers per-section signature */}

      {/* Filigrane "QC" Cormorant italic en arrière-plan */}
      <span
        aria-hidden="true"
        className="absolute -bottom-16 -right-8 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/10 text-[24rem] leading-none pointer-events-none select-none"
      >
        QC
      </span>

      <Container size="xl" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(2.5rem,5vw,4rem)] items-center">
          {/* Map column — col 7. ref scroll-reveal attache pour orchestrer anim. */}
          <div ref={mapWrapRef} className="lg:col-span-7 relative">
            <svg
              viewBox="0 0 400 480"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto block"
              role="img"
              aria-label={t("territory.title")}
            >
              <defs>
                <linearGradient id="qc-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.722 0.018 84 / 0.10)" />
                  <stop offset="100%" stopColor="oklch(0.722 0.018 84 / 0.04)" />
                </linearGradient>
                <radialGradient id="qc-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="oklch(0.704 0.077 56 / 0.35)" />
                  <stop offset="100%" stopColor="oklch(0.704 0.077 56 / 0)" />
                </radialGradient>
                {/* Mask feather : silhouette QC en blanc + Gaussian blur sur les
                    bords = la carte OSM fade doucement autour du contour au lieu
                    d'un cutoff sec. Donne un halo cartographique naturel "magazine".
                    User feedback 2026-05-20 : "meme au alentour un peux pour faire plus jolie". */}
                <mask id="qc-mask">
                  <rect x="0" y="0" width="400" height="480" fill="black" />
                  <path
                    d="
                      M 80 80
                      L 130 60
                      L 200 50
                      L 280 70
                      L 340 90
                      L 360 130
                      L 350 180
                      L 330 220
                      L 310 260
                      L 290 290
                      L 280 320
                      L 270 360
                      L 240 380
                      L 200 360
                      L 180 340
                      L 160 320
                      L 140 290
                      L 120 250
                      L 100 210
                      L 90 170
                      L 80 130
                      Z
                    "
                    fill="white"
                    filter="url(#qc-feather)"
                  />
                </mask>
                <filter id="qc-feather" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" />
                </filter>
              </defs>

              {/* LAYER 1 — Carte OSM en CONTEXTE full-bg, fade-in (0 -> 0.28). */}
              <image
                href="/territory-map-bg.webp"
                x="0"
                y="0"
                width="400"
                height="480"
                preserveAspectRatio="xMidYMid slice"
                style={{
                  opacity: isVisible ? 0.28 : 0,
                  transition: "opacity 900ms ease-out 100ms",
                }}
              />

              {/* LAYER 2 — Meme carte AMPLIFIEE dans la silhouette QC, fade-in (0 -> 0.70). */}
              <image
                href="/territory-map-bg.webp"
                x="0"
                y="0"
                width="400"
                height="480"
                mask="url(#qc-mask)"
                preserveAspectRatio="xMidYMid slice"
                style={{
                  opacity: isVisible ? 0.70 : 0,
                  transition: "opacity 900ms ease-out 250ms",
                }}
              />

              {/* Silhouette stylisée — fade in apres les maps (delay 500ms).
                  Le fleuve St-Laurent decoratif retire 2026-05-20 (doublonnait
                  avec le vrai St-Laurent visible dans le fond OSM). */}
              <path
                d="
                  M 80 80
                  L 130 60
                  L 200 50
                  L 280 70
                  L 340 90
                  L 360 130
                  L 350 180
                  L 330 220
                  L 310 260
                  L 290 290
                  L 280 320
                  L 270 360
                  L 240 380
                  L 200 360
                  L 180 340
                  L 160 320
                  L 140 290
                  L 120 250
                  L 100 210
                  L 90 170
                  L 80 130
                  Z
                "
                fill="url(#qc-fill)"
                stroke="oklch(0.55 0.025 80 / 0.75)"
                strokeWidth="1.8"
                strokeDasharray="4 5"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: "opacity 800ms ease-out 500ms",
                }}
              />

              {/* Halo radial au siège (Laval) — fade in delay 800ms */}
              <circle
                cx="196"
                cy="305"
                r="60"
                fill="url(#qc-glow)"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: "opacity 700ms ease-out 800ms",
                }}
              />

              {/* B — Lignes reseau bronze de Laval vers chaque autre region.
                  Anim drawing via stroke-dashoffset (length -> 0) au scroll-reveal.
                  Metaphore visuelle "reseau Andrew couvre 4 zones depuis Laval". */}
              <g style={{ pointerEvents: "none" }}>
                {NETWORK_LINES.map((line, idx) => (
                  <line
                    key={`net-${line.to.key}`}
                    x1={LAVAL_POS.x}
                    y1={LAVAL_POS.y}
                    x2={line.to.x}
                    y2={line.to.y}
                    stroke="oklch(0.704 0.077 56 / 0.55)"
                    strokeWidth="0.8"
                    strokeDasharray={String(line.length)}
                    strokeDashoffset={isVisible ? 0 : line.length}
                    style={{
                      transition: `stroke-dashoffset 800ms cubic-bezier(.45,.05,.55,.95) ${900 + idx * 150}ms`,
                    }}
                  />
                ))}
              </g>

              {/* C+D — Markers numerotes 01/02/03/04 + mini-card NAME+NOTE au hover.
                  Staggered fade-in (delays 1100/1230/1360/1490ms) en cascade Laval-first. */}
              {REGIONS_POSITIONS.map((pos, idx) => {
                const isActive = activeIdx === idx;
                const isMain = idx === 0; // Laval = siège
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
                    {/* Pulse outer ring (Laval siege seul) */}
                    {isMain && (
                      <circle r="14" fill="oklch(0.704 0.077 56 / 0.3)">
                        <animate
                          attributeName="r"
                          from="10"
                          to="22"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.5"
                          to="0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Outer ring static */}
                    <circle
                      r={isActive ? 9 : 7}
                      fill="none"
                      stroke="oklch(0.704 0.077 56)"
                      strokeWidth="1.5"
                      style={{ transition: "r 280ms ease" }}
                    />
                    {/* Inner dot */}
                    <circle r={isMain ? 4 : 3} fill="oklch(0.704 0.077 56)" />

                    {/* C — Numero magazine 01/02/03/04 a cote du marker, Cormorant
                        italic discret. Hidden au hover (mini-card prend la place). */}
                    <text
                      x="11"
                      y="-2"
                      fontSize="7"
                      fontFamily="Georgia, serif"
                      fontStyle="italic"
                      fill="oklch(0.55 0.025 80)"
                      opacity={isActive ? 0 : 0.75}
                      style={{ transition: "opacity 200ms ease" }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </text>

                    {/* C — Mini-card actif (NAME bold + NOTE italic, cream bg + border bronze) */}
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
                          fontStyle="italic"
                          fill="oklch(0.55 0.025 80)"
                          textAnchor="middle"
                        >
                          {noteDisplay}
                        </text>
                      </g>
                    )}

                    {/* Hit area transparent pour mobile/touch */}
                    <circle r="20" fill="transparent" />
                    <title>{regions[idx]?.name}</title>
                  </g>
                );
              })}

              {/* A — Compass rose top-right (atlas magazine signature) */}
              <g
                transform="translate(355, 60)"
                style={{
                  opacity: isVisible ? 0.55 : 0,
                  transition: "opacity 700ms ease-out 700ms",
                }}
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
                  fontStyle="italic"
                  textAnchor="middle"
                  fill="oklch(0.55 0.025 80)"
                >
                  N
                </text>
              </g>

              {/* A — Scale bar bottom-right (≈30 km a z=8, calcul approximatif viewBox) */}
              <g
                transform="translate(290, 445)"
                style={{
                  opacity: isVisible ? 0.6 : 0,
                  transition: "opacity 700ms ease-out 800ms",
                }}
                aria-hidden="true"
              >
                <line x1="0" y1="0" x2="50" y2="0" stroke="oklch(0.55 0.025 80)" strokeWidth="1.1" />
                <line x1="0" y1="-3" x2="0" y2="3" stroke="oklch(0.55 0.025 80)" strokeWidth="1" />
                <line x1="25" y1="-2" x2="25" y2="2" stroke="oklch(0.55 0.025 80)" strokeWidth="0.7" />
                <line x1="50" y1="-3" x2="50" y2="3" stroke="oklch(0.55 0.025 80)" strokeWidth="1" />
                <text
                  x="25"
                  y="13"
                  fontSize="6.5"
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  textAnchor="middle"
                  fill="oklch(0.55 0.025 80)"
                >
                  ≈ 30 km
                </text>
              </g>
            </svg>

            {/* Légende sous la map — texte d'accessibilité + attribution OSM (CC-BY-SA). */}
            <p className="mt-6 text-xs italic text-[color:var(--color-taupe-dark)] text-center lg:text-left">
              {t("territory.footnote")}
            </p>
            <p className="mt-2 text-[10px] text-[color:var(--color-taupe-dark)]/70 text-center lg:text-left">
              {lang === "fr" ? "Fond cartographique : " : "Map data: "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2 hover:text-[color:var(--color-bronze-deep)] transition-colors"
              >
                © OpenStreetMap contributors
              </a>
            </p>
          </div>

          {/* Liste régions column — col 5 */}
          <div className="lg:col-span-5 space-y-7">
            <div>
              <p className="eyebrow text-[color:var(--color-taupe-dark)] inline-flex items-center gap-3 mb-5">
                <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
                {t("territory.eyebrow")}
              </p>
              <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.875rem,3vw,2.25rem)] uppercase tracking-[0.04em] leading-[1.1] mb-5 text-balance">
                {t("territory.title")}
              </h2>
              <div className="w-12 h-px bg-[color:var(--color-bronze)] mb-6" />
              <p className="text-base leading-[1.65] text-[color:var(--color-navy-deep)]/80 text-pretty">
                {t("territory.subtitle")}
              </p>
            </div>

            {/* Liste régions avec hover sync */}
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
                      className={`font-[var(--font-editorial)] italic text-2xl tabular-nums shrink-0 transition-colors duration-300 ${
                        isActive
                          ? "text-[color:var(--color-bronze-deep)]"
                          : "text-[color:var(--color-taupe)]"
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[0.04em] leading-snug">
                        {r.name}
                      </p>
                      <p className="text-xs italic text-[color:var(--color-taupe-dark)] mt-1">
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
