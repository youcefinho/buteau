import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { Partners } from "@/components/landing/Partners";
import { TeamTeaser } from "@/components/landing/TeamTeaser";
import { Services } from "@/components/landing/Services";
import { Mission } from "@/components/landing/Mission";
import { ToolsTeaser } from "@/components/landing/ToolsTeaser";
import { Reviews } from "@/components/landing/Reviews";
import { ContactSection } from "@/components/landing/ContactSection";
import { Faq } from "@/components/landing/Faq";
import { BrokerLetter } from "@/components/landing/BrokerLetter";
import { TerritoryMap } from "@/components/landing/TerritoryMap";
import { PreQualQuiz } from "@/components/landing/PreQualQuiz";
import { CalcMultiViewsButeau } from "@/components/landing/calculators/CalcMultiViewsButeau";
import { JournalPreview } from "@/components/landing/JournalPreview";
import { ValueTicker } from "@/components/landing/ValueTicker";
import { AdPage } from "@/components/landing/AdPage";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { SectionDivider } from "@/components/layout/SectionDivider";
import { SectionRail, HOME_SECTIONS } from "@/components/layout/SectionRail";
import {
  SchemaJsonLd,
  buildFaqPage,
  buildServices,
} from "@/components/layout/SchemaJsonLd";
import { useLanguage } from "@/lib/LanguageContext";
import { ta, translations } from "@/lib/translations";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { lang } = useLanguage();
  const faqItems = ta<Array<{ q: string; a: string }>>(translations[lang], "home.faq.items");
  const serviceItems = ta<Array<{ title: string; desc: string }>>(
    translations[lang],
    "home.services.items",
  );

  // Schema.org @graph pour l'Accueil — FAQPage + 4 Service entities.
  const homeSchemas = [buildFaqPage(faqItems), ...buildServices(serviceItems, lang)];

  return (
    <main id="main">
      <SchemaJsonLd schema={homeSchemas} />
      <SectionRail sections={HOME_SECTIONS} />
      <Hero />
      <Partners />

      {/* ValueTicker — bandeau scrolling éditorial avec faits vérifiés
          (200 familles, 9+ institutions, AMF, etc.). Effet "live data" sans invention. */}
      <ValueTicker />

      <ScrollReveal><TeamTeaser /></ScrollReveal>

      {/* « Le mot du courtier » — section authentique signature manuscrite (NOVEL).
          Deplacee 2026-05-20 entre TeamTeaser et Services (user : flow editorial
          presentation equipe -> mot du leader -> ce qu'on fait). */}
      <ScrollReveal><BrokerLetter /></ScrollReveal>

      <ScrollReveal><Services /></ScrollReveal>

      {/* Calculator Preview — accès direct aux outils sur l'Accueil
          (feedback user : Outils était trop enterré). Mini calc interactif
          + CTA vers /outils pour la version complète. */}
      <ScrollReveal><CalcMultiViewsButeau mode="preview" /></ScrollReveal>

      {/* JournalPreview — feature article du journal sur navy bg.
          Card grande format magazine, cliquable vers /journal/$slug. */}
      <ScrollReveal><JournalPreview /></ScrollReveal>

      <ScrollReveal><ToolsTeaser /></ScrollReveal>

      <ScrollReveal><Mission /></ScrollReveal>

      {/* SectionDivider — respiration éditoriale entre Mission corporate et AdPage */}
      <SectionDivider variant="fleuron" tone="light" />

      {/* AdPage — pleine page édito style "publicité magazine luxe" (Cereal vol.18).
          Une seule phrase Fraunces italic XL. Cree respiration entre Mission
          corporate et la qualification du lead (Quiz). */}
      <ScrollReveal><AdPage /></ScrollReveal>

      {/* SectionDivider — transition vers la qualification du lead */}
      <SectionDivider variant="ampersand" tone="light" />

      {/* Quiz pré-qualification 3Q tier-based — qualifie les leads + personalise CTA */}
      <ScrollReveal><PreQualQuiz /></ScrollReveal>

      <ScrollReveal><Reviews /></ScrollReveal>

      {/* SectionDivider — respiration entre la preuve sociale et le territoire */}
      <SectionDivider variant="fleuron" tone="light" />

      {/* Territoire desservi — heatmap stylisé QC interactif (NOVEL) */}
      <ScrollReveal><TerritoryMap /></ScrollReveal>

      <ScrollReveal><ContactSection /></ScrollReveal>
      <ScrollReveal><Faq /></ScrollReveal>
    </main>
  );
}
