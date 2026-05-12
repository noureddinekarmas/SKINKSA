import { notFound, permanentRedirect } from "next/navigation";

import ProductLanding from "@/components/product/ProductLanding";
import { isProductMarketSlug, MAIN_PRODUCT_SLUG } from "@/lib/content/main-product";

/** Old paths → must redirect here if next.config redirects are skipped in production. */
const LEGACY_PRODUCT_SLUGS = ["blue-copper-peptide-serum", "blueKSA"] as const;

/** Served HTML must not stay stale at CDN after a deploy (marketing assets change often). */
export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalized = slug.toLowerCase();

  if (LEGACY_PRODUCT_SLUGS.some((legacy) => legacy.toLowerCase() === normalized)) {
    permanentRedirect(`/products/${MAIN_PRODUCT_SLUG}`);
  }

  if (!isProductMarketSlug(normalized)) {
    notFound();
  }

  if (slug !== normalized) {
    permanentRedirect(`/products/${normalized}`);
  }

  return <ProductLanding marketSlug={normalized} />;
}
