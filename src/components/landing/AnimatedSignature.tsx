import { useEffect, useRef } from "react";

/**
 * Signature animée style "écrit à la main".
 *
 * Pas une vraie signature scannée — c'est un path SVG calligraphié simulé
 * qui se dessine au mount via stroke-dasharray + stroke-dashoffset animation.
 * Effet authentique luxury hypothécaire : "voici la touche personnelle d'Andrew".
 *
 * Pourquoi NOVEL : aucun autre client Intralys n'a de signature animée pleine
 * qui se dessine au scroll. C'est une signature unique au personal brand Andrew Buteau.
 *
 * Démarre quand le composant entre dans le viewport (IntersectionObserver).
 */
type AnimatedSignatureProps = {
  className?: string;
  /** Couleur du tracé (défaut bronze Buteau) */
  stroke?: string;
  /** Durée totale d'écriture en ms */
  duration?: number;
};

export function AnimatedSignature({
  className,
  stroke = "var(--color-bronze)",
  duration = 2200,
}: AnimatedSignatureProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const startedRef = useRef<boolean>(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Affichage immédiat sans animation
      svg.querySelectorAll("path").forEach((p) => {
        p.style.strokeDasharray = "";
        p.style.strokeDashoffset = "0";
      });
      return;
    }

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
      paths.forEach((p, idx) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
        // Stagger entre paths (lettre par lettre quand multi-paths)
        const delay = idx * 80;
        p.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.65, 0, 0.35, 1) ${delay}ms`;
        // Trigger au tick suivant
        requestAnimationFrame(() => {
          p.style.strokeDashoffset = "0";
        });
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            start();
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, [duration]);

  // Path simulé d'une signature manuscrite "Andrew Buteau" en cursive.
  // ViewBox 400x100, optimisé pour un tracé fluide qui ressemble à une vraie signature.
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Signature Andrew Buteau"
      role="img"
    >
      {/* "A" — premier trait montant + barre */}
      <path d="M 8 70 Q 15 30, 28 18 Q 38 22, 42 65 Q 44 75, 48 70" />
      <path d="M 18 56 Q 28 50, 38 56" />

      {/* "ndrew" — flow cursive */}
      <path d="M 50 60 Q 56 38, 62 60 Q 68 72, 74 50 Q 78 35, 84 56 Q 90 70, 96 50 Q 100 38, 110 50 Q 116 60, 124 42 Q 130 30, 134 50 Q 138 72, 148 50" />

      {/* Espace + "B" */}
      <path d="M 168 70 Q 172 25, 178 22 Q 192 24, 188 45 Q 184 50, 175 50 Q 192 50, 196 65 Q 196 78, 178 80 Q 175 80, 174 75" />

      {/* "uteau" — flow cursive avec underline final flourish */}
      <path d="M 198 50 Q 204 70, 212 50 Q 216 38, 222 50 Q 228 65, 232 50 Q 238 32, 246 30 Q 252 32, 250 60 Q 248 70, 254 65 Q 262 55, 268 60 Q 276 70, 282 50 Q 286 38, 292 50 Q 296 60, 304 50 Q 310 38, 318 56 Q 322 70, 330 60" />

      {/* Underline flourish final */}
      <path d="M 24 88 Q 90 92, 160 88 Q 240 84, 340 88" />
    </svg>
  );
}
