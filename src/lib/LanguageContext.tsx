import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/translations";
import { translations } from "@/lib/translations";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: <T = string>(path: string) => T;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "buteau:lang";

function detectInitialLang(): Lang {
  // FR par défaut au load (Charte loi 96 Quebec).
  if (typeof window === "undefined") return "fr";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "fr") return stored;
  return "fr";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang());

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute("lang", lang === "fr" ? "fr-CA" : "en-CA");
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggle = useCallback(() => setLangState((prev) => (prev === "fr" ? "en" : "fr")), []);

  const t = useCallback(
    <T = string,>(path: string): T => {
      const parts = path.split(".");
      let acc: unknown = translations[lang];
      for (const p of parts) {
        if (acc && typeof acc === "object" && p in (acc as Record<string, unknown>)) {
          acc = (acc as Record<string, unknown>)[p];
        } else {
          // En dev : afficher la clé manquante pour faciliter le debug.
          if (import.meta.env.DEV) {
            console.warn(`[i18n] missing key: ${path} (lang=${lang})`);
          }
          return path as unknown as T;
        }
      }
      return acc as T;
    },
    [lang],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, toggle, t }),
    [lang, setLang, toggle, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage doit être utilisé à l'intérieur de <LanguageProvider>");
  }
  return ctx;
}
