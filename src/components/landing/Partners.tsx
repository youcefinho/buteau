import { Link } from "@tanstack/react-router";
import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/lib/LanguageContext";
import { SectionHeading } from "./SectionHeading";

/**
 * Carousel infinite scroll des logos partenaires.
 * Ref visuelle : Accueil.html lignes 1074-1165 (logo-scroll-track).
 *
 * Pattern : 9 logos affichés en stripe horizontale qui scroll a gauche.
 * Animation CSS pure (transform translateX) pour eviter la dépendance JS.
 */

const partners = [
  { name: "Banque Nationale", logo: "https://static.wixstatic.com/media/60fa64_ef3269be7b644d2eb233adfb8f1ce3d4~mv2.jpg/v1/fill/w_300,h_300,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/bn_vid_hero_dark_fr.jpg" },
  { name: "MCAP", logo: "https://static.wixstatic.com/media/60fa64_bcf3ebc0984a426ca2bccc5ddfd9323a~mv2.webp/v1/fill/w_300,h_300,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/mcap-lg.webp" },
  { name: "First National", logo: "https://static.wixstatic.com/media/60fa64_596e739841a5440eb4ffe7cc1b894de0~mv2.png/v1/fill/w_300,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/first-national-financial-corporation--600.png" },
  { name: "Scotiabank", logo: "https://static.wixstatic.com/media/60fa64_73e0863852c24c888713e4b252db98bb~mv2.png/v1/fill/w_300,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Scotiabank-1024x1024.png" },
  { name: "CIBC", logo: "https://static.wixstatic.com/media/60fa64_4018f458f5d54d0685b0fae6956669a8~mv2.png/v1/crop/x_19,y_19,w_474,h_474/fill/w_300,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/unnamed.png" },
  { name: "TD", logo: "https://static.wixstatic.com/media/60fa64_1fef0d42716f47ac91744065679e9dfb~mv2.png/v1/fill/w_300,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/buteau%20(4_33%20x%205_59%20po)%20(4_21%20x%205_59%20po)-3.png" },
];

export function Partners() {
  const { t } = useLanguage();
  const doubled = [...partners, ...partners]; // duplicate pour scroll infini

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
                  className="h-20 md:h-24 w-auto object-contain transition-all hover:scale-110 grayscale-0 hover:grayscale"
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
