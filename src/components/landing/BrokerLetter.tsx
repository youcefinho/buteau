import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { AnimatedSignature } from "./AnimatedSignature";

/**
 * « Le mot du courtier » — section letter-format AUTHENTIQUE.
 *
 * Pourquoi NOVEL : aucun autre client Intralys n'a une section qui mime un papier
 * à lettre manuscrit luxury. C'est la touche personal brand qui rend Andrew tangible.
 *
 * Structure :
 * - Eyebrow tirets longs encadrants
 * - "Bonjour," dropcap Cormorant italic XL
 * - 3 paragraphes Cormorant italic 1.7-1.8 leading (effet papier à lettre)
 * - Signature SVG animée au scroll-into-view
 * - Texte signataire italique sous la signature
 *
 * Layout : asymétrique 8/4 (texte 8, signature 4) sur desktop ; vertical mobile.
 */
export function BrokerLetter() {
  const { t } = useLanguage();

  return (
    <section className="relative py-24 md:py-32 surface-cream overflow-hidden">
      {/* Filigrane "lettre M" Cormorant en filigrane (référence "mot du courtier") */}
      <span
        aria-hidden="true"
        className="absolute -top-12 -left-8 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/8 text-[28rem] leading-none pointer-events-none select-none"
      >
        m
      </span>

      <Container size="lg" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Lettre — col 8 */}
          <div className="lg:col-span-8 lg:pr-8">
            <p className="eyebrow text-[color:var(--color-taupe-dark)] inline-flex items-center gap-3 mb-10">
              <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
              {t("letter.eyebrow")}
              <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            </p>

            {/* "Bonjour," — accroche Cormorant italic 5xl */}
            <p className="font-[var(--font-editorial)] italic text-[color:var(--color-navy-deep)] text-4xl md:text-5xl lg:text-6xl leading-none mb-10 tracking-tight">
              {t("letter.heading")}
            </p>

            {/* Body paragraphes */}
            <div className="space-y-7 max-w-2xl text-[color:var(--color-navy-deep)]/85">
              <p className="font-[var(--font-editorial)] italic text-lg md:text-xl leading-[1.7]">
                {t("letter.bodyP1")}{" "}
                <span className="not-italic font-semibold text-[color:var(--color-bronze-deep)]">
                  {t("letter.bodyP1Emphasis")}
                </span>
              </p>

              <p className="font-[var(--font-editorial)] italic text-base md:text-lg leading-[1.75]">
                {t("letter.bodyP2")}
              </p>

              <p className="font-[var(--font-editorial)] italic text-base md:text-lg leading-[1.75]">
                {t("letter.bodyP3")}
              </p>
            </div>

            {/* Closing manuscrit */}
            <p className="font-[var(--font-editorial)] italic text-[color:var(--color-navy-deep)] text-2xl md:text-3xl mt-10 leading-none">
              {t("letter.closing")}
            </p>
          </div>

          {/* Signature column — col 4 */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-center lg:pt-32">
            <div className="w-full max-w-[320px]">
              <AnimatedSignature className="w-full h-auto" duration={2400} />
            </div>
            <div className="mt-6 lg:mt-8 lg:text-center w-full max-w-[320px]">
              <div className="w-12 h-px bg-[color:var(--color-bronze)] lg:mx-auto mb-3" />
              <p className="eyebrow text-[color:var(--color-taupe-dark)]">
                {t("letter.role")}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
