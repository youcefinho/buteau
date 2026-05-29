import { Link } from "@tanstack/react-router";
import { BookOpen, Star } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { HeartbeatCta } from "@/components/layout/HeartbeatCta";
import { config } from "@/lib/config";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ta, translations } from "@/lib/translations";
import { useQuizTier } from "@/hooks/useQuizTier";
import { useGlossary } from "@/lib/GlossaryContext";

/**
 * Hero Accueil — large, plein écran, fond navy avec image overlay,
 * logo BUTEAU énorme + tagline "L'HYPOTHÈQUE AUTREMENT" en uppercase.
 *
 * Ref visuelle : Accueil.html lignes 1050-1072.
 */
export function Hero() {
  const { t, lang } = useLanguage();
  const { open: openGlossary } = useGlossary();
  const magneticCta = useMagnetic<HTMLAnchorElement>({ strength: 0.3, maxOffset: 14 });
  const { tier } = useQuizTier();
  // A11y : skip l'animation inline si user a opt-in prefers-reduced-motion.
  const reduceMotion = useReducedMotion();

  // CTA personnalisé selon le tier du quiz (si complété), sinon CTA par défaut.
  const ctaLabel = tier
    ? ta<string>(translations[lang], `home.hero.ctaByTier.${tier}`) || t("home.hero.ctaPrimary")
    : t("home.hero.ctaPrimary");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden surface-navy grain-overlay"
    >
      {/* Atmospheric continuity — embers per-section signature */}

      {/* Background image avec overlay tonal — laisse respirer l'image (luxury éditorial). */}
      {/* Perf E (2026-05-10) : image self-hostee depuis /hero-buteau.{avif,webp,jpg}.
          image-set() = browser auto-pick meilleur format supporte (AVIF Chrome 85+,
          WebP partout). Old browsers (Safari < 14 ~0.5% market share) n'ont pas
          image-set(), donc on garde un fallback url() comme premiere declaration. */}
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(16, 34, 61, 0.55) 0%, rgba(16, 34, 61, 0.68) 45%, rgba(16, 34, 61, 0.82) 100%), image-set(url('/hero-buteau.avif') type('image/avif'), url('/hero-buteau.webp') type('image/webp'), url('/hero-buteau.jpg'))",
        }}
        aria-hidden="true"
      />

      {/* Vignette latérale — détail luxury éditorial pour ramener l'œil au centre */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(16, 34, 61, 0.45) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Ambient particles — flotteurs subtils luxury cinematic */}
      <div className="ambient-particles" aria-hidden="true" />

      {/* Location top-right (Laval · Québec) */}
      <div className="absolute top-24 md:top-28 right-6 md:right-12 z-10 text-right animate-[buteauFadeUp_700ms_ease-out_500ms_both]">
        <p className="eyebrow text-[color:var(--color-taupe)] text-[10px] inline-flex items-center gap-2">
          <span className="block w-3 h-px bg-[color:var(--color-taupe)]" />
          {t("home.hero.issueLocation")}
        </p>
      </div>

      {/* Scroll hint bottom — fine ligne verticale + texte */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 animate-[buteauFadeUp_700ms_ease-out_1800ms_both]">
        <span className="block w-px h-12 bg-gradient-to-b from-transparent via-[color:var(--color-taupe)]/70 to-[color:var(--color-bronze)]" />
        <p className="eyebrow text-[color:var(--color-taupe)]/70 text-[10px]">
          {t("home.hero.scrollHint")}
        </p>
      </div>

      <Container size="xl" className="relative py-[clamp(5rem,12vw,10rem)]">
        <div className="text-center max-w-5xl mx-auto flex flex-col items-center">
          {/* Eyebrow (Planiprêt — l'arrière-plan métier) — reveal step 1 */}
          <p className="eyebrow text-[color:var(--color-bronze)] mb-[clamp(1.5rem,3vw,2rem)] opacity-90 animate-[buteauFadeUp_800ms_ease-out_100ms_both]">
            <span className="inline-block w-6 h-px align-middle bg-[color:var(--color-bronze)] mr-3" />
            {t("home.hero.eyebrow")}
            <span className="inline-block w-6 h-px align-middle bg-[color:var(--color-bronze)] ml-3" />
          </p>

          {/* Brand mark — letter-by-letter reveal AU MOUNT + hover word reveal interactif.
              Chaque lettre B/U/T/E/A/U révèle un mot signature au hover (Buteau / Unique /
              Transparence / Expert / Accessible / Utile). */}
          <div className="relative inline-block group/brand">
            <p className="font-[family-name:var(--font-display)] text-[color:var(--color-cream)] text-[clamp(3.5rem,11vw,9rem)] font-extrabold tracking-[0.055em] leading-[0.95] pl-[0.055em] flex">
              {config.brandName.split("").map((letter, idx) => (
                <span
                  key={idx}
                  className="relative inline-block"
                  style={
                    reduceMotion
                      ? undefined
                      : {
                          animation: `buteauLetterIn 900ms cubic-bezier(0.34, 1.56, 0.64, 1) ${
                            400 + idx * 90
                          }ms backwards`,
                        }
                  }
                >
                  {letter}
                </span>
              ))}
            </p>
            <span
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[clamp(3rem,5vw,5rem)] h-px bg-[color:var(--color-bronze)] animate-[buteauWidth_700ms_ease-out_1100ms_both]"
              aria-hidden="true"
            />
            {/* Hint educatif "Survolez chaque lettre" retire 2026-05-19 (demande Andrew) */}
          </div>

          {/* Tagline — lockup CHARTE : MAJUSCULES, Libre Franklin, tracking large
              (≈ ITC Franklin Gothic 138). Taille en vw proportionnelle à BUTEAU
              (~0.26× la taille du logo) pour s'aligner en LARGEUR sous lui, responsive. */}
          <h1
            className="font-[family-name:var(--font-sans)] uppercase text-[color:var(--color-cream)]/90 text-[clamp(0.9rem,2.9vw,2.3rem)] font-medium tracking-[0.138em] leading-[1.2] mt-[clamp(0.85rem,1.8vw,1.4rem)] whitespace-nowrap animate-[buteauFadeUp_800ms_ease-out_700ms_both]"
          >
            {t("home.hero.title")}
          </h1>

          {/* Decorative line taupe — fine, signature — reveal step 4 */}
          <div className="w-[clamp(6rem,9vw,8rem)] h-px bg-[color:var(--color-taupe)] my-[clamp(2.5rem,5vw,3.5rem)] animate-[buteauWidth_700ms_ease-out_1100ms_both]" />

          {/* Subtitle — reveal step 4 */}
          <p className="text-[color:var(--color-cream)]/85 text-[clamp(1rem,1.4vw,1.125rem)] font-light leading-[1.45] max-w-xl mb-[clamp(2.5rem,5vw,3rem)] text-pretty hyphens-auto animate-[buteauFadeUp_700ms_ease-out_1000ms_both]">
            {t("home.hero.subtitle")}
          </p>

          {/* CTA stack — reveal step 5, btn-bronze magnétique.
              CTA principal va TOUJOURS au #contact form (alignement avec
              Faq/MobileStickyCta — user 2026-05-21 préfère cohérence).
              tier-quiz personnalise juste le LABEL, pas la destination. */}
          <div className="flex flex-col sm:flex-row gap-5 items-center animate-[buteauFadeUp_700ms_ease-out_1200ms_both]">
            <HeartbeatCta>
              <a ref={magneticCta} href="#contact" className="btn-bronze btn-shine cta-sheen">
                {ctaLabel}
              </a>
            </HeartbeatCta>
            <HeartbeatCta>
              <Link
                to="/equipe"
                className="group font-[family-name:var(--font-display)] text-[color:var(--color-cream)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] inline-flex items-center gap-2 transition-all"
              >
                <span className="relative">
                  {t("home.hero.ctaSecondary")}
                  <span className="absolute left-0 -bottom-1 w-0 h-px bg-[color:var(--color-orange)] group-hover:w-full transition-[width] duration-500" />
                </span>
                <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
            </HeartbeatCta>
          </div>

          {/* Lien lexique discret — premier contact = jargon hypothécaire opaque */}
          <div className="mt-6 animate-[buteauFadeUp_700ms_ease-out_1400ms_both]">
            <button
              type="button"
              onClick={() => openGlossary()}
              className="text-glow-hover inline-flex items-center gap-2 text-[clamp(0.75rem,1.1vw,0.875rem)] text-[color:var(--color-cream)]/70 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[color:var(--color-bronze)]" strokeWidth={1.5} aria-hidden />
              {lang === "fr"
                ? "Premier contact ? Voir le lexique hypothécaire."
                : "First time? View the mortgage glossary."}
            </button>
          </div>

          {/* Trust chip Google reviews — deplace sous lexique 2026-05-20 (user :
              "plus epuree mieux organise"). Avant : positionne entre tagline et
              subtitle = competition visuelle avec H1 + paragraphe. Maintenant en
              "preuve sociale finale" sous CTA + lexique = closing argument calme. */}
          <a
            href={config.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("home.reviews.googleBadgeLabel")}
            className="group/chip mt-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[color:var(--color-bronze)]/35 bg-[color:var(--color-bronze)]/[0.06] hover:border-[color:var(--color-bronze)]/65 hover:bg-[color:var(--color-bronze)]/10 transition-all duration-300 text-[clamp(0.75rem,1.1vw,0.875rem)] animate-[buteauFadeUp_700ms_ease-out_1600ms_both]"
          >
            <Star className="w-3.5 h-3.5 fill-[color:var(--color-bronze)] text-[color:var(--color-bronze)] shrink-0" strokeWidth={1.5} aria-hidden />
            <span className="font-[family-name:var(--font-display)] font-medium tracking-[0.06em] uppercase text-[color:var(--color-cream)]/90 whitespace-nowrap">
              {t("home.reviews.googleBadgeLabel")}
            </span>
            <span aria-hidden="true" className="text-[color:var(--color-bronze)] transition-transform duration-300 group-hover/chip:translate-x-0.5">→</span>
          </a>
        </div>
      </Container>

      {/* Signature line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[color:var(--color-taupe)]" />
    </section>
  );
}
