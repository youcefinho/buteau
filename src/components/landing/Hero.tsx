import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { config } from "@/lib/config";

/**
 * Hero Accueil — large, plein écran, fond navy avec image overlay,
 * logo BUTEAU énorme + tagline "L'HYPOTHÈQUE AUTREMENT" en uppercase.
 *
 * Ref visuelle : Accueil.html lignes 1050-1072.
 */
export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden surface-navy"
    >
      {/* Background image avec overlay tonal — laisse respirer l'image (luxury éditorial). */}
      {/* Audit P1-B : avant 0.78/0.86 mangeait l'image, on baisse à 0.55/0.78 avec dégradé. */}
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(16, 34, 61, 0.55) 0%, rgba(16, 34, 61, 0.68) 45%, rgba(16, 34, 61, 0.82) 100%), url('https://i.imgur.com/8cyAet6.jpg')",
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

      <Container size="xl" className="relative py-32 md:py-40">
        <div className="text-center max-w-5xl mx-auto flex flex-col items-center">
          {/* Eyebrow (Planiprêt — l'arrière-plan métier) — reveal step 1 */}
          <p className="eyebrow text-[color:var(--color-taupe)] mb-6 md:mb-8 opacity-90 animate-[buteauFadeUp_800ms_ease-out_100ms_both]">
            <span className="inline-block w-6 h-px align-middle bg-[color:var(--color-taupe)] mr-3" />
            {t("home.hero.eyebrow")}
            <span className="inline-block w-6 h-px align-middle bg-[color:var(--color-taupe)] ml-3" />
          </p>

          {/* Brand mark — reveal step 2 (scale, more dramatic) */}
          <div className="relative inline-block animate-[buteauScale_900ms_cubic-bezier(0.4,0,0.2,1)_300ms_both]">
            <p className="font-[var(--font-display)] text-[color:var(--color-cream)] text-6xl md:text-8xl lg:text-[8.5rem] font-extrabold tracking-[0.22em] leading-[0.95] pl-[0.22em]">
              {config.brandName}
            </p>
            <span
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 md:w-20 h-px bg-[color:var(--color-bronze)] animate-[buteauWidth_700ms_ease-out_900ms_both]"
              aria-hidden="true"
            />
          </div>

          {/* Tagline mega — reveal step 3 */}
          <h1
            className="font-[var(--font-editorial)] italic text-[color:var(--color-cream)]/95 text-3xl md:text-5xl lg:text-[3.5rem] font-light tracking-[0.02em] leading-[1.05] mt-10 md:mt-12 max-w-3xl animate-[buteauFadeUp_800ms_ease-out_700ms_both]"
          >
            {t("home.hero.title")}
          </h1>

          {/* Decorative line taupe — fine, signature — reveal step 4 */}
          <div className="w-24 md:w-32 h-px bg-[color:var(--color-taupe)] my-10 md:my-14 animate-[buteauWidth_700ms_ease-out_1100ms_both]" />

          {/* Subtitle — reveal step 5 */}
          <p className="text-[color:var(--color-cream)]/85 text-base md:text-lg font-light leading-[1.45] max-w-xl mb-12 animate-[buteauFadeUp_700ms_ease-out_1200ms_both]">
            {t("home.hero.subtitle")}
          </p>

          {/* CTA stack — reveal step 6 */}
          <div className="flex flex-col sm:flex-row gap-5 items-center animate-[buteauFadeUp_700ms_ease-out_1400ms_both]">
            <a href="#contact" className="btn-bronze">
              {t("home.hero.ctaPrimary")}
            </a>
            <Link
              to="/equipe"
              className="group font-[var(--font-display)] text-[color:var(--color-cream)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] inline-flex items-center gap-2 transition-all"
            >
              <span className="relative">
                {t("home.hero.ctaSecondary")}
                <span className="absolute left-0 -bottom-1 w-0 h-px bg-[color:var(--color-taupe)] group-hover:w-full transition-[width] duration-500" />
              </span>
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </Container>

      {/* Signature line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[color:var(--color-taupe)]" />
    </section>
  );
}
