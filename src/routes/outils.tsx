import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { PageHero } from "@/components/landing/PageHero";
import { CalcMultiViewsButeau } from "@/components/landing/calculators/CalcMultiViewsButeau";
import { GuidesGrid } from "@/components/landing/GuidesGrid";
import { TikTokTeaser } from "@/components/landing/TikTokTeaser";
import { DocumentsGrid } from "@/components/landing/DocumentsGrid";
import { ToolsFinalCta } from "@/components/landing/ToolsFinalCta";
import { SchemaJsonLd, breadcrumbs } from "@/components/layout/SchemaJsonLd";

export const Route = createFileRoute("/outils")({
  component: ToolsPage,
});

function ToolsPage() {
  const { t, lang } = useLanguage();
  return (
    <main id="main">
      <SchemaJsonLd schema={breadcrumbs.tools(lang)} />
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
    </main>
  );
}
