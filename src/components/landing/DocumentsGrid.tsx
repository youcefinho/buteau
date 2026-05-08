import { FileDown, FileText } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { ta, translations } from "@/lib/translations";

/**
 * Section Documents téléchargeables.
 * 2 cartes (Liste documents requis / Guide acheteur) — toutes "Bientôt disponible".
 */

const ICONS = [FileDown, FileText];

export function DocumentsGrid() {
  const { t, lang } = useLanguage();
  const items = ta<Array<{ title: string; meta: string }>>(
    translations[lang],
    "tools.documents.items",
  );

  return (
    <section id="documents" className="py-24 surface-cream">
      <Container size="md">
        <SectionHeading
          eyebrow={t("tools.documents.eyebrow")}
          title={t("tools.documents.title")}
          subtitle={t("tools.documents.subtitle")}
          tone="light"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {items.map((doc, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <article
                key={idx}
                className="group card-luxury p-7 flex items-start gap-5"
              >
                <div className="shrink-0 w-12 h-12 rounded-full bg-[color:var(--color-taupe)]/15 flex items-center justify-center text-[color:var(--color-bronze-deep)]">
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[0.04em] leading-snug mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-[color:var(--color-taupe-dark)] mb-3">{doc.meta}</p>
                  <span className="inline-block eyebrow text-[color:var(--color-bronze-deep)] border-l-2 border-[color:var(--color-bronze)] pl-2.5">
                    {t("tools.documents.comingSoonLabel")}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
