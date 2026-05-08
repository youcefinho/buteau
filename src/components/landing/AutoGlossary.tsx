import { useMemo, type ReactNode } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { glossary } from "@/lib/glossary";
import { GlossaryHovercard } from "./GlossaryHovercard";

/**
 * AutoGlossary — prend une string et wrap automatiquement les termes du
 * glossaire qu'elle contient avec <GlossaryHovercard>.
 *
 * Pourquoi NOVEL : combiné avec GlossaryHovercard, l'utilisateur a la définition
 * INSTANT au hover sur n'importe quel terme dans le contenu textuel — sans cliquer
 * un modal. Pattern Wikipedia hovercards adapté à un site courtier.
 *
 * Performance :
 * - Termes triés par longueur descendante (priorité aux composés "Ratio ABD"
 *   avant "Ratio")
 * - 1 seul match par terme par AutoGlossary instance (le 1er trouvé)
 * - Regex case-insensitive avec word boundaries
 * - Compile la regex 1 fois par lang via useMemo
 */
type AutoGlossaryProps = {
  text: string;
  /** Limite combien de termes wrap au total (défaut 4 — éviter "underline soup") */
  maxWraps?: number;
};

export function AutoGlossary({ text, maxWraps = 4 }: AutoGlossaryProps) {
  const { lang } = useLanguage();

  const tokens = useMemo<ReactNode[]>(() => {
    if (!text) return [];

    // Build terms list trié par longueur descendante pour matcher les composés d'abord
    const terms = glossary
      .flatMap((g) => {
        const labels = [g.term[lang]];
        if (lang === "fr" && g.term.fr_alt) labels.push(...g.term.fr_alt);
        return labels.map((label) => ({ label, slug: g.slug }));
      })
      .filter((t) => t.label.length >= 3)
      .sort((a, b) => b.label.length - a.label.length);

    // On parse la string et garde une trace des matches déjà faits
    const used = new Set<string>();
    let remaining = text;
    const out: ReactNode[] = [];
    let key = 0;
    let wrapsCount = 0;

    while (remaining.length > 0 && wrapsCount < maxWraps) {
      let bestMatch: {
        idx: number;
        len: number;
        original: string;
        slug: string;
      } | null = null;

      for (const t of terms) {
        if (used.has(t.slug)) continue;
        const escapedLabel = t.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(`\\b${escapedLabel}\\b`, "i");
        const match = re.exec(remaining);
        if (match && (bestMatch === null || match.index < bestMatch.idx)) {
          bestMatch = {
            idx: match.index,
            len: match[0].length,
            original: match[0],
            slug: t.slug,
          };
        }
      }

      if (!bestMatch) break;

      // Push texte avant le match
      if (bestMatch.idx > 0) {
        out.push(remaining.slice(0, bestMatch.idx));
      }

      // Push le hovercard
      out.push(
        <GlossaryHovercard key={`g-${key++}`} term={bestMatch.original}>
          {bestMatch.original}
        </GlossaryHovercard>,
      );

      used.add(bestMatch.slug);
      wrapsCount += 1;
      remaining = remaining.slice(bestMatch.idx + bestMatch.len);
    }

    if (remaining.length > 0) out.push(remaining);

    return out;
  }, [text, lang, maxWraps]);

  return <>{tokens}</>;
}
