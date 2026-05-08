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
      className="relative py-24 surface-navy overflow-hidden border-t border-[color:var(--color-taupe)]/30"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 34, 61, 0.92), rgba(16, 34, 61, 0.92)), url('https://i.imgur.com/Bw7Zyf4.jpg')",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((g, idx) => (
            <article
              key={idx}
              className="group bg-[color:var(--color-cream)]/8 backdrop-blur-sm border border-[color:var(--color-cream)]/20 p-8 md:p-10 transition-all duration-500 hover:border-[color:var(--color-bronze)]/60 hover:bg-[color:var(--color-cream)]/15"
            >
              {/* Icone */}
              <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[color:var(--color-taupe)]/15 text-[color:var(--color-bronze-soft)] group-hover:bg-[color:var(--color-bronze)]/25 transition-colors">
                <Download size={24} strokeWidth={1.75} aria-hidden="true" />
              </div>

              {/* Titre */}
              <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-base md:text-lg uppercase tracking-[0.04em] mb-4 leading-snug">
                {g.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-[color:var(--color-cream)]/75 mb-6">
                {g.desc}
              </p>

              {/* Badge */}
              <span className="inline-block eyebrow text-[color:var(--color-bronze-soft)] border-l-2 border-[color:var(--color-bronze)] pl-3">
                {t("tools.guides.comingSoonLabel")}
              </span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
