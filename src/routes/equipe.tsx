import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { PageHero } from "@/components/landing/PageHero";
import { TeamGrid } from "@/components/landing/TeamGrid";
import { TeamMethod } from "@/components/landing/TeamMethod";
import { MediaShowcase } from "@/components/landing/MediaShowcase";
import { CtaBlock } from "@/components/landing/CtaBlock";
import { SectionRail, type SectionEntry } from "@/components/layout/SectionRail";
import { SchemaJsonLd, breadcrumbs, buildPerson } from "@/components/layout/SchemaJsonLd";
import { ta, translations } from "@/lib/translations";

export const Route = createFileRoute("/equipe")({
  component: TeamPage,
});

const TEAM_SECTIONS: ReadonlyArray<SectionEntry> = [
  { id: "hero", type: "main", label: { fr: "L'équipe", en: "The team" } },
  { id: "membres", type: "main", label: { fr: "Les membres", en: "Members" } },
  { id: "methode", type: "main", label: { fr: "Notre méthode", en: "Our method" } },
  { id: "media", type: "sub", label: { fr: "Médias", en: "Media" } },
  { id: "contact-cta", type: "main", label: { fr: "Contact", en: "Contact" } },
];

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
      <SectionRail sections={TEAM_SECTIONS} />
      <PageHero
        eyebrow={t("team.hero.eyebrow")}
        title={t("team.hero.title")}
        subtitle={t("team.hero.subtitle")}
        ornament="02"
      />
      <TeamGrid />
      <TeamMethod />
      <MediaShowcase />
      <CtaBlock />
    </main>
  );
}
