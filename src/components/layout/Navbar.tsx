import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Instagram, Linkedin, Facebook, Star, Phone, BookOpen, CalendarCheck, User } from "lucide-react";
import { useGlossary } from "@/lib/GlossaryContext";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";
import { Container } from "./Container";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t, lang } = useLanguage();
  const { open: openGlossary } = useGlossary();

  // Calendly bouton mort si URL vide (Phase 9 a venir). Pattern cross-site.
  const openCalendly = (e: React.MouseEvent) => {
    e.preventDefault();
    if (config.calendlyUrl) {
      window.open(config.calendlyUrl, "_blank", "noopener,noreferrer");
    }
  };
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme le menu mobile sur changement de route.
  useEffect(() => setMobileOpen(false), [location.pathname]);

  // Empêche scroll body quand menu mobile ouvert.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navItems: Array<{ to: "/" | "/equipe" | "/institutions" | "/outils" | "/capsules" | "/journal"; key: string }> = [
    { to: "/", key: "nav.home" },
    { to: "/equipe", key: "nav.team" },
    { to: "/institutions", key: "nav.institutions" },
    { to: "/outils", key: "nav.tools" },
    { to: "/journal", key: "nav.journal" },
    { to: "/capsules", key: "nav.capsules" },
  ];

  // Couleur dynamique : cream sur Hero (top), navy-deep apres scroll (sur cream).
  // Audit UI-BL1 : avant cette correction, le navbar etait navy-on-navy au top → invisible.
  const fgColor = scrolled ? "var(--color-navy-deep)" : "var(--color-cream)";
  const accentColor = scrolled ? "var(--color-taupe-dark)" : "var(--color-taupe)";

  return (
    <header
      className={cn(
        "fixed inset-x-0 z-50 transition-all duration-500 ease-out",
        // Pattern floating pill : quand scrolled, le navbar se rétrécit, s'éloigne
        // du top, devient une pill arrondie centrée. Vs le navbar pleine largeur initial.
        scrolled
          ? "top-4 mx-auto max-w-[2200px] px-4"
          : "top-0",
      )}
    >
      <Container
        size="full"
        as="nav"
        className={cn(
          "flex items-center justify-between transition-all duration-500 ease-out max-w-[2200px]",
          scrolled
            ? "h-14 bg-[color:var(--color-cream)]/95 backdrop-blur-xl border border-[color:var(--color-border)] rounded-full shadow-[0_8px_32px_-12px_rgba(16,34,61,0.18)] px-6 md:px-8"
            : "h-20 bg-transparent border-b border-transparent px-6 md:px-10",
        )}
      >
        {/* Logo Buteau + filet vertical + logo cabinet Planiprêt (mockup parity).
            Pattern HTML original : 2 logos cote-a-cote separes par une ligne
            taupe 1px verticale 30px. Le logo Planipret rappelle le cabinet
            d'attache officiel d'Andrew (courtier hypothecaire). */}
        <Link to="/" className="group flex items-center gap-3 md:gap-4">
          {/* BUTEAU brand mark : visible MOBILE only. Sur desktop (md+),
              le brand est porte par la tagline + logo Planipret pour alleger
              le navbar (decision user 2026-05-17 — trop d'items en compet). */}
          <span
            className="md:hidden font-[var(--font-display)] text-xl font-bold tracking-[var(--tracking-eyebrow)]"
            style={{ color: fgColor }}
          >
            {config.brandName}
          </span>
          <span
            className="hidden md:inline eyebrow"
            style={{ color: accentColor }}
          >
            {t("common.tagline")}
          </span>
          <span
            aria-hidden="true"
            className="hidden md:inline-block w-px h-7"
            style={{ backgroundColor: "color-mix(in oklch, var(--color-taupe) 60%, transparent)" }}
          />
          <img
            src="/planipret-logo.png"
            alt="Planiprêt — Cabinet en courtage hypothécaire"
            loading="lazy"
            decoding="async"
            className="hidden md:inline-block h-7 lg:h-8 w-auto object-contain transition-opacity"
            style={{
              opacity: scrolled ? 0.85 : 0.95,
              // Invert filter quand fond cream (scrolled) : logo Planipret est
              // en couleurs sur fond sombre, doit etre lisible sur cream aussi.
              filter: scrolled ? "none" : "brightness(1.1)",
            }}
          />
        </Link>

        {/* Desktop nav — ml genereux pour aerer apres retrait BUTEAU
            (PNG Planipret a du padding transparent qui rend visuellement serre). */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-9 ml-12 xl:ml-20" style={{ color: fgColor }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} label={t(item.key)} />
          ))}
        </div>

        {/* Right cluster — lang toggle + social icons + CTA + burger mobile */}
        <div className="flex items-center gap-3" style={{ color: fgColor }}>
          <LanguageToggle className="hidden sm:inline-flex" />

          {/* 3 icons outline bronze : Phone + Lexique + Calendly. Ajout 2026-05-14
              cross-site portage. Calendly = bouton mort si calendlyUrl vide. */}
          <div className="hidden md:flex items-center gap-1.5">
            <a
              href={`tel:${config.phone.raw}`}
              aria-label={`${t("common.callUs")} ${config.phone.display}`}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              style={{
                border: `1px solid color-mix(in oklch, ${fgColor} 25%, transparent)`,
                color: fgColor,
              }}
            >
              <Phone className="w-4 h-4" strokeWidth={1.7} />
            </a>
            <button
              type="button"
              onClick={() => openGlossary()}
              aria-label="Lexique"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              style={{
                border: `1px solid color-mix(in oklch, ${fgColor} 25%, transparent)`,
                color: fgColor,
              }}
            >
              <BookOpen className="w-4 h-4" strokeWidth={1.7} />
            </button>
            <a
              href={config.calendlyUrl || "#"}
              target={config.calendlyUrl ? "_blank" : undefined}
              rel={config.calendlyUrl ? "noopener noreferrer" : undefined}
              onClick={openCalendly}
              aria-label="Calendly"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              style={{
                border: `1px solid color-mix(in oklch, ${fgColor} 25%, transparent)`,
                color: fgColor,
              }}
            >
              <CalendarCheck className="w-4 h-4" strokeWidth={1.7} />
            </a>
          </div>

          {/* "Nous joindre" — scroll vers #contact (section ContactSection) au
              lieu de tel: qui ouvrait le composeur OS sur desktop (Skype/FaceTime/
              Teams popup). L'icone Phone outline-bronze a gauche garde tel: pour
              appel direct mobile. User choice 2026-05-14 option B. */}
          <Link
            to="/"
            hash="contact"
            className="hidden md:inline-flex btn-bronze"
          >
            {t("common.callUs")}
          </Link>

          {/* Bouton client portal Planiprêt — mockup parity (icon-only user
              square bronze, target=_blank vers client.planipret.com). Permet
              aux clients existants d'acceder a leur dossier sans passer par
              le form ni call. Position : juste apres le CTA Nous joindre. */}
          <a
            href="https://client.planipret.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={lang === "fr" ? "Portail client Planiprêt (nouvel onglet)" : "Planiprêt client portal (new tab)"}
            title={lang === "fr" ? "Portail client Planiprêt" : "Planiprêt client portal"}
            className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-md transition-all duration-300 hover:-translate-y-0.5 active:scale-95 btn-bronze !p-0"
          >
            <User className="w-4 h-4" strokeWidth={1.7} />
          </a>

          {/* Reseaux sociaux compacts — desktop only (mobile dans le drawer).
              Position : APRES le CTA "Nous joindre", AVANT le trust chip. */}
          <div className="hidden md:flex items-center gap-1.5">
            {config.socials.instagram && (
              <a
                href={config.socials.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Andrew Buteau"
                className="inline-flex items-center justify-center w-9 h-9 rounded-md transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                style={{
                  border: `1px solid color-mix(in oklch, ${fgColor} 25%, transparent)`,
                  color: fgColor,
                }}
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
                className="inline-flex items-center justify-center w-9 h-9 rounded-md transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                style={{
                  border: `1px solid color-mix(in oklch, ${fgColor} 25%, transparent)`,
                  color: fgColor,
                }}
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
                className="inline-flex items-center justify-center w-9 h-9 rounded-md transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                style={{
                  border: `1px solid color-mix(in oklch, ${fgColor} 25%, transparent)`,
                  color: fgColor,
                }}
              >
                <Facebook className="w-4 h-4" strokeWidth={1.7} />
              </a>
            )}
          </div>

          {/* Trust chip Google reviews — Position FINALE a droite, apres socials
              (user demande swap 2026-05-14). Star jaune fill universel. */}
          <a
            href={config.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-400/40 bg-yellow-400/5 hover:border-yellow-400/70 hover:bg-yellow-400/10 transition-colors text-xs"
            aria-label={t("home.reviews.googleBadgeLabel")}
            style={{ color: fgColor }}
          >
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 shrink-0" strokeWidth={1.5} aria-hidden />
            <span className="font-medium whitespace-nowrap">
              {t("home.reviews.googleBadgeLabel")}
            </span>
          </a>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-3 -mr-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
          >
            {mobileOpen ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full inset-x-0 bg-[color:var(--color-cream)] border-b border-[color:var(--color-border)] shadow-xl animate-[buteauFadeUp_300ms_ease-out_both]">
          <Container size="xl" className="py-8 space-y-6">
            <ul className="space-y-4">
              {navItems.map((item, i) => (
                <li
                  key={item.to}
                  style={{ animationDelay: `${i * 70 + 120}ms`, animationFillMode: "backwards" }}
                  className="animate-[buteauFadeUp_500ms_ease-out_both]"
                >
                  <Link
                    to={item.to}
                    className="block font-[var(--font-display)] text-2xl text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-bronze-deep)] transition-colors"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="signature-line-long" />

            {/* Reseaux sociaux mobile — icons row centree */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {config.socials.instagram && (
                <a
                  href={config.socials.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Andrew Buteau"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-md border border-[color:var(--color-bronze)]/30 text-[color:var(--color-navy-deep)] hover:bg-[color:var(--color-bronze)]/10 hover:border-[color:var(--color-bronze)]/60 transition-all duration-300 active:scale-95"
                >
                  <Instagram className="w-5 h-5" strokeWidth={1.7} />
                </a>
              )}
              {config.socials.linkedin && (
                <a
                  href={config.socials.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Andrew Buteau"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-md border border-[color:var(--color-bronze)]/30 text-[color:var(--color-navy-deep)] hover:bg-[color:var(--color-bronze)]/10 hover:border-[color:var(--color-bronze)]/60 transition-all duration-300 active:scale-95"
                >
                  <Linkedin className="w-5 h-5" strokeWidth={1.7} />
                </a>
              )}
              {config.socials.facebook && (
                <a
                  href={config.socials.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Andrew Buteau"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-md border border-[color:var(--color-bronze)]/30 text-[color:var(--color-navy-deep)] hover:bg-[color:var(--color-bronze)]/10 hover:border-[color:var(--color-bronze)]/60 transition-all duration-300 active:scale-95"
                >
                  <Facebook className="w-5 h-5" strokeWidth={1.7} />
                </a>
              )}
            </div>

            <div className="flex items-center justify-between">
              <LanguageToggle />
              <a href={`tel:${config.phone.raw}`} className="btn-bronze">
                {config.phone.display}
              </a>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, label }: { to: "/" | "/equipe" | "/institutions" | "/outils" | "/capsules" | "/journal"; label: string }) {
  return (
    <Link
      to={to}
      className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-current hover:text-[color:var(--color-bronze)] transition-colors"
      activeProps={{
        className:
          "text-[color:var(--color-bronze)]",
      }}
    >
      {label}
    </Link>
  );
}
