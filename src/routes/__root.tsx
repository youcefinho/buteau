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
import { useLenis, scrollToHash } from "@/hooks/useLenis";

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

  // v52 user 2026-05-21 : cross-page hash nav (ex: /journal/X → /#contact)
  // utilise scrollToHash helper (sync Lenis + offset navbar + fallback mobile).
  // Retry rapide (50ms × 20 = max 1s) pour laisser sections mounter avant scroll.
  // Si pas de hash → strip + scroll top (comportement classique route change).
  const { location } = useRouterState();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace(/^#/, '');
      let timerId = 0;
      let attempts = 0;
      const tryScroll = () => {
        attempts++;
        if (document.getElementById(id)) {
          scrollToHash(id);
          return;
        }
        if (attempts < 20) {
          timerId = window.setTimeout(tryScroll, 50);
        } else {
          // Target jamais trouve → strip + top
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      };
      tryScroll();
      return () => { if (timerId) window.clearTimeout(timerId); };
    }
    window.scrollTo({ top: 0, behavior: "instant" });
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
