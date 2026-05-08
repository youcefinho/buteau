import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { LanguageProvider } from "@/lib/LanguageContext";
import { GlossaryProvider } from "@/lib/GlossaryContext";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
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

createRoot(rootEl).render(
  <StrictMode>
    <LanguageProvider>
      <GlossaryProvider>
        <RouterProvider router={router} />
      </GlossaryProvider>
    </LanguageProvider>
  </StrictMode>,
);
