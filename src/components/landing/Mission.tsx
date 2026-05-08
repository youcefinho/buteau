import { CircleHelp, MapPin, Users, Clock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";

/**
 * Section Mission/Valeurs — surface navy avec image overlay,
 * tagline italic + 2 paragraphes mission + grid 4 valeurs.
 * Ref visuelle : Accueil.html lignes 1290-1372.
 */

const ICONS = [CircleHelp, Users, Clock, MapPin]; // 4 icones lucide pour les 4 valeurs

export function Mission() {
  const { t, lang } = useLanguage();
  const values = ta<Array<{ title: string; desc: string }>>(
    translations[lang],
    "home.mission.values",
  );

  return (
    <section
      id="mission"
      className="relative py-24 surface-navy overflow-hidden"
    >
      {/* Background image overlay — dégradé tonal, image respire (audit P2-K) */}
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

        {/* Body éditorial */}
        <div className="max-w-4xl mx-auto mb-16 text-center space-y-8">
          <p className="text-base lg:text-xl leading-relaxed text-[color:var(--color-cream)] font-light">
            {t("home.mission.bodyP1Lead")}
            <span className="font-bold text-[color:var(--color-bronze)]">
              {t("home.mission.bodyP1Brand")}
            </span>
            {t("home.mission.bodyP1Continued")}
          </p>
          <p className="text-base lg:text-xl leading-relaxed text-[color:var(--color-cream)] font-light">
            {t("home.mission.bodyP2Lead")}
            <span className="font-bold text-[color:var(--color-bronze)]">
              {t("home.mission.bodyP2Year")}
            </span>
            {t("home.mission.bodyP2Continued")}
            <span className="font-bold text-[color:var(--color-bronze)]">
              {t("home.mission.bodyP2Stat")}
            </span>
            {t("home.mission.bodyP2End")}
          </p>
        </div>

        {/* Grid 4 valeurs — pattern signature : numéro filigrane + icône taupe + tag bronze */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {values.map((v, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <article
                key={idx}
                className="group relative bg-[color:var(--color-cream)] p-8 md:p-10 border border-[color:var(--color-taupe)]/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_18px_48px_-20px_rgba(16,34,61,0.32)] hover:border-[color:var(--color-bronze)] overflow-hidden"
              >
                {/* Numéro filigrane top-right */}
                <span
                  aria-hidden="true"
                  className="absolute top-4 right-5 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/20 text-5xl leading-none pointer-events-none select-none transition-colors duration-500 group-hover:text-[color:var(--color-bronze)]/30"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                {/* Icône */}
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[color:var(--color-taupe)]/15 text-[color:var(--color-bronze-deep)] transition-colors duration-500 group-hover:bg-[color:var(--color-bronze)]/15">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[var(--tracking-eyebrow)] mb-3 leading-snug">
                  {v.title}
                </h3>

                {/* Signature line bronze */}
                <div className="w-8 h-px bg-[color:var(--color-bronze)] mb-4 transition-[width] duration-500 group-hover:w-14" />

                {/* Description */}
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
