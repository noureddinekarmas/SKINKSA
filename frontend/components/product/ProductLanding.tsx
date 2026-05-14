"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import ProductGallery from "@/components/product/ProductGallery";
import { CheckoutFormFlow } from "@/components/checkout/CheckoutFormFlow";
import { faqItems } from "@/lib/content/faq";
import type { ProductLandingData } from "@/lib/content/product-landing-data";
import { AUTHENTICITY_TO_PAIN_PRODUCT_IMAGES } from "@/lib/content/product-page";
import type { GalleryImage } from "@/lib/content/product-page";
import { formatMoney } from "@/lib/currency";
import { useCartStore } from "@/lib/cart/store";
import { trackCommerceEvent, generateEventId } from "@/lib/tracking";

function galleryKey(img: GalleryImage): string {
  const s = img.src;
  return typeof s === "string" ? s : s.src;
}

function savingsPercent(price: number, compare: number | null): number | null {
  if (compare == null || compare <= price) return null;
  return Math.round(((compare - price) / compare) * 100);
}

function offerCtaLine(pieces: number): string {
  if (pieces === 1) return "اطلبي عبوة واحدة";
  if (pieces === 2) return "اطلبي عبوتين";
  return "اطلبي ثلاث عبوات";
}

export default function ProductLanding({ data }: { data: ProductLandingData }) {
  const d = data;
  const offers = d.product.offers.map((o) => ({
    code: o.code,
    pieces: o.quantity,
    price: Number(o.price_sar),
    compare: o.compare_at_sar != null ? Number(o.compare_at_sar) : null,
    label: o.label_ar,
    badge: o.badge_ar,
  }));

  const resolveDefaultOfferIndex = () => {
    const i = d.product.offers.findIndex((o) => o.is_default);
    if (i >= 0) return i;
    const j = d.product.offers.findIndex((o) => o.code === "OFFER_3");
    return j >= 0 ? j : 0;
  };

  const [selectedIdx, setSelectedIdx] = useState(resolveDefaultOfferIndex);
  const replaceCartWithOffer = useCartStore((s) => s.replaceCartWithOffer);
  const selected = offers[selectedIdx] ?? offers[0];

  const heroKeys = useMemo(() => new Set(d.productHeroGallery.map(galleryKey)), [d.productHeroGallery]);

  const extraDescriptionGallery = useMemo(
    () => d.productDescriptionGallery.filter((g) => !heroKeys.has(galleryKey(g))),
    [d.productDescriptionGallery, heroKeys]
  );

  const authenticityExtras = useMemo(
    () => AUTHENTICITY_TO_PAIN_PRODUCT_IMAGES.filter((row) => !heroKeys.has(row.imageSrc)),
    [heroKeys]
  );

  const faqList = d.faq.length > 0 ? d.faq : faqItems;

  useEffect(() => {
    const i = d.product.offers.findIndex((o) => o.is_default);
    const j = d.product.offers.findIndex((o) => o.code === "OFFER_3");
    setSelectedIdx(i >= 0 ? i : j >= 0 ? j : 0);
  }, [d.product.slug, d.product.offers]);

  const defaultIdx = resolveDefaultOfferIndex();
  const defaultOffer = offers[defaultIdx] ?? offers[0];

  useEffect(() => {
    const eventId = generateEventId("vc");
    trackCommerceEvent({
      eventName: "ViewContent",
      eventId,
      value: defaultOffer.price,
      currency: d.currency,
      contents: [
        {
          id: d.product.slug,
          quantity: defaultOffer.pieces,
          item_price: defaultOffer.price,
        },
      ],
      contentName: d.product.title_ar,
    });
  }, [defaultOffer.pieces, defaultOffer.price, d.currency, d.product.slug, d.product.title_ar]);

  useEffect(() => {
    replaceCartWithOffer(
      {
        code: selected.code,
        quantity: selected.pieces,
        price_sar: selected.price,
        label_ar: selected.label,
        currency: d.currency,
      },
      {
        id: d.product.id,
        slug: d.product.slug,
        titleAr: d.product.title_ar,
      }
    );
  }, [
    d.currency,
    d.product.id,
    d.product.slug,
    d.product.title_ar,
    replaceCartWithOffer,
    selected.code,
    selected.label,
    selected.pieces,
    selected.price,
  ]);

  function scrollToCheckoutAndTrack() {
    const eventId = generateEventId("atc");
    trackCommerceEvent({
      eventName: "AddToCart",
      eventId,
      value: selected.price,
      currency: d.currency,
      contents: [
        {
          id: d.product.slug,
          quantity: selected.pieces,
          item_price: selected.price,
        },
      ],
      contentName: d.product.title_ar,
    });
    document.getElementById("product-checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const productDesc = d.product.description_ar?.trim() ?? "";

  return (
    <>
      <article className="bg-white pb-28 md:pb-12">
        {d.pdpUrgencyLine.trim() ? (
          <div className="border-b border-amber-100 bg-amber-50/80">
            <p className="mx-auto max-w-3xl px-4 py-2.5 text-center text-xs font-medium text-amber-950 sm:text-sm">
              {d.pdpUrgencyLine}
            </p>
          </div>
        ) : null}

        <p className="border-b border-neutral-100 bg-neutral-50/60 px-4 py-2 text-center text-[11px] text-neutral-600 sm:text-xs">
          {d.productHeadline}
        </p>

        <nav className="border-b border-neutral-100 text-sm text-neutral-500" aria-label="مسار التنقل">
          <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="hover:text-neutral-900">
                  الرئيسية
                </Link>
              </li>
              <li aria-hidden className="text-neutral-300">
                /
              </li>
              <li>
                <Link href="/collections" className="hover:text-neutral-900">
                  المجموعة
                </Link>
              </li>
              <li aria-hidden className="text-neutral-300">
                /
              </li>
              <li className="font-medium text-neutral-900">{d.pdpBreadcrumbCurrent}</li>
            </ol>
          </div>
        </nav>

        {/* Hero + buy box — Darina-style density */}
        <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
            <div className="md:sticky md:top-24 md:self-start">
              <ProductGallery images={d.productHeroGallery} variant="storefront" />
            </div>

            <div className="flex flex-col gap-5">
              <header className="space-y-2 border-b border-neutral-100 pb-5">
                <h1 className="text-2xl font-bold leading-snug text-neutral-900 sm:text-3xl">{d.pdpShortTitle}</h1>
                <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">{d.pdpSubtitle}</p>
                <p className="text-sm text-neutral-500">
                  <span className="font-semibold text-neutral-800" dir="ltr">
                    {d.heroRatingScore}
                  </span>
                  <span className="mx-1.5 text-neutral-300">·</span>
                  {d.heroRatingCaption}
                </p>
              </header>

              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-neutral-100 pb-4 text-sm">
                <span className="text-neutral-500">ثقة بالشراء</span>
                <span className="text-end">
                  <span className="font-bold tabular-nums text-neutral-900" dir="ltr">
                    {d.socialStrip.stat}+
                  </span>
                  <span className="mx-1 text-neutral-400">·</span>
                  <span className="text-neutral-600">{d.socialStrip.statLabel}</span>
                </span>
              </div>

              <ul className="space-y-2 text-sm leading-snug text-neutral-800">
                {d.pdpBullets.slice(0, 4).map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-neutral-300" aria-hidden>
                      —
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div>
                <h2 className="mb-3 text-sm font-semibold text-neutral-900">اختيار الباقة</h2>
                <div className="flex flex-col gap-3">
                  {offers.map((offer, idx) => {
                    const pct = savingsPercent(offer.price, offer.compare);
                    const isOn = idx === selectedIdx;
                    const thumb =
                      offer.code === "OFFER_1" || offer.code === "OFFER_2" || offer.code === "OFFER_3"
                        ? d.offerBundleImages[offer.code]
                        : undefined;
                    return (
                      <button
                        key={offer.code}
                        type="button"
                        onClick={() => setSelectedIdx(idx)}
                        className={`flex w-full flex-row-reverse items-center gap-3 rounded-xl border bg-white px-3 py-3 text-right transition sm:px-4 sm:py-3.5 ${
                          isOn
                            ? "border-neutral-900 shadow-sm ring-1 ring-neutral-900"
                            : "border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        {thumb ? (
                          <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white sm:h-20 sm:w-20">
                            <Image
                              src={thumb.src}
                              alt={thumb.alt}
                              fill
                              className="object-contain p-1.5"
                              sizes="80px"
                            />
                          </div>
                        ) : null}
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center justify-end gap-2">
                            {pct != null && pct > 0 && (
                              <span className="rounded bg-neutral-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                                ٪{pct} توفير
                              </span>
                            )}
                            {offer.badge && (
                              <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-800">
                                {offer.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                            <div className="space-y-1">
                              <p className="text-[13px] font-semibold text-neutral-500">{offerCtaLine(offer.pieces)}</p>
                              <p className="text-sm font-medium text-neutral-900">{offer.label}</p>
                            </div>
                            <div className="flex flex-col items-end gap-0.5 sm:text-end" dir="ltr">
                              <span className="text-lg font-bold tabular-nums text-neutral-900 sm:text-xl">
                                {formatMoney(offer.price, d.currency, d.numberLocale)} {d.currencyLabelAr}
                              </span>
                              {offer.compare != null && (
                                <span className="text-xs tabular-nums text-neutral-400 line-through">
                                  {formatMoney(offer.compare, d.currency, d.numberLocale)} {d.currencyLabelAr}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={scrollToCheckoutAndTrack}
                className="w-full rounded-xl bg-neutral-900 py-3.5 text-center text-sm font-bold text-white transition hover:bg-neutral-800"
              >
                {d.pdpPrimaryCta}
              </button>

              <div className="scroll-mt-28">
                <CheckoutFormFlow mode="inline" compact />
              </div>

              <div className="space-y-0 divide-y divide-neutral-100 border-t border-neutral-100 pt-1">
                {productDesc ? (
                  <details className="group py-3">
                    <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900">وصف المنتج</summary>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{productDesc}</p>
                  </details>
                ) : null}
                <details className="group py-3">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900">
                    الشحن والتوصيل
                  </summary>
                  <p className="mt-2 text-sm text-neutral-600">{d.valueStripDelivery}</p>
                </details>
                <details className="group py-3">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900">الضمان</summary>
                  <p className="mt-2 text-sm text-neutral-600">
                    {d.authenticity.guarantee.title}. {d.valueStripRegulatory}
                  </p>
                </details>
                <details className="group py-3">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900">الاسترجاع</summary>
                  <p className="mt-2 text-sm text-neutral-600">
                    التفاصيل في{" "}
                    <Link href="/returns-policy" className="font-medium text-neutral-900 underline underline-offset-2">
                      سياسة الإرجاع
                    </Link>
                    .
                  </p>
                </details>
                <details className="group py-3">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900">
                    طريقة الاستخدام
                  </summary>
                  <ul className="mt-2 space-y-2 text-sm text-neutral-600">
                    {d.productHowTo.map((step) => (
                      <li key={step.step}>
                        <span className="font-semibold text-neutral-800">{step.title}</span>
                        <span className="text-neutral-400"> — </span>
                        {step.desc}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              <p className="text-xs text-neutral-500">
                {d.topPromoStrip} · {d.cartTrustLine}
              </p>
            </div>
          </div>
        </section>

        {/* Short proof row — Darina-style icon strip, text-only here */}
        <section className="border-t border-neutral-100 bg-neutral-50/40 py-6">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from(d.scienceProofList)
                .slice(0, 6)
                .map((line) => (
                  <li
                    key={line}
                    className="rounded-lg border border-neutral-100 bg-white px-3 py-2 text-xs leading-snug text-neutral-700 sm:text-sm"
                  >
                    {line}
                  </li>
                ))}
            </ul>
          </div>
        </section>

        {/* Stats band */}
        <section className="border-y border-neutral-100 py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-center text-lg font-bold text-neutral-900">أرقام تثق بها</h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-neutral-500">{d.pdpBoldStatsNote}</p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {d.heroStats.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <p className="text-lg font-bold text-neutral-900 sm:text-xl">{s.value}</p>
                  <p className="mt-1 text-xs text-neutral-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Full-width result image */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <p className="text-xs font-semibold text-neutral-500">{d.productResultVisual.eyebrow}</p>
          <h2 className="mt-1 text-lg font-bold text-neutral-900 sm:text-xl">{d.productResultVisual.title}</h2>
          <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-100 sm:aspect-[16/10]">
            <Image
              src={d.productResultVisual.imageSrc}
              alt={d.productResultVisual.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </section>

        {/* Lifestyle image */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <p className="text-xs font-semibold text-neutral-500">{d.productLifestyleVisual.eyebrow}</p>
          <h2 className="mt-1 text-lg font-bold text-neutral-900 sm:text-xl">{d.productLifestyleVisual.title}</h2>
          <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-100 sm:aspect-[16/10]">
            <Image
              src={d.productLifestyleVisual.imageSrc}
              alt={d.productLifestyleVisual.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </section>

        {/* Story cards — image + short headline only */}
        <section className="border-t border-neutral-100 bg-neutral-50/30 py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="mb-6 text-lg font-bold text-neutral-900">لمحة من القصة</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {d.storyFrames.map((sf) => (
                <div
                  key={sf.headline}
                  className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3]">
                    <Image src={sf.src} alt={sf.alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="text-[11px] font-semibold text-neutral-500">{sf.badge}</p>
                    <p className="text-sm font-bold leading-snug text-neutral-900">{sf.headline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ingredient chips — names only */}
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2">
            {d.productIngredients.map((ing) => (
              <span
                key={ing.name}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-800"
              >
                {ing.name}
              </span>
            ))}
          </div>
        </section>

        {/* Extra gallery tiles not duplicated in hero */}
        {extraDescriptionGallery.length > 0 ? (
          <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {extraDescriptionGallery.map((img) => (
                <div key={galleryKey(img)} className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-100">
                  <Image src={img.src} alt={img.alt} fill className="object-contain p-4" sizes="(max-width:768px) 100vw, 280px" />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {authenticityExtras.length > 0 ? (
          <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {authenticityExtras.map((row) => (
                <div key={row.imageSrc} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-100">
                  <Image src={row.imageSrc} alt={row.imageAlt} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Guarantee CTA strip */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-6 text-center sm:px-8">
            <p className="text-xs font-semibold text-neutral-500">{d.authenticity.guarantee.kicker}</p>
            <h2 className="mt-1 text-lg font-bold text-neutral-900">{d.authenticity.guarantee.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 line-clamp-3">{d.authenticity.guarantee.body}</p>
            <Link
              href={d.authenticity.guarantee.returnsLink.href}
              className="mt-3 inline-block text-sm font-semibold text-neutral-900 underline underline-offset-4"
            >
              {d.authenticity.guarantee.returnsLink.label}
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
          <h2 className="mb-4 text-lg font-bold text-neutral-900">الأسئلة الشائعة</h2>
          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {faqList.map((item) => (
              <details key={item.question} className="group py-3">
                <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900">{item.question}</summary>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 line-clamp-5">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">التقييمات</h2>
              <p className="mt-1 text-sm text-neutral-500">{d.reviewsEyebrow}</p>
            </div>
            <p className="text-sm text-neutral-600">
              <span className="font-bold tabular-nums text-neutral-900" dir="ltr">
                {d.heroRatingScore}
              </span>
              <span className="mx-1">·</span>
              {d.heroRatingCaption}
            </p>
          </div>
          <div className="space-y-3">
            {d.productReviews.map((r) => (
              <article key={`${r.name}-${r.text.slice(0, 24)}`} className="rounded-xl border border-neutral-100 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-neutral-900">{r.name}</span>
                  <span className="text-xs text-neutral-500">{r.city}</span>
                </div>
                {r.tag ? <p className="mt-1 text-[11px] text-neutral-500">{r.tag}</p> : null}
                <p className="mt-2 text-sm leading-relaxed text-neutral-700 line-clamp-4">{r.text}</p>
              </article>
            ))}
          </div>
        </section>
      </article>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-3 py-2.5 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-neutral-500">المجموع</p>
            <p className="truncate text-base font-bold text-neutral-900 tabular-nums" dir="ltr">
              {formatMoney(selected.price, d.currency, d.numberLocale)} {d.currencyLabelAr}
            </p>
          </div>
          <button
            type="button"
            onClick={scrollToCheckoutAndTrack}
            className="shrink-0 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            {d.pdpPrimaryCta}
          </button>
        </div>
      </div>
    </>
  );
}
