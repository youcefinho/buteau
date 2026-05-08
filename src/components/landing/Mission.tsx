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
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 34, 61, 0.88), rgba(16, 34, 61, 0.88)), url('https://i.imgur.com/Bw7Zyf4.jpg')",
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

        {/* Grid 4 valeurs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {values.map((v, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <div
                key={idx}
                className="bg-[color:var(--color-cream)] p-10 text-center border border-[color:var(--color-taupe)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(16,34,61,0.18)] hover:border-[color:var(--color-navy)] relative overflow-hidden"
              >
                <div className="mb-5 flex justify-center text-[color:var(--color-navy-deep)]">
                  <Icon size={40} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[var(--tracking-eyebrow)] mb-3">
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed text-[color:var(--color-navy-deep)]/85">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
