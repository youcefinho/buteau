import { CircleHelp, MapPin, Users, Clock, BookMarked } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { useCarnet } from "@/lib/CarnetContext";
import { AutoGlossary } from "@/components/landing/AutoGlossary";

/**
 * Section Mission — refonte cinematic luxury éditorial.
 *
 * Détails signature :
 * - Drop cap Cormorant  bronze sur le 1er paragraphe (utility .dropcap)
 * - Pull quote asymétrique entre les 2 paragraphes (Cormorant  4xl)
 * - Counter animé "200 familles" qui démarre à l'intersection scroll (useCountUp)
 * - 4 cards valeurs avec numéro filigrane + signature line + halo bronze
 * - Grain texture overlay pour print magazine feel
 */

const ICONS = [CircleHelp, Users, Clock, MapPin];

export function Mission() {
  const { t, lang } = useLanguage();
  const { open: openCarnet } = useCarnet();
  const values = ta<Array<{ title: string; desc: string }>>(
    translations[lang],
    "home.mission.values",
  );

  // Counter "200 familles" — démarre quand la section entre dans le viewport.
  // Fix HIGH : threshold 0.1 (vs 0.4) — sur mobile/tablet la section Mission fait >1.5x viewport,
  // 40% n'était jamais atteint donc le counter restait à 0.
  const { ref: counterRef, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const familiesCount = useCountUp(200, { duration: 1800, start: isVisible });

  return (
    <section
      ref={counterRef}
      id="mission"
      className="relative py-[clamp(4rem,9vw,8rem)] surface-navy overflow-hidden grain-overlay"
    >
      {/* Atmospheric continuity — embers per-section signature */}

      {/* Background image overlay — dégradé tonal, image visible */}
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(16, 34, 61, 0.72) 0%, rgba(16, 34, 61, 0.85) 50%, rgba(16, 34, 61, 0.78) 100%), image-set(url('/texture-navy-fixed.avif') type('image/avif'), url('/texture-navy-fixed.webp') type('image/webp'), url('/texture-navy-fixed.jpg'))",
        }}
        aria-hidden="true"
      />

      <Container size="xl" className="relative">
        <SectionHeading
          eyebrow={t("home.mission.eyebrow")}
          title={t("home.mission.title")}
          tone="dark"
        />

        {/* Body éditorial — grid 2-col (paragraphe gauche / pull quote droite)
            au lieu du stack vertical. User 2026-05-20 : "trop vertical, mieux structurer".
            Mobile : vertical naturel. Desktop : 5/7 cols avec items-center magazine. */}
        <div className="max-w-6xl mx-auto mb-[clamp(5rem,7vw,6rem)] grid grid-cols-1 lg:grid-cols-12 gap-[clamp(2.5rem,5vw,4rem)] items-center">
          {/* P1 avec drop cap luxury — col 5 desktop */}
          <p className="lg:col-span-5 dropcap text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.8] text-[color:var(--color-cream)]/90 font-light text-pretty hyphens-auto">
            {t("home.mission.bodyP1Lead")}
            <span className="font-bold text-[color:var(--color-bronze)]">
              {t("home.mission.bodyP1Brand")}
            </span>
            {t("home.mission.bodyP1Continued")}
          </p>

          {/* Pull quote — col 7 desktop, Cormorant  XL */}
          <blockquote className="lg:col-span-7 relative pl-8 md:pl-14 pr-4 md:pr-0">

            <span
              aria-hidden="true"
              className="absolute -top-6 left-0 font-[var(--font-editorial)]  text-[color:var(--color-bronze)]/60 text-7xl md:text-8xl leading-none"
            >
              &ldquo;
            </span>
            <p className="font-signature text-[color:var(--color-cream)] text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.2] font-light tracking-[-0.005em]">
              <span className="text-[color:var(--color-cream)]/85">
                {t("home.mission.bodyP2Lead")}
              </span>
              <span className="font-bold text-[color:var(--color-bronze)] not-italic">
                {t("home.mission.bodyP2Year")}
              </span>
              <span className="text-[color:var(--color-cream)]/85">
                {t("home.mission.bodyP2Continued")}
              </span>
              <span
                className="inline-block tabular-nums font-bold text-[color:var(--color-bronze)] mr-1"
                aria-live="polite"
              >
                {familiesCount}
              </span>
              <span className="text-[color:var(--color-cream)]/85">
                {t("home.mission.bodyP2Stat")}
                {t("home.mission.bodyP2End")}
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
                className="group relative bg-[color:var(--color-cream)] p-[clamp(1.75rem,3vw,2.5rem)] border border-[color:var(--color-taupe)]/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_18px_48px_-20px_rgba(16,34,61,0.32)] hover:border-[color:var(--color-bronze)] overflow-hidden"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-4 right-5 font-[var(--font-editorial)]  text-[color:var(--color-taupe)]/20 text-5xl leading-none pointer-events-none select-none transition-colors duration-500 group-hover:text-[color:var(--color-bronze)]/30"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[color:var(--color-taupe)]/15 text-[color:var(--color-navy)] transition-colors duration-500 group-hover:bg-[color:var(--color-bronze)]/15">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </div>

                <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] group-hover:text-[color:var(--color-bronze)] transition-colors duration-500 text-base uppercase tracking-[var(--tracking-eyebrow)] mb-3 leading-snug text-balance">
                  {v.title}
                </h3>

                <div className="w-8 h-px bg-[color:var(--color-bronze)] mb-4 transition-[width] duration-500 group-hover:w-14" />

                <p className="text-sm leading-[1.55] text-[color:var(--color-navy-deep)]/80 text-pretty hyphens-auto">
                  <AutoGlossary text={v.desc} />
                </p>
              </article>
            );
          })}
        </div>

        {/* Pont vers carnet — extension de la méthode (4 valeurs → ressources) */}
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={openCarnet}
            className="text-glow-hover inline-flex items-center gap-2  text-[clamp(0.875rem,1.2vw,1rem)] text-[color:var(--color-cream)]/85 cursor-pointer"
          >
            <BookMarked className="w-4 h-4 text-[color:var(--color-bronze)]" strokeWidth={1.5} aria-hidden />
            {lang === "fr"
              ? "Voir notre carnet de l'emprunteur"
              : "Open our borrower notebook"}
          </button>
        </div>
      </Container>
    </section>
  );
}
