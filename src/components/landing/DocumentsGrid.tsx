import { FileDown, FileText } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { Tiltable } from "@/components/layout/Tiltable";
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 max-w-3xl mx-auto" style={{ perspective: "1200px" }}>
          {items.map((doc, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <Tiltable key={idx} maxDeg={4}>
              <article
                className="group card-luxury p-7 md:p-8 flex items-start gap-5 relative overflow-hidden h-full"
              >
                {/* Numéro filigrane Cormorant subtile */}
                <span
                  aria-hidden="true"
                  className="absolute top-3 right-4 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/25 text-4xl leading-none pointer-events-none select-none"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <div className="shrink-0 w-12 h-12 rounded-full bg-[color:var(--color-taupe)]/15 flex items-center justify-center text-[color:var(--color-bronze-deep)] transition-colors duration-500 group-hover:bg-[color:var(--color-bronze)]/15">
                  <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[0.04em] leading-snug mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-xs italic text-[color:var(--color-taupe-dark)] mb-4">{doc.meta}</p>
                  <span className="inline-block eyebrow text-[color:var(--color-bronze-deep)] border-l-2 border-[color:var(--color-bronze)] pl-2.5">
                    {t("tools.documents.comingSoonLabel")}
                  </span>
                </div>
              </article>
              </Tiltable>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
