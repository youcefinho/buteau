import { useEffect } from "react";
import { Outlet, createRootRoute, useRouterState } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ScrollSideBronzeLine } from "@/components/atmosphere/ScrollSideBronzeLine";
import { SplashIntro } from "@/components/layout/SplashIntro";
import { TrackingPixels } from "@/components/landing/TrackingPixels";
import { GlossaryModal } from "@/components/landing/GlossaryModal";
import { ColophonModal } from "@/components/landing/ColophonModal";
import { CarnetModal } from "@/components/landing/CarnetModal";
import { ExitIntent } from "@/components/landing/ExitIntent";
import { NotFoundEditorial } from "@/components/landing/NotFoundEditorial";
import { PageTransition } from "@/components/layout/PageTransition";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { SmsButton } from "@/components/layout/SmsButton";
import { BackToTop } from "@/components/layout/BackToTop";
import { ColophonProvider } from "@/lib/ColophonContext";
import { CarnetProvider } from "@/lib/CarnetContext";
import { useLenis, getLenis, scrollToHash } from "@/hooks/useLenis";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <>
      <NotFoundEditorial />
    </>
  ),
});

function RootComponent() {
  useLenis();

  // v54 user 2026-05-22 : ANCIEN replaceState retiré (race avec Router pushState
  // -> nav 1er click avalee, user devait clicker 2 fois). Double rAF defer pour
  // laisser Router terminer + layout. Si nouvelle URL a hash valide -> scroll
  // vers cet element (resoud cross-page hash nav), sinon Lenis.scrollTo(0).
  const { location } = useRouterState();
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        const hash = window.location.hash.slice(1);
        if (hash && document.getElementById(hash)) {
          scrollToHash(hash);
          return;
        }
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(0, { immediate: true });
        else window.scrollTo({ top: 0, behavior: "instant" });
      });
    });
    return () => { cancelled = true; };
  }, [location.pathname]);

  return (
    <ColophonProvider>
      <CarnetProvider>
        <SplashIntro />
        <TrackingPixels />
        <SkipToContent />
        <ScrollProgress />
        <ScrollSideBronzeLine />
        <Navbar />
        <PageTransition>
          <Outlet />
        </PageTransition>
        <Footer />
        <CookieBanner />
        <GlossaryModal />
        <ColophonModal />
        <CarnetModal />
        <ExitIntent />
        <MobileStickyCta />
        <SmsButton />
        <BackToTop />
        <CustomCursor />
      </CarnetProvider>
    </ColophonProvider>
  );
}
