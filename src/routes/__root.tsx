import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SplashIntro } from "@/components/layout/SplashIntro";
import { TrackingPixels } from "@/components/landing/TrackingPixels";
import { GlossaryModal } from "@/components/landing/GlossaryModal";
import { NotFoundEditorial } from "@/components/landing/NotFoundEditorial";
import { PageTransition } from "@/components/layout/PageTransition";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <>
      <NotFoundEditorial />
    </>
  ),
});

function RootComponent() {
  return (
    <>
      <SplashIntro />
      <TrackingPixels />
      <SkipToContent />
      <ScrollProgress />
      <Navbar />
      <PageTransition>
        <Outlet />
      </PageTransition>
      <Footer />
      <CookieBanner />
      <GlossaryModal />
      <CustomCursor />
    </>
  );
}
