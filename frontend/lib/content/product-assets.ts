/**
 * Product images live under /public/images/product/.
 *
 * Do **not** append cache-bust query strings (?v=…) — `next/image` calls
 * `/_next/image?url=…` and the optimizer returns **400** for local static
 * paths that include a query string, so images vanish in production.
 *
 * Fresh bytes after swaps are enforced via `next.config.ts` Cache-Control on
 * `/images/product/:path*` (must-revalidate) and by redeploying.
 *
 * (When you replace files, redeploy; no URL version param needed.)
 */

/** Use for every product image `src` (Next/Image, Open Graph, plain href). */
export function productAsset(path: string): string {
  return path;
}
