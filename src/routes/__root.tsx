import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { TrackingPixels } from "@/components/landing/TrackingPixels";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <TrackingPixels />
      <SkipToContent />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
