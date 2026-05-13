import { useLanguage } from "@/lib/LanguageContext";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, toggle } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "fr" ? "Switch to English" : "Passer au français"}
      className={`
        inline-flex items-center justify-center gap-1.5
        px-3 py-1.5 max-md:min-h-[44px] max-md:min-w-[44px] max-md:px-4
        font-[var(--font-display)]
        text-xs font-semibold uppercase
        tracking-[var(--tracking-eyebrow)]
        text-current
        border border-current/30
        hover:border-current/70
        transition-colors
        ${className}
      `}
    >
      <span aria-hidden="true">{lang === "fr" ? "EN" : "FR"}</span>
    </button>
  );
}
