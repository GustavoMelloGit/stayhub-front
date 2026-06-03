/**
 * Converts any string format to Capital Case.
 *
 * Handles: snake_case, kebab-case, camelCase, PascalCase,
 * ALLCAPS, space-separated strings with inconsistent casing, and combinations.
 *
 * Examples:
 *   capitalize('capital_case')   → 'Capital Case'
 *   capitalize('capitalCase')    → 'Capital Case'
 *   capitalize('cAPitAl cASE')   → 'Capital Case'
 *   capitalize('kebab-case')     → 'Kebab Case'
 *   capitalize('PascalCase')     → 'Pascal Case'
 */
export function capitalize(str: string): string {
  const tokens = str.replace(/[_-]+/g, ' ').split(/\s+/).filter(Boolean);

  const words: string[] = [];

  for (const token of tokens) {
    const hasCamelBoundary = /[a-z][A-Z]/.test(token);
    const hasConsecutiveUppercase = /[A-Z]{2}/.test(token);

    if (hasCamelBoundary && !hasConsecutiveUppercase) {
      words.push(...token.split(/(?=[A-Z])/));
    } else {
      words.push(token);
    }
  }

  return words
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
