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
      {/* Background image avec overlay navy 70% — pattern Accueil.html */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 34, 61, 0.78), rgba(16, 34, 61, 0.86)), url('https://i.imgur.com/8cyAet6.jpg')",
        }}
        aria-hidden="true"
      />

      <Container size="xl" className="relative py-32 md:py-40">
        <div className="text-center max-w-5xl mx-auto flex flex-col items-center">
          {/* Brand mark — en attendant le logo final */}
          <p className="font-[var(--font-display)] text-[color:var(--color-cream)] text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.18em] mb-2">
            {config.brandName}
          </p>

          {/* Tagline mega — uppercase, italic light */}
          <h1
            className="font-[var(--font-display)] text-[color:var(--color-cream)] text-2xl md:text-4xl lg:text-5xl font-light uppercase tracking-[0.08em] leading-tight mt-6"
          >
            {t("home.hero.title")}
          </h1>

          {/* Decorative line taupe */}
          <div className="w-32 md:w-48 h-1 bg-[color:var(--color-taupe)] my-10 md:my-14" />

          {/* Subtitle */}
          <p className="text-[color:var(--color-cream)] text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-2xl mb-12">
            {t("home.hero.subtitle")}
          </p>

          {/* CTA stack — anchor #contact reste un <a>, /equipe utilise <Link> SPA */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a href="#contact" className="btn-bronze">
              {t("home.hero.ctaPrimary")}
            </a>
            <Link
              to="/equipe"
              className="font-[var(--font-display)] text-[color:var(--color-cream)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] underline-offset-4 hover:underline transition-all"
            >
              <span>{t("home.hero.ctaSecondary")} →</span>
            </Link>
          </div>
        </div>
      </Container>

      {/* Signature line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[color:var(--color-taupe)]" />
    </section>
  );
}
