import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { PageHero } from "@/components/landing/PageHero";
import { HypothequeCalculator } from "@/components/landing/calculators/HypothequeCalculator";
import { GuidesGrid } from "@/components/landing/GuidesGrid";
import { TikTokTeaser } from "@/components/landing/TikTokTeaser";
import { BlogTeaser } from "@/components/landing/BlogTeaser";
import { DocumentsGrid } from "@/components/landing/DocumentsGrid";
import { ToolsFinalCta } from "@/components/landing/ToolsFinalCta";
import { SchemaJsonLd, breadcrumbs } from "@/components/layout/SchemaJsonLd";
import { PageFooterMark } from "@/components/layout/PageFooterMark";

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
        ornament="IV"
      />
      <HypothequeCalculator />
      <GuidesGrid />
      <TikTokTeaser />
      <BlogTeaser />
      <DocumentsGrid />
      <ToolsFinalCta />
      <PageFooterMark numeral="04" label={lang === "fr" ? "Outils" : "Tools"} />
    </main>
  );
}
