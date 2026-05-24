import type { ReactNode } from "react";
import { Container } from "./Container";
import { ButeauMonogramInline } from "@/components/atmosphere/ButeauMonogramInline";

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
      <section id="hero" className="relative surface-navy pt-[clamp(8rem,12vw,10rem)] pb-[clamp(4rem,6vw,5rem)] overflow-hidden">
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
            <h1 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-[clamp(1.875rem,4vw,3rem)] uppercase tracking-[0.04em] leading-[1.1] text-balance">
              {title}
            </h1>
            <div className="w-16 h-px bg-[color:var(--color-taupe-dark)] mx-auto" />
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

      {/* Monogramme B Buteau decoratif entre hero et body (remplace ancien ❦ 2026-05-20).
          Style mini par souci d'integration discrete (pas un divider hero proeminent). */}
      <div className="flex items-center justify-center py-[clamp(2.5rem,4vw,3.5rem)] relative" aria-hidden="true">
        <div className="flex items-center gap-5">
          <span className="block w-[clamp(4rem,8vw,6rem)] h-px bg-[color:var(--color-taupe)]" />
          <span className="text-[color:var(--color-navy-deep)] inline-flex items-center text-2xl">
            <ButeauMonogramInline size="lg" />
          </span>
          <span className="block w-[clamp(4rem,8vw,6rem)] h-px bg-[color:var(--color-taupe)]" />
        </div>
      </div>

      {/* Body — prose éditoriale */}
      <section className="pb-[clamp(5rem,7vw,6rem)]">
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
