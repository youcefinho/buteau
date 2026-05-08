import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";
import { Container } from "./Container";

export function Footer() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="surface-navy mt-24 pt-20 pb-10">
      <Container size="xl">
        {/* Top — brand + grid links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand block */}
          <div className="md:col-span-5 space-y-5">
            <p className="font-[var(--font-display)] text-2xl font-bold tracking-[var(--tracking-eyebrow)]">
              {config.brandName}
            </p>
            <p className="eyebrow text-[color:var(--color-taupe)]">
              {t("common.tagline")}
            </p>
            <p className="text-sm leading-relaxed text-[color:var(--color-cream)]/80 max-w-md">
              {t("footer.brokerLicence")}
            </p>
            <div className="signature-line bg-[color:var(--color-taupe)]" />
          </div>

          {/* Contact */}
          <div className="md:col-span-3 space-y-3">
            <p className="eyebrow text-[color:var(--color-taupe)]">
              {lang === "fr" ? "Contact" : "Contact"}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone size={14} className="mt-1 shrink-0 text-[color:var(--color-taupe)]" aria-hidden="true" />
                <a
                  href={`tel:${config.phone.raw}`}
                  className="hover:text-[color:var(--color-bronze-soft)]"
                >
                  {config.phone.display}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="mt-1 shrink-0 text-[color:var(--color-taupe)]" aria-hidden="true" />
                <a
                  href={`mailto:${config.email}`}
                  className="hover:text-[color:var(--color-bronze-soft)] break-all"
                >
                  {config.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-1 shrink-0 text-[color:var(--color-taupe)]" aria-hidden="true" />
                <span className="text-[color:var(--color-cream)]/80">
                  {config.address.streetAddress}<br />
                  {config.address.addressLocality}, {config.address.addressRegion} {config.address.postalCode}
                </span>
              </li>
            </ul>
          </div>

          {/* Navigation interne */}
          <div className="md:col-span-2 space-y-3">
            <p className="eyebrow text-[color:var(--color-taupe)]">
              {lang === "fr" ? "Navigation" : "Sitemap"}
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-[color:var(--color-bronze-soft)]">{t("nav.home")}</Link></li>
              <li><Link to="/equipe" className="hover:text-[color:var(--color-bronze-soft)]">{t("nav.team")}</Link></li>
              <li><Link to="/institutions" className="hover:text-[color:var(--color-bronze-soft)]">{t("nav.institutions")}</Link></li>
              <li><Link to="/outils" className="hover:text-[color:var(--color-bronze-soft)]">{t("nav.tools")}</Link></li>
            </ul>
          </div>

          {/* Légal — utilise Link (SPA) pour ne pas casser le state/cache (audit HI-03) */}
          <div className="md:col-span-2 space-y-3">
            <p className="eyebrow text-[color:var(--color-taupe)]">
              {lang === "fr" ? "Légal" : "Legal"}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/mentions-legales"
                  className="hover:text-[color:var(--color-bronze-soft)]"
                >
                  {t("footer.legal")}
                </Link>
              </li>
              <li>
                <Link
                  to="/confidentialite"
                  className="hover:text-[color:var(--color-bronze-soft)]"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/lexique"
                  className="hover:text-[color:var(--color-bronze-soft)]"
                >
                  {t("footer.lexique")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom — disclaimer AMF compact + copyright */}
        <div className="mt-16 pt-10 border-t border-[color:var(--color-taupe)]/30">
          <p className="text-xs leading-relaxed text-[color:var(--color-cream)]/60 max-w-4xl mb-6">
            {config.amf.disclaimer[lang]}
          </p>
          <p className="text-xs text-[color:var(--color-cream)]/50">
            © {year} {config.name}. {t("footer.rights")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
