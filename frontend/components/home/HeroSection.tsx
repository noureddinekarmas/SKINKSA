"use client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart/store";
import { STATIC_OFFERS, STATIC_PRODUCT } from "@/lib/content/products";
import { trackCommerceEvent, generateEventId } from "@/lib/tracking";
import { ShieldCheck, Star, ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const { addOfferToCart } = useCartStore();

  const handleCTA = () => {
    const offer = STATIC_OFFERS.find((o) => o.is_default) || STATIC_OFFERS[1];
    const eventId = generateEventId("hero_atc");
    addOfferToCart(
      {
        code: offer.code as "OFFER_1" | "OFFER_2" | "OFFER_3",
        quantity: offer.quantity,
        price_sar: offer.price_sar,
        label_ar: offer.label_ar,
      },
      { id: STATIC_PRODUCT.id, slug: STATIC_PRODUCT.slug, titleAr: STATIC_PRODUCT.title_ar }
    );
    trackCommerceEvent({
      eventName: "AddToCart",
      eventId,
      value: offer.price_sar,
      currency: "SAR",
    });
  };

  return (
    <section className="bg-gradient-to-br from-[#312E81] via-indigo-900 to-[#1e1b4b] text-white py-16 md:py-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/placeholders/pattern.svg')] opacity-5"></div>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text */}
        <div className="space-y-6 order-2 md:order-1">
          <div className="flex items-center gap-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-white/80 text-sm font-medium">+1000 عميلة سعيدة من أنحاء المملكة</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
            وجهك باين تعبان؟
            <span className="block text-[#B7791F] mt-2 text-2xl md:text-4xl">سيروم ببتيد النحاس لشد البشرة وتجديدها</span>
          </h1>

          <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl">
            ودعي البهتان وعلامات الإرهاق. تركيبة علمية فاخرة مرخصة من هيئة الغذاء والدواء (SFDA)، مصممة خصيصاً لتمنح المرأة السعودية النضارة والإشراق الذي تستحقه.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start pt-2">
            <Button
              onClick={handleCTA}
              size="lg"
              className="bg-gradient-to-l from-[#B7791F] to-[#d97706] hover:from-[#d97706] hover:to-[#B7791F] text-white h-16 px-10 text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(183,121,31,0.4)] transform hover:-translate-y-1 transition-all"
            >
              اطلبي الآن - الدفع عند الاستلام
            </Button>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span>ضمان ذهبي 30 يوماً: استرداد فوري إذا لم تلاحظي الفرق.</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <ShieldAlert className="w-5 h-5 text-blue-400" />
              <span>آمن ومصرح من الهيئة العامة للغذاء والدواء.</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/product/hero-flowers.jpg"
                alt="سيروم ببتيد النحاس الأزرق"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 288px, 384px"
                priority
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#B7791F] to-[#d97706] text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg border border-[#fcd34d]/30">
              الخيار الأول للنضارة
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
