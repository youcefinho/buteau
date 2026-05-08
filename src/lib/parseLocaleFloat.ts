/**
 * Parse un nombre saisi en format français Québec (calculator hypothécaire).
 *
 * Accepte :
 *   - virgule décimale : "1234,56" → 1234.56
 *   - point décimal : "1234.56" → 1234.56
 *   - espace insécable étroit U+202F (NNBSP, séparateur de milliers FR) : "1 234,56" → 1234.56
 *   - espace insécable U+00A0 : "1 234,56" → 1234.56
 *   - espace standard : "1 234,56" → 1234.56
 *   - signe dollar : "1 234,56 $" → 1234.56
 *
 * Retourne `null` si la chaîne n'est PAS un nombre valide (ne pas confondre avec 0).
 *
 * Anti-pattern : `parseLocaleFloat(x) || 0` mange le 0 légitime saisi par l'utilisateur.
 * Préférer : `const n = parseLocaleFloat(x); const value = n ?? 0;`
 *
 * Cf. skill `intralys-locale-parsefloat`.
 */
export function parseLocaleFloat(input: string | number | null | undefined): number | null {
  if (input === null || input === undefined) return null;
  if (typeof input === "number") {
    return Number.isFinite(input) ? input : null;
  }

  // Strip dollar, espaces (NNBSP   + NBSP   + espace régulier).
  const cleaned = input
    .replace(/\$/g, "")
    .replace(/[  \s]/g, "")
    .replace(",", ".")
    .trim();

  if (cleaned === "") return null;

  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

/**
 * Format inverse — affiche un nombre en format FR Québec avec NNBSP comme séparateur de milliers.
 */
export function formatLocaleCurrency(n: number, lang: "fr" | "en" = "fr"): string {
  const locale = lang === "fr" ? "fr-CA" : "en-CA";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2,
  }).format(n);
}
