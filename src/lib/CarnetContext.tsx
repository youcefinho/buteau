import { createContext, useCallback, useContext, useMemo, useState } from "react";

type CarnetContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CarnetContext = createContext<CarnetContextValue | null>(null);

export function CarnetProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CarnetContextValue>(
    () => ({ isOpen, open, close }),
    [isOpen, open, close],
  );

  return <CarnetContext.Provider value={value}>{children}</CarnetContext.Provider>;
}

export function useCarnet(): CarnetContextValue {
  const ctx = useContext(CarnetContext);
  if (!ctx) {
    throw new Error("useCarnet doit être utilisé à l'intérieur de <CarnetProvider>");
  }
  return ctx;
}
