"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart/store";
import { HOME_IMAGES } from "@/lib/content/home-images";
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
        price_sar: Number(offer.price_sar),
        label_ar: offer.label_ar ?? "",
        currency: "SAR",
      },
      { id: STATIC_PRODUCT.id, slug: STATIC_PRODUCT.slug, titleAr: STATIC_PRODUCT.title_ar }
    );
    openDrawer();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-brand-deep)] via-[#1a3d6d] to-[#0f2744] py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[url('/placeholders/pattern.svg')] opacity-[0.06]" aria-hidden />
      <div
        className="pointer-events-none absolute -right-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[var(--color-brand-accent)]/15 blur-[100px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:gap-16">
        <div className="order-2 text-center md:order-1 md:text-right">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-[var(--color-brand-accent)]">جاهزة للخطوة الجاية؟</p>
          <h2 className="text-balance text-3xl font-black leading-tight md:text-4xl lg:text-5xl">
            استعيدي نضارة وجهك الآن بثقة تامة
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80 md:mx-0">
            لا تدعي فرصة التغيير تفوتك. اطلبي سيروم SKINKSA الأصلي من المتجر الرسمي، وجربيه براحة بال مع الضمان الذهبي، ولا
            تدفعي ريالاً إلا عند استلام طلبك بيدج.
          </p>
          <div className="mt-8 flex justify-center md:justify-start">
            <Button
              onClick={handleCTA}
              size="lg"
              className="h-16 rounded-2xl bg-gradient-to-l from-[var(--color-brand-accent)] to-[#d4a843] px-12 text-xl font-black text-[#0f1c2e] shadow-[0_16px_48px_-12px_rgba(201,164,74,0.55)] transition-all hover:from-[#d4b356] hover:to-[#c9a44a] hover:-translate-y-0.5"
            >
              اطلبي الآن — الدفع عند الاستلام
            </Button>
          </div>
          <div className="mt-8 flex flex-col items-center gap-4 text-sm font-semibold text-white/90 sm:flex-row sm:justify-start sm:gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-300" />
              <span>ضمان استرداد 30 يوم</span>
            </div>
            <div className="hidden text-white/35 sm:block">•</div>
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6 shrink-0 text-sky-300" />
              <span>توصيل سريع لكل مناطق المملكة</span>
            </div>
          </div>
        </div>

        <div className="order-1 flex justify-center md:order-2">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-[var(--color-brand-primary)]/30 to-[var(--color-brand-accent)]/25 blur-xl" aria-hidden />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border-2 border-white/15 shadow-2xl ring-2 ring-[var(--color-brand-accent)]/30">
              <Image
                src={HOME_IMAGES.finalCta}
                alt="استخدام سيروم SKINKSA"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
