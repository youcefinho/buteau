import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";
import { Container } from "./Container";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useLanguage();
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

  const navItems: Array<{ to: "/" | "/equipe" | "/institutions" | "/outils"; key: string }> = [
    { to: "/", key: "nav.home" },
    { to: "/equipe", key: "nav.team" },
    { to: "/institutions", key: "nav.institutions" },
    { to: "/outils", key: "nav.tools" },
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
          ? "top-4 mx-auto max-w-6xl px-4"
          : "top-0",
      )}
    >
      <Container
        size="xl"
        as="nav"
        className={cn(
          "flex items-center justify-between transition-all duration-500 ease-out",
          scrolled
            ? "h-14 bg-[color:var(--color-cream)]/95 backdrop-blur-xl border border-[color:var(--color-border)] rounded-full shadow-[0_8px_32px_-12px_rgba(16,34,61,0.18)] px-6 md:px-8"
            : "h-20 bg-transparent border-b border-transparent px-6 md:px-10",
        )}
      >
        {/* Logo */}
        <Link to="/" className="group flex items-baseline gap-2">
          <span
            className="font-[var(--font-display)] text-xl md:text-2xl font-bold tracking-[var(--tracking-eyebrow)]"
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
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-10" style={{ color: fgColor }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} label={t(item.key)} />
          ))}
        </div>

        {/* Right cluster — lang toggle + CTA + burger mobile */}
        <div className="flex items-center gap-3" style={{ color: fgColor }}>
          <LanguageToggle className="hidden sm:inline-flex" />
          <a
            href={`tel:${config.phone.raw}`}
            className="hidden md:inline-flex btn-bronze"
          >
            {t("common.callUs")}
          </a>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 -mr-2"
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
        <div className="lg:hidden absolute top-full inset-x-0 bg-[color:var(--color-cream)] border-b border-[color:var(--color-border)] shadow-xl">
          <Container size="xl" className="py-8 space-y-6">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="block font-[var(--font-display)] text-2xl text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-bronze-deep)]"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="signature-line-long" />
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

function NavLink({ to, label }: { to: "/" | "/equipe" | "/institutions" | "/outils"; label: string }) {
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
