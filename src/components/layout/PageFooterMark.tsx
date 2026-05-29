import { Container } from "./Container";

/**
 * PageFooterMark — signature de page Buteau, placée juste avant le Footer.
 *
 * Pattern magazine : chaque page se ferme sur une marque éditoriale discrète.
 * Style minimal qui se distingue du SectionDivider (qui a medaillon complet +
 * swash + losanges). Ici juste le monogramme B + hairlines flanquants.
 *
 * Refait 2026-05-20 : version label retire (etait dupliquant les eyebrows
 * des sections suivantes) -> juste monogramme.
 */
export function PageFooterMark() {
  return (
    <div
      className="surface-cream pt-10 pb-6 border-t border-[color:var(--color-taupe)]/30"
      aria-hidden="true"
    >
      <Container size="md">
        <div className="flex items-center justify-center gap-5 opacity-65 hover:opacity-100 transition-opacity duration-700">
          <span className="block w-[clamp(3rem,6vw,5rem)] h-px bg-[color:var(--color-taupe)]/70" />
          <span className="block w-1.5 h-1.5 rounded-full bg-[color:var(--color-bronze)]/70 shrink-0" />
          <span className="block w-[clamp(3rem,6vw,5rem)] h-px bg-[color:var(--color-taupe)]/70" />
        </div>
      </Container>
    </div>
  );
}
