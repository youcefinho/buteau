import { Container } from "@/components/layout/Container";

/**
 * ChapterMarker — séparateur éditorial entre sections (numéro Cormorant
 * italic + label optionnel). Détail luxury magazine qui rythme la lecture.
 *
 * Usage : `<ChapterMarker numeral="02" label="Notre équipe" />` entre 2 sections.
 */
type ChapterMarkerProps = {
  numeral?: string; // Conserve pour backward compat — n'est plus affiche (user 2026-05-20 "plus epure").
  label?: string;
  tone?: "light" | "dark" | "bronze";
};

export function ChapterMarker({ label, tone = "light" }: ChapterMarkerProps) {
  const labelColor =
    tone === "dark"
      ? "text-[color:var(--color-taupe)]"
      : tone === "bronze"
        ? "text-[color:var(--color-bronze)]"
        : "text-[color:var(--color-bronze)]";
  const lineColor =
    tone === "dark"
      ? "bg-[color:var(--color-taupe)]/40"
      : tone === "bronze"
        ? "bg-[color:var(--color-bronze)]"
        : "bg-[color:var(--color-bronze)]/70";

  return (
    <div
      className={`relative py-[clamp(2rem,4vw,3rem)] ${
        tone === "dark" ? "surface-navy" : "surface-cream"
      }`}
      aria-hidden={!label ? "true" : undefined}
    >
      <Container size="md">
        <div className="flex flex-col items-center text-center">
          {/* Label eyebrow seul — le numero romain XL retire 2026-05-20 (user epuration). */}
          {label && (
            <p className={`eyebrow ${labelColor} inline-flex items-center gap-3`}>
              <span className={`inline-block w-10 h-px ${lineColor}`} />
              {label}
              <span className={`inline-block w-10 h-px ${lineColor}`} />
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
