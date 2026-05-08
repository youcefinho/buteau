import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";

export const Route = createFileRoute("/institutions")({
  component: InstitutionsPage,
});

function InstitutionsPage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen flex items-center justify-center p-12 surface-cream">
      <div className="max-w-2xl text-center space-y-6">
        <p className="eyebrow">{t("institutions.hero.eyebrow")}</p>
        <h1 className="display text-4xl md:text-5xl">{t("institutions.hero.title")}</h1>
        <p className="text-lg text-[color:var(--color-taupe-dark)]">
          {t("institutions.hero.subtitle")}
        </p>
        <p className="text-sm italic mt-12 text-[color:var(--color-taupe-dark)]">
          [Phase 1 placeholder — Page Institutions sera codée Phase 5 à partir de institutions.html]
        </p>
      </div>
    </main>
  );
}
