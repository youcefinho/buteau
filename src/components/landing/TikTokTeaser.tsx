import { Link } from "@tanstack/react-router";
import { Play, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";

/**
 * Teaser capsules « 30 secondes top chrono » — pousse vers /capsules.
 * Réécrit pour amener le visiteur sur la nouvelle page-collection.
 *
 * Layout : visual cluster (icone + offset taupe) + content cluster
 * (eyebrow + title + body + 2 CTAs : interne /capsules + externe TikTok).
 */
export function TikTokTeaser() {
  const { t } = useLanguage();

  return (
    <section id="capsules" className="py-24 surface-cream">
      <Container size="md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Visual cluster */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-[color:var(--color-navy)] flex items-center justify-center text-[color:var(--color-bronze-soft)]">
                <Play size={56} strokeWidth={1.5} aria-hidden="true" />
              </div>
              {/* Decorative offset block taupe */}
              <div
                className="absolute -bottom-4 -right-4 w-32 h-32 md:w-40 md:h-40 border-2 border-[color:var(--color-bronze)] -z-10"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Content cluster */}
          <div className="lg:col-span-8 space-y-5">
            <p className="eyebrow text-[color:var(--color-bronze-deep)]">
              {t("tools.tiktok.eyebrow")}
            </p>
            <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.5rem,3vw,2.25rem)] tracking-[-0.01em] leading-tight text-balance">
              {t("tools.tiktok.title")}
            </h2>
            <div className="signature-line" />
            <p className="text-[clamp(1rem,1.4vw,1.125rem)] leading-relaxed text-[color:var(--color-navy-deep)]/85 text-pretty">
              {t("tools.tiktok.body")}
            </p>

            {/* CTAs : interne /capsules + externe TikTok */}
            <div className="flex flex-col sm:flex-row gap-4 items-start pt-3">
              <Link
                to="/capsules"
                className="group inline-flex items-center gap-2 font-[var(--font-display)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-bronze-deep)] hover:text-[color:var(--color-bronze)] transition-colors"
              >
                <span className="relative">
                  {t("tools.tiktok.ctaCollection")}
                  <span className="absolute left-0 -bottom-1 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <a
                href="https://www.tiktok.com/@equipebuteau"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-[var(--font-display)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-taupe-dark)] hover:text-[color:var(--color-bronze-deep)] transition-colors"
              >
                <Play size={12} aria-hidden="true" />
                <span className="relative">
                  {t("tools.tiktok.ctaTikTok")}
                  <span className="absolute left-0 -bottom-1 w-0 h-px bg-[color:var(--color-bronze)] group-hover:w-full transition-[width] duration-500" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
