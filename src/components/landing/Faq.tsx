import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, BookOpen, BookMarked } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { AutoGlossary } from "./AutoGlossary";
import { ta, translations } from "@/lib/translations";
import { useGlossary } from "@/lib/GlossaryContext";
import { useCarnet } from "@/lib/CarnetContext";
import { scrollToHash } from "@/hooks/useLenis";

/**
 * Section FAQ — accordion 7 questions hypothecaires courantes.
 * Ref visuelle : Accueil.html lignes 1714-1860.
 *
 * Utilise Radix Accordion pour a11y robuste (aria-expanded, keyboard nav).
 * Une seule item ouverte a la fois (type="single", collapsible).
 */
export function Faq() {
  const { t, lang } = useLanguage();
  const { open: openGlossary } = useGlossary();
  const { open: openCarnet } = useCarnet();
  const items = ta<Array<{ q: string; a: string }>>(translations[lang], "home.faq.items");

  return (
    <section
      id="faq"
      className="relative py-24 surface-navy overflow-hidden grain-overlay cv-defer"
    >
      {/* Atmospheric continuity — embers per-section signature */}

      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 34, 61, 0.92), rgba(16, 34, 61, 0.92)), image-set(url('/texture-navy-fixed.avif') type('image/avif'), url('/texture-navy-fixed.webp') type('image/webp'), url('/texture-navy-fixed.jpg'))",
        }}
        aria-hidden="true"
      />

      <Container size="full" className="relative max-w-[110rem] px-[clamp(1.5rem,2.5vw,2rem)] md:px-[clamp(1.5rem,2.5vw,2rem)]">
        <SectionHeading
          eyebrow={t("home.faq.eyebrow")}
          title={t("home.faq.title")}
          tone="dark"
        />

        {/* Grid 2-cols sur lg+ (4 gauche + 4 droite). auto-rows-min + items-start
            empêche le stretch vertical des items quand un voisin est ouvert. */}
        <Accordion.Root
          type="single"
          collapsible
          className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-3 lg:auto-rows-min lg:items-start"
        >
          {items.map((item, idx) => (
            <Accordion.Item
              key={item.q.slice(0, 30)}
              value={`faq-${idx}`}
              className="group bg-[color:var(--color-cream)] border border-[color:var(--color-taupe)]/50 overflow-hidden transition-colors duration-300 data-[state=open]:border-[color:var(--color-bronze)]"
            >
              <Accordion.Header>
                <Accordion.Trigger className="w-full px-[clamp(1.5rem,2.5vw,2rem)] py-[clamp(1.25rem,1.8vw,1.5rem)] flex items-center justify-between text-left hover:bg-[color:var(--color-cream-warm)] transition-colors gap-5">
                  {/* Numero filigrane Cormorant a gauche */}
                  <span
                    aria-hidden="true"
                    className="font-[var(--font-editorial)] italic text-[color:var(--color-taupe)] group-data-[state=open]:text-[color:var(--color-bronze)] text-2xl shrink-0 transition-colors w-8"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 min-w-0 font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(0.875rem,1.2vw,1rem)] uppercase tracking-[0.04em] leading-snug text-balance">
                    {item.q}
                  </span>
                  <ChevronDown
                    className="w-5 h-5 shrink-0 text-[color:var(--color-taupe-dark)] group-data-[state=open]:text-[color:var(--color-bronze)] transition-all duration-300 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=open]:animate-[accordionDown_280ms_ease-out] data-[state=closed]:animate-[accordionUp_220ms_ease-in]">
                <div className="px-[clamp(1.5rem,2.5vw,2rem)] pb-6 pt-2 ml-13 md:ml-16 border-t border-[color:var(--color-taupe)]/30">
                  <p className="text-[clamp(0.875rem,1.2vw,1rem)] leading-[1.65] text-[color:var(--color-navy-deep)]/80 pt-4 text-pretty hyphens-auto">
                    <AutoGlossary text={item.a} maxWraps={3} />
                  </p>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>

        <div className="mt-14 text-center space-y-5">
          <p className="text-[color:var(--color-cream)]/80 text-sm">
            {t("home.faq.moreQuestionsLabel")}
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToHash("contact");
            }}
            className="btn-bronze"
          >
            {t("common.writeUs")}
          </a>

        </div>
      </Container>

      <style>{`
        @keyframes accordionDown {
          from { height: 0; opacity: 0; }
          to { height: var(--radix-accordion-content-height); opacity: 1; }
        }
        @keyframes accordionUp {
          from { height: var(--radix-accordion-content-height); opacity: 1; }
          to { height: 0; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
