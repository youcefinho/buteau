import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { PageHero } from "@/components/landing/PageHero";
import { TeamGrid } from "@/components/landing/TeamGrid";
import { TeamMethod } from "@/components/landing/TeamMethod";
import { MediaShowcase } from "@/components/landing/MediaShowcase";
import { CtaBlock } from "@/components/landing/CtaBlock";
import { SchemaJsonLd, breadcrumbs, buildPerson } from "@/components/layout/SchemaJsonLd";
import { PageFooterMark } from "@/components/layout/PageFooterMark";
import { ta, translations } from "@/lib/translations";

export const Route = createFileRoute("/equipe")({
  component: TeamPage,
});

function TeamPage() {
  const { t, lang } = useLanguage();
  const members = ta<Array<{ name: string; role: string; photo: string; bio: string }>>(
    translations[lang],
    "team.members",
  );
  const teamSchemas = [breadcrumbs.team(lang), ...members.map(buildPerson)];

  return (
    <main id="main">
      <SchemaJsonLd schema={teamSchemas} />
      <PageHero
        eyebrow={t("team.hero.eyebrow")}
        title={t("team.hero.title")}
        subtitle={t("team.hero.subtitle")}
        ornament="II"
      />
      <TeamGrid />
      <TeamMethod />
      <MediaShowcase />
      <CtaBlock />
      <PageFooterMark numeral="II" label={lang === "fr" ? "Équipe" : "Team"} />
    </main>
  );
}
