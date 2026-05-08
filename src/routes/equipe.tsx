import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { PageHero } from "@/components/landing/PageHero";
import { TeamGrid } from "@/components/landing/TeamGrid";
import { TeamMethod } from "@/components/landing/TeamMethod";
import { CtaBlock } from "@/components/landing/CtaBlock";

export const Route = createFileRoute("/equipe")({
  component: TeamPage,
});

function TeamPage() {
  const { t } = useLanguage();
  return (
    <main id="main">
      <PageHero
        eyebrow={t("team.hero.eyebrow")}
        title={t("team.hero.title")}
        subtitle={t("team.hero.subtitle")}
      />
      <TeamGrid />
      <TeamMethod />
      <CtaBlock />
    </main>
  );
}
