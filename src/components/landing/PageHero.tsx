import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

/**
 * Hero secondaire pour pages internes (Équipe / Institutions / Outils).
 * Pattern luxury éditorial : overlay tonal dégradé + numéro romain filigrane optionnel
 * + tagline Cormorant italic + animation staggered reveal au mount.
 */
type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bgImageUrl?: string;
  /** Chiffre romain ornement (I/II/III/IV) en filigrane top — donne du rythme entre pages */
  ornament?: string;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  bgImageUrl = "https://i.imgur.com/YsueQT3.jpg",
  ornament,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative pt-40 pb-24 md:pt-48 md:pb-32 surface-navy overflow-hidden",
        className,
      )}
    >
      {/* Background image avec overlay tonal — image visible, pas un bloc plat */}
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(16, 34, 61, 0.74) 0%, rgba(16, 34, 61, 0.85) 60%, rgba(16, 34, 61, 0.9) 100%), url('${bgImageUrl}')`,
        }}
        aria-hidden="true"
      />

      {/* Vignette subtle pour ramener l'œil au centre */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(16, 34, 61, 0.4) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Ornement filigrane Cormorant italic (numéro romain) si fourni */}
      {ornament && (
        <span
          aria-hidden="true"
          className="absolute top-24 left-1/2 -translate-x-1/2 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/15 text-[12rem] md:text-[16rem] leading-none pointer-events-none select-none animate-[buteauFadeUp_900ms_ease-out_forwards]"
        >
          {ornament}
        </span>
      )}

      <Container size="lg" className="relative">
        <div className="text-center max-w-3xl mx-auto">
          {eyebrow && (
            <p className="eyebrow text-[color:var(--color-taupe)] mb-6 inline-flex items-center gap-3 animate-[buteauFadeUp_700ms_ease-out_100ms_both]">
              <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
              {eyebrow}
              <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            </p>
          )}

          <h1 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-4xl md:text-5xl lg:text-[3.75rem] uppercase tracking-[0.04em] leading-[1.05] animate-[buteauFadeUp_700ms_ease-out_200ms_both]">
            {title}
          </h1>

          <div className="w-16 h-px bg-[color:var(--color-bronze)] mx-auto my-8 md:my-10 animate-[buteauWidth_700ms_ease-out_400ms_both]" />

          {subtitle && (
            <p className="font-[var(--font-editorial)] italic text-base md:text-lg leading-[1.5] text-[color:var(--color-cream)]/85 max-w-2xl mx-auto animate-[buteauFadeUp_700ms_ease-out_500ms_both]">
              {subtitle}
            </p>
          )}
        </div>
      </Container>

      {/* Signature line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[color:var(--color-taupe)]" />
    </section>
  );
}
