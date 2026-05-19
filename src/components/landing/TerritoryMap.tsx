import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { ta, translations } from "@/lib/translations";

/**
 * TerritoryMap — silhouette Quebec stylisée + 5 régions desservies cliquables.
 *
 * Pourquoi NOVEL : aucun courtier hypothécaire concurrent ne montre son territoire
 * sous forme de carte interactive luxury. C'est une preuve visuelle de couverture
 * (vs juste "Tout le Québec" en texte).
 *
 * Pas une vraie projection cartographique — c'est une silhouette stylisée du QC
 * avec 5 markers positionnés approximativement, chaque marker hover révèle la note.
 */

// Coordonnées approximatives sur le SVG (silhouette QC stylisée).
const REGIONS_POSITIONS: Array<{ key: string; x: number; y: number }> = [
  { key: "laval", x: 196, y: 305 }, // Laval (siège, gros marker)
  { key: "montreal", x: 200, y: 322 }, // Montréal (au sud de Laval)
  { key: "rive-nord", x: 168, y: 268 }, // Rive-Nord (Laurentides, NW de Laval)
  { key: "rive-sud", x: 226, y: 340 }, // Rive-Sud (au sud de Montréal)
  { key: "province", x: 138, y: 200 }, // Reste du QC (centre nord)
];

export function TerritoryMap() {
  const { t, lang } = useLanguage();
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

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
          {/* Map column — col 7 */}
          <div className="lg:col-span-7 relative">
            <svg
              viewBox="0 0 400 480"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto block"
              role="img"
              aria-label={t("territory.title")}
            >
              <defs>
                <linearGradient id="qc-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.722 0.018 84 / 0.18)" />
                  <stop offset="100%" stopColor="oklch(0.722 0.018 84 / 0.06)" />
                </linearGradient>
                <radialGradient id="qc-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="oklch(0.704 0.077 56 / 0.35)" />
                  <stop offset="100%" stopColor="oklch(0.704 0.077 56 / 0)" />
                </radialGradient>
              </defs>

              {/* Silhouette stylisée du Quebec — pas une vraie projection,
                  mais une forme reconnaissable (région inférieure + golfe St-Laurent). */}
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
                stroke="oklch(0.722 0.018 84 / 0.5)"
                strokeWidth="1"
                strokeDasharray="3 4"
              />

              {/* Halo radial au siège (Laval) */}
              <circle cx="196" cy="305" r="60" fill="url(#qc-glow)" />

              {/* Filet décoratif — fleuve St-Laurent stylisé */}
              <path
                d="M 80 240 Q 180 280, 260 305 Q 320 320, 360 340"
                fill="none"
                stroke="oklch(0.722 0.018 84 / 0.4)"
                strokeWidth="0.8"
                strokeLinecap="round"
              />

              {/* Markers */}
              {REGIONS_POSITIONS.map((pos, idx) => {
                const isActive = activeIdx === idx;
                const isMain = idx === 0; // Laval = siège
                return (
                  <g
                    key={pos.key}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveIdx(idx)}
                    onFocus={() => setActiveIdx(idx)}
                  >
                    {/* Pulse outer ring (siège uniquement) */}
                    {isMain && (
                      <>
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
                      </>
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
                    <circle
                      r={isMain ? 4 : 3}
                      fill="oklch(0.704 0.077 56)"
                    />

                    {/* Label texte (visible uniquement actif) */}
                    {isActive && (
                      <g style={{ pointerEvents: "none" }}>
                        <line
                          x1="0"
                          y1="-9"
                          x2="0"
                          y2="-22"
                          stroke="oklch(0.704 0.077 56)"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="-28"
                          fontSize="13"
                          fontFamily="Montserrat, system-ui"
                          fontWeight="700"
                          fill="oklch(0.252 0.067 256)"
                          textAnchor="middle"
                          letterSpacing="1.5"
                          style={{ textTransform: "uppercase" }}
                        >
                          {regions[idx]?.name?.toUpperCase()}
                        </text>
                      </g>
                    )}

                    {/* Hit area transparent pour mobile/touch */}
                    <circle r="20" fill="transparent" />

                    {/* Tabbable a11y */}
                    <title>{regions[idx]?.name}</title>
                  </g>
                );
              })}
            </svg>

            {/* Légende sous la map — texte d'accessibilité */}
            <p className="mt-6 text-xs italic text-[color:var(--color-taupe-dark)] text-center lg:text-left">
              {t("territory.footnote")}
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
