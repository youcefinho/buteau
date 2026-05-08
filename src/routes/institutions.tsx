import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { PageHero } from "@/components/landing/PageHero";
import { InsuranceNote } from "@/components/landing/InsuranceNote";
import { LendersGrid } from "@/components/landing/LendersGrid";
import { InstitutionMissing } from "@/components/landing/InstitutionMissing";
import { CtaBlock } from "@/components/landing/CtaBlock";
import { SchemaJsonLd, breadcrumbs } from "@/components/layout/SchemaJsonLd";

export const Route = createFileRoute("/institutions")({
  component: InstitutionsPage,
});

function InstitutionsPage() {
  const { t, lang } = useLanguage();
  return (
    <main id="main">
      <SchemaJsonLd schema={breadcrumbs.institutions(lang)} />
      <PageHero
        eyebrow={t("institutions.hero.eyebrow")}
        title={t("institutions.hero.title")}
        subtitle={t("institutions.hero.subtitle")}
        ornament="III"
      />
      <InsuranceNote />
      <LendersGrid />
      <InstitutionMissing />
      <CtaBlock />
    </main>
  );
}
