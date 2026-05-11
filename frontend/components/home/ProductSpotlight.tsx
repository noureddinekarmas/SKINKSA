import OfferSelector from "@/components/product/OfferSelector";
import { STATIC_OFFERS, STATIC_PRODUCT } from "@/lib/content/products";
import Image from "next/image";

export default function ProductSpotlight() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#0F172A]">المنتج الرئيسي</h2>
          <p className="text-[#475569] mt-3">اختاري الباقة التي تناسبك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="w-72 h-72 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl flex items-center justify-center shadow-lg">
              <Image
                src="/placeholders/serum-bottle.svg"
                alt="سيروم SKINKSA"
                width={220}
                height={220}
                className="object-contain"
                style={{ width: "auto", height: "auto", maxWidth: 220, maxHeight: 220 }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A] leading-snug">
                {STATIC_PRODUCT.title_ar}
              </h3>
              <p className="text-[#475569] mt-2 text-sm leading-relaxed">
                {STATIC_PRODUCT.description_ar}
              </p>
            </div>
            <OfferSelector
              offers={STATIC_OFFERS}
              productId={STATIC_PRODUCT.id}
              productTitleAr={STATIC_PRODUCT.title_ar}
              productSlug={STATIC_PRODUCT.slug}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
