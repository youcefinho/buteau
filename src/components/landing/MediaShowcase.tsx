import { Play, Newspaper, Camera } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { ta, translations } from "@/lib/translations";

/**
 * MediaShowcase — section éditoriale "Vu dans les médias".
 *
 * Patterns appliqués (skills) :
 * - intralys-edito-magazine : halo-glow on cards, signature lines bronze qui s'étendent
 *   au hover, dropcap première ligne caption, filigrane chiffre Cormorant XL en marge,
 *   eyebrow encadré tirets longs.
 * - intralys-sections-edito-templates : asymétrie 7/5 + 5/7 alterné, chiffres signature
 *   01/02 en marge gauche de chaque bloc (pattern Process zigzag).
 * - frontend-design : moment "wow" via filigrane chiffres XL + asymétrie photos
 *   gallery (4 photos décalées verticalement, pas grid 2x2 stagnante).
 *
 * Layout :
 * - Header magazine (eyebrow + title + filet bronze)
 * - Bloc 1 (chiffre filigrane "01") : embed YouTube 16:9 + caption éditoriale
 *   à droite avec dropcap (7/5)
 * - Bloc 2 (chiffre filigrane "02") : caption + galerie 4 photos asymétrique (5/7)
 *
 * Photos servies depuis /public/media/*.jpg (Art de Réussir behind-the-scenes —
 * les photos Dans la rue ne sont pas encore envoyées par le client, note inline).
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
      {/* Filigrane "¶" Cormorant XL background — signature édito magazine */}
      <span
        aria-hidden="true"
        className="absolute -top-16 -right-12 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/10 text-[24rem] leading-none pointer-events-none select-none"
      >
        ¶
      </span>

      <Container size="xl" className="relative">
        {/* Header magazine — eyebrow encadré tirets longs + h2 + filet signature */}
        <div className="text-center mb-20 md:mb-24 max-w-3xl mx-auto">
          <p className="eyebrow text-[color:var(--color-taupe-dark)] inline-flex items-center gap-3 mb-5">
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            {t("media.eyebrow")}
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
          </p>
          <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.04em] leading-[1.1] mb-5">
            {t("media.title")}
          </h2>
          <div className="w-16 h-px bg-[color:var(--color-bronze)] mx-auto mb-6" />
          <p className="font-[var(--font-editorial)] italic text-base md:text-lg text-[color:var(--color-navy-deep)]/80 leading-[1.55]">
            {t("media.subtitle")}
          </p>
        </div>

        {/* === BLOC 1 — TV (Art de Réussir) — 7/5 split === */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-24 md:mb-32 items-center">
          {/* Chiffre filigrane "01" — pattern signature pages séquentielles */}
          <span
            aria-hidden="true"
            className="hidden md:block absolute -top-12 -left-4 lg:-left-12 font-[var(--font-editorial)] italic text-[color:var(--color-bronze)]/12 text-[12rem] lg:text-[16rem] leading-none pointer-events-none select-none tabular-nums"
          >
            01
          </span>

          {/* Embed YouTube — 7/12 — halo-glow renforcé */}
          <div className="lg:col-span-7 order-2 lg:order-1 relative z-10">
            <div className="halo-glow relative bg-[color:var(--color-navy)] aspect-video overflow-hidden border border-[color:var(--color-taupe)]/40 group">
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
          <div className="lg:col-span-5 order-1 lg:order-2 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Play size={14} className="text-[color:var(--color-bronze)]" aria-hidden="true" />
              <p className="eyebrow text-[color:var(--color-bronze-deep)]">
                {t("media.tvEyebrow")}
              </p>
            </div>
            <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-2xl md:text-3xl uppercase tracking-[0.02em] leading-[1.15] mb-5">
              {t("media.tvTitle")}
            </h3>
            {/* Signature line bronze qui s'étend au hover (pattern intralys-edito-magazine) */}
            <div className="group/line">
              <div className="w-10 h-px bg-[color:var(--color-bronze)] mb-7 transition-[width] duration-500 hover:w-24" />
            </div>
            <div className="space-y-4">
              {tvCaptionLines.map((line, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? "dropcap text-base md:text-[1.0625rem] leading-[1.75] text-[color:var(--color-navy-deep)]/85"
                      : "text-base md:text-lg leading-[1.65] text-[color:var(--color-navy-deep)]/80 font-[var(--font-editorial)] italic"
                  }
                >
                  {line}
                </p>
              ))}
            </div>
            <p className="eyebrow text-[color:var(--color-taupe-dark)] mt-7 text-[10px] border-l-2 border-[color:var(--color-bronze)] pl-2.5">
              {t("media.tvShowName")}
            </p>
          </div>
        </div>

        {/* === BLOC 2 — Coulisses du plateau — 5/7 split === */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Chiffre filigrane "02" — décalé à droite cette fois (asymétrie magazine) */}
          <span
            aria-hidden="true"
            className="hidden md:block absolute -top-12 -right-4 lg:-right-12 font-[var(--font-editorial)] italic text-[color:var(--color-bronze)]/12 text-[12rem] lg:text-[16rem] leading-none pointer-events-none select-none tabular-nums"
          >
            02
          </span>

          {/* Caption éditoriale — 5/12 */}
          <div className="lg:col-span-5 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Camera size={14} className="text-[color:var(--color-bronze)]" aria-hidden="true" />
              <p className="eyebrow text-[color:var(--color-bronze-deep)]">
                {t("media.eventEyebrow")}
              </p>
            </div>
            <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-2xl md:text-3xl uppercase tracking-[0.02em] leading-[1.15] mb-5">
              {t("media.eventTitle")}
            </h3>
            {/* Signature line bronze + dropcap intro (pattern intralys-edito-magazine) */}
            <div className="w-10 h-px bg-[color:var(--color-bronze)] mb-7 transition-[width] duration-500 hover:w-24" />
            <div className="space-y-4">
              {eventCaptionLines.map((line, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? "dropcap text-base md:text-[1.0625rem] leading-[1.75] text-[color:var(--color-navy-deep)]/85"
                      : "text-base md:text-lg leading-[1.65] text-[color:var(--color-navy-deep)]/80 font-[var(--font-editorial)] italic"
                  }
                >
                  {line}
                </p>
              ))}
            </div>
            <p className="eyebrow text-[color:var(--color-taupe-dark)] mt-7 text-[10px] border-l-2 border-[color:var(--color-bronze)] pl-2.5">
              <Newspaper size={11} className="inline mr-1.5 -mt-0.5" aria-hidden="true" />
              {t("media.eventDate")}
            </p>
            {/* Note honnête : photos Dans la rue pas encore reçues du client */}
            <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)]/85 mt-4 leading-[1.55] max-w-md">
              {t("media.communityNote")}
            </p>
          </div>

          {/* Galerie 4 photos asymétrique — 7/12 — halo-glow per photo + signature line hover */}
          <div className="lg:col-span-7 relative z-10">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {eventGallery.map((src, idx) => (
                <figure
                  key={src}
                  className={`halo-glow relative overflow-hidden bg-[color:var(--color-navy)] border border-[color:var(--color-taupe)]/40 hover:border-[color:var(--color-bronze)]/60 transition-colors group ${
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
                  {/* Numéro photo — pattern marginalia signature */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 right-3 font-[var(--font-editorial)] italic text-[color:var(--color-cream)] text-sm tabular-nums opacity-70"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
