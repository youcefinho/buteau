import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { LanguageProvider } from "@/lib/LanguageContext";
import { GlossaryProvider } from "@/lib/GlossaryContext";
import { routeTree } from "./routeTree.gen";
// Fonts self-hosted via Fontsource (perf B.1) — elimine cross-origin
// fonts.googleapis.com + fonts.gstatic.com pour LCP -200-400ms.
import "@fontsource-variable/open-sans/index.css";
import "@fontsource-variable/montserrat/index.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "@fontsource-variable/fraunces/index.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "./index.css";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  // View Transitions API native — fade cinematic entre routes (Chrome 111+, Safari 18+).
  // Fallback : navigation standard sur browsers non-supportés (no-op gracieux).
  defaultViewTransition: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("#root introuvable dans index.html");
}

// Retire le splash HTML après MIN_LOADER_MS (masque le boot React ~2s sur
// chaque page load — parité avec Mathis/Serujan/EG).
const MIN_LOADER_MS = 3000;
const FADE_MS = 500;
setTimeout(() => {
  const loader = document.getElementById("app-loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), FADE_MS);
  }
}, MIN_LOADER_MS);

createRoot(rootEl).render(
  <StrictMode>
    <LanguageProvider>
      <GlossaryProvider>
        <RouterProvider router={router} />
      </GlossaryProvider>
    </LanguageProvider>
  </StrictMode>,
);
