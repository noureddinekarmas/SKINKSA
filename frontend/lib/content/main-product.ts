/**
 * Product PDP path segments: /products/<slug>
 * `blueskin` is the canonical KSA page; `qarskin` / `kwtskin` are GCC storefront variants.
 * Keep middleware/routing imports limited to this file (edge-safe, no API client).
 */
export const MAIN_PRODUCT_SLUG = "blueskin" as const;

export const PRODUCT_MARKET_SLUGS = ["blueskin", "qarskin", "kwtskin"] as const;
export type ProductMarketSlug = (typeof PRODUCT_MARKET_SLUGS)[number];

/** Storefront template for catalog PDPs (`/products/<any-active-slug>`) when slug is not a regional path. */
export function defaultCatalogStorefront(): ProductMarketSlug {
  const v = process.env.NEXT_PUBLIC_CATALOG_STOREFRONT?.toLowerCase();
  if (v && isProductMarketSlug(v)) return v;
  return "blueskin";
}

export function isProductMarketSlug(s: string): s is ProductMarketSlug {
  return (PRODUCT_MARKET_SLUGS as readonly string[]).includes(s);
}
