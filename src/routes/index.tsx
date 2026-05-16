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
import { ChapterMarker } from "@/components/landing/ChapterMarker";
import { BrokerLetter } from "@/components/landing/BrokerLetter";
import { TerritoryMap } from "@/components/landing/TerritoryMap";
import { PreQualQuiz } from "@/components/landing/PreQualQuiz";
import { CalcMultiViewsButeau } from "@/components/landing/calculators/CalcMultiViewsButeau";
import { JournalPreview } from "@/components/landing/JournalPreview";
import { ValueTicker } from "@/components/landing/ValueTicker";
import { AdPage } from "@/components/landing/AdPage";
import { PageFooterMark } from "@/components/layout/PageFooterMark";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { SectionDivider } from "@/components/layout/SectionDivider";
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

  // Labels chapter markers selon langue
  const chapter2 = lang === "fr" ? "Notre équipe" : "Our team";
  const chapter3 = lang === "fr" ? "La preuve" : "Proof";

  return (
    <main id="main">
      <SchemaJsonLd schema={homeSchemas} />
      <Hero />
      <PageFooterMark numeral="01" label={lang === "fr" ? "Le réseau" : "The network"} />
      <Partners />

      {/* ValueTicker — bandeau scrolling éditorial avec faits vérifiés
          (200 familles, 9+ institutions, AMF, etc.). Effet "live data" sans invention. */}
      <ValueTicker />

      {/* Chapter II — annonce Team + Services + Mission */}
      <ChapterMarker numeral="02" label={chapter2} tone="light" />

      <ScrollReveal><TeamTeaser /></ScrollReveal>
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
          Insérée entre Mission corporate et BrokerLetter humaine — crée respiration
          + autorité. Une seule phrase Fraunces italic XL. */}
      <ScrollReveal><AdPage /></ScrollReveal>

      {/* « Le mot du courtier » — section authentique signature manuscrite (NOVEL) */}
      <ScrollReveal><BrokerLetter /></ScrollReveal>

      {/* SectionDivider — transition vers la qualification du lead */}
      <SectionDivider variant="ampersand" tone="light" />

      {/* Quiz pré-qualification 3Q tier-based — qualifie les leads + personalise CTA */}
      <ScrollReveal><PreQualQuiz /></ScrollReveal>

      {/* Chapter III — annonce témoignages + contact */}
      <ChapterMarker numeral="03" label={chapter3} tone="light" />

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
