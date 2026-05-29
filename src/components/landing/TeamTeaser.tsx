import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { HeartbeatCta } from "@/components/layout/HeartbeatCta";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";

/**
 * Section Équipe (teaser sur Accueil).
 *
 * Lit la liste canonique `team.members` (même source que la page /equipe) :
 * ajouter un membre dans translations le fait apparaître ICI **et** sur /equipe,
 * sans toucher au code. Extensible (demande client 2026-05-29 : la section doit
 * pouvoir accueillir d'autres membres sans surcharge, pas figée sur « 4 pros »).
 *
 * Grille responsive : 1 col mobile, 2 col tablet, 4 col desktop (wrap au-delà).
 */
export function TeamTeaser() {
  const { t, lang } = useLanguage();

  const members = ta<Array<{ name: string; role: string; photo: string; bio: string }>>(
    translations[lang],
    "team.members",
  );

  return (
    <section
      id="equipe"
      className="relative py-24 surface-navy overflow-hidden grain-overlay"
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 34, 61, 0.86), rgba(16, 34, 61, 0.86)), image-set(url('/texture-team-fixed.avif') type('image/avif'), url('/texture-team-fixed.webp') type('image/webp'), url('/texture-team-fixed.jpg'))",
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
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1rem,1.4vw,1.125rem)] uppercase tracking-[var(--tracking-eyebrow)] mb-3 text-balance">
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
          <HeartbeatCta>
            <Link to="/equipe" className="btn-bronze">
              {t("home.teamTeaser.cta")}
            </Link>
          </HeartbeatCta>
          {/* Teaser éditorial sous CTA — générique (pas de liste de noms figée) pour
              rester valable quand l'équipe grandit. */}
          <p className="mt-4 text-[color:var(--color-cream)]/70 text-[clamp(0.8125rem,1.05vw,0.875rem)] leading-snug max-w-md mx-auto text-pretty">
            {lang === "fr"
              ? "Des parcours complémentaires, une seule méthode. Découvrez qui suit votre dossier."
              : "Complementary paths, one method. Meet the people who handle your file."}
          </p>
        </div>
      </Container>
    </section>
  );
}
