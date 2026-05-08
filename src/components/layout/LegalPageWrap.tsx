import type { ReactNode } from "react";
import { Container } from "./Container";

/**
 * Wrapper layout pour les pages légales (mentions / confidentialité / lexique).
 * Hero compact + container réservé + typographie éditoriale légale.
 */
export function LegalPageWrap({
  eyebrow,
  title,
  lastUpdated,
  children,
}: {
  eyebrow?: string;
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}) {
  return (
    <main id="main" className="surface-cream">
      {/* Hero compact navy */}
      <section className="surface-navy pt-32 pb-14 md:pt-40 md:pb-16">
        <Container size="md">
          <div className="text-center space-y-4">
            {eyebrow && (
              <p className="eyebrow text-[color:var(--color-taupe)]">{eyebrow}</p>
            )}
            <h1 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.04em] leading-[1.1]">
              {title}
            </h1>
            <div className="w-16 h-0.5 bg-[color:var(--color-taupe)] mx-auto" />
            {lastUpdated && (
              <p className="eyebrow text-[color:var(--color-cream)]/60">
                {lastUpdated}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Body — prose éditoriale */}
      <section className="py-16 md:py-20">
        <Container size="md">
          <div className="prose-legal max-w-3xl mx-auto space-y-8 text-[color:var(--color-navy-deep)]/90 text-base leading-relaxed">
            {children}
          </div>
        </Container>
      </section>
    </main>
  );
}
