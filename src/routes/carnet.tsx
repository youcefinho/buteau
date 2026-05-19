import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { CarnetContent } from "@/components/landing/CarnetContent";

// ═══════════════════════════════════════════════════════════
// /carnet — page SEO du Carnet de l'emprunteur Buteau.
// Pendant routable du modal Carnet (CarnetContent variant="page").
// Mots-clés : courtier hypothécaire Planiprêt, RAP CELIAPP, primo Québec,
// refinancement, consolidation dettes, OACIQ, AMF.
// ═══════════════════════════════════════════════════════════

export const Route = createFileRoute("/carnet")({
  component: CarnetPage,
});

function CarnetPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <LegalPageWrap
      eyebrow={isFr ? "Service éditorial" : "Editorial service"}
      title={isFr ? "Le carnet de l'emprunteur" : "The borrower's address book"}
      lastUpdated={
        isFr
          ? "Ressources hypothécaires officielles"
          : "Official mortgage resources"
      }
    >
      <CarnetContent variant="page" />
    </LegalPageWrap>
  );
}
