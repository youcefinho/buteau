import { MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";
import { RisingBronzeEmbers } from "@/components/atmosphere/RisingBronzeEmbers";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";
import { ContactForm } from "./ContactForm";

/**
 * Section Contact — refonte luxury éditoriale post-audit P1-A.
 *
 * Avant : 3 répétitions de la même info (2 boutons CTA + form + ul list).
 * Maintenant : 1 form connecté worker + 1 bloc info éditorial (3 lignes contact, 1 territoire).
 */
export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 md:py-28 surface-cream relative overflow-hidden">
      {/* Atmospheric continuity — embers per-section signature */}
      <RisingBronzeEmbers count={5} tone="light" />

      {/* Filigrane décoratif éditorial */}
      <span
        aria-hidden="true"
        className="absolute -top-10 -right-10 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/10 text-[24rem] leading-none pointer-events-none select-none"
      >
        &
      </span>

      <Container size="lg" className="relative">
        <SectionHeading
          eyebrow={t("home.contact.eyebrow")}
          title={t("home.contact.title")}
          subtitle={t("home.contact.subtitle")}
          tone="bronze"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-5xl mx-auto">
          {/* Form column — 7/12 */}
          <div className="lg:col-span-7 bg-[color:var(--color-surface)] p-7 md:p-10 border border-[color:var(--color-taupe)]/50 relative">
            {/* Corner accent bronze */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 w-12 h-px bg-[color:var(--color-bronze)]"
            />
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 w-px h-12 bg-[color:var(--color-bronze)]"
            />

            <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[var(--tracking-eyebrow)] mb-6">
              {t("home.contact.formLabel")}
            </h3>
            <ContactForm source="home_contact_form" />
          </div>

          {/* Info column — 5/12 — éditorial vertical */}
          <aside className="lg:col-span-5 flex flex-col justify-between gap-10">
            {/* Coordonnées — pattern 3 lignes magazine */}
            <ul className="space-y-7">
              <ContactLine
                icon={<Phone size={18} aria-hidden="true" />}
                label={t("nav.contact")}
                value={config.phone.display}
                href={`tel:${config.phone.raw}`}
              />
              <ContactLine
                icon={<Mail size={18} aria-hidden="true" />}
                label={t("home.contact.emailCta")}
                value={config.email}
                href={`mailto:${config.email}`}
                breakAll
              />
              <ContactLine
                icon={<MapPin size={18} aria-hidden="true" />}
                label={t("home.contact.territoryLabel")}
                value={t("home.contact.territoryValue")}
              />
            </ul>

            {/* Carte adresse — bordure taupe minimale */}
            <div className="bg-[color:var(--color-cream-warm)] border-l-[3px] border-[color:var(--color-bronze)] pl-5 py-4">
              <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-2">
                {t("nav.contact")} — {config.address.addressLocality}
              </p>
              <address className="not-italic text-sm leading-relaxed text-[color:var(--color-navy-deep)]/85">
                {config.address.streetAddress}
                <br />
                {config.address.addressLocality}, {config.address.addressRegion}{" "}
                {config.address.postalCode}
              </address>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

function ContactLine({
  icon,
  label,
  value,
  href,
  breakAll,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  breakAll?: boolean;
}) {
  const inner = (
    <div className="group flex items-start gap-4">
      <div className="shrink-0 mt-1 text-[color:var(--color-bronze)] transition-transform duration-300 group-hover:translate-x-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-1">{label}</p>
        <p
          className={`font-[var(--font-display)] text-[color:var(--color-navy-deep)] text-base md:text-lg font-semibold ${
            breakAll ? "break-all" : ""
          }`}
        >
          {value}
        </p>
      </div>
      {href && (
        <ArrowUpRight
          size={16}
          className="shrink-0 mt-1 text-[color:var(--color-taupe)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
          aria-hidden="true"
        />
      )}
    </div>
  );

  return (
    <li className="border-b border-[color:var(--color-taupe)]/30 pb-5 last:border-b-0">
      {href ? (
        <a href={href} className="block">
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  );
}
