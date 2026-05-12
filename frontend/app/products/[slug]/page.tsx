import { notFound } from "next/navigation";

import ProductLanding from "@/components/product/ProductLanding";
import { STATIC_PRODUCT } from "@/lib/content/products";

/** Served HTML must not stay stale at CDN after a deploy (marketing assets change often). */
export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== STATIC_PRODUCT.slug) {
    notFound();
  }
  return <ProductLanding />;
}
