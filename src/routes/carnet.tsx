import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { CarnetContent } from "@/components/landing/CarnetContent";
import { SectionRail, type SectionEntry } from "@/components/layout/SectionRail";

// ═══════════════════════════════════════════════════════════
// /carnet — page SEO du Carnet de l'emprunteur Buteau.
// Pendant routable du modal Carnet (CarnetContent variant="page").
// Mots-clés : courtier hypothécaire Planiprêt, RAP CELIAPP, primo Québec,
// refinancement, consolidation dettes, OACIQ, AMF.
// ═══════════════════════════════════════════════════════════

export const Route = createFileRoute("/carnet")({
  component: CarnetPage,
});

const CARNET_SECTIONS: ReadonlyArray<SectionEntry> = [
  { id: "hero", type: "main", label: { fr: "Le carnet", en: "The address book" } },
  { id: "carnet-01", type: "main", label: { fr: "Notaires & actes", en: "Notaries & deeds" } },
  { id: "carnet-02", type: "main", label: { fr: "Subventions", en: "Grants" } },
  { id: "carnet-03", type: "sub", label: { fr: "Inspecteurs", en: "Inspectors" } },
  { id: "carnet-04", type: "sub", label: { fr: "Assurances", en: "Insurance" } },
  { id: "carnet-05", type: "sub", label: { fr: "Outils gouv.", en: "Gov. tools" } },
  { id: "carnet-06", type: "main", label: { fr: "Crédit & recours", en: "Credit & recourse" } },
];

function CarnetPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <>
      <SectionRail sections={CARNET_SECTIONS} />
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
    </>
  );
}
