import { notFound, permanentRedirect } from "next/navigation";

import ProductLanding from "@/components/product/ProductLanding";
import { getProduct } from "@/lib/api/products";
import { getProductLandingData, mergeApiProductLandingData } from "@/lib/content/product-landing-data";
import { defaultCatalogStorefront, isProductMarketSlug, MAIN_PRODUCT_SLUG } from "@/lib/content/main-product";

/** Old paths → must redirect here if next.config redirects are skipped in production. */
const LEGACY_PRODUCT_SLUGS = ["blue-copper-peptide-serum", "blueKSA"] as const;

/** Served HTML must not stay stale at CDN after a deploy (marketing assets change often). */
export const dynamic = "force-dynamic";

async function loadCatalogProduct(slug: string) {
  try {
    return await getProduct(slug);
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalized = slug.toLowerCase();

  if (LEGACY_PRODUCT_SLUGS.some((legacy) => legacy.toLowerCase() === normalized)) {
    permanentRedirect(`/products/${MAIN_PRODUCT_SLUG}`);
  }

  if (slug !== normalized) {
    permanentRedirect(`/products/${normalized}`);
  }

  if (!isProductMarketSlug(normalized)) {
    const apiProduct = await loadCatalogProduct(normalized);
    if (!apiProduct) {
      notFound();
    }
    const template = getProductLandingData(defaultCatalogStorefront());
    const data = mergeApiProductLandingData(template, apiProduct);
    return <ProductLanding data={data} />;
  }

  let data = getProductLandingData(normalized);
  const apiProduct = await loadCatalogProduct(normalized);
  if (apiProduct && apiProduct.slug === normalized) {
    data = mergeApiProductLandingData(data, apiProduct);
  }

  return <ProductLanding data={data} />;
}
