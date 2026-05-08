import { Video } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";

/**
 * Teaser "Prochainement sur TikTok".
 * Layout : eyebrow + title + body + label "à l'affût".
 * Surface cream avec accent visuel (icone + carre bronze).
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
                <Video size={56} strokeWidth={1.5} aria-hidden="true" />
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
            <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-2xl md:text-3xl lg:text-4xl tracking-[-0.01em] leading-tight">
              {t("tools.tiktok.title")}
            </h2>
            <div className="signature-line" />
            <p className="text-base md:text-lg leading-relaxed text-[color:var(--color-navy-deep)]/85">
              {t("tools.tiktok.body")}
            </p>
            <p className="eyebrow text-[color:var(--color-taupe-dark)] pt-2">
              {t("tools.tiktok.ctaLabel")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
