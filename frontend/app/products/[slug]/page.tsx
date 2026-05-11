import { notFound } from "next/navigation";

import ProductLanding from "@/components/product/ProductLanding";
import { STATIC_PRODUCT } from "@/lib/content/products";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== STATIC_PRODUCT.slug) {
    notFound();
  }
  return <ProductLanding />;
}
