"use client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart/store";
import { STATIC_OFFERS, STATIC_PRODUCT } from "@/lib/content/products";
import { ShieldCheck, Truck } from "lucide-react";

export default function FinalCtaSection() {
  const { addOfferToCart, openDrawer } = useCartStore();

  const handleCTA = () => {
    const offer = STATIC_OFFERS.find((o) => o.is_default) || STATIC_OFFERS[1];
    addOfferToCart(
      {
        code: offer.code as "OFFER_1" | "OFFER_2" | "OFFER_3",
        quantity: offer.quantity,
        price_sar: offer.price_sar,
        label_ar: offer.label_ar,
      },
      { id: STATIC_PRODUCT.id, slug: STATIC_PRODUCT.slug, titleAr: STATIC_PRODUCT.title_ar }
    );
    openDrawer();
  };

  return (
    <section className="py-24 bg-gradient-to-br from-[#1e3a5f] via-[#1a3d6d] to-[#0f2744] text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholders/pattern.svg')] opacity-5"></div>
      <div className="max-w-3xl mx-auto px-4 space-y-8 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
          استعيدي نضارة وجهك الآن بثقة تامة
        </h2>
        <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          لا تدعي فرصة التغيير تفوتك. اطلبي سيروم SKINKSA وجربيه براحة بال تامة بفضل الضمان الذهبي، ولا تدفعي ريالاً واحداً إلا عند استلام طلبك بيدك.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            onClick={handleCTA}
            size="lg"
            className="bg-gradient-to-l from-[#c9a44a] to-[#d4a843] hover:from-[#d4a843] hover:to-[#c9a44a] text-white h-16 px-12 text-xl font-bold rounded-2xl shadow-[0_0_30px_rgba(201,164,74,0.5)] transform hover:-translate-y-1 transition-all"
          >
            اطلبي الآن - الدفع عند الاستلام
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/90 text-sm font-medium pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-green-400" />
            <span>ضمان استرداد 30 يوم</span>
          </div>
          <div className="hidden sm:block text-white/30">•</div>
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-400" />
            <span>توصيل سريع لكل مناطق المملكة</span>
          </div>
        </div>
      </div>
    </section>
  );
}
