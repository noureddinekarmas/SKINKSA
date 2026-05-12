/**
 * Cache-bust URLs for files in /public/images/product/ so mobile/desktop
 * both fetch fresh bytes after art swaps (browser + CDN).
 * Bump when replacing assets.
 */
export const PRODUCT_ASSET_VERSION = "11";

export function productAsset(path: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${PRODUCT_ASSET_VERSION}`;
}
