import { Container } from "@/components/layout/Container";

/**
 * ChapterMarker — séparateur éditorial entre sections (numéro Cormorant
 * italic + label optionnel). Détail luxury magazine qui rythme la lecture.
 *
 * Usage : `<ChapterMarker numeral="02" label="Notre équipe" />` entre 2 sections.
 */
type ChapterMarkerProps = {
  numeral: string; // 01 / 02 / 03 / 04 / 05 / 06 / 07 / 08 / 09
  label?: string;
  tone?: "light" | "dark" | "bronze";
};

export function ChapterMarker({ numeral, label, tone = "light" }: ChapterMarkerProps) {
  const numColor =
    tone === "dark"
      ? "text-[color:var(--color-taupe)]/40"
      : "text-[color:var(--color-bronze)]/30";
  const labelColor =
    tone === "dark"
      ? "text-[color:var(--color-taupe)]"
      : "text-[color:var(--color-taupe-dark)]";
  const lineColor =
    tone === "dark"
      ? "bg-[color:var(--color-taupe)]/40"
      : "bg-[color:var(--color-taupe)]";

  return (
    <div
      className={`relative py-[clamp(2.5rem,5vw,4rem)] ${
        tone === "dark" ? "surface-navy" : "surface-cream"
      }`}
      aria-hidden={!label ? "true" : undefined}
    >
      <Container size="md">
        <div className="flex flex-col items-center text-center gap-5">
          {/* Roman numeral énorme Cormorant italic — central focus */}
          <span
            className={`font-[var(--font-editorial)] italic font-light ${numColor} text-[7rem] md:text-[10rem] lg:text-[12rem] leading-[0.85] pointer-events-none select-none`}
          >
            {numeral}
          </span>

          {/* Label optional eyebrow */}
          {label && (
            <p className={`eyebrow ${labelColor} inline-flex items-center gap-3 -mt-2`}>
              <span className={`inline-block w-6 h-px ${lineColor}`} />
              {label}
              <span className={`inline-block w-6 h-px ${lineColor}`} />
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
