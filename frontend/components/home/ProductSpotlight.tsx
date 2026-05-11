import OfferSelector from "@/components/product/OfferSelector";
import { STATIC_OFFERS, STATIC_PRODUCT } from "@/lib/content/products";
import Image from "next/image";

export default function ProductSpotlight() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#0f1c2e]">المنتج الرئيسي</h2>
          <p className="text-[#4b5e78] mt-3">اختاري الباقة التي تناسبك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/product/bottle-plain.png"
                alt="سيروم SKINKSA"
                fill
                className="object-cover"
                sizes="288px"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-[#0f1c2e] leading-snug">
                {STATIC_PRODUCT.title_ar}
              </h3>
              <p className="text-[#4b5e78] mt-2 text-sm leading-relaxed">
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
