import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      {/* Skip-to-content (a11y WCAG 2.4.1) — sera implémenté Phase 2 */}
      <Outlet />
    </>
  );
}
