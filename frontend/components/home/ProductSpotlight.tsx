import OfferSelector from "@/components/product/OfferSelector";
import { HOME_IMAGES } from "@/lib/content/home-images";
import { STATIC_OFFERS, STATIC_PRODUCT } from "@/lib/content/products";
import Image from "next/image";

export default function ProductSpotlight() {
  return (
    <section className="relative overflow-hidden border-y border-[var(--color-brand-border)] bg-gradient-to-b from-[var(--color-brand-mist)] via-white to-[var(--color-brand-mist)] py-16 md:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(26,86,219,0.08),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl px-4">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-[var(--color-brand-accent)]/35 bg-[var(--color-brand-accent)]/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#9a7b2c]">
            المنتج الرئيسي
          </span>
          <h2 className="mt-4 text-3xl font-black text-[var(--color-brand-ink)] md:text-4xl">اختاري الباقة التي تناسبج</h2>
          <p className="mt-3 text-[var(--color-brand-slate)]">نفس السيروم الأصلي — وباقات توفر على الروتين</p>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[var(--color-brand-primary)]/15 via-transparent to-[var(--color-brand-accent)]/20 blur-2xl" aria-hidden />
              <div className="relative aspect-square overflow-hidden rounded-3xl border-2 border-white shadow-[0_24px_64px_-16px_rgba(15,28,46,0.25)] ring-1 ring-[var(--color-brand-border)]">
                <Image
                  src={HOME_IMAGES.productSpotlight}
                  alt="قوام سيروم SKINKSA"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-[var(--color-brand-border)] bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <h3 className="text-xl font-black leading-snug text-[var(--color-brand-ink)]">{STATIC_PRODUCT.title_ar}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-brand-slate)]">{STATIC_PRODUCT.description_ar}</p>
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
