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

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main id="main">
      <Hero />
      <Partners />
      <TeamTeaser />
      <Services />
      <Mission />
      <ToolsTeaser />
      <Reviews />
      <ContactSection />
      <Faq />
    </main>
  );
}
