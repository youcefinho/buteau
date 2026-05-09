import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ColophonContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const ColophonContext = createContext<ColophonContextValue | null>(null);

export function ColophonProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<ColophonContextValue>(
    () => ({ isOpen, open, close }),
    [isOpen, open, close],
  );

  return <ColophonContext.Provider value={value}>{children}</ColophonContext.Provider>;
}

export function useColophon(): ColophonContextValue {
  const ctx = useContext(ColophonContext);
  if (!ctx) {
    throw new Error("useColophon doit être utilisé à l'intérieur de <ColophonProvider>");
  }
  return ctx;
}
