import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { LanguageProvider } from "@/lib/LanguageContext";
import { GlossaryProvider } from "@/lib/GlossaryContext";
import { routeTree } from "./routeTree.gen";
// Fonts CHARTE Buteau (self-host Fontsource) — Raleway (display/logo) + Libre
// Franklin (corps/tagline, sosie libre de l'ITC Franklin Gothic de la charte).
// Refonte charte 2026-05-29 : remplace Montserrat/Open Sans/Cormorant/Fraunces.
import "@fontsource-variable/raleway/index.css";
import "@fontsource-variable/raleway/wght-italic.css";
import "@fontsource-variable/libre-franklin/index.css";
import "@fontsource-variable/libre-franklin/wght-italic.css";
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
