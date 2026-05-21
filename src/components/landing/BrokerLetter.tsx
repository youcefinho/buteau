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
    <section id="lettre" className="relative py-[clamp(4rem,9vw,8rem)] surface-cream overflow-hidden lined-paper">
      {/* Atmospheric continuity — embers per-section signature */}

      {/* Filigrane "lettre M" Cormorant en filigrane (référence "mot du courtier") */}
      <span
        aria-hidden="true"
        className="absolute -top-12 -left-8 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/8 text-[28rem] leading-none pointer-events-none select-none"
      >
        m
      </span>

      <Container size="lg" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(2.5rem,5vw,4rem)] items-start">
          {/* Lettre — col 8 */}
          <div className="lg:col-span-8 lg:pr-8">
            <p className="eyebrow text-[color:var(--color-taupe-dark)] inline-flex items-center gap-3 mb-10">
              <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
              {t("letter.eyebrow")}
              <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            </p>

            {/* "Bonjour," — accroche Fraunces italic XL avec axes optical + WONK
                (signature endroit #3, plus distinctive que Cormorant). */}
            <p className="font-signature text-[color:var(--color-navy-deep)] text-[clamp(2.25rem,5vw,3.75rem)] leading-none mb-10 tracking-[-0.015em]">
              {t("letter.heading")}
            </p>

            {/* Body paragraphes */}
            <div className="space-y-7 max-w-2xl text-[color:var(--color-navy-deep)]/85">
              <p className="font-[var(--font-editorial)] italic text-[clamp(1.125rem,1.6vw,1.25rem)] leading-[1.7] text-pretty hyphens-auto">
                {t("letter.bodyP1")}{" "}
                <span className="not-italic font-semibold text-[color:var(--color-bronze-deep)]">
                  {t("letter.bodyP1Emphasis")}
                </span>
              </p>

              <p className="font-[var(--font-editorial)] italic text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.75] text-pretty hyphens-auto">
                {t("letter.bodyP2")}
              </p>

              <p className="font-[var(--font-editorial)] italic text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.75] text-pretty hyphens-auto">
                {t("letter.bodyP3")}
              </p>
            </div>

            {/* Closing manuscrit */}
            <p className="font-[var(--font-editorial)] italic text-[color:var(--color-navy-deep)] text-[clamp(1.5rem,2.5vw,1.875rem)] mt-10 leading-none">
              {t("letter.closing")}
            </p>
          </div>

          {/* Signature column — col 4 (Photo entrevue + signature manuscrite + nom).
              Option A polished 2026-05-21 v3 : photo au-dessus mais plus subtle
              (pas de border carte, shadow softer, max-w reduit) + lg:pt-24
              pour s'aligner avec le body letter (pas tout en haut). */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-center lg:pt-24">
            {/* Photo Andrew en entrevue — cinematic chiaroscuro, treatment editorial */}
            <figure className="w-full max-w-[280px] mb-10 lg:mb-12 photo-edito group">
              <picture>
                <source srcSet="/equipe/andrew-podcast.avif" type="image/avif" />
                <source srcSet="/equipe/andrew-podcast.webp" type="image/webp" />
                <img
                  src="/equipe/andrew-podcast.jpg"
                  alt="Andrew Buteau en entrevue"
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={1200}
                  className="w-full h-auto block shadow-[0_8px_24px_-12px_rgba(16,34,61,0.25)] transition-shadow duration-500 group-hover:shadow-[0_14px_36px_-12px_rgba(16,34,61,0.4)]"
                />
              </picture>
            </figure>

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
