import { Link } from "@tanstack/react-router";
import { BookOpen, Video, FileText, Download, BookMarked } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { HeartbeatCta } from "@/components/layout/HeartbeatCta";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";
import { useGlossary } from "@/lib/GlossaryContext";
import { useCarnet } from "@/lib/CarnetContext";

/**
 * Section Outils & Ressources (teaser) — 4 cartes glass sur surface navy.
 * Ref visuelle : Accueil.html lignes 1374-1450.
 */
const ICONS = [BookOpen, Video, FileText, Download];

export function ToolsTeaser() {
  const { t, lang } = useLanguage();
  const isFr = lang === "fr";
  const { open: openGlossary } = useGlossary();
  const { open: openCarnet } = useCarnet();
  const items = ta<Array<{ title: string; desc: string }>>(
    translations[lang],
    "home.tools.items",
  );

  return (
    <section
      id="outils-teaser"
      className="relative py-[clamp(4rem,8vw,6rem)] surface-navy overflow-hidden grain-overlay"
    >
      {/* Atmospheric continuity — embers per-section signature */}

      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 34, 61, 0.88), rgba(16, 34, 61, 0.88)), image-set(url('/texture-navy-fixed.avif') type('image/avif'), url('/texture-navy-fixed.webp') type('image/webp'), url('/texture-navy-fixed.jpg'))",
        }}
        aria-hidden="true"
      />

      <Container size="xl" className="relative">
        <SectionHeading
          eyebrow={t("home.tools.eyebrow")}
          title={t("home.tools.title")}
          subtitle={t("home.tools.subtitle")}
          tone="dark"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(1.5rem,2.5vw,2rem)] mb-[clamp(2.5rem,5vw,3.5rem)]">
          {items.map((item, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <Link
                key={idx}
                to="/outils"
                className="group relative block bg-[color:var(--color-cream)]/8 backdrop-blur-sm border border-[color:var(--color-cream)]/20 p-[clamp(1.5rem,2.5vw,2rem)] text-center transition-all duration-500 hover:bg-[color:var(--color-cream)]/15 hover:border-[color:var(--color-bronze)]/70 hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Numéro Cormorant filigrane top-right */}
                <span
                  aria-hidden="true"
                  className="absolute top-3 right-4 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/25 text-3xl leading-none pointer-events-none select-none transition-colors duration-500 group-hover:text-[color:var(--color-bronze)]/35"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <div className="mb-5 flex justify-center text-[color:var(--color-taupe)] group-hover:text-[color:var(--color-bronze-soft)] transition-colors">
                  <Icon size={36} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div className="w-8 h-px bg-[color:var(--color-bronze)] mx-auto mb-4 transition-[width] duration-500 group-hover:w-14" />
                <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-[clamp(1rem,1.4vw,1.125rem)] uppercase tracking-[var(--tracking-eyebrow)] mb-2 leading-snug text-balance">
                  {item.title}
                </h3>
                <p className="text-xs text-[color:var(--color-cream)]/70 leading-[1.6] text-pretty">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <HeartbeatCta>
            <Link to="/outils" className="btn-bronze">
              {t("home.tools.cta")}
            </Link>
          </HeartbeatCta>
          {/* Teaser editorial — surface navy, cream/70. Liste les vraies
              catégories de /outils (calculs + simulateurs + guides + lettres). */}
          <p
            className="mt-4 font-[var(--font-editorial)] italic text-[color:var(--color-cream)]/70 text-[clamp(0.8125rem,1.05vw,0.875rem)] leading-snug max-w-md mx-auto text-pretty"
          >
            {isFr
              ? "Calculatrices, simulateurs « et si », guides téléchargeables, lettres-types. Préparez votre dossier avant le RDV."
              : "Calculators, what-if simulators, downloadable guides, template letters. Prepare your file before the meeting."}
          </p>
        </div>
      </Container>
    </section>
  );
}
