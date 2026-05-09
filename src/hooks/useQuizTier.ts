import { useCallback, useEffect, useRef, useState } from "react";

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

// Generate unique instance id pour exclure l'émetteur du listener (BLOCKER fix)
let instanceCounter = 0;

const isValidTier = (v: unknown): v is QuizTier =>
  v === "primo" || v === "refi" || v === "investor" || v === "explorer";

export function useQuizTier(): {
  tier: QuizTier | null;
  saveTier: (t: QuizTier) => void;
  clearTier: () => void;
} {
  // Instance ID unique par instance du hook — pour ignorer ses propres dispatches
  const instanceIdRef = useRef<string>("");
  if (instanceIdRef.current === "") {
    instanceCounter += 1;
    instanceIdRef.current = `tier-${instanceCounter}`;
  }

  const [tier, setTier] = useState<QuizTier | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isValidTier(stored) ? stored : null;
  });

  // Synchronise entre tabs/windows ouverts (storage event)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setTier(isValidTier(e.newValue) ? e.newValue : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const saveTier = useCallback((t: QuizTier) => {
    setTier(t);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, t);
      // Dispatch avec source = instance ID pour exclure l'émetteur (BLOCKER fix)
      window.dispatchEvent(
        new CustomEvent("buteau:tier-changed", { detail: { tier: t, source: instanceIdRef.current } }),
      );
    }
  }, []);

  const clearTier = useCallback(() => {
    setTier(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent("buteau:tier-changed", { detail: { tier: null, source: instanceIdRef.current } }),
      );
    }
  }, []);

  // Listener custom event — IGNORE si source === cet instance (anti-loop BLOCKER fix)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { tier: unknown; source: unknown } | null;
      if (!detail || typeof detail !== "object") return;
      // Skip si l'événement vient de cette instance (auto-notification anti-pattern)
      if (detail.source === instanceIdRef.current) return;
      // Validation runtime du tier
      if (detail.tier === null) {
        setTier(null);
      } else if (isValidTier(detail.tier)) {
        setTier(detail.tier);
      }
    };
    window.addEventListener("buteau:tier-changed", onChange);
    return () => window.removeEventListener("buteau:tier-changed", onChange);
  }, []);

  return { tier, saveTier, clearTier };
}
