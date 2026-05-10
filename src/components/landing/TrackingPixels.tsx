import { useEffect } from "react";
import { config } from "@/lib/config";

/**
 * TrackingPixels — Meta Pixel + GA4 + Microsoft Clarity + Google Ads.
 *
 * IMPORTANT (Loi 25 art. 23 + RGPD-equivalent canadien) :
 * - Consent Mode v2 par défaut : TOUS DENIED. Les pixels chargent en mode "consent denied"
 *   tant que le user n'a pas accepté via le CookieBanner (Phase 8).
 * - Aucun pixel ne charge si l'ID de config correspondant est vide (no-op total).
 * - Les pixels sont chargés UNE SEULE FOIS au mount (effect avec [] deps).
 *
 * Cf. skill `intralys-tracking` pour la doctrine complète + skill `intralys-consent-loi25`
 * pour le consent UI.
 */
export function TrackingPixels() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const { ga4, metaPixel, clarity, googleAds } = config.tracking;

    // === Consent Mode v2 — toujours initialisé en DEFAULT DENIED ===
    // À déclencher AVANT tout pixel pour que GA4/Ads l'utilise.
    // window.gtag est ajouté par GTM/GA4 — on le shim ici si besoin.
    const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
    w.dataLayer = w.dataLayer || [];
    if (!w.gtag) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      w.gtag = function gtag(...args: unknown[]) {
        (w.dataLayer as unknown[]).push(args);
      };
    }

    w.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted", // toujours granted (security baseline)
      wait_for_update: 500, // attend 500ms avant de fire (donne au CookieBanner le temps de set le consent)
    });

    // Heavy pixel script injections deferred a requestIdleCallback :
    // - LCP/INP win : main thread libre pendant first paint
    // - Consent Mode v2 deja set ci-dessus, donc les pixels respectent le state
    //   quand ils fire (DENIED par defaut → no PII tracking jusqu'a consent)
    const injectAllPixels = () => {
      // === GA4 ===
      if (ga4) {
        injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4)}`, {
          async: true,
        });
        w.gtag!("js", new Date());
        w.gtag!("config", ga4, { anonymize_ip: true });
      }

      // === Google Ads ===
      if (googleAds) {
        if (!ga4) {
          injectScript(
            `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAds)}`,
            { async: true },
          );
          w.gtag!("js", new Date());
        }
        w.gtag!("config", googleAds);
      }

      // === Meta Pixel ===
      if (metaPixel) {
        injectMetaPixel(metaPixel);
      }

      // === Microsoft Clarity ===
      if (clarity) {
        injectClarity(clarity);
      }
    };

    type IdleWin = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    const idleWin = window as IdleWin;
    if (typeof idleWin.requestIdleCallback === "function") {
      idleWin.requestIdleCallback(injectAllPixels, { timeout: 3000 });
    } else {
      // Safari < 17.2 : fallback setTimeout
      setTimeout(injectAllPixels, 1500);
    }
  }, []);

  return null;
}

function injectScript(src: string, opts: { async?: boolean; defer?: boolean } = {}) {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return;
  const s = document.createElement("script");
  s.src = src;
  if (opts.async) s.async = true;
  if (opts.defer) s.defer = true;
  document.head.appendChild(s);
}

function injectMetaPixel(pixelId: string) {
  // Meta Pixel snippet officiel + init.
  // ID format : 16 chiffres (ex: "1234567890123456").
  // Audit ME-01 fix : on retire le noscript fallback car (a) place dans <head> il est
  // invalide HTML5, (b) en SPA il fire systematiquement = double event PageView.
  // Le user a forcement JS active (sinon le SPA ne fonctionne pas du tout).
  if (document.getElementById("fb-pixel")) return;

  const s = document.createElement("script");
  s.id = "fb-pixel";
  s.text = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId.replace(/[^0-9]/g, "")}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(s);
}

function injectClarity(projectId: string) {
  if (document.getElementById("ms-clarity")) return;

  const s = document.createElement("script");
  s.id = "ms-clarity";
  s.text = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${projectId.replace(/[^a-zA-Z0-9]/g, "")}");
  `;
  document.head.appendChild(s);
}
