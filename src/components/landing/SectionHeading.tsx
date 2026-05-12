import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "light" | "dark" | "bronze"; // light = surface claire (navy text), dark = surface navy (cream text), bronze = cream bg avec eyebrow bronze
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const titleColor = tone === "dark" ? "text-[color:var(--color-cream)]" : "text-[color:var(--color-navy-deep)]";
  const subtitleColor = tone === "dark" ? "text-[color:var(--color-cream)]/80" : "text-[color:var(--color-taupe-dark)]";
  const eyebrowColor = tone === "dark"
    ? "text-[color:var(--color-taupe)]"
    : tone === "bronze"
      ? "text-[color:var(--color-bronze)]"
      : "text-[color:var(--color-taupe-dark)]";

  return (
    <div
      className={cn(
        "space-y-5 mb-14 md:mb-16",
        align === "center" ? "text-center mx-auto max-w-3xl" : "text-left max-w-3xl",
        className,
      )}
    >
      {eyebrow && <p className={cn("eyebrow", eyebrowColor)}>{eyebrow}</p>}
      <h2 className={cn("display text-3xl md:text-4xl lg:text-5xl uppercase tracking-[-0.01em]", titleColor)}>
        {title}
      </h2>
      <div className={cn("signature-line", align === "center" ? "mx-auto" : "")} />
      {subtitle && <p className={cn("text-base md:text-lg leading-relaxed", subtitleColor)}>{subtitle}</p>}
    </div>
  );
}
