"use client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart/store";
import { HOME_IMAGES } from "@/lib/content/home-images";
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
        price_sar: Number(offer.price_sar),
        label_ar: offer.label_ar ?? "",
        currency: "SAR",
      },
      { id: STATIC_PRODUCT.id, slug: STATIC_PRODUCT.slug, titleAr: STATIC_PRODUCT.title_ar }
    );
    trackCommerceEvent({
      eventName: "AddToCart",
      eventId,
      value: offer.price_sar,
      currency: "SAR",
      contents: [
        {
          id: STATIC_PRODUCT.slug,
          quantity: offer.quantity,
          item_price: offer.price_sar,
        },
      ],
      contentName: STATIC_PRODUCT.title_ar,
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-brand-deep)] via-[#1a3d6d] to-[#0f2744] py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[url('/placeholders/pattern.svg')] opacity-[0.06]" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-[var(--color-brand-primary)]/25 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[var(--color-brand-accent)]/20 blur-[90px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:gap-14">
        <div className="order-2 space-y-6 md:order-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-[var(--color-brand-accent)] text-[var(--color-brand-accent)]" />
              ))}
            </div>
            <span className="text-sm font-semibold text-white/85">+1000 عميلة سعيدة من أنحاء المملكة</span>
          </div>

          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--color-brand-accent)]">
            SKINKSA · سيروم ببتيد النحاس الأزرق
          </p>

          <h1 className="text-balance text-3xl font-black leading-tight md:text-5xl lg:text-6xl">
            وجهك باين تعبان؟
            <span className="mt-2 block text-2xl text-[var(--color-brand-accent)] md:text-4xl">
              سيروم ببتيد النحاس لشد البشرة وتجديدها
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            ودعي البهتان وعلامات الإرهاق. تركيبة علمية فاخرة مرخصة من هيئة الغذاء والدواء (SFDA)، مصممة خصيصاً لتمنح
            المرأة السعودية النضارة والإشراق الذي تستحقه.
          </p>

          <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row">
            <Button
              onClick={handleCTA}
              size="lg"
              className="h-16 rounded-2xl bg-gradient-to-l from-[var(--color-brand-accent)] to-[#d4a843] px-10 text-lg font-black text-[#0f1c2e] shadow-[0_12px_40px_-8px_rgba(201,164,74,0.55)] transition-all hover:from-[#d4b356] hover:to-[#c9a44a] hover:-translate-y-0.5"
            >
              اطلبي الآن — الدفع عند الاستلام
            </Button>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center gap-2 text-sm font-medium text-white/90">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-300" />
              <span>ضمان ذهبي 30 يوماً: استرداد فوري إذا لم تلاحظي الفرق.</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-white/90">
              <ShieldAlert className="h-5 w-5 shrink-0 text-sky-300" />
              <span>آمن ومصرح من الهيئة العامة للغذاء والدواء.</span>
            </div>
          </div>
        </div>

        <div className="order-1 flex justify-center md:order-2">
          <div className="relative h-72 w-72 md:h-96 md:w-96">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[var(--color-brand-accent)]/50 via-transparent to-[var(--color-brand-primary)]/40 blur-md" aria-hidden />
            <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/15 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.5)] ring-4 ring-[var(--color-brand-accent)]/25">
              <Image
                src={HOME_IMAGES.hero}
                alt="سيروم ببتيد النحاس الأزرق SKINKSA"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 288px, 384px"
                priority
              />
            </div>
            <div className="absolute -right-2 -top-2 rounded-full border border-[#e8c65a]/40 bg-gradient-to-r from-[var(--color-brand-accent)] to-[#d4a843] px-4 py-2 text-sm font-black text-[#0f1c2e] shadow-lg">
              الخيار الأول للنضارة
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
