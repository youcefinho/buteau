import { FileText, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { HeartbeatCta } from "@/components/layout/HeartbeatCta";

/**
 * Teaser /journal — depuis /outils, lien direct vers la page journal.
 * Layout : intro a gauche + visual a droite (inverse de TikTokTeaser pour rythme).
 */
export function BlogTeaser() {
  const { t, lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <section
      id="blog"
      className="relative py-24 surface-navy overflow-hidden border-t border-[color:var(--color-taupe)]/20 grain-overlay"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 34, 61, 0.94), rgba(16, 34, 61, 0.94)), image-set(url('/texture-navy-fixed.avif') type('image/avif'), url('/texture-navy-fixed.webp') type('image/webp'), url('/texture-navy-fixed.jpg'))",
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
            <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-[clamp(1.5rem,3vw,2.25rem)] tracking-[-0.01em] leading-tight text-balance">
              {t("tools.blog.title")}
            </h2>
            <div className="w-12 h-0.5 bg-[color:var(--color-bronze)]" />
            <p className="text-[clamp(1rem,1.4vw,1.125rem)] leading-relaxed text-[color:var(--color-cream)]/85 text-pretty">
              {t("tools.blog.body")}
            </p>
            <div className="pt-3">
              <HeartbeatCta>
                <Link
                  to="/journal"
                  className="group inline-flex items-center gap-2 font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-bronze-soft)] hover:text-[color:var(--color-cream)] transition-colors"
                >
                  <span className="relative">
                    {t("tools.blog.ctaLabel")}
                    <span className="absolute left-0 -bottom-1 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </span>
                  <ArrowRight
                    size={14}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </HeartbeatCta>
              {/* Teaser editorial — surface navy, cream/70. */}
              <p
                className="mt-3  text-[color:var(--color-cream)]/70 text-[clamp(0.8125rem,1.05vw,0.875rem)] leading-snug max-w-md text-pretty"
              >
                {isFr
                  ? "Articles longs voix Andrew — analyses, décryptages, mécaniques expliquées sans diluer."
                  : "Long-form articles in Andrew's voice — analyses, breakdowns, mechanics explained without dilution."}
              </p>
            </div>
          </div>

          {/* Visual (4 cols) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end lg:order-2 order-1">
            <Link
              to="/journal"
              aria-label={t("tools.blog.ctaLabel")}
              className="relative group"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 bg-[color:var(--color-cream)] flex items-center justify-center text-[color:var(--color-navy-deep)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:-translate-x-1">
                <FileText size={56} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div
                className="absolute -bottom-4 -left-4 w-32 h-32 md:w-40 md:h-40 border-2 border-[color:var(--color-taupe)] -z-10 transition-colors duration-500 group-hover:border-[color:var(--color-bronze)]"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
