/**
 * ButeauMonogramInline — version mini du monogramme B Buteau pour usage inline
 * dans le texte (remplace l'ancien char ❦ Cormorant italic inline).
 *
 * 18x14 SVG inline-block + currentColor sur le B = hérite la couleur du texte
 * parent. Petit point bronze sous le B pour signature minimale.
 *
 * Usage : `<ButeauMonogramInline /> Lire le carnet complet`
 *
 * Pourquoi pas le monogramme complet (cercle médaillon + losanges + swash) ?
 * Inline dans texte = 18px max sinon ça casse la baseline + se voit comme
 * un objet a part. Cette mini version se fond dans le flow de lecture.
 */
export function ButeauMonogramInline({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ display: "inline-block", verticalAlign: "-2px" }}
    >
      {/* "B" du logo officiel scale tres petit, fill currentColor pour heriter
          la couleur du parent (bronze sur cards cream, taupe sur fond navy, etc.) */}
      <g transform="translate(9, 5) scale(0.025) translate(-235, -705)">
        <path
          d="M321.781,756.962C321.781,769.003 318.609,779.084 312.267,787.203C305.925,795.322 297.404,801.468 286.703,805.641C276.002,809.815 264.21,811.901 251.324,811.901L147.853,811.901L147.853,598.109L263.966,598.109C274.004,598.109 282.686,600.769 290.013,606.089C297.34,611.408 302.961,618.261 306.875,626.647C310.79,635.033 312.747,643.742 312.747,652.776C312.747,662.882 310.143,672.53 304.935,681.721C299.726,690.911 292.092,697.769 282.033,702.295C294.279,705.909 303.965,712.389 311.091,721.736C318.217,731.083 321.781,742.825 321.781,756.962ZM192.433,636.247L192.433,686.303L245.001,686.303C249.317,686.303 253.24,685.335 256.77,683.398C260.3,681.461 263.16,678.615 265.35,674.861C267.539,671.106 268.634,666.572 268.634,661.259C268.634,655.986 267.668,651.523 265.735,647.869C263.803,644.214 261.2,641.364 257.925,639.317C254.651,637.271 250.945,636.247 246.808,636.247L192.433,636.247ZM276.566,748.149C276.566,743.19 275.555,738.705 273.532,734.693C271.508,730.682 268.787,727.469 265.368,725.055C261.95,722.642 257.971,721.435 253.432,721.435L192.433,721.435L192.433,774.097L251.324,774.097C256.064,774.097 260.344,772.946 264.164,770.644C267.984,768.341 271.007,765.235 273.23,761.323C275.454,757.412 276.566,753.021 276.566,748.149Z"
          fill="currentColor"
        />
      </g>
      {/* Mini dot bronze signature sous le B */}
      <circle cx="9" cy="12" r="0.7" fill="var(--color-bronze)" opacity="0.75" />
    </svg>
  );
}
