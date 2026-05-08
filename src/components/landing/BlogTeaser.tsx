import { FileText } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";

/**
 * Teaser "Notre blog sera bientôt disponible".
 * Layout : intro a gauche + visual a droite (inverse de TikTokTeaser pour rythme).
 */
export function BlogTeaser() {
  const { t } = useLanguage();

  return (
    <section
      id="blog"
      className="relative py-24 surface-navy overflow-hidden border-t border-[color:var(--color-taupe)]/20 grain-overlay"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 34, 61, 0.94), rgba(16, 34, 61, 0.94)), url('https://i.imgur.com/Bw7Zyf4.jpg')",
        }}
        aria-hidden="true"
      />

      <Container size="md" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Content (8 cols) */}
          <div className="lg:col-span-8 space-y-5 lg:order-1 order-2">
            <p className="eyebrow text-[color:var(--color-bronze-soft)]">
              {t("tools.blog.eyebrow")}
            </p>
            <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-2xl md:text-3xl lg:text-4xl tracking-[-0.01em] leading-tight">
              {t("tools.blog.title")}
            </h2>
            <div className="w-12 h-0.5 bg-[color:var(--color-bronze)]" />
            <p className="text-base md:text-lg leading-relaxed text-[color:var(--color-cream)]/85">
              {t("tools.blog.body")}
            </p>
            <p className="eyebrow text-[color:var(--color-taupe)] pt-2">
              {t("tools.blog.ctaLabel")}
            </p>
          </div>

          {/* Visual (4 cols) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end lg:order-2 order-1">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-[color:var(--color-cream)] flex items-center justify-center text-[color:var(--color-navy-deep)]">
                <FileText size={56} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div
                className="absolute -bottom-4 -left-4 w-32 h-32 md:w-40 md:h-40 border-2 border-[color:var(--color-taupe)] -z-10"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
