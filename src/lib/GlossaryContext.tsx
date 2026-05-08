import { createContext, useCallback, useContext, useMemo, useState } from "react";

type GlossaryContextValue = {
  isOpen: boolean;
  selectedSlug: string | null;
  open: (slug?: string) => void;
  close: () => void;
};

const GlossaryContext = createContext<GlossaryContextValue | null>(null);

export function GlossaryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const open = useCallback((slug?: string) => {
    setSelectedSlug(slug ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedSlug(null);
  }, []);

  const value = useMemo<GlossaryContextValue>(
    () => ({ isOpen, selectedSlug, open, close }),
    [isOpen, selectedSlug, open, close],
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
