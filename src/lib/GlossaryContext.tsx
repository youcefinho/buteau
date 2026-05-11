import { createContext, useCallback, useContext, useMemo, useState } from "react";

type GlossaryContextValue = {
  isOpen: boolean;
  /** Slug du terme cliqué — utilisé pour scroll auto vers le terme dans la modal. */
  selectedSlug: string | null;
  /** Query pré-remplie dans la search bar de la modal (label du terme cliqué). */
  initialQuery: string;
  /**
   * Ouvre la modal Glossary.
   * @param slug    slug du terme pour scroll auto (optionnel)
   * @param query   label du terme à pré-remplir dans la search bar (optionnel)
   */
  open: (slug?: string, query?: string) => void;
  close: () => void;
};

const GlossaryContext = createContext<GlossaryContextValue | null>(null);

export function GlossaryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [initialQuery, setInitialQuery] = useState<string>("");

  const open = useCallback((slug?: string, query?: string) => {
    setSelectedSlug(slug ?? null);
    setInitialQuery(query ?? "");
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedSlug(null);
    setInitialQuery("");
  }, []);

  const value = useMemo<GlossaryContextValue>(
    () => ({ isOpen, selectedSlug, initialQuery, open, close }),
    [isOpen, selectedSlug, initialQuery, open, close],
  );

  return <GlossaryContext.Provider value={value}>{children}</GlossaryContext.Provider>;
}

export function useGlossary(): GlossaryContextValue {
  const ctx = useContext(GlossaryContext);
  if (!ctx) {
    throw new Error("useGlossary doit être utilisé à l'intérieur de <GlossaryProvider>");
  }
  return ctx;
}
