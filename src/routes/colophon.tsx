import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { ColophonContent } from "@/components/landing/ColophonContent";

// ═══════════════════════════════════════════════════════════
// /colophon — page SEO du Colophon Buteau.
// Pendant routable du modal Colophon (ColophonContent variant="page").
// E-E-A-T : transparence totale méthode/standards/équipe.
// ═══════════════════════════════════════════════════════════

export const Route = createFileRoute("/colophon")({
  component: ColophonPage,
});

function ColophonPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <LegalPageWrap
      eyebrow={isFr ? "Mentions techniques" : "Technical credits"}
      title={isFr ? "L'atelier — méthode et standards" : "The atelier — method and standards"}
      lastUpdated={
        isFr
          ? "Volume I — Édition N° 01 · Quebec MMXXVI"
          : "Volume I — Edition Nº 01 · Quebec MMXXVI"
      }
    >
      <ColophonContent variant="page" />
    </LegalPageWrap>
  );
}
