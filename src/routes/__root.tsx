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
import { useLenis, getLenis } from "@/hooks/useLenis";

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

  // Scroll handling on route change. v2 Buteau 2026-05-21 (port EGSF v48) :
  // deps [pathname] uniquement. Hash branch reste pour CROSS-PAGE nav
  // (pathname change avec hash present, ex: /journal/X → /#contact).
  // Same-page hash nav (Navbar items) gere par useLenis intercept.
  // Sans lock+force (causait fight Lenis avec SectionRail).
  const { location } = useRouterState();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace(/^#/, '');
      const timer = window.setTimeout(() => {
        const el = document.getElementById(id);
        if (!el) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          window.scrollTo({ top: 0, behavior: "instant" });
          return;
        }
        const nav = document.querySelector('nav') as HTMLElement | null;
        const navHeight = nav?.getBoundingClientRect().height ?? 100;
        let top = 0;
        let current: HTMLElement | null = el;
        while (current) {
          top += current.offsetTop;
          current = current.offsetParent as HTMLElement | null;
        }
        const target = top - navHeight - 24;
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(target, { immediate: true });
        } else {
          window.scrollTo({ top: target, behavior: "instant" });
        }
      }, 1500);
      return () => window.clearTimeout(timer);
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
