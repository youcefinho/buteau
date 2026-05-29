import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { AnimatedSignature } from "./AnimatedSignature";

/**
 * « Le mot du courtier » — section letter-format AUTHENTIQUE.
 *
 * Pourquoi NOVEL : aucun autre client Intralys n'a une section qui mime un papier
 * à lettre manuscrit luxury. C'est la touche personal brand qui rend Andrew tangible.
 *
 * Structure :
 * - Eyebrow tirets longs encadrants
 * - "Bonjour," dropcap Cormorant  XL
 * - 3 paragraphes Cormorant  1.7-1.8 leading (effet papier à lettre)
 * - Signature SVG animée au scroll-into-view
 * - Texte signataire italique sous la signature
 *
 * Layout : asymétrique 8/4 (texte 8, signature 4) sur desktop ; vertical mobile.
 */
export function BrokerLetter() {
  const { t, lang } = useLanguage();
  // Lightbox state (user 2026-05-22) — click photo Andrew = agrandit modal.
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxOpen(false); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen]);

  return (
    <section id="lettre" className="relative py-[clamp(4rem,9vw,8rem)] surface-cream overflow-hidden">
      {/* Atmospheric continuity — embers per-section signature */}

      {/* Filigrane "lettre M" Cormorant en filigrane (référence "mot du courtier") */}
      <span
        aria-hidden="true"
        className="absolute -top-12 -left-8 font-[var(--font-editorial)] text-[color:var(--color-taupe)]/8 text-[28rem] leading-none pointer-events-none select-none"
      >
        m
      </span>

      <Container size="lg" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(2.5rem,5vw,4rem)] items-start">
          {/* Lettre — col 8 */}
          <div className="lg:col-span-8 lg:pr-8">
            <p className="eyebrow text-[color:var(--color-bronze)] inline-flex items-center gap-3 mb-10">
              <span className="inline-block w-6 h-px bg-[color:var(--color-bronze)]" />
              {t("letter.eyebrow")}
              <span className="inline-block w-6 h-px bg-[color:var(--color-bronze)]" />
            </p>

            {/* "Bonjour," — accroche Fraunces  XL avec axes optical + WONK
                (signature endroit #3, plus distinctive que Cormorant). */}
            <p className="font-signature text-[color:var(--color-navy-deep)] text-[clamp(2.25rem,5vw,3.75rem)] leading-none mb-10 tracking-[-0.015em]">
              {t("letter.heading")}
            </p>

            {/* Body paragraphes */}
            <div className="space-y-7 max-w-2xl text-[color:var(--color-navy-deep)]/85">
              <p className="text-[clamp(1.125rem,1.6vw,1.25rem)] leading-[1.7] text-pretty hyphens-auto">
                {t("letter.bodyP1")}{" "}
                <span className="not-italic font-semibold text-[color:var(--color-navy)]">
                  {t("letter.bodyP1Emphasis")}
                </span>
              </p>

              <p className="text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.75] text-pretty hyphens-auto">
                {t("letter.bodyP2")}
              </p>

              <p className="text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.75] text-pretty hyphens-auto">
                {t("letter.bodyP3")}
              </p>
            </div>

            {/* Closing manuscrit */}
            <p className="font-[var(--font-editorial)] text-[color:var(--color-navy-deep)] text-[clamp(1.5rem,2.5vw,1.875rem)] mt-10 leading-none">
              {t("letter.closing")}
            </p>
          </div>

          {/* Signature column — col 4. Ordre split mobile vs desktop (user 2026-05-21 v8) :
              - Mobile : signature -> nom -> photo (lettre signee naturelle, portrait apres)
              - Desktop : photo -> signature -> nom (photo ancre visuelle haut de colonne)
              CSS `order` + `lg:order` pilote l'ordre flex selon viewport.
              lg:-translate-x-12 = decalage visible vers la gauche desktop. */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-center lg:pt-24 lg:-translate-x-12">
            {/* Photo Andrew en entrevue — clickable lightbox user 2026-05-22 */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={lang === "fr" ? "Agrandir la photo d'Andrew" : "Enlarge Andrew's photo"}
              className="order-3 lg:order-1 w-full max-w-[280px] photo-edito group mt-10 lg:mt-0 cursor-zoom-in p-0 border-0 bg-transparent"
            >
              <picture>
                <source srcSet="/equipe/andrew-podcast.avif" type="image/avif" />
                <source srcSet="/equipe/andrew-podcast.webp" type="image/webp" />
                <img
                  src="/equipe/andrew-podcast.jpg"
                  alt="Andrew Buteau en entrevue"
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={1200}
                  className="w-full h-auto block shadow-[0_8px_24px_-12px_rgba(16,34,61,0.25)] transition-shadow duration-500 group-hover:shadow-[0_14px_36px_-12px_rgba(16,34,61,0.4)]"
                />
              </picture>
            </button>
            {/* Signature manuscrite */}
            <div className="order-1 lg:order-2 w-full max-w-[320px] lg:mt-12">
              <AnimatedSignature className="w-full h-auto" duration={2400} />
            </div>
            {/* Nom + role */}
            <div className="order-2 lg:order-3 mt-6 lg:mt-8 lg:text-center w-full max-w-[320px]">
              <div className="w-12 h-px bg-[color:var(--color-bronze)] lg:mx-auto mb-3" />
              <p className="eyebrow text-[color:var(--color-taupe-dark)]">
                {t("letter.role")}
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Lightbox modal — user 2026-05-22. Click photo Andrew = agrandit full-size
          centré, backdrop noir 92% + blur. Click outside ou Escape ferme. */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lang === "fr" ? "Photo agrandie" : "Enlarged photo"}
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 cursor-zoom-out animate-[buteauFadeIn_240ms_ease-out]"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.92)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            aria-label={lang === "fr" ? "Fermer" : "Close"}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 flex items-center justify-center rounded-full bg-[color:var(--color-navy-deep)]/80 border border-[color:var(--color-taupe)]/40 text-[color:var(--color-cream)] hover:bg-[color:var(--color-bronze)]/20 hover:border-[color:var(--color-bronze)]/60 transition-all duration-200 z-10"
          >
            <X size={20} strokeWidth={1.8} aria-hidden />
          </button>
          <picture onClick={(e) => e.stopPropagation()}>
            <source srcSet="/equipe/andrew-podcast.avif" type="image/avif" />
            <source srcSet="/equipe/andrew-podcast.webp" type="image/webp" />
            <img
              src="/equipe/andrew-podcast.jpg"
              alt="Andrew Buteau en entrevue"
              className="max-w-full max-h-full object-contain shadow-2xl cursor-default"
              style={{ borderRadius: 2 }}
            />
          </picture>
        </div>
      )}
    </section>
  );
}
