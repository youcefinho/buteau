import { Link } from "@tanstack/react-router";
import { ArrowRight, Play } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { HeartbeatCta } from "@/components/layout/HeartbeatCta";
import { ta, translations } from "@/lib/translations";

/**
 * CapsulesPreview — table-of-contents éditoriale magazine pour les capsules
 * vidéo « 30 secondes top chrono » (page /capsules complète).
 *
 * Format inspiré de GuidesShelf (5/12 sticky header + 7/12 liste verticale)
 * mais avec format hook plus punchy (citation italique entre guillemets) +
 * Play badge TikTok au lieu de Coming Soon.
 *
 * Synergie : GuidesShelf (guides éducatifs) + CapsulesPreview (vidéos courtes)
 * + ToolsTeaser (overview catégories) sur l'Accueil.
 */
export function CapsulesPreview() {
  const { t, lang } = useLanguage();
  const items = ta<Array<{ categoryId?: string; title: string; hook: string }>>(
    translations[lang],
    "home.capsulesPreview.items",
  );

  return (
    <section className="relative py-[clamp(4rem,9vw,8rem)] surface-cream overflow-hidden">
      {/* Atmospheric continuity — embers per-section signature */}

      {/* Filigrane Play XL background — signature édito magazine */}
      <span
        aria-hidden="true"
        className="absolute -top-12 left-0 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/8 text-[24rem] leading-none pointer-events-none select-none"
      >
        ▶
      </span>

      <Container size="xl" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(2.5rem,5vw,4rem)]">
          {/* Header column — 5/12 sticky desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-[color:var(--color-taupe-dark)] inline-flex items-center gap-3 mb-5">
              <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
              {t("home.capsulesPreview.eyebrow")}
            </p>
            <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.875rem,3vw,2.25rem)] uppercase tracking-[0.04em] leading-[1.1] mb-5 text-balance">
              {t("home.capsulesPreview.title")}
            </h2>
            <div className="w-12 h-px bg-[color:var(--color-bronze)] mb-6" />
            <p className="font-[var(--font-editorial)] italic text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.65] text-[color:var(--color-navy-deep)]/80 mb-8 text-pretty">
              {t("home.capsulesPreview.subtitle")}
            </p>

            <HeartbeatCta>
              <Link
                to="/capsules"
                className="group inline-flex items-center gap-2 font-[var(--font-display)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-bronze-deep)] hover:text-[color:var(--color-bronze)] transition-colors"
              >
                <span className="relative">
                  {t("home.capsulesPreview.ctaFull")}
                  <span className="absolute left-0 -bottom-1 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </HeartbeatCta>
            {/* Teaser editorial sous CTA — décrit le contenu /capsules (34
                capsules, 7 catégories, sujets concrets) en voix Andrew. */}
            <p
              className="mt-4 font-[var(--font-editorial)] italic text-[color:var(--color-taupe-dark)] text-[clamp(0.8125rem,1.05vw,0.875rem)] leading-snug max-w-md text-pretty"
            >
              {lang === "fr"
                ? "34 capsules vidéo en 7 catégories — mise de fonds, refi, dettes, stratégies, expliquées en 30 secondes."
                : "34 video capsules in 7 categories — down payment, refi, debt, strategies, explained in 30 seconds."}
            </p>
          </div>

          {/* Items list — 7/12 — magazine table-of-contents éditorial */}
          <ol className="lg:col-span-7 space-y-0 border-t border-[color:var(--color-taupe)]/40">
            {items.map((item, idx) => (
              <li key={`${idx}-${item.title.slice(0, 20)}`}>
                <Link
                  to="/capsules"
                  hash={item.categoryId}
                  className="group flex items-start gap-[clamp(1.25rem,2vw,1.75rem)] py-[clamp(1.5rem,2vw,1.75rem)] border-b border-[color:var(--color-taupe)]/40 transition-colors duration-300 hover:border-[color:var(--color-bronze)]"
                >
                  {/* Numéro Cormorant italic XL — pattern table-of-contents magazine */}
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)] group-hover:text-[color:var(--color-bronze-deep)] text-[clamp(1.875rem,3vw,2.25rem)] leading-none tabular-nums w-12 md:w-14 transition-colors duration-300"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Tag eyebrow + Play icon — fix LOW i18n (avant FR hardcoded) */}
                    <div className="flex items-center gap-2 mb-1">
                      <Play
                        size={11}
                        className="text-[color:var(--color-bronze)]"
                        aria-hidden="true"
                      />
                      <p className="eyebrow text-[color:var(--color-bronze-deep)] text-[10px]">
                        {lang === "fr" ? "Capsule · 30 sec" : "Capsule · 30 sec"}
                      </p>
                    </div>

                    {/* Title */}
                    <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.125rem,1.6vw,1.25rem)] uppercase tracking-[0.02em] leading-snug text-balance group-hover:text-[color:var(--color-bronze-deep)] transition-colors">
                      {item.title}
                    </h3>

                    {/* Hook entre guillemets italique — voix Andrew */}
                    <p className="font-[var(--font-editorial)] italic text-[clamp(0.875rem,1.2vw,1rem)] leading-[1.6] text-[color:var(--color-navy-deep)]/75 text-pretty">
                      « {item.hook} »
                    </p>
                  </div>

                  {/* Right column : TikTok badge + arrow */}
                  <div className="shrink-0 flex flex-col items-end gap-3">
                    <span className="eyebrow text-[color:var(--color-bronze-deep)] text-[9px] border-l-2 border-[color:var(--color-bronze)] pl-2">
                      TikTok
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-[color:var(--color-taupe)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[color:var(--color-bronze-deep)] transition-all duration-300"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
