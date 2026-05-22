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

  // v55 user 2026-05-22 : cross-page hash nav re-scroll polling avec auto-cancel.
  // v54 reglait le bug "1er click navbar avale" (replaceState racy retire).
  // v55 ajoute polling pour resoudre cross-page hash nav qui landait a 2230 au
  // lieu de 15605 (layout shift home sections lourdes / images lazy).
  // Polling re-scroll a chaque frame pendant ~1.5s, AUTO-CANCEL si user interagit
  // (wheel/touch/keydown/click hors hash anchor) -> evite rogue scroll.
  const { location } = useRouterState();
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    const cancel = () => { cancelled = true; };
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        const hash = window.location.hash.slice(1);
        if (!hash || !document.getElementById(hash)) {
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(0, { immediate: true });
          else window.scrollTo({ top: 0, behavior: "instant" });
          return;
        }
        window.addEventListener("wheel", cancel, { once: true, passive: true });
        window.addEventListener("touchstart", cancel, { once: true, passive: true });
        window.addEventListener("keydown", cancel, { once: true });
        const clickCancel = (e: MouseEvent) => {
          const a = (e.target as HTMLElement | null)?.closest?.<HTMLAnchorElement>("a");
          if (a && /^\/?#/.test(a.getAttribute("href") || "")) return;
          cancel();
        };
        window.addEventListener("click", clickCancel, { once: true });
        let attempts = 0;
        const tick = () => {
          if (cancelled || attempts++ > 90) return;
          if (document.getElementById(hash)) scrollToHash(hash);
          requestAnimationFrame(tick);
        };
        scrollToHash(hash);
        requestAnimationFrame(tick);
      });
    });
    return () => {
      cancelled = true;
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
    };
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
