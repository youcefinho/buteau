import { useLanguage } from "@/lib/LanguageContext";

/**
 * Skip-to-content link (WCAG 2.4.1 — Bypass Blocks).
 * Premier élément focusable de la page. Visible uniquement au focus clavier.
 */
export function SkipToContent() {
  const { t } = useLanguage();
  return (
    <a
      href="#main"
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
        focus:px-4 focus:py-2
        focus:bg-[color:var(--color-bronze)] focus:text-[color:var(--color-cream)]
        focus:rounded-sm focus:shadow-lg
        focus:font-[var(--font-display)] focus:text-sm focus:font-semibold
        focus:outline-none
      "
    >
      {t("nav.skipToContent")}
    </a>
  );
}
