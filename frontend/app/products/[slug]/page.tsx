import { notFound, permanentRedirect } from "next/navigation";

import ProductLanding from "@/components/product/ProductLanding";
import { STATIC_PRODUCT } from "@/lib/content/products";

/** Previous public URL — must redirect here as well as next.config (some hosts skip config redirects). */
const LEGACY_PRODUCT_SLUG = "blue-copper-peptide-serum";

/** Served HTML must not stay stale at CDN after a deploy (marketing assets change often). */
export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const canonical = STATIC_PRODUCT.slug;

  if (slug.toLowerCase() === LEGACY_PRODUCT_SLUG.toLowerCase()) {
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
