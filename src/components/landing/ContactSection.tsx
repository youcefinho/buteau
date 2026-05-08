import { MapPin, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";

/**
 * Section Contact — placeholder Phase 7 backend leads.
 *
 * Pour l'instant : 2 boutons (email + tel) + carte territoire +
 * placeholder visuel pour le formulaire (sera remplace par le worker /api/lead
 * + GHL POST en Phase 7, ou par GhlFormEmbed iframe selon strategy).
 *
 * Ref visuelle : Accueil.html lignes 1666-1712.
 */
export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 surface-cream">
      <Container size="md">
        <SectionHeading
          eyebrow={t("home.contact.eyebrow")}
          title={t("home.contact.title")}
          subtitle={t("home.contact.subtitle")}
          tone="light"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form column — placeholder Phase 7 (worker /api/lead 4 couches) */}
          <div className="bg-[color:var(--color-surface)] p-8 border-2 border-[color:var(--color-taupe)] order-2 lg:order-1 flex flex-col">
            <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-lg uppercase tracking-[var(--tracking-eyebrow)] mb-6 text-center">
              {t("home.contact.formLabel")}
            </h3>
            <div className="flex-1 flex items-center justify-center min-h-[280px] text-center">
              <p className="text-xs italic text-[color:var(--color-taupe-dark)] max-w-xs">
                [Phase 7 — formulaire connecté au worker /api/lead avec défense en profondeur 4 couches : honeypot + timing + rate limit D1 + validation server-side]
              </p>
            </div>
          </div>

          {/* Contact info column */}
          <div className="space-y-5 order-1 lg:order-2">
            <a
              href={`mailto:${config.email}`}
              className="btn-bronze w-full"
            >
              {t("home.contact.emailCta")}
            </a>
            <a
              href={`tel:${config.phone.raw}`}
              className="btn-ghost-navy w-full"
            >
              {config.phone.display}
            </a>

            <div className="bg-[color:var(--color-surface)] p-6 border-2 border-[color:var(--color-taupe)] space-y-3">
              <p className="eyebrow text-[color:var(--color-taupe-dark)] text-center">
                {t("home.contact.territoryLabel")}
              </p>
              <div className="flex items-center justify-center gap-2 text-[color:var(--color-navy-deep)]">
                <MapPin size={20} aria-hidden="true" className="text-[color:var(--color-bronze)]" />
                <p className="text-sm font-medium">{t("home.contact.territoryValue")}</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-[color:var(--color-navy-deep)]/85 pt-2">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[color:var(--color-bronze)] shrink-0" aria-hidden="true" />
                <a href={`mailto:${config.email}`} className="hover:text-[color:var(--color-bronze-deep)] break-all">
                  {config.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[color:var(--color-bronze)] shrink-0" aria-hidden="true" />
                <a href={`tel:${config.phone.raw}`} className="hover:text-[color:var(--color-bronze-deep)]">
                  {config.phone.display}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-[color:var(--color-bronze)] shrink-0" aria-hidden="true" />
                <span>{config.address.streetAddress}, {config.address.addressLocality}, {config.address.addressRegion}</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
