import { Star } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";

/**
 * Section avis Google.
 * Ref visuelle : Accueil.html lignes 1452-1664.
 *
 * IMPORTANT — anti-pattern A8 (skill intralys-compliance) :
 * On AFFICHE le badge Google "Évaluation Excellente" (mention generique) sans inscrire
 * de note chiffree dans le HTML/Schema.org tant que la note (5.0/34) n'est pas
 * verifiee publiquement en mode incognito. Phase 9 : si verifie, on enrichit
 * Schema.org `aggregateRating`. Sinon, on omet l'aggregateRating ENTIEREMENT.
 *
 * Risque autrement : Google manual action + LPC art. 219 (fausse representation).
 */

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=Andrew+Buteau+Courtier+Hypothecaire";

export function Reviews() {
  const { t, lang } = useLanguage();
  const items = ta<Array<{ quote: string; authorInitial: string; author: string }>>(
    translations[lang],
    "home.reviews.items",
  );

  return (
    <section id="avis" className="py-24 surface-cream">
      <Container size="xl">
        <SectionHeading
          eyebrow={t("home.reviews.eyebrow")}
          title={t("home.reviews.title")}
          tone="light"
        />

        {/* Google Trust Badge — texte qualitatif, sans rating chiffre tant que non verifie */}
        <div className="flex justify-center mb-12">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-8 py-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-3 mb-2">
              <GoogleLogo />
              <span className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-lg tracking-wide group-hover:text-[color:var(--color-bronze-deep)]">
                {t("home.reviews.googleBadgeLabel")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="fill-[#FFC107] text-[#FFC107]"
                  aria-hidden="true"
                />
              ))}
              <span className="ml-2 eyebrow text-[color:var(--color-taupe-dark)]">
                {lang === "fr" ? "Avis Google" : "Google Reviews"}
              </span>
            </div>
          </a>
        </div>

        {/* Grid 3 avis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {items.map((r, idx) => (
            <article
              key={idx}
              className="card-luxury p-8 flex flex-col items-center text-center"
            >
              <div className="flex gap-1 mb-5" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-[#FFC107] text-[#FFC107]"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-sm font-light leading-relaxed text-[color:var(--color-navy-deep)]/90 mb-6 italic">
                « {r.quote} »
              </p>
              <div className="mt-auto flex items-center justify-center gap-3">
                <div
                  className="w-9 h-9 rounded-full bg-[color:var(--color-taupe-light)] flex items-center justify-center text-[color:var(--color-navy-deep)] font-bold text-sm"
                  aria-hidden="true"
                >
                  {r.authorInitial}
                </div>
                <p className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-xs tracking-[var(--tracking-eyebrow)] uppercase">
                  {r.author}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* CTA toward Google reviews */}
        <div className="text-center">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-navy"
          >
            {t("common.seeAllReviews")}
          </a>
        </div>
      </Container>
    </section>
  );
}

function GoogleLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
