import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useTilt } from "@/hooks/useTilt";

/**
 * Tiltable — wrapper qui applique le tilt 3D suivi-curseur au mouseover.
 * Pour utilisation dans .map() (hooks-in-loop interdit, donc on extrait en composant).
 *
 * Usage :
 *   <Tiltable maxDeg={4}>
 *     <article className="card-luxury">...</article>
 *   </Tiltable>
 *
 * Le child doit être un seul élément. transform-style preserve-3d applique au parent.
 */
type TiltableProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Amplitude max degrés (défaut 5) */
  maxDeg?: number;
  /** Style additionnel */
  style?: CSSProperties;
};

export function Tiltable({ children, maxDeg = 5, style, ...rest }: TiltableProps) {
  const ref = useTilt<HTMLDivElement>({ maxDeg });
  return (
    <div
      ref={ref}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
