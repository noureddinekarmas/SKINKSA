import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { STATIC_PRODUCT, STATIC_OFFERS } from "@/lib/content/products";
import { formatSar } from "@/lib/currency";
import { Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "المجموعة | SKINKSA",
  description: "تصفحي مجموعة SKINKSA للعناية الفاخرة بالبشرة",
};

export default function CollectionsPage() {
  const defaultOffer = STATIC_OFFERS.find((o) => o.is_default) || STATIC_OFFERS[1];

  return (
    <main dir="rtl">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#312E81] to-indigo-700 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">المجموعة</h1>
          <p className="text-white/80 text-lg">
            منتجات عناية فاخرة مصممة للمرأة السعودية
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main product */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0] hover:shadow-md transition group">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-100 aspect-square flex items-center justify-center relative">
                <Image
                  src="/placeholders/serum-bottle.svg"
                  alt={STATIC_PRODUCT.title_ar}
                  width={180}
                  height={180}
                  className="object-contain"
                />
                <Badge className="absolute top-3 right-3 bg-[#B7791F] text-white hover:bg-[#B7791F]">
                  الأكثر مبيعاً
                </Badge>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-[#475569] text-xs mr-1">4.9</span>
                </div>
                <h3 className="font-bold text-[#0F172A] text-sm leading-snug line-clamp-2">
                  {STATIC_PRODUCT.title_ar}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#312E81]">
                    <span dir="ltr" className="sar-glyph tabular-nums">
                      {formatSar(defaultOffer.price_sar)}
                    </span>
                  </span>
                  {defaultOffer.compare_at_sar && (
                    <span className="text-sm text-[#475569] line-through">
                      <span dir="ltr" className="sar-glyph tabular-nums">
                        {formatSar(defaultOffer.compare_at_sar)}
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[#15803D] text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>دفع عند الاستلام</span>
                </div>
                <Link href={`/products/${STATIC_PRODUCT.slug}`}>
                  <Button className="w-full bg-[#312E81] hover:bg-indigo-800 text-white rounded-xl">
                    اطلبي الآن
                  </Button>
                </Link>
              </div>
            </div>

            {/* Coming soon placeholders */}
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center aspect-square text-center p-6 space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
                <p className="text-[#475569] font-medium">قريباً</p>
                <p className="text-[#475569] text-xs">منتج جديد قيد التطوير</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
