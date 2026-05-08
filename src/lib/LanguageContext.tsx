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
      const resolve = (dict: unknown): unknown => {
        const parts = path.split(".");
        let acc: unknown = dict;
        for (const p of parts) {
          if (acc && typeof acc === "object" && p in (acc as Record<string, unknown>)) {
            acc = (acc as Record<string, unknown>)[p];
          } else {
            return undefined;
          }
        }
        return acc;
      };

      const primary = resolve(translations[lang]);
      if (primary !== undefined) return primary as T;

      // Audit ME-06 fix : fallback sur FR si la cle manque dans la langue active
      // (au lieu de retourner le path string en clair pour l'utilisateur).
      if (lang !== "fr") {
        const fallback = resolve(translations.fr);
        if (fallback !== undefined) {
          if (import.meta.env.DEV) {
            console.warn(`[i18n] missing en key, fallback to fr: ${path}`);
          }
          return fallback as T;
        }
      }

      // En dev : afficher la clé totalement manquante pour faciliter le debug.
      if (import.meta.env.DEV) {
        console.warn(`[i18n] missing key (no fallback): ${path} (lang=${lang})`);
      }
      // En prod : retourner le path en clair reste le meilleur fallback (visible mais pas catastrophique).
      return path as unknown as T;
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
