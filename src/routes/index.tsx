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
      <Partners />

      {/* Chapter II — annonce Team + Services + Mission */}
      <ChapterMarker numeral="II" label={chapter2} tone="light" />

      <TeamTeaser />
      <Services />
      <Mission />
      <ToolsTeaser />

      {/* Chapter III — annonce témoignages + contact */}
      <ChapterMarker numeral="III" label={chapter3} tone="light" />

      <Reviews />
      <ContactSection />
      <Faq />
    </main>
  );
}
