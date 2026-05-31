import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useGlossary } from "@/lib/GlossaryContext";
import { useColophon } from "@/lib/ColophonContext";
import { useCarnet } from "@/lib/CarnetContext";
import { config } from "@/lib/config";
import { Container } from "./Container";
import { PoweredByIntralys } from "@/components/shared/PoweredByIntralys";

/**
 * Footer — version SIMPLIFIÉE (refonte charte 2026-05-29, demande client « simplifier »).
 *
 * Retiré (flourish magazine) : bloc « Quatrième de couverture » + statement, crédits
 * colophon (« Composé/Imprimé »), ligne ISSN, filigrane BUTEAU géant.
 * Gardé : logo BUTEAU complet, contact, navigation, légal, conformité AMF, signature.
 */
export function Footer() {
  const { t, lang } = useLanguage();
  const { open: openGlossary } = useGlossary();
  const { open: openColophon } = useColophon();
  const { open: openCarnet } = useCarnet();
  const year = new Date().getFullYear();

  return (
    <footer className="relative surface-navy overflow-hidden grain-overlay">
      {/* Filigrane « BUTEAU » — wordmark de marque en fond (réintroduit 2026-05-30,
          demande Rochdi) en version sobre charte : Raleway, crème sur navy en très
          basse opacité. Décoratif, aria-hidden, clippé par overflow-hidden. */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-[-0.16em] left-1/2 -translate-x-1/2 z-0 font-[family-name:var(--font-display)] font-extrabold uppercase tracking-[0.04em] leading-[0.78] whitespace-nowrap text-[clamp(5rem,24vw,20rem)] text-[color:var(--color-cream)]/[0.05]"
      >
        {config.brandName}
      </span>
      <Container size="xl" className="relative z-10 pt-[clamp(2.5rem,5vw,4rem)] pb-6">
        {/* Logo officiel BUTEAU + tagline (« Buteau au complet ») */}
        <img
          src="/logo-buteau-white.svg"
          alt="Buteau — L'hypothèque autrement"
          width={1267}
          height={368}
          loading="lazy"
          decoding="async"
          className="h-[clamp(2.5rem,4vw,3.5rem)] w-auto mb-[clamp(2rem,3.5vw,3rem)] opacity-95"
        />

        {/* Grid : Contact / Navigation / Légal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[clamp(2rem,3vw,3rem)] pb-8 border-b border-[color:var(--color-taupe)]/30">
          {/* Contact */}
          <div className="md:col-span-5 space-y-4">
            <p className="eyebrow text-[color:var(--color-taupe)]">{t("footer.contact")}</p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={14} className="mt-1 shrink-0 text-[color:var(--color-bronze)]" aria-hidden="true" />
                <a
                  href={`tel:${config.phone.raw}`}
                  className="text-glow-hover font-[family-name:var(--font-display)] text-base font-semibold"
                >
                  {config.phone.display}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} className="mt-1 shrink-0 text-[color:var(--color-bronze)]" aria-hidden="true" />
                <a href={`mailto:${config.email}`} className="text-glow-hover break-all">
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

            {/* Réseaux sociaux */}
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

          {/* Navigation */}
          <div className="md:col-span-4 space-y-3">
            <p className="eyebrow text-[color:var(--color-taupe)]">{t("footer.sitemap")}</p>
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

          {/* Légal */}
          <div className="md:col-span-3 space-y-3">
            <p className="eyebrow text-[color:var(--color-taupe)]">{lang === "fr" ? "Légal" : "Legal"}</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/mentions-legales" className="text-glow-hover">{t("footer.legal")}</Link></li>
              <li><Link to="/confidentialite" className="text-glow-hover">{t("footer.privacy")}</Link></li>
              <li>
                <button type="button" onClick={openColophon} className="text-glow-hover text-left">
                  Colophon
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* === Conformité AMF + bas de page === */}
        <div className="pt-6 space-y-3">
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
          {/* Statement de marque — remplace le disclaimer AMF en bas (demande Rochdi 2026-05-29).
              Le disclaimer AMF complet reste sur /mentions-legales + composant AmfDisclaimer ;
              la mention « Inscrit AMF — N° … » ci-dessus assure l'identification réglementaire. */}
          <p className="font-[family-name:var(--font-display)] text-[color:var(--color-cream)] text-[clamp(1.05rem,1.6vw,1.375rem)] font-medium tracking-[0.01em] leading-snug max-w-2xl text-balance">
            {t("footer.coverStatement")}
          </p>

          <p className="text-xs text-[color:var(--color-cream)]/75 pt-1">
            © {year} {config.name}. {t("footer.rights")}
          </p>

          {/* Signature Intralys */}
          <div className="pt-5 mt-2 border-t border-[color:var(--color-taupe)]/20">
            <PoweredByIntralys variant="inline" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
