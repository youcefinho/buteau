import { useEffect, useRef } from "react";
import intralysLogo from "@/assets/intralys-fleurdelis.png";

// ═══════════════════════════════════════════════════════════
// IntralysWidget — widget flottant signature agence Intralys
// Reproduction fidele du widget roynakhal.com (CSS + comportement).
// - Etat collapsed : cercle 42px avec fleur-de-lis Quebec
// - Etat hover : pill 258px avec stripes + tagline + signature
// - Position : fixed bottom-left, A COTE du BackToTop (left:84px desktop)
// - Script : randomize URL vers /ecosysteme, /ecosysteme/{cat}, /technologie
//   + ref=clientId pour tracking attribution
// - Z-index : 40 (sous modals 50+, au-dessus contenu)
// ═══════════════════════════════════════════════════════════

type Props = {
  /** Slug client pour ref tracking (ex: "equipe-buteau"). */
  clientId: string;
  /** Categorie ecosysteme Intralys. */
  category?: "immobilier" | "hypothecaire" | "financier" | "services" | "local";
};

export function IntralysWidget({ clientId, category = "immobilier" }: Props) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Script roynakhal : randomize 3 variants URL + append ref=clientId
  useEffect(() => {
    if (!linkRef.current) return;
    const variants = [
      "/ecosysteme",
      `/ecosysteme/${category}`,
      "/technologie",
    ];
    const randomPath = variants[Math.floor(Math.random() * variants.length)];
    linkRef.current.href = `https://intralys.com${randomPath}?ref=${clientId}`;
  }, [clientId, category]);

  return (
    <div className="intralys-widget-container">
      <a
        ref={linkRef}
        target="_blank"
        rel="noopener sponsored"
        className="intralys-widget-link"
        aria-label="Site realise par Intralys - Decouvrez nos ecosystemes"
        href="https://intralys.com/"
      >
        <img
          src={intralysLogo}
          className="intralys-widget-logo"
          alt="Intralys"
          width={42}
          height={42}
          loading="lazy"
        />
        <div className="intralys-widget-content">
          <div className="intralys-widget-stripes">
            <div className="intralys-widget-stripe intralys-widget-s-orange" />
            <div className="intralys-widget-stripe intralys-widget-s-lblue" />
            <div className="intralys-widget-stripe intralys-widget-s-blue" />
            <div className="intralys-widget-stripe intralys-widget-s-black" />
          </div>
          <div className="intralys-widget-text">
            <span className="intralys-widget-sub">Création fièrement québécoise</span>
            <span className="intralys-widget-title">
              signée Intralys<span className="intralys-widget-dot" />
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
