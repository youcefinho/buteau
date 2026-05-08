import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

/**
 * Hero secondaire pour pages internes (Équipe / Institutions / Outils).
 * Plus court que le Hero Accueil. Surface navy + image overlay + signature line.
 */
type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bgImageUrl?: string;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  bgImageUrl = "https://i.imgur.com/YsueQT3.jpg",
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative pt-40 pb-24 md:pb-28 surface-navy overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(16, 34, 61, 0.88), rgba(16, 34, 61, 0.92)), url('${bgImageUrl}')`,
        }}
        aria-hidden="true"
      />

      <Container size="lg" className="relative">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {eyebrow && (
            <p className="eyebrow text-[color:var(--color-taupe)]">{eyebrow}</p>
          )}
          <h1 className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-4xl md:text-5xl lg:text-6xl uppercase tracking-[0.06em] leading-[1.05]">
            {title}
          </h1>
          <div className="w-24 h-0.5 bg-[color:var(--color-taupe)] mx-auto" />
          {subtitle && (
            <p className="text-base md:text-lg leading-relaxed text-[color:var(--color-cream)]/85 max-w-2xl mx-auto">
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
