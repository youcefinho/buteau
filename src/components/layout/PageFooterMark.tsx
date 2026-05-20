import { Container } from "./Container";

/**
 * PageFooterMark — petite signature numérotée en pied de chaque page.
 *
 * Pourquoi NOVEL : pattern ChapterMarker miniature qui rappelle le numéro
 * de chapitre du magazine — discret mais cohérent. À placer juste avant
 * le Footer global.
 *
 * Numérotation cohérente :
 *   I    — Accueil
 *   II   — Équipe
 *   III  — Institutions
 *   IV   — Outils
 *   V    — Lexique
 *   VI   — Journal
 *   VII  — Courrier
 */
type PageFooterMarkProps = {
  numeral?: string; // Conserve pour backward compat — n'est plus affiche (user 2026-05-20 "plus epure").
  label: string;
};

export function PageFooterMark({ label }: PageFooterMarkProps) {
  return (
    <div className="surface-cream pt-12 pb-6 border-t border-[color:var(--color-taupe)]/30">
      <Container size="md">
        <div className="flex items-center justify-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
          <span className="block w-12 h-px bg-[color:var(--color-taupe)]" />
          <span className="eyebrow text-[color:var(--color-taupe-dark)]">
            {label}
          </span>
          <span className="block w-12 h-px bg-[color:var(--color-taupe)]" />
        </div>
      </Container>
    </div>
  );
}
