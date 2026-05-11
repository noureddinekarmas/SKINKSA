/**
 * Official Saudi riyal symbol (Unicode 17 — U+20C1).
 * Announced by SAMA Feb 2025; use alongside ISO "SAR" in APIs.
 * Narrow no-break space (U+202F) before the sign matches common KSA typography.
 */
export const SAR_SIGN = "\u20C1";

/** `amount` + narrow NBSP + riyal sign */
export function formatSar(amount: number | string): string {
  return `${amount}\u202F${SAR_SIGN}`;
}
