import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";

/**
 * SmsButton — FAB flottant bas-droite DESKTOP only (lg:inline-flex).
 *
 * Remplace l'ancien WhatsAppButton 2026-05-20 (user request) :
 * - href sms: au lieu de wa.me (ouvre l'app SMS native, pas WhatsApp)
 * - body SMS prerempli theme magazine luxe Buteau (vouvoiement Andrew)
 * - Icone MessageCircle Lucide au lieu du SVG WhatsApp
 * - Couleur bronze caramel (palette site, plus le vert WA)
 * - Hidden sur mobile : MobileStickyCta couvre deja Appeler + RDV en bas
 *
 * Pattern garde :
 * - Halo bronze pulsant 2-layer animate-ping
 * - Tooltip "Écrivez-nous par SMS" hover desktop
 * - Pill format avec nom + telephone
 */
export function SmsButton() {
  const { t } = useLanguage();
  const message = encodeURIComponent(t("common.smsButtonBody"));
  const href = `sms:${config.phone.raw}?&body=${message}`;

  return (
    <a
      href={href}
      aria-label={`${t("common.smsButtonTooltip")} ${config.name} ${config.phone.display}`}
      className="group fixed bottom-6 right-6 z-50 hidden lg:inline-flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full bg-[color:var(--color-navy-deep)] border border-[color:var(--color-taupe-dark)]/35 hover:border-[color:var(--color-taupe-dark)]/70 hover:bg-[color:var(--color-taupe-dark)]/10 hover:-translate-y-0.5 transition-all duration-300 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)]"
    >
      {/* Tooltip hover desktop — apparait au-dessus du pill */}
      <span className="pointer-events-none absolute bottom-full mb-3 right-0 px-3 py-1.5 rounded-md bg-[color:var(--color-navy-deep)] border border-[color:var(--color-taupe-dark)]/35 text-[color:var(--color-cream)] text-xs font-medium whitespace-nowrap opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
        {t("common.smsButtonTooltip")}
      </span>

      {/* Halo bronze pulsant 2 couches superposees (effet ripple) */}
      <span
        className="absolute inset-0 rounded-full bg-[color:var(--color-taupe-dark)]/30 motion-safe:animate-ping pointer-events-none group-hover:hidden"
        style={{ animationDuration: "2.4s" }}
        aria-hidden
      />
      <span
        className="absolute -inset-1 rounded-full bg-[color:var(--color-taupe-dark)]/15 motion-safe:animate-ping pointer-events-none group-hover:hidden"
        style={{ animationDuration: "2.4s", animationDelay: "0.6s" }}
        aria-hidden
      />

      {/* Icone Message dans badge bronze circulaire */}
      <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-[color:var(--color-taupe-dark)]/15 border border-[color:var(--color-taupe-dark)]/40 text-[color:var(--color-taupe-dark)] shrink-0">
        <MessageCircle className="w-4 h-4" strokeWidth={2} aria-hidden />
      </span>

      {/* Nom + numero stack vertical */}
      <span className="relative flex flex-col items-start leading-tight whitespace-nowrap">
        <span className="text-sm text-[color:var(--color-cream)] font-bold">
          {config.name}
        </span>
        <span className="text-[11px] text-[color:var(--color-cream)]/75 font-medium tabular-nums">
          {config.phone.display}
        </span>
      </span>
    </a>
  );
}
