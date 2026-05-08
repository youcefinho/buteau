import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";

export const Route = createFileRoute("/outils")({
  component: ToolsPage,
});

function ToolsPage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen flex items-center justify-center p-12 surface-cream">
      <div className="max-w-2xl text-center space-y-6">
        <p className="eyebrow">{t("tools.hero.eyebrow")}</p>
        <h1 className="display text-4xl md:text-5xl">{t("tools.hero.title")}</h1>
        <p className="text-lg text-[color:var(--color-taupe-dark)]">{t("tools.hero.subtitle")}</p>
        <p className="text-sm italic mt-12 text-[color:var(--color-taupe-dark)]">
          [Phase 1 placeholder — Page Outils sera codée Phase 6 à partir de outils.html]
        </p>
      </div>
    </main>
  );
}
