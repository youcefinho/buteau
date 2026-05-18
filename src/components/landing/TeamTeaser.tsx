import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { config } from "@/lib/config";

/**
 * Section Équipe (teaser sur Accueil).
 * 4 cartes : Andrew (lead), Abygaèle (coord), Alexis (assistant), Felix (coordo opérations).
 * Photos servies depuis config.assets.teamPhotos (3 anciennes imgur + Felix studio).
 * Grille responsive : 1 col mobile, 2 col tablet, 4 col desktop.
 */

export function TeamTeaser() {
  const { t } = useLanguage();

  const members = [
    {
      name: t("home.teamTeaser.andrewName"),
      role: t("home.teamTeaser.andrewRole"),
      photo: config.assets.teamPhotos.andrew,
    },
    {
      name: t("home.teamTeaser.abygaeleName"),
      role: t("home.teamTeaser.abygaeleRole"),
      photo: config.assets.teamPhotos.abygaele,
    },
    {
      name: t("home.teamTeaser.alexisName"),
      role: t("home.teamTeaser.alexisRole"),
      photo: config.assets.teamPhotos.alexis,
    },
    {
      name: t("home.teamTeaser.felixName"),
      role: t("home.teamTeaser.felixRole"),
      photo: config.assets.teamPhotos.felix,
    },
  ];

  return (
    <section
      id="equipe"
      className="relative py-24 surface-navy overflow-hidden grain-overlay"
    >
      {/* Atmospheric continuity — embers per-section signature */}

      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 34, 61, 0.86), rgba(16, 34, 61, 0.86)), url('https://i.imgur.com/YsueQT3.jpg')",
        }}
        aria-hidden="true"
      />

      <Container size="xl" className="relative">
        <SectionHeading
          eyebrow={t("home.teamTeaser.eyebrow")}
          title={t("home.teamTeaser.title")}
          tone="dark"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(1.5rem,2.5vw,2rem)] mb-12">
          {members.map((m) => (
            <Link
              key={m.name}
              to="/equipe"
              className="group block bg-[color:var(--color-cream)] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-[color:var(--color-taupe)]/40 hover:border-[color:var(--color-bronze)]/60"
            >
              <div className="relative h-72 lg:h-80 overflow-hidden bg-gradient-to-br from-[color:var(--color-navy)] to-[color:var(--color-taupe)]">
                <img
                  src={m.photo}
                  alt={m.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-[clamp(1.25rem,2vw,1.5rem)] text-center">
                <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1rem,1.4vw,1.125rem)] uppercase tracking-[var(--tracking-eyebrow)] mb-3 text-balance">
                  {m.name}
                </h3>
                <div className="flex items-center justify-center gap-2.5">
                  <div className="w-6 h-0.5 bg-[color:var(--color-bronze)]" aria-hidden="true" />
                  <p className="eyebrow text-[color:var(--color-taupe-dark)] text-[10px] leading-tight">
                    {m.role}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/equipe" className="btn-bronze">
            {t("home.teamTeaser.cta")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
