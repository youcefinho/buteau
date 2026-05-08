import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";

export const Route = createFileRoute("/equipe")({
  component: TeamPage,
});

function TeamPage() {
  const { t } = useLanguage();
  return (
    <main id="main" className="min-h-screen flex items-center justify-center p-12 pt-32 surface-cream">
      <div className="max-w-2xl text-center space-y-6">
        <p className="eyebrow">{t("team.hero.eyebrow")}</p>
        <h1 className="display text-4xl md:text-5xl">{t("team.hero.title")}</h1>
        <p className="text-lg text-[color:var(--color-taupe-dark)]">{t("team.hero.subtitle")}</p>
        <p className="text-sm italic mt-12 text-[color:var(--color-taupe-dark)]">
          [Phase 1 placeholder — Page Équipe sera codée Phase 4 à partir de equipe.html]
        </p>
      </div>
    </main>
  );
}
