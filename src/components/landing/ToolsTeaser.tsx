import { Link } from "@tanstack/react-router";
import { BookOpen, Video, FileText, Download } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";

/**
 * Section Outils & Ressources (teaser) — 4 cartes glass sur surface navy.
 * Ref visuelle : Accueil.html lignes 1374-1450.
 */
const ICONS = [BookOpen, Video, FileText, Download];

export function ToolsTeaser() {
  const { t, lang } = useLanguage();
  const items = ta<Array<{ title: string; desc: string }>>(
    translations[lang],
    "home.tools.items",
  );

  return (
    <section
      id="outils-teaser"
      className="relative py-24 surface-navy overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 34, 61, 0.88), rgba(16, 34, 61, 0.88)), url('https://i.imgur.com/Bw7Zyf4.jpg')",
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {items.map((item, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <Link
                key={idx}
                to="/outils"
                className="group block bg-[color:var(--color-cream)]/8 backdrop-blur-sm border border-[color:var(--color-cream)]/20 p-8 text-center transition-all duration-500 hover:bg-[color:var(--color-cream)]/15 hover:border-[color:var(--color-bronze)]/60 hover:-translate-y-1"
              >
                <div className="mb-4 flex justify-center text-[color:var(--color-taupe)] group-hover:text-[color:var(--color-bronze-soft)] transition-colors">
                  <Icon size={40} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-lg uppercase tracking-[var(--tracking-eyebrow)] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[color:var(--color-cream)]/70 leading-relaxed">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/outils" className="btn-bronze">
            {t("home.tools.cta")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
