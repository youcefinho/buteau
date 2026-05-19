import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { PageHero } from "@/components/landing/PageHero";
import { InsuranceNote } from "@/components/landing/InsuranceNote";
import { LendersGrid } from "@/components/landing/LendersGrid";
import { InstitutionMissing } from "@/components/landing/InstitutionMissing";
import { CtaBlock } from "@/components/landing/CtaBlock";
import { SectionRail, type SectionEntry } from "@/components/layout/SectionRail";
import { SchemaJsonLd, breadcrumbs } from "@/components/layout/SchemaJsonLd";

export const Route = createFileRoute("/institutions")({
  component: InstitutionsPage,
});

const INSTITUTIONS_SECTIONS: ReadonlyArray<SectionEntry> = [
  { id: "hero", type: "main", label: { fr: "Institutions", en: "Institutions" } },
  { id: "assurance", type: "main", label: { fr: "Preuve d'assurance", en: "Insurance proof" } },
  { id: "preteurs", type: "main", label: { fr: "Liste des prêteurs", en: "Lenders list" } },
  { id: "autre-institution", type: "sub", label: { fr: "Autre institution ?", en: "Other institution?" } },
  { id: "contact-cta", type: "main", label: { fr: "Contact", en: "Contact" } },
];

function InstitutionsPage() {
  const { t, lang } = useLanguage();
  return (
    <main id="main">
      <SchemaJsonLd schema={breadcrumbs.institutions(lang)} />
      <SectionRail sections={INSTITUTIONS_SECTIONS} />
      <PageHero
        eyebrow={t("institutions.hero.eyebrow")}
        title={t("institutions.hero.title")}
        subtitle={t("institutions.hero.subtitle")}
        ornament="03"
      />
      <InsuranceNote />
      <LendersGrid />
      <InstitutionMissing />
      <CtaBlock />
    </main>
  );
}
