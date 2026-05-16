import type { ReactNode } from "react";
import { Container } from "./Container";

/**
 * Wrapper layout pour les pages légales (mentions / confidentialité / lexique).
 * Pattern éditorial luxury : hero navy avec filigrane "§" Cormorant, fleuron
 * décoratif avant le body, drop cap optional sur premier paragraphe.
 */
export function LegalPageWrap({
  eyebrow,
  title,
  lastUpdated,
  children,
  afterContent,
}: {
  eyebrow?: string;
  title: string;
  lastUpdated?: string;
  children: ReactNode;
  /** Slot full-width rendu apres le body (avant Footer). Sert aux CTA pleine
   *  largeur comme ToolsFinalCta sur /journal et /capsules. */
  afterContent?: ReactNode;
}) {
  return (
    <main id="main" className="surface-cream">
      {/* Hero compact navy avec filigrane éditorial */}
      <section className="relative surface-navy pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        {/* Filigrane "§" éditorial luxury */}
        <span
          aria-hidden="true"
          className="absolute -top-12 left-1/2 -translate-x-1/2 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/12 text-[18rem] md:text-[22rem] leading-none pointer-events-none select-none"
        >
          §
        </span>

        <Container size="md" className="relative">
          <div className="text-center space-y-5">
            {eyebrow && (
              <p className="eyebrow text-[color:var(--color-taupe)] inline-flex items-center gap-3">
                <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
                {eyebrow}
                <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
              </p>
            )}
            <h1 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.04em] leading-[1.1]">
              {title}
            </h1>
            <div className="w-16 h-px bg-[color:var(--color-bronze)] mx-auto" />
            {lastUpdated && (
              <p className="eyebrow text-[color:var(--color-cream)]/60">
                {lastUpdated}
              </p>
            )}
          </div>
        </Container>

        {/* Signature line bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[color:var(--color-taupe)]" />
      </section>

      {/* Fleuron décoratif Cormorant entre hero et body */}
      <div className="flex items-center justify-center py-10 md:py-14 relative" aria-hidden="true">
        <div className="flex items-center gap-5">
          <span className="block w-16 md:w-24 h-px bg-[color:var(--color-taupe)]" />
          <span className="font-[var(--font-editorial)] italic text-[color:var(--color-bronze)] text-2xl">
            ❦
          </span>
          <span className="block w-16 md:w-24 h-px bg-[color:var(--color-taupe)]" />
        </div>
      </div>

      {/* Body — prose éditoriale */}
      <section className="pb-20 md:pb-24">
        <Container size="md">
          <div className="prose-legal max-w-3xl mx-auto space-y-8 text-[color:var(--color-navy-deep)]/90 text-base leading-[1.7]">
            {children}
          </div>
        </Container>
      </section>

      {/* Slot full-width pour CTAs en pied de page (ex: ToolsFinalCta) */}
      {afterContent}
    </main>
  );
}
