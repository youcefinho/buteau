import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { TrackingPixels } from "@/components/landing/TrackingPixels";
import { GlossaryModal } from "@/components/landing/GlossaryModal";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <TrackingPixels />
      <SkipToContent />
      <ScrollProgress />
      <Navbar />
      <Outlet />
      <Footer />
      <CookieBanner />
      <GlossaryModal />
      <CustomCursor />
    </>
  );
}
