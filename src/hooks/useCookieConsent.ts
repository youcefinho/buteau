import { useCallback, useEffect, useState } from "react";

/**
 * Hook de gestion du consentement cookies — Loi 25 Quebec art. 23.
 *
 * État persisté dans localStorage. Update Consent Mode v2 (gtag) à chaque change.
 *
 * Boutons d'égale visibilité (Loi 25 art. 23) :
 * - Accepter tout  → analytics + ad + functionality + personalization GRANTED
 * - Refuser tout   → tous DENIED (default)
 * - Personnaliser  → granular toggles (futur — Phase 9 si besoin)
 *
 * Cf. skill `intralys-consent-loi25` + `intralys-tracking`.
 */

export type ConsentState = {
  necessary: true;        // toujours true (cookies fonctionnels)
  analytics: boolean;     // GA4 / Clarity
  marketing: boolean;     // Meta Pixel / Google Ads
  decided: boolean;       // true une fois choix fait (cache la banner)
  decidedAt: string | null;
};

const STORAGE_KEY = "buteau:cookie-consent";

const DEFAULT_STATE: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  decided: false,
  decidedAt: null,
};

function loadFromStorage(): ConsentState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      necessary: true,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      decided: !!parsed.decided,
      decidedAt: parsed.decidedAt ?? null,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveToStorage(state: ConsentState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage quota exceeded — rare, on ignore
  }
}

function updateConsentMode(state: ConsentState): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return;

  w.gtag("consent", "update", {
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
    analytics_storage: state.analytics ? "granted" : "denied",
    functionality_storage: state.necessary ? "granted" : "denied",
    personalization_storage: state.analytics ? "granted" : "denied",
    security_storage: "granted",
  });
}

export function useCookieConsent() {
  const [state, setState] = useState<ConsentState>(() => loadFromStorage());

  // Fix HIGH : mount-only. acceptAll/refuseAll/updateGranular appellent déjà
  // updateConsentMode synchronously — pas besoin de re-fire à chaque [state] change.
  // Cet effet sert UNIQUEMENT à propager le consent stocké au premier mount.
  useEffect(() => {
    if (state.decided) {
      updateConsentMode(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptAll = useCallback(() => {
    const next: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
      decided: true,
      decidedAt: new Date().toISOString(),
    };
    saveToStorage(next);
    updateConsentMode(next);
    setState(next);
  }, []);

  const refuseAll = useCallback(() => {
    const next: ConsentState = {
      necessary: true,
      analytics: false,
      marketing: false,
      decided: true,
      decidedAt: new Date().toISOString(),
    };
    saveToStorage(next);
    updateConsentMode(next);
    setState(next);
  }, []);

  const updateGranular = useCallback(
    (changes: Partial<Pick<ConsentState, "analytics" | "marketing">>) => {
      const next: ConsentState = {
        ...state,
        ...changes,
        decided: true,
        decidedAt: new Date().toISOString(),
      };
      saveToStorage(next);
      updateConsentMode(next);
      setState(next);
    },
    [state],
  );

  // Pour reset (debug ou bouton "Modifier mes préférences" en footer)
  const reset = useCallback(() => {
    saveToStorage(DEFAULT_STATE);
    setState(DEFAULT_STATE);
  }, []);

  return {
    state,
    acceptAll,
    refuseAll,
    updateGranular,
    reset,
    showBanner: !state.decided,
  };
}
