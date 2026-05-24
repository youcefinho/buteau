import { Shield } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";

/**
 * AmfDisclaimer — encadré obligatoire pour clients réglementés AMF.
 * Affiche le disclaimer + (optionnellement) le numéro de certificat AMF.
 *
 * 3 variantes :
 * - inline : compact, texte seul (footer, fin de calculator results)
 * - card   : encadré avec icône + titre, mis en avant (post-CTA, post-success)
 * - badge  : juste le badge "Inscrit AMF" (header, pages produit)
 *
 * Cf. skill `intralys-amf-disclaimer` pour la doctrine + guards de visibilité.
 */
type AmfDisclaimerProps = {
  variant?: "inline" | "card" | "badge";
  className?: string;
};

export function AmfDisclaimer({ variant = "inline", className }: AmfDisclaimerProps) {
  const { t, lang } = useLanguage();
  const certNumber = config.amf.certificateNumberAndrew; // peut être vide Phase 9
  const disclaimerText = config.amf.disclaimer[lang];

  if (variant === "badge") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 border border-[color:var(--color-taupe)]/50 text-[color:var(--color-bronze)] eyebrow text-[10px]",
          className,
        )}
      >
        <Shield size={11} aria-hidden="true" className="text-[color:var(--color-bronze)]" />
        {t("amf.certificateLabel")}
        {certNumber && <span className="ml-1 font-semibold">№ {certNumber}</span>}
      </span>
    );
  }

  if (variant === "card") {
    return (
      <aside
        className={cn(
          "bg-[color:var(--color-cream-warm)] border-l-[3px] border-[color:var(--color-bronze)] p-[clamp(1.25rem,2vw,1.5rem)] space-y-3",
          className,
        )}
        aria-label={t("amf.certificateLabel")}
      >
        <div className="flex items-center gap-2.5">
          <Shield size={16} className="text-[color:var(--color-bronze)]" aria-hidden="true" />
          <p className="eyebrow text-[color:var(--color-navy)]">
            {t("amf.certificateLabel")}
            {certNumber && <span className="ml-2 font-semibold">№ {certNumber}</span>}
          </p>
        </div>
        <p className="text-xs leading-relaxed text-[color:var(--color-navy-deep)]/85 text-pretty hyphens-auto">
          {disclaimerText}
        </p>
      </aside>
    );
  }

  // inline (default)
  return (
    <p
      className={cn(
        "text-xs italic leading-relaxed text-[color:var(--color-bronze)]",
        className,
      )}
    >
      {disclaimerText}
    </p>
  );
}
