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
    <section className="py-24 surface-cream">
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {members.map((m, idx) => (
            <article
              key={idx}
              className="group flex flex-col bg-[color:var(--color-surface)] overflow-hidden card-luxury"
            >
              {/* Photo */}
              <div className="relative h-80 md:h-96 overflow-hidden bg-gradient-to-br from-[color:var(--color-navy)] to-[color:var(--color-taupe)]">
                <img
                  src={m.photo}
                  alt={m.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>

              {/* Info + bio */}
              <div className="p-8 md:p-10 flex flex-col flex-1">
                <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-xl md:text-2xl uppercase tracking-[0.04em] mb-2">
                  {m.name}
                </h3>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-0.5 bg-[color:var(--color-bronze)]" aria-hidden="true" />
                  <p className="eyebrow text-[color:var(--color-taupe-dark)]">
                    {m.role}
                  </p>
                </div>
                <p className="text-sm md:text-base leading-relaxed text-[color:var(--color-navy-deep)]/85">
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
