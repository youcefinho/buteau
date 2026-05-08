import { Link } from "@tanstack/react-router";
import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/lib/LanguageContext";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";

/**
 * Carousel infinite scroll des logos partenaires.
 * Ref visuelle : Accueil.html lignes 1074-1165 (logo-scroll-track).
 *
 * Source unique : translations.institutions.lenders (9 institutions, partage avec LendersGrid).
 * Audit UI-BL2 fix : avant la copy disait "Plus de 9 institutions" mais Partners n'avait que 6 logos.
 *
 * Animation CSS pure (transform translateX) pour eviter la dépendance JS.
 */

export function Partners() {
  const { t, lang } = useLanguage();
  const lenders = ta<Array<{ name: string; logo: string }>>(
    translations[lang],
    "institutions.lenders",
  );
  const doubled = [...lenders, ...lenders]; // duplicate pour scroll infini

  return (
    <section id="partenaires" className="py-24 surface-cream">
      <Container size="xl">
        <SectionHeading
          eyebrow={t("home.partners.eyebrow")}
          title={t("home.partners.title")}
          subtitle={t("home.partners.subtitle")}
          tone="light"
        />

        {/* Logo carousel — animation infinite via CSS */}
        <div className="relative overflow-hidden mb-12 mask-fade-x">
          <div className="flex w-fit animate-[scroll-x_30s_linear_infinite] hover:[animation-play-state:paused]">
            {doubled.map((p, idx) => (
              <div
                key={`${p.name}-${idx}`}
                className="flex-shrink-0 w-[200px] flex items-center justify-center px-6 py-4"
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  loading="lazy"
                  className="h-16 md:h-20 max-w-[160px] w-auto object-contain transition-all hover:scale-110 grayscale-0 hover:grayscale"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA toward institutions page */}
        <div className="text-center">
          <Link to="/institutions" className="btn-bronze">
            {t("home.partners.cta")}
          </Link>
        </div>
      </Container>

      {/* CSS keyframes inline — leaner que ajouter dans index.css pour ce composant unique */}
      <style>{`
        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .mask-fade-x {
          mask-image: linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%);
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[scroll-x_30s_linear_infinite\\] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
