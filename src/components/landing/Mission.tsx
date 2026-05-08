import { CircleHelp, MapPin, Users, Clock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";

/**
 * Section Mission — refonte cinematic luxury éditorial.
 *
 * Détails signature :
 * - Drop cap Cormorant italic bronze sur le 1er paragraphe (utility .dropcap)
 * - Pull quote asymétrique entre les 2 paragraphes (Cormorant italic 4xl)
 * - Counter animé "200 familles" qui démarre à l'intersection scroll (useCountUp)
 * - 4 cards valeurs avec numéro filigrane + signature line + halo bronze
 * - Grain texture overlay pour print magazine feel
 */

const ICONS = [CircleHelp, Users, Clock, MapPin];

export function Mission() {
  const { t, lang } = useLanguage();
  const values = ta<Array<{ title: string; desc: string }>>(
    translations[lang],
    "home.mission.values",
  );

  // Counter "200 familles" — démarre quand la section entre dans le viewport
  const { ref: counterRef, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.4 });
  const familiesCount = useCountUp(200, { duration: 1800, start: isVisible });

  return (
    <section
      ref={counterRef}
      id="mission"
      className="relative py-24 md:py-32 surface-navy overflow-hidden grain-overlay"
    >
      {/* Background image overlay — dégradé tonal, image visible */}
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(16, 34, 61, 0.72) 0%, rgba(16, 34, 61, 0.85) 50%, rgba(16, 34, 61, 0.78) 100%), url('https://i.imgur.com/Bw7Zyf4.jpg')",
        }}
        aria-hidden="true"
      />

      <Container size="xl" className="relative">
        <SectionHeading
          eyebrow={t("home.mission.eyebrow")}
          title={t("home.mission.title")}
          tone="dark"
        />

        {/* Body éditorial — drop cap + pull quote asymétrique */}
        <div className="max-w-4xl mx-auto mb-20 md:mb-24 space-y-10 md:space-y-12">
          {/* P1 avec drop cap luxury */}
          <p className="dropcap text-base md:text-lg leading-[1.8] text-[color:var(--color-cream)]/90 font-light">
            {t("home.mission.bodyP1Lead")}
            <span className="font-bold text-[color:var(--color-bronze)]">
              {t("home.mission.bodyP1Brand")}
            </span>
            {t("home.mission.bodyP1Continued")}
          </p>

          {/* Pull quote asymétrique — Cormorant italic XL avec décalage */}
          <blockquote className="relative pl-8 md:pl-14 pr-4 md:pr-0 md:max-w-2xl md:ml-auto">

            <span
              aria-hidden="true"
              className="absolute -top-6 left-0 font-[var(--font-editorial)] italic text-[color:var(--color-bronze)]/60 text-7xl md:text-8xl leading-none"
            >
              &ldquo;
            </span>
            <p className="font-[var(--font-editorial)] italic text-[color:var(--color-cream)] text-2xl md:text-4xl leading-[1.2] font-light">
              <span
                className="inline-block tabular-nums font-bold text-[color:var(--color-bronze)] mr-2"
                aria-live="polite"
              >
                {familiesCount}
              </span>
              {t("home.mission.bodyP2Stat")}
              <span className="text-[color:var(--color-cream)]/85">
                {t("home.mission.bodyP2Continued").trimEnd()}
              </span>
              <span className="font-bold text-[color:var(--color-bronze)] not-italic mx-2">
                {t("home.mission.bodyP2Year")}
              </span>
              <span className="text-[color:var(--color-cream)]/85">
                {t("home.mission.bodyP2End").trimStart()}
              </span>
            </p>
            <span
              aria-hidden="true"
              className="block w-12 h-px bg-[color:var(--color-bronze)] mt-6"
            />
          </blockquote>
        </div>

        {/* Grid 4 valeurs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {values.map((v, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <article
                key={idx}
                className="group relative bg-[color:var(--color-cream)] p-8 md:p-10 border border-[color:var(--color-taupe)]/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_18px_48px_-20px_rgba(16,34,61,0.32)] hover:border-[color:var(--color-bronze)] overflow-hidden"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-4 right-5 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/20 text-5xl leading-none pointer-events-none select-none transition-colors duration-500 group-hover:text-[color:var(--color-bronze)]/30"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[color:var(--color-taupe)]/15 text-[color:var(--color-bronze-deep)] transition-colors duration-500 group-hover:bg-[color:var(--color-bronze)]/15">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </div>

                <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[var(--tracking-eyebrow)] mb-3 leading-snug">
                  {v.title}
                </h3>

                <div className="w-8 h-px bg-[color:var(--color-bronze)] mb-4 transition-[width] duration-500 group-hover:w-14" />

                <p className="text-sm leading-[1.55] text-[color:var(--color-navy-deep)]/80">
                  {v.desc}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
