import { useState, useEffect } from "react";
import { Play, Newspaper, Camera, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { ta, translations } from "@/lib/translations";

/**
 * MediaShowcase — section éditoriale "Vu dans les médias et dans la communauté".
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
 * - Bloc 1 (chiffre filigrane "01") : embed YouTube 16:9 (Art de Réussir) + caption
 *   éditoriale à droite avec dropcap (7/5)
 * - Bloc 2 (chiffre filigrane "02") : caption + galerie 4 photos asymétrique
 *   soirée-bénéfice Dans la rue, novembre 2025 (5/7)
 *
 * Photos /public/media/dans-la-rue-XX.jpg viennent du mail #2 client.
 */

const youtubeId = "GojrM7ftwUE"; // Andrew Buteau à Art de Réussir
// Photos Art de Réussir behind-the-scenes (mail #1 client) — affichées sous le YouTube
const tvGallery = [
  "/media/art-reussir-01.jpg",
  "/media/art-reussir-02.jpg",
  "/media/art-reussir-03.jpg",
];
// Photos soirée-bénéfice Dans la rue novembre 2025 (mail #2 client) — 6 photos
const eventGallery = [
  "/media/dans-la-rue-03.jpg",
  "/media/dans-la-rue-02.jpg",
  "/media/dans-la-rue-04.jpg",
  "/media/dans-la-rue-05.jpg",
  "/media/dans-la-rue-01.jpg",
  "/media/dans-la-rue-06.jpg",
];

export function MediaShowcase() {
  const { t, lang } = useLanguage();
  // Lazy mount iframe (fix MEDIUM) : économise ~600 kB scripts YouTube au load initial.
  // Mount uniquement au clic sur le poster.
  const [videoPlaying, setVideoPlaying] = useState(false);
  // Lightbox state (user 2026-05-22) — click photo = agrandit en modal.
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

  // Escape key + body scroll lock pendant lightbox open
  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxSrc(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxSrc]);

  const openLightbox = (src: string, alt: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
  };

  const tvCaptionLines = ta<string[]>(translations[lang], "media.tvCaptionLines");
  const eventCaptionLines = ta<string[]>(translations[lang], "media.eventCaptionLines");

  return (
    <section
      id="media"
      className="relative py-[clamp(4rem,9vw,8rem)] surface-cream overflow-hidden"
    >
      {/* Filigrane "¶" Cormorant XL background — signature édito magazine */}
      <span
        aria-hidden="true"
        className="absolute -top-16 -right-12 font-[var(--font-editorial)]  text-[color:var(--color-taupe)]/10 text-[24rem] leading-none pointer-events-none select-none"
      >
        ¶
      </span>

      <Container size="xl" className="relative">
        {/* Header magazine — eyebrow encadré tirets longs + h2 + filet signature */}
        <div className="text-center mb-[clamp(4rem,6vw,6rem)] max-w-3xl mx-auto">
          <p className="eyebrow text-[color:var(--color-taupe-dark)] inline-flex items-center gap-3 mb-5">
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            {t("media.eyebrow")}
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
          </p>
          <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.875rem,4vw,3rem)] uppercase tracking-[0.04em] leading-[1.1] mb-5 text-balance">
            {t("media.title")}
          </h2>
          <div className="w-16 h-px bg-[color:var(--color-bronze)] mx-auto mb-6" />
          <p className=" text-[clamp(1rem,1.4vw,1.125rem)] text-[color:var(--color-navy-deep)]/80 leading-[1.55] text-pretty">
            {t("media.subtitle")}
          </p>
        </div>

        {/* === BLOC 1 — TV (Art de Réussir) — 7/5 split === */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-[clamp(2rem,3vw,3rem)] mb-[clamp(4rem,7vw,8rem)] items-center">
          {/* Chiffre filigrane "01" — pattern signature pages séquentielles */}
          <span
            aria-hidden="true"
            className="hidden md:block absolute -top-12 -left-4 lg:-left-12 font-[var(--font-editorial)]  text-[color:var(--color-bronze)]/12 text-[12rem] lg:text-[16rem] leading-none pointer-events-none select-none tabular-nums"
          >
            01
          </span>

          {/* Embed YouTube + strip thumbnails coulisses — 7/12 — halo-glow renforcé.
              Fix MEDIUM : poster lazy load. Iframe mount UNIQUEMENT au clic (économie ~600 kB scripts YouTube). */}
          <div className="lg:col-span-7 order-2 lg:order-1 relative z-10 space-y-4">
            <div className="halo-glow relative bg-[color:var(--color-navy)] aspect-video overflow-hidden border border-[color:var(--color-taupe)]/40 group">
              {videoPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=1`}
                  title={t("media.tvVideoTitle")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setVideoPlaying(true)}
                  aria-label={`${t("media.tvVideoTitle")} — ${lang === "fr" ? "lancer la vidéo" : "play video"}`}
                  className="absolute inset-0 w-full h-full flex items-center justify-center group/play"
                >
                  <img
                    src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`}
                    alt=""
                    loading="lazy"
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-navy-deep)]/60 via-[color:var(--color-navy-deep)]/20 to-[color:var(--color-navy-deep)]/40 transition-opacity duration-500 group-hover/play:opacity-80"
                  />
                  <span className="relative z-10 flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-[color:var(--color-bronze)]/95 text-[color:var(--color-navy-deep)] shadow-2xl transition-all duration-500 group-hover/play:scale-110 group-hover/play:bg-[color:var(--color-navy)]">
                    <Play size={32} className="ml-1" aria-hidden="true" />
                  </span>
                </button>
              )}
            </div>

            {/* Strip 3 thumbnails coulisses Art de Réussir — photos mail #1 client.
                Clickable -> lightbox (user 2026-05-22). */}
            <div className="grid grid-cols-3 gap-3">
              {tvGallery.map((src, idx) => {
                const altText = `${t("media.tvTitle")} — ${idx + 1}`;
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => openLightbox(src, altText)}
                    aria-label={`${altText} — ${lang === "fr" ? "agrandir" : "enlarge"}`}
                    className="halo-glow relative aspect-[4/5] overflow-hidden bg-[color:var(--color-navy)] border border-[color:var(--color-taupe)]/40 hover:border-[color:var(--color-bronze)]/60 transition-colors group cursor-zoom-in"
                  >
                    <img
                      src={src}
                      alt={altText}
                      loading="lazy"
                      className="photo-edito w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-navy-deep)]/30 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-20"
                      aria-hidden="true"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute bottom-2 right-2  text-[color:var(--color-cream)] text-xs tabular-nums opacity-70"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caption éditoriale — 5/12 */}
          <div className="lg:col-span-5 order-1 lg:order-2 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Play size={14} className="text-[color:var(--color-bronze)]" aria-hidden="true" />
              <p className="eyebrow text-[color:var(--color-navy)]">
                {t("media.tvEyebrow")}
              </p>
            </div>
            <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.5rem,2.5vw,1.875rem)] uppercase tracking-[0.02em] leading-[1.15] mb-5 text-balance">
              {t("media.tvTitle")}
            </h3>
            {/* Signature line bronze qui s'étend au hover (pattern intralys-edito-magazine) */}
            <div className="group/line">
              <div className="w-10 h-px bg-[color:var(--color-bronze)] mb-7 transition-[width] duration-500 hover:w-24" />
            </div>
            <div className="space-y-4">
              {tvCaptionLines.map((line, idx) => (
                <p
                  key={`tv-${idx}-${line.slice(0, 20)}`}
                  className={
                    idx === 0
                      ? "dropcap text-[clamp(1rem,1.3vw,1.0625rem)] leading-[1.75] text-[color:var(--color-navy-deep)]/85"
                      : "text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.65] text-[color:var(--color-navy-deep)]/80 "
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
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-[clamp(2rem,3vw,3rem)] items-center">
          {/* Chiffre filigrane "02" — décalé à droite cette fois (asymétrie magazine) */}
          <span
            aria-hidden="true"
            className="hidden md:block absolute -top-12 -right-4 lg:-right-12 font-[var(--font-editorial)]  text-[color:var(--color-bronze)]/12 text-[12rem] lg:text-[16rem] leading-none pointer-events-none select-none tabular-nums"
          >
            02
          </span>

          {/* Caption éditoriale — 5/12 */}
          <div className="lg:col-span-5 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Camera size={14} className="text-[color:var(--color-bronze)]" aria-hidden="true" />
              <p className="eyebrow text-[color:var(--color-navy)]">
                {t("media.eventEyebrow")}
              </p>
            </div>
            <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.5rem,2.5vw,1.875rem)] uppercase tracking-[0.02em] leading-[1.15] mb-5 text-balance">
              {t("media.eventTitle")}
            </h3>
            {/* Signature line bronze + dropcap intro (pattern intralys-edito-magazine) */}
            <div className="w-10 h-px bg-[color:var(--color-bronze)] mb-7 transition-[width] duration-500 hover:w-24" />
            <div className="space-y-4">
              {eventCaptionLines.map((line, idx) => (
                <p
                  key={`event-${idx}-${line.slice(0, 20)}`}
                  className={
                    idx === 0
                      ? "dropcap text-[clamp(1rem,1.3vw,1.0625rem)] leading-[1.75] text-[color:var(--color-navy-deep)]/85"
                      : "text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.65] text-[color:var(--color-navy-deep)]/80 "
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
          </div>

          {/* Galerie 6 photos — 7/12 — halo-glow per photo + signature line hover
              Layout : mobile 2 cols, desktop 3 cols × 2 lignes (pas de 3e ligne en dessous)
              Stagger asymétrique vertical subtle pour rythme magazine. */}
          <div className="lg:col-span-7 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {eventGallery.map((src, idx) => {
                const staggerClass = (() => {
                  // Stagger asymétrique : col-2 (idx 1, 4) descend, col-3 (idx 2, 5) reste
                  switch (idx) {
                    case 1: return "lg:mt-6";
                    case 4: return "lg:mt-6";
                    default: return "";
                  }
                })();
                const altText = `${t("media.eventTitle")} — ${idx + 1}`;
                return (
                <button
                  key={src}
                  type="button"
                  onClick={() => openLightbox(src, altText)}
                  aria-label={`${altText} — ${lang === "fr" ? "agrandir" : "enlarge"}`}
                  className={`halo-glow relative aspect-[4/5] overflow-hidden bg-[color:var(--color-navy)] border border-[color:var(--color-taupe)]/40 hover:border-[color:var(--color-bronze)]/60 transition-colors group cursor-zoom-in ${staggerClass}`}
                >
                  <img
                    src={src}
                    alt={altText}
                    loading="lazy"
                    className="photo-edito w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-navy-deep)]/30 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-20"
                    aria-hidden="true"
                  />
                  {/* Numéro photo — pattern marginalia signature */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 right-3  text-[color:var(--color-cream)] text-sm tabular-nums opacity-70"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </button>
                );
              })}
            </div>
          </div>
        </div>
      </Container>

      {/* Lightbox modal — user 2026-05-22. Click photo (tv ou event) -> agrandit
          full-size centré dans backdrop noir 90%. Click-outside ou Escape ferme. */}
      {lightboxSrc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lang === "fr" ? "Photo agrandie" : "Enlarged photo"}
          onClick={() => setLightboxSrc(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 cursor-zoom-out animate-[buteauFadeIn_240ms_ease-out]"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.92)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxSrc(null); }}
            aria-label={lang === "fr" ? "Fermer" : "Close"}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 flex items-center justify-center rounded-full bg-[color:var(--color-navy-deep)]/80 border border-[color:var(--color-taupe)]/40 text-[color:var(--color-cream)] hover:bg-[color:var(--color-bronze)]/20 hover:border-[color:var(--color-bronze)]/60 transition-all duration-200 z-10"
          >
            <X size={20} strokeWidth={1.8} aria-hidden />
          </button>
          <img
            src={lightboxSrc}
            alt={lightboxAlt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain shadow-2xl cursor-default"
            style={{ borderRadius: 2 }}
          />
        </div>
      )}
    </section>
  );
}
