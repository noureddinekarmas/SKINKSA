/**
 * Canonical public site origin (no trailing slash).
 * Set NEXT_PUBLIC_SITE_URL in production, e.g. https://shop.blueksa or https://officialskinksa.store
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://officialskinksa.store";
  return raw.replace(/\/$/, "");
}
