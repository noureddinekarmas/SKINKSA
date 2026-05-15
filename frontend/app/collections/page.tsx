import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/api/products";
import { Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "المجموعة | SKINKSA",
  description: "تصفحي مجموعة SKINKSA للعناية الفاخرة بالبشرة",
};

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const products = await getProducts().catch(() => []);

  return (
    <main dir="rtl">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#312E81] to-indigo-700 py-16 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-4 text-4xl font-bold">المجموعة</h1>
          <p className="text-lg text-white/80">منتجات عناية فاخرة في روتين عملي ونتائج واضحة</p>
        </div>
      </section>

      {/* Products */}
      <section className="bg-[#F8FAFC] py-16">
        <div className="mx-auto max-w-5xl px-4">
          {products.length === 0 ? (
            <p className="text-center text-[#475569]">لا توجد منتجات متاحة حالياً.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const offers = product.offers ?? [];
                const defaultOffer = offers.find((o) => o.is_default) || offers[1] || offers[0];
                const price = defaultOffer ? Number(defaultOffer.price_sar) : null;
                const compare = defaultOffer?.compare_at_sar != null ? Number(defaultOffer.compare_at_sar) : null;
                const img = product.base_image_url || "/placeholders/serum-bottle.svg";

                return (
                  <div
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
                      <Image
                        src={img}
                        alt={product.title_ar}
                        width={180}
                        height={180}
                        className="object-contain"
                      />
                      <Badge className="absolute right-3 top-3 bg-[#B7791F] text-white hover:bg-[#B7791F]">
                        متوفر
                      </Badge>
                    </div>
                    <div className="space-y-3 p-5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="mr-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="mr-1 text-xs text-[#475569]">4.9</span>
                      </div>
                      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#0F172A]">{product.title_ar}</h3>
                      {defaultOffer && price != null && (
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-[#312E81]">{price} ر.س</span>
                          {compare != null && compare > price && (
                            <span className="text-sm text-[#475569] line-through">{compare} ر.س</span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-[#15803D]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>دفع عند الاستلام</span>
                      </div>
                      <Link href={`/products/${product.slug}`}>
                        <Button className="w-full rounded-xl bg-[#312E81] text-white hover:bg-indigo-800">اطلبي الآن</Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
