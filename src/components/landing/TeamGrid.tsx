import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { ta, translations } from "@/lib/translations";

/**
 * Grid 3 cartes équipe avec bios complètes (page Équipe).
 * Format different du teaser Accueil — ici layout magazine éditorial avec bio
 * paragraphe complete sous chaque membre.
 *
 * Ref visuelle : equipe.html — 3 cartes avec photo + nom + role + bio paragraphe.
 */
export function TeamGrid() {
  const { lang } = useLanguage();
  const members = ta<Array<{ name: string; role: string; photo: string; bio: string }>>(
    translations[lang],
    "team.members",
  );

  return (
    <section className="py-24 md:py-28 surface-cream relative overflow-hidden">
      {/* Filigrane "&" decoratif arriere-plan editorial */}
      <span
        aria-hidden="true"
        className="absolute top-12 right-0 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/8 text-[28rem] leading-none pointer-events-none select-none"
      >
        &
      </span>

      <Container size="xl" className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {members.map((m, idx) => (
            <article
              key={idx}
              className="group relative flex flex-col"
            >
              {/* Numéro filigrane top-left (01/02/03) */}
              <span
                aria-hidden="true"
                className="absolute -top-2 -left-3 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/30 text-7xl md:text-8xl leading-none pointer-events-none select-none z-10 transition-colors duration-500 group-hover:text-[color:var(--color-bronze)]/35"
              >
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Photo with editorial frame — h-80 lg:h-[24rem] pour 4 cards balance */}
              <div className="relative h-80 lg:h-[24rem] overflow-hidden bg-gradient-to-br from-[color:var(--color-navy)] to-[color:var(--color-taupe)]">
                <img
                  src={m.photo}
                  alt={m.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-[center_20%] transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
                {/* Subtle inner overlay au hover pour drama */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-navy-deep)]/35 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-30"
                  aria-hidden="true"
                />
              </div>

              {/* Info — design éditorial avec hierarchy magazine */}
              <div className="pt-7 md:pt-8 space-y-4 relative">
                {/* Marginalia — signature italic discrete a droite, signature manuscrite */}
                <span
                  aria-hidden="true"
                  className="hidden md:block absolute -right-2 top-2 font-[var(--font-editorial)] italic text-[color:var(--color-bronze)]/45 text-sm rotate-90 origin-right tracking-[0.18em]"
                >
                  {["fondateur", "coordo.", "assist.", "opérations"][idx]}
                </span>

                {/* Eyebrow rôle (uppercase tracking) */}
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-px bg-[color:var(--color-bronze)] transition-[width] duration-500 group-hover:w-16" aria-hidden="true" />
                  <p className="eyebrow text-[color:var(--color-taupe-dark)]">
                    {m.role}
                  </p>
                </div>

                {/* Name display — taille adaptée 4 cards (text-xl/2xl vs 2xl/3xl avant) */}
                <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-xl lg:text-2xl uppercase tracking-[0.02em] leading-tight">
                  {m.name}
                </h3>

                {/* Bio Open Sans — text-sm pour densité 4 cards */}
                <p className="text-sm leading-[1.6] text-[color:var(--color-navy-deep)]/80 pt-2">
                  {m.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
