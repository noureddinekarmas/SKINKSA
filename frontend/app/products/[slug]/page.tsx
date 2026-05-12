import { notFound, permanentRedirect } from "next/navigation";

import ProductLanding from "@/components/product/ProductLanding";
import { MAIN_PRODUCT_SLUG } from "@/lib/content/main-product";

/** Old paths → must redirect here if next.config redirects are skipped in production. */
const LEGACY_PRODUCT_SLUGS = ["blue-copper-peptide-serum", "blueKSA"] as const;

/** Served HTML must not stay stale at CDN after a deploy (marketing assets change often). */
export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const canonical = MAIN_PRODUCT_SLUG;

  if (
    LEGACY_PRODUCT_SLUGS.some((legacy) => legacy.toLowerCase() === slug.toLowerCase())
  ) {
    permanentRedirect(`/products/${canonical}`);
  }

  if (slug.toLowerCase() === canonical.toLowerCase()) {
    if (slug !== canonical) {
      permanentRedirect(`/products/${canonical}`);
    }
    return <ProductLanding />;
  }

  notFound();
}
