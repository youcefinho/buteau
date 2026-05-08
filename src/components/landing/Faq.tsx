import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";

/**
 * Section FAQ — accordion 7 questions hypothecaires courantes.
 * Ref visuelle : Accueil.html lignes 1714-1860.
 *
 * Utilise Radix Accordion pour a11y robuste (aria-expanded, keyboard nav).
 * Une seule item ouverte a la fois (type="single", collapsible).
 */
export function Faq() {
  const { t, lang } = useLanguage();
  const items = ta<Array<{ q: string; a: string }>>(translations[lang], "home.faq.items");

  return (
    <section
      id="faq"
      className="relative py-24 surface-navy overflow-hidden grain-overlay"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 34, 61, 0.92), rgba(16, 34, 61, 0.92)), url('https://i.imgur.com/Bw7Zyf4.jpg')",
        }}
        aria-hidden="true"
      />

      <Container size="md" className="relative">
        <SectionHeading
          eyebrow={t("home.faq.eyebrow")}
          title={t("home.faq.title")}
          tone="dark"
        />

        <Accordion.Root type="single" collapsible className="space-y-3">
          {items.map((item, idx) => (
            <Accordion.Item
              key={idx}
              value={`faq-${idx}`}
              className="group bg-[color:var(--color-cream)] border border-[color:var(--color-taupe)]/50 overflow-hidden transition-colors duration-300 data-[state=open]:border-[color:var(--color-bronze)]"
            >
              <Accordion.Header>
                <Accordion.Trigger className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left hover:bg-[color:var(--color-cream-warm)] transition-colors gap-5">
                  {/* Numero filigrane Cormorant a gauche */}
                  <span
                    aria-hidden="true"
                    className="font-[var(--font-editorial)] italic text-[color:var(--color-taupe)] group-data-[state=open]:text-[color:var(--color-bronze)] text-2xl shrink-0 transition-colors w-8"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-sm md:text-base uppercase tracking-[0.04em] leading-snug">
                    {item.q}
                  </span>
                  <ChevronDown
                    className="w-5 h-5 shrink-0 text-[color:var(--color-taupe-dark)] group-data-[state=open]:text-[color:var(--color-bronze)] transition-all duration-300 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=open]:animate-[accordionDown_280ms_ease-out] data-[state=closed]:animate-[accordionUp_220ms_ease-in]">
                <div className="px-6 md:px-8 pb-6 pt-2 ml-13 md:ml-16 border-t border-[color:var(--color-taupe)]/30">
                  <p className="text-sm md:text-base leading-[1.65] text-[color:var(--color-navy-deep)]/80 pt-4">
                    {item.a}
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
          <a href="#contact" className="btn-bronze">
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
