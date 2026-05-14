import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";

/**
 * WhatsAppButton — FAB flottant bas-droite, visible PC + mobile.
 *
 * Pattern porté de Gatineau / Serujan adapté palette bronze Buteau.
 * - bottom-24 mobile : offset au-dessus de MobileStickyCta (~64px height + margin)
 * - bottom-6 desktop : sous le viewport, ne masque rien
 * - right-4 mobile / right-6 desktop
 * - Halo bronze pulsant 2-layer animate-ping (signal attention discret)
 * - Tooltip "Écrivez-nous sur WhatsApp" au hover desktop, masqué mobile
 * - Click → ouvre wa.me/<num>?text=<message bilingue> en nouvel onglet
 *
 * Skills appliquées :
 * - frontend-design : FAB pattern app-like, motion subtile
 * - intralys-edito-magazine : palette bronze + glassmorphism navy-deep border
 * - intralys-gatineau-portage : pattern ported cross-site Intralys
 */
export function WhatsAppButton() {
  const { t } = useLanguage();
  const message = encodeURIComponent(t("common.whatsappMessage"));
  // phone.raw = "+14384944567" → strip "+" pour wa.me (qui prend l'international format sans +)
  const phoneIntl = config.phone.raw.replace(/^\+/, "");
  const href = `https://wa.me/${phoneIntl}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("common.whatsappTooltip")}
      className="group fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-50 flex w-12 h-12 items-center justify-center rounded-full bg-[color:var(--color-navy-deep)] border border-[color:var(--color-bronze)]/35 text-[color:var(--color-bronze)] hover:border-[color:var(--color-bronze)]/65 hover:bg-[color:var(--color-bronze)]/10 hover:-translate-y-0.5 transition-all duration-300 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)]"
    >
      {/* Tooltip au hover desktop — apparait a gauche du bouton */}
      <span className="pointer-events-none hidden lg:block absolute right-full mr-3 px-3 py-1.5 rounded-md bg-[color:var(--color-navy-deep)] border border-[color:var(--color-bronze)]/35 text-[color:var(--color-cream)] text-xs font-medium whitespace-nowrap opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-lg">
        {t("common.whatsappTooltip")}
      </span>

      {/* Halo bronze pulsant — 2 couches superposees pour profondeur,
          decalees 0.6s pour effet ripple. Pause au hover desktop (signal "actif"). */}
      <span
        className="absolute inset-0 rounded-full bg-[color:var(--color-bronze)]/40 motion-safe:animate-ping pointer-events-none lg:group-hover:hidden"
        style={{ animationDuration: "2.4s" }}
        aria-hidden
      />
      <span
        className="absolute -inset-1 rounded-full bg-[color:var(--color-bronze)]/20 motion-safe:animate-ping pointer-events-none lg:group-hover:hidden"
        style={{ animationDuration: "2.4s", animationDelay: "0.6s" }}
        aria-hidden
      />

      {/* Icone WhatsApp officielle (SVG inline) — couleur bronze via text-bronze parent */}
      <svg className="relative w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    </a>
  );
}
