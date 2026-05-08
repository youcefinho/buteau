import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { PageHero } from "@/components/landing/PageHero";
import { InsuranceNote } from "@/components/landing/InsuranceNote";
import { LendersGrid } from "@/components/landing/LendersGrid";
import { InstitutionMissing } from "@/components/landing/InstitutionMissing";
import { CtaBlock } from "@/components/landing/CtaBlock";

export const Route = createFileRoute("/institutions")({
  component: InstitutionsPage,
});

function InstitutionsPage() {
  const { t } = useLanguage();
  return (
    <main id="main">
      <PageHero
        eyebrow={t("institutions.hero.eyebrow")}
        title={t("institutions.hero.title")}
        subtitle={t("institutions.hero.subtitle")}
      />
      <InsuranceNote />
      <LendersGrid />
      <InstitutionMissing />
      <CtaBlock />
    </main>
  );
}
