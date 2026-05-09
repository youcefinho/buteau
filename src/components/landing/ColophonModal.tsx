import { useLanguage } from "@/lib/LanguageContext";
import { useColophon } from "@/lib/ColophonContext";
import { ModalShell } from "@/components/layout/ModalShell";
import { AutoGlossary } from "@/components/landing/AutoGlossary";
import { config } from "@/lib/config";

/**
 * ColophonModal — mentions techniques magazine en modal (pattern Serujan).
 *
 * Reprise du contenu de l'ancienne route /colophon. Sections : Typographie, Palette
 * (4 swatches oklch), Principes éditoriaux (4 numérotés), Direction, Accessibilité,
 * Composition. Drop-cap Cormorant sur intro.
 */
export function ColophonModal() {
  const { lang } = useLanguage();
  const { isOpen, close } = useColophon();
  const isFr = lang === "fr";

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={close}
      eyebrow={isFr ? "Mentions techniques" : "Technical credits"}
      title={isFr ? "Colophon" : "Colophon"}
      closeLabel={isFr ? "Fermer le colophon" : "Close colophon"}
      ariaLabelledById="colophon-title"
    >
      {/* Sous-titre Volume / Édition */}
      <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-6">
        {isFr ? "Volume I — Édition N° 01 · Quebec MMXXVI" : "Volume I — Edition Nº 01 · Quebec MMXXVI"}
      </p>

      {/* Intro éditorial avec drop-cap */}
      <p className="font-[var(--font-editorial)] italic text-base md:text-lg leading-[1.7] text-[color:var(--color-navy-deep)]/85 first-letter:font-[var(--font-editorial)] first-letter:italic first-letter:text-6xl first-letter:text-[color:var(--color-bronze-deep)] first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85] first-letter:mt-1">
        {isFr
          ? "Comme un magazine d'auteur, ce site assume sa fabrication. Voici les choix typographiques, chromatiques et éditoriaux qui composent l'édition que vous parcourez."
          : "Like an author's magazine, this site owns its making. Here are the typographic, chromatic and editorial choices that compose the edition you are browsing."}
      </p>

      {/* Typographie */}
      <ColophonSection label={isFr ? "Typographie" : "Typography"}>
        <ColophonRow
          label={isFr ? "Caractères de titre" : "Display"}
          value="Cormorant Garamond"
          note={isFr ? "Italique éditorial — éclats, marginalia, chiffres romains" : "Editorial italic — accents, marginalia, roman numerals"}
        />
        <ColophonRow
          label={isFr ? "Caractères signature" : "Signature"}
          value="Fraunces (variable)"
          note={
            isFr
              ? "Axes opsz, ital, SOFT, WONK — réservé à 3 endroits : tagline Hero, pull-quote Mission, « Bonjour » du Mot du courtier"
              : "Axes opsz, ital, SOFT, WONK — reserved to 3 places: Hero tagline, Mission pull-quote, the Broker's letter « Bonjour »"
          }
        />
        <ColophonRow
          label={isFr ? "Caractères de labeur" : "Body"}
          value="Montserrat"
          note={isFr ? "Sans-serif, eyebrows uppercase tracking 0.12em" : "Sans-serif, uppercase eyebrows tracking 0.12em"}
        />
      </ColophonSection>

      {/* Palette */}
      <ColophonSection label={isFr ? "Palette" : "Palette"}>
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
          value="oklch(0.704 0.077 56)"
          swatchClass="bg-[color:var(--color-bronze)]"
          note={isFr ? "Accents — boutons, hover, signatures" : "Accents — buttons, hover, signatures"}
        />
        <ColophonRow
          label={isFr ? "Crème" : "Cream"}
          value="oklch(0.978 0 0)"
          swatchClass="bg-[color:var(--color-cream)] border border-[color:var(--color-taupe)]/40"
          note={isFr ? "Surface de respiration" : "Breathing surface"}
        />
      </ColophonSection>

      {/* Principes éditoriaux */}
      <ColophonSection label={isFr ? "Principes éditoriaux" : "Editorial principles"}>
        <ol className="space-y-5 mt-2">
          {(isFr
            ? [
                ["Aucune zone grise.", "Pas de jargon non expliqué, pas de promesse irréaliste, pas de chiffre inventé. Les chiffres affichés (200 familles, 9+ institutions) sont vérifiables."],
                ["Le silence comme matière.", "Le luxe vrai chuchote. Aucun effet ambient gratuit. Le motion sert le contenu, pas l'inverse."],
                ["La pédagogie avant la transaction.", "Le calculateur, le quiz, les capsules, le carnet — gratuits, sans email obligatoire. On vous outille même si vous ne signez pas avec nous."],
                ["L'humain avant la machine.", "Le « Mot du courtier » est signé manuscritement. Les biographies sont écrites au « je ». Le courrier des lecteurs reproduit de vraies lettres clients."],
              ]
            : [
                ["No grey areas.", "No unexplained jargon, no unrealistic promise, no invented figures. The numbers shown (200 families, 9+ institutions) are verifiable."],
                ["Silence as matter.", "True luxury whispers. No gratuitous ambient effect. Motion serves content, not the reverse."],
                ["Pedagogy before transaction.", "The calculator, quiz, shorts, address book — free, no mandatory email. We equip you even if you don't sign with us."],
                ["Humans before machines.", "The « Broker's letter » carries a hand-drawn signature. Bios are written in the first person. Letters to the editor reproduce real client letters."],
              ]
          ).map(([title, body], idx) => (
            <li key={title} className="flex gap-5">
              <span className="font-[var(--font-editorial)] italic text-[color:var(--color-bronze-deep)] text-2xl shrink-0 leading-none w-8">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="space-y-2">
                <p className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base uppercase tracking-[0.04em]">
                  {title}
                </p>
                <p className="text-sm leading-[1.7] text-[color:var(--color-navy-deep)]/75">
                  <AutoGlossary text={body} maxWraps={2} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </ColophonSection>

      {/* Équipe */}
      <ColophonSection label={isFr ? "Direction" : "Editorial team"}>
        <ColophonRow label={isFr ? "Direction" : "Direction"} value="Andrew Buteau" note={isFr ? "Courtier hypothécaire & fondateur" : "Mortgage broker & founder"} />
        <ColophonRow label={isFr ? "Coordination" : "Coordination"} value="Abygaèle Gagné" note={isFr ? "Coordonnatrice exécutive" : "Executive coordinator"} />
        <ColophonRow label={isFr ? "Gestion hypothécaire" : "Mortgage management"} value="Alexis Buteau" note={isFr ? "Assistant en gestion hypothécaire" : "Mortgage management assistant"} />
        <ColophonRow label={isFr ? "Opérations" : "Operations"} value="Felix" note={isFr ? "Coordonnateur des opérations de courtage" : "Brokerage operations coordinator"} />
      </ColophonSection>

      {/* Accessibilité */}
      <ColophonSection label={isFr ? "Accessibilité" : "Accessibility"}>
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

      {/* Composition */}
      <ColophonSection label={isFr ? "Composition" : "Composition"}>
        <p className="font-[var(--font-editorial)] italic text-base leading-[1.7] text-[color:var(--color-navy-deep)]/80">
          {isFr
            ? "Composé en TypeScript. Hébergé sur Cloudflare. Aucun tracker tiers chargé sans consentement explicite. Le code source des composants suit les principes énoncés ci-dessus — la rigueur visible côté client est la même que la rigueur invisible côté serveur."
            : "Set in TypeScript. Hosted on Cloudflare. No third-party tracker loaded without explicit consent. The source code follows the principles stated above — the rigor visible client-side mirrors the rigor invisible server-side."}
        </p>
      </ColophonSection>

      {/* Crédits final */}
      <section className="pt-10 mt-8 border-t border-[color:var(--color-taupe)]/40 text-center">
        <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-3">
          {isFr ? "Imprimé à Laval" : "Printed in Laval"}
        </p>
        <p className="font-[var(--font-editorial)] italic text-[color:var(--color-navy-deep)]/85 text-base leading-relaxed">
          {isFr
            ? "par L'Équipe Buteau, en cabinet d'attache chez Plani-prêt Cabinet en Courtage Hypothécaire."
            : "by Équipe Buteau, with Plani-prêt Cabinet en Courtage Hypothécaire as their attached firm."}
        </p>
        <p className="mt-6 eyebrow text-[color:var(--color-taupe-dark)]/70 text-[10px]">
          ☞ {isFr ? "Bureau" : "Office"} — {config.address.streetAddress}, {config.address.addressLocality} ({config.address.addressRegion}) {config.address.postalCode}
        </p>
      </section>
    </ModalShell>
  );
}

/* ─── Sous-composants ────────────────────────────────────────────────── */

function ColophonSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-8">
      <div className="flex items-center gap-4 mb-5">
        <span className="block w-8 h-px bg-[color:var(--color-bronze)]" aria-hidden="true" />
        <h3 className="eyebrow text-[color:var(--color-bronze-deep)]">{label}</h3>
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
          <p className="font-[var(--font-editorial)] italic text-[color:var(--color-navy-deep)]/65 text-sm leading-snug">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
