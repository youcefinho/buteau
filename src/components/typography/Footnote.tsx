import { type ReactNode, createContext, useContext, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Footnote / FootnoteScope — système de notes éditoriales numérotées.
 *
 * Pattern adapté au theme luxury minimal corporate Buteau :
 * - Numérotation auto (1, 2, 3…) per-scope
 * - Marker inline en exposant bronze, cliquable, ancre vers la note
 * - Liste de notes en pied de scope (filet taupe + numérotation italic Cormorant)
 * - Retour-back ↩ pour revenir au marker dans le texte
 *
 * Justifié pour Buteau : ton magazine luxury corporate qui parle de jargon
 * (APP, RAP, ratio ATD, Planiprêt, AMF) — les footnotes documentent
 * discrètement les claims légaux + crédibilisent le ton "magazine d'auteur".
 *
 * Usage :
 *   <FootnoteScope id="broker-letter">
 *     <p>200 familles accompagnées<Footnote n={1}>Donnée interne 2025, dossiers fermés</Footnote></p>
 *     <p>Inscrit auprès de l'AMF<Footnote n={2}>Cabinet Planiprêt, n° en pied de page</Footnote></p>
 *     <FootnoteList />
 *   </FootnoteScope>
 */

type Note = { n: number; content: ReactNode; id: string };

type ScopeContext = {
  scopeId: string;
  notes: React.MutableRefObject<Note[]>;
};

const FootnoteCtx = createContext<ScopeContext | null>(null);

export function FootnoteScope({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const notes = useRef<Note[]>([]);
  const value = useMemo(() => ({ scopeId: id, notes }), [id]);

  return (
    <FootnoteCtx.Provider value={value}>
      <div className={className}>{children}</div>
    </FootnoteCtx.Provider>
  );
}

/**
 * Footnote — marker inline (exposant bronze) qui ancre vers la note correspondante.
 * Le contenu de la note est enregistré dans le scope pour rendu par <FootnoteList />.
 */
export function Footnote({ n, children }: { n: number; children: ReactNode }) {
  const ctx = useContext(FootnoteCtx);

  if (ctx) {
    // Enregistrer la note (idempotent — si déjà présent même n, on remplace)
    const existing = ctx.notes.current.findIndex((x) => x.n === n);
    const note: Note = {
      n,
      content: children,
      id: `${ctx.scopeId}-note-${n}`,
    };
    if (existing >= 0) ctx.notes.current[existing] = note;
    else ctx.notes.current.push(note);
  }

  const id = ctx ? `${ctx.scopeId}-ref-${n}` : `note-ref-${n}`;
  const href = ctx ? `#${ctx.scopeId}-note-${n}` : `#note-${n}`;

  return (
    <sup
      className="inline-block align-super text-[0.65em] font-medium ml-0.5"
      id={id}
    >
      <a
        href={href}
        className="text-[color:var(--color-bronze)] hover:text-[color:var(--color-navy)] transition-colors no-underline"
        aria-label={`Voir note ${n}`}
      >
        [{n}]
      </a>
    </sup>
  );
}

/**
 * FootnoteList — rend la liste des notes enregistrées dans le scope courant.
 * À placer en bas du <FootnoteScope>. Filet taupe au-dessus + numérotation italic.
 */
export function FootnoteList({ title, className }: { title?: string; className?: string }) {
  const ctx = useContext(FootnoteCtx);
  if (!ctx) return null;

  // On lit la ref directement — les notes ont été enregistrées au render des markers
  const notes = ctx.notes.current.slice().sort((a, b) => a.n - b.n);
  if (notes.length === 0) return null;

  return (
    <aside
      className={cn(
        "mt-10 pt-6 border-t border-[color:var(--color-taupe)]/40",
        className,
      )}
      aria-label="Notes"
    >
      <ol className="space-y-2 text-sm leading-relaxed text-[color:var(--color-bronze)]">
        {notes.map((note) => (
          <li
            key={note.n}
            id={note.id}
            className="flex gap-3"
          >
            <span className="font-[family-name:var(--font-editorial)] italic text-[color:var(--color-bronze)] flex-shrink-0">
              {note.n}.
            </span>
            <span>
              {note.content}{" "}
              <a
                href={`#${ctx.scopeId}-ref-${note.n}`}
                className="text-[color:var(--color-bronze)] hover:text-[color:var(--color-navy)] transition-colors no-underline ml-1"
                aria-label={`Retour à la référence ${note.n}`}
              >
                ↩
              </a>
            </span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
