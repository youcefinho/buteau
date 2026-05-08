import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { PageHero } from "@/components/landing/PageHero";
import { HypothequeCalculator } from "@/components/landing/calculators/HypothequeCalculator";
import { GuidesGrid } from "@/components/landing/GuidesGrid";
import { TikTokTeaser } from "@/components/landing/TikTokTeaser";
import { BlogTeaser } from "@/components/landing/BlogTeaser";
import { DocumentsGrid } from "@/components/landing/DocumentsGrid";
import { ToolsFinalCta } from "@/components/landing/ToolsFinalCta";

export const Route = createFileRoute("/outils")({
  component: ToolsPage,
});

function ToolsPage() {
  const { t } = useLanguage();
  return (
    <main id="main">
      <PageHero
        eyebrow={t("tools.hero.eyebrow")}
        title={t("tools.hero.title")}
        subtitle={t("tools.hero.subtitle")}
      />
      <HypothequeCalculator />
      <GuidesGrid />
      <TikTokTeaser />
      <BlogTeaser />
      <DocumentsGrid />
      <ToolsFinalCta />
    </main>
  );
}
