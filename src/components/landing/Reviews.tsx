import { Star } from "lucide-react";
import { RisingBronzeEmbers } from "@/components/atmosphere/RisingBronzeEmbers";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { Tiltable } from "@/components/layout/Tiltable";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";

/**
 * Reviews — refonte "Courrier des lecteurs" / Letters to the Editor.
 *
 * Pourquoi NOVEL : pattern 3-card avec étoiles + quote = AI generic. Ici on
 * traite chaque témoignage comme une vraie lettre publiée dans un magazine :
 * date de réception + ville + corps de lettre + signature manuscrite. Le client
 * lit le site comme un magazine, pas comme une landing.
 *
 * IMPORTANT — anti-pattern A8 : pas de note Google chiffrée dans Schema.org
 * tant que verifie publiquement. Phase 9 : si verifie -> ajouter aggregateRating.
 */

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=Andrew+Buteau+Courtier+Hypothecaire";

export function Reviews() {
  const { t, lang } = useLanguage();
  const items = ta<
    Array<{
      quote: string;
      authorInitial: string;
      author: string;
      city: string;
      date: string;
    }>
  >(translations[lang], "home.reviews.items");

  return (
    <section id="avis" className="relative py-24 md:py-28 surface-cream overflow-hidden">
      {/* Atmospheric continuity — embers per-section signature */}
      <RisingBronzeEmbers count={5} tone="light" />

      {/* Filigrane "✉" enveloppe — Cormorant XL background */}
      <span
        aria-hidden="true"
        className="absolute -top-12 -right-12 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/8 text-[24rem] leading-none pointer-events-none select-none"
      >
        ✉
      </span>

      <Container size="xl" className="relative">
        <SectionHeading
          eyebrow={t("home.reviews.eyebrow")}
          title={t("home.reviews.title")}
          tone="light"
        />

        {/* Google Trust Badge — texte qualitatif, sans rating chiffre tant que non verifie */}
        <div className="flex justify-center mb-14">
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
                  className="fill-[color:var(--color-rating-amber)] text-[color:var(--color-rating-amber)]"
                  aria-hidden="true"
                />
              ))}
              <span className="ml-2 eyebrow text-[color:var(--color-taupe-dark)]">
                {lang === "fr" ? "Avis Google" : "Google Reviews"}
              </span>
            </div>
          </a>
        </div>

        {/* === Letters to the Editor — format magazine === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-9" style={{ perspective: "1200px" }}>
          {items.map((r, idx) => (
            <Tiltable key={`${r.author}-${r.date}`} maxDeg={4}>
            <article
              className="group relative bg-[color:var(--color-surface)] border border-[color:var(--color-taupe)]/45 transition-all duration-500 hover:border-[color:var(--color-bronze)]/70 halo-glow flex flex-col h-full"
            >
              {/* Letter header — date + ville (pattern courrier) */}
              <header className="flex items-baseline justify-between gap-3 px-6 md:px-7 pt-6 pb-4 border-b border-dashed border-[color:var(--color-taupe)]/40">
                <div>
                  <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-1">
                    {t("home.reviews.letterDateLabel")}
                  </p>
                  <p className="font-[var(--font-editorial)] italic text-sm text-[color:var(--color-navy-deep)]">
                    {r.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-1">
                    {t("home.reviews.letterFromLabel")}
                  </p>
                  <p className="font-[var(--font-editorial)] italic text-sm text-[color:var(--color-navy-deep)]">
                    {r.city}
                  </p>
                </div>
              </header>

              {/* Letter body — drop cap subtle + Cormorant italic */}
              <div className="px-6 md:px-7 py-7 flex-1 flex flex-col">
                <div className="flex gap-1 mb-5" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className="fill-[color:var(--color-rating-amber)] text-[color:var(--color-rating-amber)]"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <p className="font-[var(--font-editorial)] italic text-base md:text-[1.05rem] leading-[1.65] text-[color:var(--color-navy-deep)]/90">
                  <span className="font-[var(--font-editorial)] not-italic font-bold text-[color:var(--color-bronze)] text-2xl mr-0.5 leading-none align-baseline">
                    «
                  </span>
                  {" "}
                  {r.quote}
                  {" "}
                  <span className="font-[var(--font-editorial)] not-italic font-bold text-[color:var(--color-bronze)] text-2xl ml-0.5 leading-none align-baseline">
                    »
                  </span>
                </p>
              </div>

              {/* Letter footer — signature manuscrite */}
              <footer className="px-6 md:px-7 pb-6 mt-auto">
                <div className="flex items-center gap-3 pt-4 border-t border-[color:var(--color-taupe)]/30">
                  <div
                    className="w-8 h-8 rounded-full bg-[color:var(--color-bronze)]/15 flex items-center justify-center text-[color:var(--color-bronze-deep)] font-[var(--font-display)] font-bold text-xs tracking-wider"
                    aria-hidden="true"
                  >
                    {r.authorInitial}
                  </div>
                  <p className="font-[var(--font-editorial)] italic text-sm text-[color:var(--color-navy-deep)]">
                    — {r.author}
                  </p>
                </div>
              </footer>
            </article>
            </Tiltable>
          ))}
        </div>

        {/* CTA toward Google reviews — texte signature italique */}
        <div className="text-center mt-12">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-[var(--font-editorial)] italic text-base text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-bronze-deep)] transition-colors"
          >
            <span className="relative">
              {t("common.seeAllReviews")}
              <span className="absolute left-0 -bottom-0.5 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </span>
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
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
