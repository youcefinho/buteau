import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";

/**
 * Section Équipe (teaser sur Accueil).
 * 3 cartes : Andrew (lead), Abygaèle (coord), Alexis (assistant).
 * Ref visuelle : Accueil.html lignes 1167-1239.
 *
 * Note : photos issues du HTML mockup. À remplacer par des assets clients
 * définitifs en Phase 9 (config.assets.teamPhotos).
 */

const photoUrls = {
  andrew: "https://i.imgur.com/k4bZmLl.jpg",
  abygaele: "https://ugc.production.linktr.ee/5iBsvLTR0iXiJgoKotJw_I4Qhjq9XsUtz0u6v?io=true&size=avatar-v3_0",
  alexis: "https://i.imgur.com/MUD07Kc.jpg",
};

export function TeamTeaser() {
  const { t } = useLanguage();

  const members = [
    {
      name: t("home.teamTeaser.andrewName"),
      role: t("home.teamTeaser.andrewRole"),
      photo: photoUrls.andrew,
    },
    {
      name: t("home.teamTeaser.abygaeleName"),
      role: t("home.teamTeaser.abygaeleRole"),
      photo: photoUrls.abygaele,
    },
    {
      name: t("home.teamTeaser.alexisName"),
      role: t("home.teamTeaser.alexisRole"),
      photo: photoUrls.alexis,
    },
  ];

  return (
    <section
      id="equipe"
      className="relative py-24 surface-navy overflow-hidden"
    >
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {members.map((m) => (
            <Link
              key={m.name}
              to="/equipe"
              className="group block bg-[color:var(--color-cream)] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-[color:var(--color-taupe)]/40 hover:border-[color:var(--color-bronze)]/60"
            >
              <div className="relative h-80 overflow-hidden bg-gradient-to-br from-[color:var(--color-navy)] to-[color:var(--color-taupe)]">
                <img
                  src={m.photo}
                  alt={m.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-lg uppercase tracking-[var(--tracking-eyebrow)] mb-3">
                  {m.name}
                </h3>
                <div className="flex items-center justify-center gap-2.5">
                  <div className="w-8 h-0.5 bg-[color:var(--color-bronze)]" aria-hidden="true" />
                  <p className="eyebrow text-[color:var(--color-taupe-dark)]">
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
