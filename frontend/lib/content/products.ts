import type { Product } from "@/lib/api/products";
import { productAsset } from "@/lib/content/product-assets";
import { getProductLandingData } from "@/lib/content/product-landing-data";
import { type ProductMarketSlug, isProductMarketSlug } from "@/lib/content/main-product";

/** Cart drawer & checkout thumbnails (same asset as gallery hero). */
export const PRODUCT_CART_IMAGE = productAsset("/images/product/gallery-main-1.png");

/** KSA storefront defaults (home spotlight, legacy imports). */
export const STATIC_PRODUCT: Product = getProductLandingData("blueskin").product;
export const STATIC_OFFERS = STATIC_PRODUCT.offers;

export function getStaticProduct(slug: string): Product | null {
  if (!isProductMarketSlug(slug)) return null;
  return getProductLandingData(slug as ProductMarketSlug).product;
}
