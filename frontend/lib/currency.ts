import type { ShopCurrency } from "@/lib/content/product-landing-data";

/**
 * Build-time default for pages that are not tied to a market slug (e.g. home).
 * `/products/qarskin` and `/kwtskin` use **QAR** / **KWD** from `product-landing-data.ts` — this env does not override those.
 */
export function getPublicDefaultCurrency(): ShopCurrency {
  const raw = process.env.NEXT_PUBLIC_DEFAULT_CURRENCY?.trim().toUpperCase();
  if (raw === "QAR" || raw === "KWD" || raw === "SAR") return raw;
  return "SAR";
}

/** Plain number string for SAR displays; pair with «ر.س» in Arabic copy or `sar-glyph` styling where used. */
export function formatSar(n: string | number): string {
  return formatMoney(n, "SAR", "en-SA");
}

/**
 * Format a cart/PDP amount for display. `unitPrice` fields remain named `price_sar` in some APIs
 * but are interpreted in the active storefront currency (SAR / QAR / KWD).
 */
export function formatMoney(n: string | number, currency: ShopCurrency, locale?: string): string {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (Number.isNaN(v)) return "—";
  const loc =
    locale ??
    (currency === "SAR" ? "en-SA" : currency === "QAR" ? "en-QA" : "en-KW");
  const maxFrac = currency === "KWD" ? 3 : 0;
  return new Intl.NumberFormat(loc, { maximumFractionDigits: maxFrac, minimumFractionDigits: 0 }).format(v);
}
