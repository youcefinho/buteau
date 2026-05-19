import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { ColophonContent } from "@/components/landing/ColophonContent";
import { SectionRail, type SectionEntry } from "@/components/layout/SectionRail";

// ═══════════════════════════════════════════════════════════
// /colophon — page SEO du Colophon Buteau.
// Pendant routable du modal Colophon (ColophonContent variant="page").
// E-E-A-T : transparence totale méthode/standards/équipe.
// ═══════════════════════════════════════════════════════════

export const Route = createFileRoute("/colophon")({
  component: ColophonPage,
});

const COLOPHON_SECTIONS: ReadonlyArray<SectionEntry> = [
  { id: "hero", type: "main", label: { fr: "L'atelier", en: "The atelier" } },
  { id: "colophon-typo", type: "main", label: { fr: "Typographie", en: "Typography" } },
  { id: "colophon-palette", type: "main", label: { fr: "Palette", en: "Palette" } },
  { id: "colophon-principes", type: "main", label: { fr: "Principes", en: "Principles" } },
  { id: "colophon-direction", type: "sub", label: { fr: "Direction", en: "Editorial team" } },
  { id: "colophon-a11y", type: "sub", label: { fr: "Accessibilité", en: "Accessibility" } },
];

function ColophonPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <>
      <SectionRail sections={COLOPHON_SECTIONS} />
      <LegalPageWrap
        eyebrow={isFr ? "Mentions techniques" : "Technical credits"}
        title={isFr ? "L'atelier — méthode et standards" : "The atelier — method and standards"}
      >
        <ColophonContent variant="page" />
      </LegalPageWrap>
    </>
  );
}
