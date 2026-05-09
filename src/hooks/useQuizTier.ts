import { useCallback, useEffect, useState } from "react";

/**
 * useQuizTier — hook qui persiste le tier du quiz pré-qualification dans localStorage
 * et permet aux composants partout dans l'app de personnaliser leur CTA / contenu
 * selon le profil de l'utilisateur.
 *
 * 4 tiers : primo / refi / investor / explorer
 *
 * Pourquoi NOVEL : aucun courtier hypothécaire concurrent n'a un site qui se
 * personnalise après un quiz. Chaque utilisateur voit un site "ajusté" à son
 * profil — Hero CTA, Calculator CTA, ContactForm context, etc. changent.
 */

export type QuizTier = "primo" | "refi" | "investor" | "explorer";

const STORAGE_KEY = "buteau:quiz-tier";

export function useQuizTier(): {
  tier: QuizTier | null;
  saveTier: (t: QuizTier) => void;
  clearTier: () => void;
} {
  const [tier, setTier] = useState<QuizTier | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "primo" || stored === "refi" || stored === "investor" || stored === "explorer") {
      return stored;
    }
    return null;
  });

  // Synchronise entre tabs/windows ouverts
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const v = e.newValue;
      if (v === "primo" || v === "refi" || v === "investor" || v === "explorer") {
        setTier(v);
      } else {
        setTier(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const saveTier = useCallback((t: QuizTier) => {
    setTier(t);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, t);
      // Custom event pour synchroniser les composants dans le même tab
      window.dispatchEvent(new CustomEvent("buteau:tier-changed", { detail: t }));
    }
  }, []);

  const clearTier = useCallback(() => {
    setTier(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("buteau:tier-changed", { detail: null }));
    }
  }, []);

  // Listener pour le custom event (changement dans le même tab)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setTier(detail);
    };
    window.addEventListener("buteau:tier-changed", onChange);
    return () => window.removeEventListener("buteau:tier-changed", onChange);
  }, []);

  return { tier, saveTier, clearTier };
}
