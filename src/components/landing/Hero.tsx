import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { config } from "@/lib/config";
import { useMagnetic } from "@/hooks/useMagnetic";
import { ta, translations } from "@/lib/translations";

/**
 * Hero Accueil — large, plein écran, fond navy avec image overlay,
 * logo BUTEAU énorme + tagline "L'HYPOTHÈQUE AUTREMENT" en uppercase.
 *
 * Ref visuelle : Accueil.html lignes 1050-1072.
 */
export function Hero() {
  const { t, lang } = useLanguage();
  const magneticCta = useMagnetic<HTMLAnchorElement>({ strength: 0.3, maxOffset: 14 });
  const letterWords = ta<string[]>(translations[lang], "home.hero.letterWords");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden surface-navy grain-overlay"
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

      {/* Ambient particles — flotteurs subtils luxury cinematic */}
      <div className="ambient-particles" aria-hidden="true" />

      {/* === MAGAZINE COVER TREATMENT === */}
      {/* Issue number top-left — comme la couverture d'un magazine luxury */}
      <div className="absolute top-24 md:top-28 left-6 md:left-12 z-10 flex flex-col gap-2 animate-[buteauFadeUp_700ms_ease-out_400ms_both]">
        <p className="eyebrow text-[color:var(--color-taupe)] text-[10px]">
          {t("home.hero.issueLabel")}
        </p>
        <p className="font-[var(--font-editorial)] italic text-[color:var(--color-cream)] text-3xl md:text-4xl leading-none">
          {t("home.hero.issueNumber")}
        </p>
        <p className="font-[var(--font-display)] text-[color:var(--color-taupe)] text-[10px] uppercase tracking-[0.2em] mt-1">
          {t("home.hero.issueDate")}
        </p>
      </div>

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
        <p className="eyebrow text-[color:var(--color-taupe)]/70 text-[9px]">
          {t("home.hero.scrollHint")}
        </p>
      </div>

      <Container size="xl" className="relative py-32 md:py-40">
        <div className="text-center max-w-5xl mx-auto flex flex-col items-center">
          {/* Eyebrow (Planiprêt — l'arrière-plan métier) — reveal step 1 */}
          <p className="eyebrow text-[color:var(--color-taupe)] mb-6 md:mb-8 opacity-90 animate-[buteauFadeUp_800ms_ease-out_100ms_both]">
            <span className="inline-block w-6 h-px align-middle bg-[color:var(--color-taupe)] mr-3" />
            {t("home.hero.eyebrow")}
            <span className="inline-block w-6 h-px align-middle bg-[color:var(--color-taupe)] ml-3" />
          </p>

          {/* Brand mark — letter-by-letter reveal AU MOUNT + hover word reveal interactif.
              Chaque lettre B/U/T/E/A/U révèle un mot signature au hover (Buteau / Unique /
              Transparence / Expert / Accessible / Utile). */}
          <div className="relative inline-block group/brand">
            <p className="font-[var(--font-display)] text-[color:var(--color-cream)] text-6xl md:text-8xl lg:text-[8.5rem] font-extrabold tracking-[0.22em] leading-[0.95] pl-[0.22em] flex">
              {config.brandName.split("").map((letter, idx) => {
                const word = letterWords[idx] ?? letter;
                return (
                  <span
                    key={idx}
                    className="relative inline-block group/letter cursor-default transition-all duration-300 hover:text-[color:var(--color-bronze)] hover:-translate-y-1.5"
                    style={{
                      animation: `buteauLetterIn 900ms cubic-bezier(0.34, 1.56, 0.64, 1) ${
                        400 + idx * 90
                      }ms backwards`,
                    }}
                  >
                    {letter}
                    {/* Mot signature révélé au hover — Cormorant italic small sous la lettre */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-[110%] -translate-x-1/2 font-[var(--font-editorial)] italic text-[color:var(--color-bronze-soft)] text-[0.18em] tracking-normal whitespace-nowrap opacity-0 translate-y-2 transition-all duration-400 group-hover/letter:opacity-100 group-hover/letter:translate-y-0"
                    >
                      {word}
                    </span>
                  </span>
                );
              })}
            </p>
            <span
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 md:w-20 h-px bg-[color:var(--color-bronze)] animate-[buteauWidth_700ms_ease-out_1100ms_both]"
              aria-hidden="true"
            />
            {/* Hint éducatif — apparaît subtle, fade out au 1er hover sur le brand */}
            <span
              aria-hidden="true"
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 eyebrow text-[color:var(--color-taupe)]/70 text-[10px] whitespace-nowrap opacity-100 transition-opacity duration-500 group-hover/brand:opacity-0 animate-[buteauFadeUp_700ms_ease-out_2000ms_both]"
            >
              ↑ {t("home.hero.letterHint")}
            </span>
          </div>

          {/* Tagline mega — reveal step 3. Fraunces italic variable (axes optical + WONK)
              pour distinctiveness vs Cormorant générique. Signature endroit #1. */}
          <h1
            className="font-signature text-[color:var(--color-cream)]/95 text-3xl md:text-5xl lg:text-[3.5rem] font-light tracking-[-0.01em] leading-[1.05] mt-10 md:mt-12 max-w-3xl animate-[buteauFadeUp_800ms_ease-out_700ms_both]"
          >
            {t("home.hero.title")}
          </h1>

          {/* Decorative line taupe — fine, signature — reveal step 4 */}
          <div className="w-24 md:w-32 h-px bg-[color:var(--color-taupe)] my-10 md:my-14 animate-[buteauWidth_700ms_ease-out_1100ms_both]" />

          {/* Subtitle — reveal step 5 */}
          <p className="text-[color:var(--color-cream)]/85 text-base md:text-lg font-light leading-[1.45] max-w-xl mb-12 animate-[buteauFadeUp_700ms_ease-out_1200ms_both]">
            {t("home.hero.subtitle")}
          </p>

          {/* CTA stack — reveal step 6, btn-bronze magnétique */}
          <div className="flex flex-col sm:flex-row gap-5 items-center animate-[buteauFadeUp_700ms_ease-out_1400ms_both]">
            <a ref={magneticCta} href="#contact" className="btn-bronze btn-shine">
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
