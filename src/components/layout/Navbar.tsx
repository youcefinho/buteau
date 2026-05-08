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

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[color:var(--color-cream)]/95 backdrop-blur-md border-b border-[color:var(--color-border)]"
          : "bg-transparent",
      )}
    >
      <Container size="xl" as="nav" className="flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="group flex items-baseline gap-2">
          <span
            className="font-[var(--font-display)] text-xl md:text-2xl font-bold tracking-[var(--tracking-eyebrow)]"
            style={{ color: scrolled ? "var(--color-navy-deep)" : "var(--color-navy-deep)" }}
          >
            {config.brandName}
          </span>
          <span
            className="hidden md:inline eyebrow"
            style={{ color: "var(--color-taupe-dark)" }}
          >
            {t("common.tagline")}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} label={t(item.key)} />
          ))}
        </div>

        {/* Right cluster — lang toggle + CTA + burger mobile */}
        <div className="flex items-center gap-3" style={{ color: "var(--color-navy-deep)" }}>
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
      className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-navy-deep)] hover:text-[color:var(--color-bronze-deep)] transition-colors"
      activeProps={{
        className:
          "text-[color:var(--color-bronze-deep)]",
      }}
    >
      {label}
    </Link>
  );
}
