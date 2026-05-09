import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
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
  const year = new Date().getFullYear();

  return (
    <footer className="relative surface-navy mt-24 overflow-hidden grain-overlay">
      {/* Monogramme BUTEAU filigrane gigantesque arrière-plan */}
      <span
        aria-hidden="true"
        className="absolute -bottom-24 -right-12 font-[var(--font-display)] font-extrabold text-[color:var(--color-cream)]/[0.04] text-[20rem] md:text-[28rem] lg:text-[36rem] leading-none tracking-[0.18em] pointer-events-none select-none whitespace-nowrap"
      >
        {config.brandName}
      </span>

      <Container size="xl" className="relative pt-24 md:pt-32 pb-12">
        {/* === Couverture statement — Cormorant italic XL === */}
        <div className="max-w-4xl mb-20 md:mb-28">
          <p className="eyebrow text-[color:var(--color-taupe)] mb-6 inline-flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            {lang === "fr" ? "Quatrième de couverture" : "Back cover"}
          </p>
          <p className="font-[var(--font-editorial)] italic text-[color:var(--color-cream)] text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] tracking-tight">
            « {t("footer.coverStatement")} »
          </p>
          <div className="flex items-center gap-4 mt-10">
            <span className="block w-12 h-px bg-[color:var(--color-bronze)]" />
            <p className="eyebrow text-[color:var(--color-taupe)]">
              Andrew Buteau
            </p>
          </div>
        </div>

        {/* === Grid asymétrique : Contact / Navigation / Colophon === */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-12 border-b border-[color:var(--color-taupe)]/30">
          {/* Contact — col 5 */}
          <div className="md:col-span-5 space-y-5">
            <p className="eyebrow text-[color:var(--color-taupe)]">
              {t("footer.contact")}
            </p>
            <ul className="space-y-3 text-sm">
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
          </div>

          {/* Navigation — col 3 */}
          <div className="md:col-span-3 space-y-4">
            <p className="eyebrow text-[color:var(--color-taupe)]">
              {t("footer.sitemap")}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-glow-hover">{t("nav.home")}</Link></li>
              <li><Link to="/equipe" className="text-glow-hover">{t("nav.team")}</Link></li>
              <li><Link to="/institutions" className="text-glow-hover">{t("nav.institutions")}</Link></li>
              <li><Link to="/outils" className="text-glow-hover">{t("nav.tools")}</Link></li>
              <li><Link to="/carnet" className="text-glow-hover">{lang === "fr" ? "Le carnet" : "Address book"}</Link></li>
              <li><Link to="/lexique" className="text-glow-hover">{t("footer.lexique")}</Link></li>
            </ul>
          </div>

          {/* Colophon — col 4 — pattern magazine print (typo credits) */}
          <div className="md:col-span-4 space-y-3">
            <p className="eyebrow text-[color:var(--color-taupe)]">
              {t("footer.colophon")}
            </p>
            <p className="font-[var(--font-editorial)] italic text-sm leading-[1.65] text-[color:var(--color-cream)]/75">
              {t("footer.colophonComposed")}
            </p>
            <p className="font-[var(--font-editorial)] italic text-sm leading-[1.65] text-[color:var(--color-cream)]/75">
              {t("footer.colophonPrinted")}
            </p>
            <p className="font-[var(--font-editorial)] italic text-sm leading-[1.65] text-[color:var(--color-cream)]/75 pt-1">
              {t("footer.colophonEdition")}
            </p>

            {/* Légal links + colophon */}
            <div className="pt-4 mt-4 border-t border-[color:var(--color-taupe)]/30 flex flex-wrap gap-x-5 gap-y-2 text-xs">
              <Link to="/colophon" className="text-glow-hover">
                {lang === "fr" ? "Colophon" : "Colophon"}
              </Link>
              <Link to="/mentions-legales" className="text-glow-hover">
                {t("footer.legal")}
              </Link>
              <Link to="/confidentialite" className="text-glow-hover">
                {t("footer.privacy")}
              </Link>
              <Link to="/lexique" className="text-glow-hover">
                {t("footer.lexique")}
              </Link>
            </div>
          </div>
        </div>

        {/* === Disclaimer AMF + bottom bar === */}
        <div className="pt-10 space-y-6">
          <p className="text-xs leading-[1.7] text-[color:var(--color-cream)]/65 max-w-4xl italic">
            {config.amf.disclaimer[lang]}
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="block w-8 h-px bg-[color:var(--color-bronze)]" />
              <p className="eyebrow text-[color:var(--color-taupe)] text-[10px]">
                {t("footer.issn")}
              </p>
            </div>
            <p className="text-xs text-[color:var(--color-cream)]/55">
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
