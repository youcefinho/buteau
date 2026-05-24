import { Download } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";

/**
 * Section Guides éducatifs — 3 cartes "Bientôt disponible".
 * Chaque carte : icone download + titre + description + badge "à venir".
 */
export function GuidesGrid() {
  const { t, lang } = useLanguage();
  const items = ta<Array<{ title: string; desc: string }>>(
    translations[lang],
    "tools.guides.items",
  );

  return (
    <section
      id="guides"
      className="relative py-24 surface-navy overflow-hidden border-t border-[color:var(--color-taupe)]/30 grain-overlay"
    >
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 34, 61, 0.92), rgba(16, 34, 61, 0.92)), image-set(url('/texture-navy-fixed.avif') type('image/avif'), url('/texture-navy-fixed.webp') type('image/webp'), url('/texture-navy-fixed.jpg'))",
        }}
        aria-hidden="true"
      />

      <Container size="xl" className="relative">
        <SectionHeading
          eyebrow={t("tools.guides.eyebrow")}
          title={t("tools.guides.title")}
          subtitle={t("tools.guides.subtitle")}
          tone="dark"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(1.75rem,2.5vw,2.25rem)]">
          {items.map((g, idx) => (
            <article
              key={idx}
              className="group relative bg-[color:var(--color-cream)]/8 backdrop-blur-sm border border-[color:var(--color-cream)]/20 p-[clamp(1.75rem,3vw,2.5rem)] transition-all duration-500 hover:border-[color:var(--color-taupe-dark)]/70 hover:bg-[color:var(--color-cream)]/15 hover:-translate-y-1 overflow-hidden"
            >
              {/* Numéro Cormorant filigrane top-right */}
              <span
                aria-hidden="true"
                className="absolute top-4 right-5 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/30 text-5xl leading-none pointer-events-none select-none transition-colors duration-500 group-hover:text-[color:var(--color-taupe-dark)]/45"
              >
                {["01", "02", "03"][idx]}
              </span>

              {/* Icone dans cercle bronze + halo subtle */}
              <div className="mb-6 relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-[color:var(--color-taupe)]/15 text-[color:var(--color-taupe-light)] group-hover:bg-[color:var(--color-taupe-dark)]/25 transition-colors">
                <Download size={22} strokeWidth={1.5} aria-hidden="true" />
              </div>

              {/* Titre */}
              <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-[clamp(1rem,1.4vw,1.125rem)] uppercase tracking-[0.04em] mb-3 leading-snug pr-10 text-balance">
                {g.title}
              </h3>

              {/* Signature line bronze qui s'étend au hover */}
              <div className="w-8 h-px bg-[color:var(--color-taupe-dark)] mb-4 transition-[width] duration-500 group-hover:w-14" />

              {/* Description */}
              <p className="text-sm leading-[1.65] text-[color:var(--color-cream)]/75 mb-6 text-pretty hyphens-auto">
                {g.desc}
              </p>

              {/* Badge "Bientôt" */}
              <span className="inline-block eyebrow text-[color:var(--color-taupe-light)] border-l-2 border-[color:var(--color-taupe-dark)] pl-3">
                {t("tools.guides.comingSoonLabel")}
              </span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
