/**
 * Home page imagery — uses the same /public product set as the product landing.
 * Swap paths here to update the whole homepage visuals at once.
 */
import { productAsset } from "@/lib/content/product-assets";

export const HOME_IMAGES = {
  hero: productAsset("/images/product/gallery-main-1.png"),
  productSpotlight: productAsset("/images/product/gallery-texture-2.png"),
  ingredientSfda: productAsset("/images/product/gallery-quality-4.png"),
  storyPain: productAsset("/images/product/story-card-1.png"),
  storySocial: productAsset("/images/product/story-card-2.png"),
  finalCta: productAsset("/images/product/gallery-usage-3.png"),
} as const;
