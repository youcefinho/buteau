import { Play, Newspaper, Camera } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { ta, translations } from "@/lib/translations";

/**
 * MediaShowcase — section éditoriale "Vu dans les médias & engagement
 * communautaire". Combine un embed YouTube (passage à l'émission TV
 * "Art de Réussir") et une galerie magazine de l'événement caritatif
 * "Dans la rue" novembre 2025.
 *
 * Pourquoi NOVEL : pattern "press kit + community engagement" en format
 * éditorial luxury — pas un simple bloc logos. Donne du social proof
 * autorité (TV) + chaleur humaine (événement bénévole).
 *
 * Layout :
 * - Header magazine (eyebrow + title + subtitle)
 * - Bloc 1 : embed YouTube 16:9 + caption éditoriale à droite (7/5)
 * - Bloc 2 : galerie 4 photos asymétrique "Dans la rue" + caption (5/7)
 *
 * Photos servies depuis /public/media/*.jpg (copiées depuis Downloads/buteau mail 2).
 */

const youtubeId = "GojrM7ftwUE"; // Andrew Buteau à Art de Réussir
const eventGallery = [
  "/media/art-reussir-01.jpg",
  "/media/art-reussir-02.jpg",
  "/media/art-reussir-04.jpg",
  "/media/art-reussir-05.jpg",
];

export function MediaShowcase() {
  const { t, lang } = useLanguage();

  const tvCaptionLines = ta<string[]>(translations[lang], "media.tvCaptionLines");
  const eventCaptionLines = ta<string[]>(translations[lang], "media.eventCaptionLines");

  return (
    <section
      id="media"
      className="relative py-24 md:py-32 surface-cream overflow-hidden"
    >
      {/* Filigrane "TV" Cormorant XL background */}
      <span
        aria-hidden="true"
        className="absolute -top-16 -right-12 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/10 text-[24rem] leading-none pointer-events-none select-none"
      >
        ¶
      </span>

      <Container size="xl" className="relative">
        {/* Header magazine */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <p className="eyebrow text-[color:var(--color-taupe-dark)] inline-flex items-center gap-3 mb-5">
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            {t("media.eyebrow")}
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
          </p>
          <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.04em] leading-[1.1] mb-5">
            {t("media.title")}
          </h2>
          <div className="w-12 h-px bg-[color:var(--color-bronze)] mx-auto mb-6" />
          <p className="font-[var(--font-editorial)] italic text-base md:text-lg text-[color:var(--color-navy-deep)]/80 leading-[1.55]">
            {t("media.subtitle")}
          </p>
        </div>

        {/* Bloc 1 — TV (Art de Réussir) — 7/5 split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20 md:mb-28 items-center">
          {/* Embed YouTube — 7/12 */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative bg-[color:var(--color-navy)] aspect-video overflow-hidden border border-[color:var(--color-taupe)]/40 group halo-glow">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                title={t("media.tvVideoTitle")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          {/* Caption éditoriale — 5/12 */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-4">
              <Play size={14} className="text-[color:var(--color-bronze)]" aria-hidden="true" />
              <p className="eyebrow text-[color:var(--color-bronze-deep)]">
                {t("media.tvEyebrow")}
              </p>
            </div>
            <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-2xl md:text-3xl uppercase tracking-[0.02em] leading-[1.15] mb-5">
              {t("media.tvTitle")}
            </h3>
            <div className="w-10 h-px bg-[color:var(--color-bronze)] mb-6" />
            <div className="space-y-3.5">
              {tvCaptionLines.map((line, idx) => (
                <p
                  key={idx}
                  className="text-base md:text-lg leading-[1.65] text-[color:var(--color-navy-deep)]/85 font-[var(--font-editorial)] italic first:not-italic first:font-normal first:font-[var(--font-body)]"
                >
                  {line}
                </p>
              ))}
            </div>
            <p className="eyebrow text-[color:var(--color-taupe-dark)] mt-6 text-[10px] border-l-2 border-[color:var(--color-bronze)] pl-2.5">
              {t("media.tvShowName")}
            </p>
          </div>
        </div>

        {/* Bloc 2 — Engagement communautaire (Dans la rue) — 5/7 split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Caption éditoriale — 5/12 */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <Camera size={14} className="text-[color:var(--color-bronze)]" aria-hidden="true" />
              <p className="eyebrow text-[color:var(--color-bronze-deep)]">
                {t("media.eventEyebrow")}
              </p>
            </div>
            <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-2xl md:text-3xl uppercase tracking-[0.02em] leading-[1.15] mb-5">
              {t("media.eventTitle")}
            </h3>
            <div className="w-10 h-px bg-[color:var(--color-bronze)] mb-6" />
            <div className="space-y-3.5">
              {eventCaptionLines.map((line, idx) => (
                <p
                  key={idx}
                  className="text-base md:text-lg leading-[1.65] text-[color:var(--color-navy-deep)]/85 font-[var(--font-editorial)] italic first:not-italic first:font-normal first:font-[var(--font-body)]"
                >
                  {line}
                </p>
              ))}
            </div>
            <p className="eyebrow text-[color:var(--color-taupe-dark)] mt-6 text-[10px] border-l-2 border-[color:var(--color-bronze)] pl-2.5">
              <Newspaper size={11} className="inline mr-1.5 -mt-0.5" aria-hidden="true" />
              {t("media.eventDate")}
            </p>
          </div>

          {/* Galerie 4 photos asymétrique — 7/12 */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {eventGallery.map((src, idx) => (
                <div
                  key={src}
                  className={`relative overflow-hidden bg-[color:var(--color-navy)] border border-[color:var(--color-taupe)]/40 group ${
                    idx === 0
                      ? "aspect-[4/5]"
                      : idx === 1
                        ? "aspect-[4/5] mt-8"
                        : idx === 2
                          ? "aspect-[4/5] -mt-8"
                          : "aspect-[4/5]"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${t("media.eventTitle")} — ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-navy-deep)]/30 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-20"
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
