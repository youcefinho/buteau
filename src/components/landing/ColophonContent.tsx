import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";
import { AutoGlossary } from "@/components/landing/AutoGlossary";
import { ButeauMonogramInline } from "@/components/atmosphere/ButeauMonogramInline";
import { HeartbeatCta } from "@/components/layout/HeartbeatCta";

// ═══════════════════════════════════════════════════════════
// ColophonContent — Buteau (single source of truth).
// Réutilisé par ColophonModal.tsx (modal) + routes/colophon.tsx (page SEO).
// ═══════════════════════════════════════════════════════════

interface ColophonContentProps {
  variant: "modal" | "page";
  onClose?: () => void;
}

export function ColophonContent({ variant, onClose }: ColophonContentProps) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <>
      {/* Intro éditorial */}
      <p className="italic text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.7] text-[color:var(--color-navy-deep)]/85 first-letter:italic first-letter:text-6xl first-letter:text-[color:var(--color-navy)] first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85] first-letter:mt-1 text-pretty hyphens-auto">
        {isFr
          ? "Comme un magazine d'auteur, ce site assume sa fabrication. Voici les choix typographiques, chromatiques et de fond qui composent l'édition que vous parcourez."
          : "Like an author's magazine, this site owns its making. Here are the typographic, chromatic and substantive choices that compose the edition you are browsing."}
      </p>

      {/* Typographie */}
      <ColophonSection id="colophon-typo" label={isFr ? "Typographie" : "Typography"}>
        <ColophonRow
          label={isFr ? "Caractères de titre" : "Display"}
          value="Cormorant Garamond"
          note={isFr ? "Italique de titre — éclats, marginalia, numéros décoratifs" : "Display italic — accents, marginalia, decorative numerals"}
        />
        <ColophonRow
          label={isFr ? "Caractères signature" : "Signature"}
          value="Fraunces (variable)"
          note={isFr ? "Axes opsz, ital, SOFT, WONK — réservé à 3 endroits signature" : "Axes opsz, ital, SOFT, WONK — reserved to 3 signature places"}
        />
        <ColophonRow
          label={isFr ? "Caractères de labeur" : "Body"}
          value="Montserrat"
          note={isFr ? "Sans-serif, eyebrows uppercase tracking 0.12em" : "Sans-serif, uppercase eyebrows tracking 0.12em"}
        />
      </ColophonSection>

      {/* Palette */}
      <ColophonSection id="colophon-palette" label={isFr ? "Palette" : "Palette"}>
        <ColophonRow
          label={isFr ? "Bleu nuit" : "Deep navy"}
          value="oklch(0.252 0.067 256)"
          swatchClass="bg-[color:var(--color-navy-deep)]"
          note={isFr ? "Fond dominant — sections d'autorité" : "Dominant ground — authority sections"}
        />
        <ColophonRow
          label={isFr ? "Taupe doux" : "Soft taupe"}
          value="oklch(0.722 0.018 84)"
          swatchClass="bg-[color:var(--color-taupe)]"
          note={isFr ? "Filets, marginalia, dividers" : "Hairlines, marginalia, dividers"}
        />
        <ColophonRow
          label={isFr ? "Bronze caramel" : "Bronze caramel"}
          value="oklch(0.722 0.018 84)"
          swatchClass="bg-[color:var(--color-taupe-dark)]"
          note={isFr ? "Accents — boutons, hover, signatures" : "Accents — buttons, hover, signatures"}
        />
        <ColophonRow
          label={isFr ? "Crème" : "Cream"}
          value="oklch(0.978 0 0)"
          swatchClass="bg-[color:var(--color-cream)] border border-[color:var(--color-taupe)]/40"
          note={isFr ? "Surface de respiration" : "Breathing surface"}
        />
      </ColophonSection>

      {/* Principes éditoriaux — DÉRIVÉS du copy hero/services Buteau */}
      <ColophonSection id="colophon-principes" label={isFr ? "Principes éditoriaux" : "Editorial principles"}>
        <ol className="space-y-5 mt-2">
          {(isFr
            ? [
                ["L'hypothèque autrement.", "La promesse signature du site (hero h1) — appliquée à chaque mot, chaque chiffre. Pas de jargon non expliqué, pas de promesse irréaliste."],
                ["200 familles accompagnées en 2025.", "Chiffre vérifiable — pas une projection. La cible Buteau est large : 40 % primo-acheteurs, 60 % refi/upgrade/famille. Aucun dossier traité avec moins de soin parce que plus petit."],
                ["Quatre pros, un seul interlocuteur.", "Andrew, Abygaèle, Alexis et Felix — chaque dossier passe par une équipe de quatre, mais le client a un point de contact principal. Pas de relais à un assistant à mi-parcours."],
                ["La pédagogie avant la transaction.", "Le calculateur, les guides, les capsules vidéo, le carnet — gratuits, sans email obligatoire. On vous outille même si vous ne signez pas avec nous."],
              ]
            : [
                ["Mortgage. Differently.", "The site's signature promise (hero h1) — applied to every word, every figure. No unexplained jargon, no unrealistic promise."],
                ["200 families supported in 2025.", "Verifiable number — not a projection. Buteau's target is broad: 40% first-time buyers, 60% refi/upgrade/family. No file handled with less care because smaller."],
                ["Four pros, one main contact.", "Andrew, Abygaèle, Alexis and Felix — every file goes through a team of four, but the client has one main contact. No mid-process handover to an assistant."],
                ["Pedagogy before transaction.", "The calculator, guides, video shorts, address book — free, no mandatory email. We equip you even if you don't sign with us."],
              ]
          ).map(([title, body], idx) => (
            <li key={title} className="flex gap-5">
              <span className="font-[var(--font-editorial)] italic text-[color:var(--color-navy)] text-2xl shrink-0 leading-none w-8">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="space-y-2">
                <p className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[0.04em] text-balance">
                  {title}
                </p>
                <p className="text-sm leading-[1.7] text-[color:var(--color-navy-deep)]/75 text-pretty hyphens-auto">
                  <AutoGlossary text={body} maxWraps={2} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </ColophonSection>

      {/* Direction */}
      <ColophonSection id="colophon-direction" label={isFr ? "Direction" : "Editorial team"}>
        <ColophonRow label={isFr ? "Direction" : "Direction"} value="Andrew Buteau" note={isFr ? "Courtier hypothécaire & fondateur" : "Mortgage broker & founder"} />
        <ColophonRow label={isFr ? "Coordination" : "Coordination"} value="Abygaèle Gagné" note={isFr ? "Coordonnatrice exécutive" : "Executive coordinator"} />
        <ColophonRow label={isFr ? "Gestion hypothécaire" : "Mortgage management"} value="Alexis Buteau" note={isFr ? "Assistant en gestion hypothécaire" : "Mortgage management assistant"} />
        <ColophonRow label={isFr ? "Opérations" : "Operations"} value="Felix" note={isFr ? "Coordonnateur des opérations de courtage" : "Brokerage operations coordinator"} />
      </ColophonSection>

      {/* Accessibilité */}
      <ColophonSection id="colophon-a11y" label={isFr ? "Accessibilité" : "Accessibility"}>
        <ColophonRow
          label={isFr ? "Norme cible" : "Target standard"}
          value="WCAG 2.2 AA"
          note={isFr ? "Skip-link, focus-visible, prefers-reduced-motion respecté, contraste ≥ 4.5:1" : "Skip-link, focus-visible, prefers-reduced-motion honored, contrast ≥ 4.5:1"}
        />
        <ColophonRow
          label={isFr ? "Langues" : "Languages"}
          value={isFr ? "Français · Anglais" : "French · English"}
          note={isFr ? "FR par défaut au load (Charte de la langue française du Québec)" : "FR default on load (Quebec's Charter of the French Language)"}
        />
        <ColophonRow
          label={isFr ? "Vie privée" : "Privacy"}
          value="Loi 25"
          note={isFr ? "Bannière consentement granulaire, droits user, contact DPO" : "Granular consent banner, user rights, DPO contact"}
        />
      </ColophonSection>

      {/* Crédits final */}
      <section className="pt-10 mt-8 border-t border-[color:var(--color-taupe)]/40 text-center">
        <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-3">
          {isFr ? "Imprimé à Laval" : "Printed in Laval"}
        </p>
        <p className="italic text-[color:var(--color-navy-deep)]/85 text-base leading-relaxed text-pretty">
          {isFr
            ? "par L'Équipe Buteau, en cabinet d'attache chez Planiprêt Cabinet en Courtage Hypothécaire."
            : "by Équipe Buteau, with Planiprêt Cabinet en Courtage Hypothécaire as their attached firm."}
        </p>
        <p className="mt-6 eyebrow text-[color:var(--color-taupe-dark)]/70 text-[10px]">
          ☞ {isFr ? "Bureau" : "Office"} — {config.address.streetAddress}, {config.address.addressLocality} ({config.address.addressRegion}) {config.address.postalCode}
        </p>
      </section>

      {/* CTA "Lire la version complète" — uniquement en mode modal */}
      {variant === "modal" && (
        <div className="mt-10 pt-8 border-t border-[color:var(--color-taupe)]/40">
          <HeartbeatCta className="cta-heartbeat--block">
            <Link
              to="/colophon"
              onClick={onClose}
              className="group flex items-center justify-between gap-4 p-5 bg-[color:var(--color-taupe-dark)]/5 border border-[color:var(--color-taupe-dark)]/20 hover:bg-[color:var(--color-taupe-dark)]/10 hover:border-[color:var(--color-taupe-dark)]/40 transition-all"
            >
              <div>
                <div className="eyebrow text-[color:var(--color-navy)] mb-1">
                  <ButeauMonogramInline className="mr-1" /> {isFr ? "Lire le colophon complet" : "Read the full colophon"}
                </div>
                <div className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[0.04em]">
                  {isFr ? "L'atelier — méthode et standards" : "The atelier — method and standards"}
                </div>
              </div>
              <ArrowRight
                className="w-5 h-5 text-[color:var(--color-taupe-dark)] group-hover:text-[color:var(--color-navy)] group-hover:translate-x-0.5 transition-all shrink-0"
                aria-hidden
              />
            </Link>
          </HeartbeatCta>
        </div>
      )}
    </>
  );
}

/* ─── Sous-composants ────────────────────────────────────────────────── */

function ColophonSection({
  label,
  id,
  children,
}: {
  label: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="pt-8 scroll-mt-24">
      <div className="flex items-center gap-4 mb-5">
        <span className="block w-8 h-px bg-[color:var(--color-taupe-dark)]" aria-hidden="true" />
        <h3 className="eyebrow text-[color:var(--color-navy)]">{label}</h3>
        <span className="block flex-1 h-px bg-[color:var(--color-taupe)]/40" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

function ColophonRow({
  label,
  value,
  note,
  swatchClass,
}: {
  label: string;
  value: string;
  note?: string;
  swatchClass?: string;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 py-4 border-b border-[color:var(--color-taupe)]/20 last:border-b-0 items-baseline">
      <p className="col-span-4 eyebrow text-[color:var(--color-taupe-dark)] text-[10px]">
        {label}
      </p>
      <div className="col-span-8 space-y-1.5">
        <div className="flex items-center gap-3">
          {swatchClass && (
            <span
              className={`inline-block w-4 h-4 rounded-sm shrink-0 ${swatchClass}`}
              aria-hidden="true"
            />
          )}
          <p className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base tabular-nums">
            {value}
          </p>
        </div>
        {note && (
          <p className="italic text-[color:var(--color-navy-deep)]/65 text-sm leading-snug">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
