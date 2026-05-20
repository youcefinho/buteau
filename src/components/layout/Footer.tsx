import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useGlossary } from "@/lib/GlossaryContext";
import { useColophon } from "@/lib/ColophonContext";
import { useCarnet } from "@/lib/CarnetContext";
import { config } from "@/lib/config";
import { Container } from "./Container";

/**
 * Footer "Back Cover" — refonte radicale (vs 4-col layout générique).
 *
 * Pourquoi NOVEL : pattern 4-col footer = AI generic. Ici on a une vraie 4ème
 * de couverture de magazine luxury :
 * - Statement éditorial Cormorant italic en énorme (la "tagline du dos")
 * - Monogramme BUTEAU XL en filigrane
 * - Colophon (typo credits) — détail magazine print
 * - Bandeau navigation + contact + légal en pied minimaliste
 */
export function Footer() {
  const { t, lang } = useLanguage();
  const { open: openGlossary } = useGlossary();
  const { open: openColophon } = useColophon();
  const { open: openCarnet } = useCarnet();
  const year = new Date().getFullYear();

  return (
    <footer className="relative surface-navy overflow-hidden grain-overlay">
      {/* Monogramme BUTEAU filigrane gigantesque arrière-plan */}
      <span
        aria-hidden="true"
        className="absolute -bottom-24 -right-12 font-[var(--font-display)] font-extrabold text-[color:var(--color-cream)]/[0.04] text-[20rem] md:text-[28rem] lg:text-[36rem] leading-none tracking-[0.18em] pointer-events-none select-none whitespace-nowrap"
      >
        {config.brandName}
      </span>

      <Container size="xl" className="relative pt-[clamp(2.5rem,5vw,4rem)] pb-6">
        {/* === Logo SVG officiel (guide identite visuelle 2026-05-19) === */}
        <img
          src="/logo-buteau-white.svg"
          alt="Buteau — L'hypothèque autrement"
          width={1267}
          height={368}
          loading="lazy"
          decoding="async"
          className="h-[clamp(2.5rem,4vw,3.5rem)] w-auto mb-[clamp(1.5rem,2.5vw,2rem)] opacity-95"
        />

        {/* === Couverture statement — Cormorant italic XL === */}
        <div className="max-w-4xl mb-[clamp(2rem,3vw,2.5rem)]">
          <p className="eyebrow text-[color:var(--color-taupe)] mb-4 inline-flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            {lang === "fr" ? "Quatrième de couverture" : "Back cover"}
          </p>
          <p className="font-[var(--font-editorial)] italic text-[color:var(--color-cream)] text-[clamp(1.5rem,3.5vw,2.75rem)] leading-[1.1] tracking-tight">
            « {t("footer.coverStatement")} »
          </p>
          <div className="flex items-center gap-4 mt-6">
            <span className="block w-12 h-px bg-[color:var(--color-bronze)]" />
            <p className="eyebrow text-[color:var(--color-taupe)]">
              Andrew Buteau
            </p>
          </div>
        </div>

        {/* === Grid asymétrique : Contact / Navigation / Colophon === */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[clamp(2rem,3vw,3rem)] pb-6 border-b border-[color:var(--color-taupe)]/30">
          {/* Contact — col 5 */}
          <div className="md:col-span-5 space-y-4">
            <p className="eyebrow text-[color:var(--color-taupe)]">
              {t("footer.contact")}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={14} className="mt-1 shrink-0 text-[color:var(--color-bronze)]" aria-hidden="true" />
                <a
                  href={`tel:${config.phone.raw}`}
                  className="text-glow-hover font-[var(--font-display)] text-base font-semibold"
                >
                  {config.phone.display}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} className="mt-1 shrink-0 text-[color:var(--color-bronze)]" aria-hidden="true" />
                <a
                  href={`mailto:${config.email}`}
                  className="text-glow-hover break-all"
                >
                  {config.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-1 shrink-0 text-[color:var(--color-bronze)]" aria-hidden="true" />
                <span className="text-[color:var(--color-cream)]/80 leading-relaxed">
                  {config.address.streetAddress}
                  <br />
                  {config.address.addressLocality}, {config.address.addressRegion} {config.address.postalCode}
                </span>
              </li>
            </ul>

            {/* Reseaux sociaux — deplaces de la Navbar vers le Footer 2026-05-19.
                Style identique a la Navbar (border + hover translate + scale active).
                Adapte au fond navy : foreground cream + hover bronze. */}
            <div className="pt-4 space-y-3">
              <p className="eyebrow text-[color:var(--color-taupe)]">
                {lang === "fr" ? "Suivez-moi" : "Follow"}
              </p>
              <div className="flex items-center gap-1.5">
                {config.socials.instagram && (
                  <a
                    href={config.socials.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Andrew Buteau"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-[color:var(--color-cream)]/25 text-[color:var(--color-cream)] hover:border-[color:var(--color-bronze)] hover:text-[color:var(--color-bronze)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                  >
                    <Instagram className="w-4 h-4" strokeWidth={1.7} />
                  </a>
                )}
                {config.socials.linkedin && (
                  <a
                    href={config.socials.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Andrew Buteau"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-[color:var(--color-cream)]/25 text-[color:var(--color-cream)] hover:border-[color:var(--color-bronze)] hover:text-[color:var(--color-bronze)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                  >
                    <Linkedin className="w-4 h-4" strokeWidth={1.7} />
                  </a>
                )}
                {config.socials.facebook && (
                  <a
                    href={config.socials.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook Andrew Buteau"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-[color:var(--color-cream)]/25 text-[color:var(--color-cream)] hover:border-[color:var(--color-bronze)] hover:text-[color:var(--color-bronze)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                  >
                    <Facebook className="w-4 h-4" strokeWidth={1.7} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Navigation — col 3 */}
          <div className="md:col-span-3 space-y-3">
            <p className="eyebrow text-[color:var(--color-taupe)]">
              {t("footer.sitemap")}
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-glow-hover">{t("nav.home")}</Link></li>
              <li><Link to="/equipe" className="text-glow-hover">{t("nav.team")}</Link></li>
              <li><Link to="/institutions" className="text-glow-hover">{t("nav.institutions")}</Link></li>
              <li><Link to="/outils" className="text-glow-hover">{t("nav.tools")}</Link></li>
              <li>
                <button type="button" onClick={openCarnet} className="text-glow-hover text-left">
                  {lang === "fr" ? "Le carnet" : "Address book"}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => openGlossary()} className="text-glow-hover text-left">
                  {t("footer.lexique")}
                </button>
              </li>
            </ul>
          </div>

          {/* Colophon — col 4 — pattern magazine print (typo credits).
              Compression verticale 2026-05-20 (user) : space-y-2.5 -> space-y-2,
              pt-3 mt-3 -> pt-2 mt-2. Doublon "Lexique" retire (deja dans Navigation col 3). */}
          <div className="md:col-span-4 space-y-2">
            <p className="eyebrow text-[color:var(--color-taupe)]">
              {t("footer.colophon")}
            </p>
            <p className="font-[var(--font-editorial)] italic text-sm leading-[1.55] text-[color:var(--color-cream)]/75 text-pretty">
              {t("footer.colophonComposed")}
            </p>
            <p className="font-[var(--font-editorial)] italic text-sm leading-[1.55] text-[color:var(--color-cream)]/75 text-pretty">
              {t("footer.colophonPrinted")}
            </p>

            {/* Legal/colophon links (modal pour colophon, pages pour legal) */}
            <div className="pt-2 mt-2 border-t border-[color:var(--color-taupe)]/30 flex flex-wrap gap-x-5 gap-y-2 text-xs">
              <button type="button" onClick={openColophon} className="text-glow-hover text-left">
                {lang === "fr" ? "Colophon" : "Colophon"}
              </button>
              <Link to="/mentions-legales" className="text-glow-hover">
                {t("footer.legal")}
              </Link>
              <Link to="/confidentialite" className="text-glow-hover">
                {t("footer.privacy")}
              </Link>
            </div>
          </div>
        </div>

        {/* === Disclaimer AMF + bottom bar === */}
        <div className="pt-5 space-y-3">
          {/* Ligne compliance explicite — AMF cert + NEQ (visibles en footer
              au-dessus du disclaimer, lecture rapide pour visiteurs verifiant
              la legitimite). User feedback 2026-05-20. */}
          <p className="text-[11px] tracking-[0.04em] text-[color:var(--color-cream)]/80">
            {lang === "fr" ? "Inscrit AMF — N° " : "AMF registered — No. "}
            <span className="font-semibold text-[color:var(--color-cream)]">{config.amf.certificateNumberAndrew}</span>
            <span className="mx-2 text-[color:var(--color-taupe)]/60">·</span>
            {lang === "fr" ? "NEQ " : "BIN "}
            <span className="font-semibold text-[color:var(--color-cream)]">{config.legal.neq}</span>
            <span className="mx-2 text-[color:var(--color-taupe)]/60">·</span>
            {lang === "fr" ? "Cabinet : " : "Firm: "}
            <span className="font-semibold text-[color:var(--color-cream)]">{config.cabinet}</span>
          </p>
          <p className="text-xs leading-[1.6] text-[color:var(--color-cream)]/85 max-w-4xl italic text-pretty hyphens-auto">
            {config.amf.disclaimer[lang]}
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="block w-8 h-px bg-[color:var(--color-bronze)]" />
              <p className="eyebrow text-[color:var(--color-taupe)] text-[10px]">
                {t("footer.issn")}
              </p>
            </div>
            <p className="text-xs text-[color:var(--color-cream)]/75">
              © {year} {config.name}. {t("footer.rights")}
            </p>
            <p className="eyebrow text-[color:var(--color-taupe)]/70 text-[10px]">
              {t("footer.websiteBy")} —{" "}
              <a
                href="https://intralys.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-glow-hover"
              >
                Intralys
              </a>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
