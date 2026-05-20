import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { PageHero } from "@/components/landing/PageHero";
import { CalcMultiViewsButeau } from "@/components/landing/calculators/CalcMultiViewsButeau";
import { GuidesGrid } from "@/components/landing/GuidesGrid";
import { TikTokTeaser } from "@/components/landing/TikTokTeaser";
import { DocumentsGrid } from "@/components/landing/DocumentsGrid";
import { ToolsFinalCta } from "@/components/landing/ToolsFinalCta";
import { PageFooterMark } from "@/components/layout/PageFooterMark";
import { SectionRail, type SectionEntry } from "@/components/layout/SectionRail";
import { SchemaJsonLd, breadcrumbs } from "@/components/layout/SchemaJsonLd";

export const Route = createFileRoute("/outils")({
  component: ToolsPage,
});

const TOOLS_SECTIONS: ReadonlyArray<SectionEntry> = [
  { id: "hero", type: "main", label: { fr: "La boîte à outils", en: "The toolkit" } },
  { id: "calculateur", type: "main", label: { fr: "Calculateur", en: "Calculator" } },
  { id: "guides", type: "main", label: { fr: "Guides", en: "Guides" } },
  { id: "capsules", type: "sub", label: { fr: "Capsules", en: "Capsules" } },
  { id: "documents", type: "sub", label: { fr: "Documents", en: "Documents" } },
  { id: "contact-cta", type: "main", label: { fr: "Contact", en: "Contact" } },
];

function ToolsPage() {
  const { t, lang } = useLanguage();
  return (
    <main id="main">
      <SchemaJsonLd schema={breadcrumbs.tools(lang)} />
      <SectionRail sections={TOOLS_SECTIONS} />
      <PageHero
        eyebrow={t("tools.hero.eyebrow")}
        title={t("tools.hero.title")}
        subtitle={t("tools.hero.subtitle")}
        ornament="04"
      />
      <CalcMultiViewsButeau />
      <GuidesGrid />
      <TikTokTeaser />
      <DocumentsGrid />
      <ToolsFinalCta />
      <PageFooterMark />
    </main>
  );
}
