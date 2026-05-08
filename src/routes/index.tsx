import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { t } = useLanguage();
  return (
    <main id="main" className="min-h-screen flex items-center justify-center p-12 pt-32 surface-cream">
      <div className="max-w-2xl text-center space-y-6">
        <p className="eyebrow">{t("home.hero.eyebrow")}</p>
        <h1 className="display text-5xl md:text-6xl">
          {t("home.hero.title")}
        </h1>
        <p className="text-lg text-[color:var(--color-taupe-dark)]">
          {t("home.hero.subtitle")}
        </p>
        <p className="text-sm text-[color:var(--color-taupe-dark)] italic mt-12">
          [Phase 1 placeholder — Page Accueil sera codée Phase 3 à partir de Accueil.html]
        </p>
      </div>
    </main>
  );
}
