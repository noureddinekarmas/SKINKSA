"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, ShieldCheck, Star, Timer } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import ProductGallery from "@/components/product/ProductGallery";
import { CheckoutFormFlow } from "@/components/checkout/CheckoutFormFlow";
import { faqItems } from "@/lib/content/faq";
import type { ProductLandingData } from "@/lib/content/product-landing-data";
import { AUTHENTICITY_TO_PAIN_PRODUCT_IMAGES } from "@/lib/content/product-page";
import type { GalleryImage } from "@/lib/content/product-page";
import { formatMoney } from "@/lib/currency";
import { useCartStore } from "@/lib/cart/store";
import { trackCommerceEvent, generateEventId } from "@/lib/tracking";
import { cn } from "@/lib/utils";

function galleryKey(img: GalleryImage): string {
  const s = img.src;
  return typeof s === "string" ? s : s.src;
}

function savingsPercent(price: number, compare: number | null): number | null {
  if (compare == null || compare <= price) return null;
  return Math.round(((compare - price) / compare) * 100);
}

function savingsAbsolute(price: number, compare: number | null): number | null {
  if (compare == null || compare <= price) return null;
  return compare - price;
}

function offerCtaLine(pieces: number): string {
  if (pieces === 1) return "اطلبي عبوة واحدة";
  if (pieces === 2) return "اطلبي عبوتين";
  return "اطلبي ثلاث عبوات";
}

/** Distinct bundle tiers — still within SKINKSA blues + gold accent for top tier. */
function getOfferVisual(code: string): {
  selectedCard: string;
  idleCard: string;
  priceClass: string;
  ctaGradient: string;
  mobileCtaGradient: string;
  thumbSelected: string;
} {
  switch (code) {
    case "OFFER_1":
      return {
        selectedCard:
          "border-slate-500/55 bg-gradient-to-bl from-slate-50 via-white to-[var(--color-brand-light)]/30 shadow-[0_22px_56px_-20px_rgba(51,65,85,0.35)] ring-2 ring-slate-400/20",
        idleCard: "hover:border-slate-300/90 hover:bg-slate-50/40",
        priceClass: "text-slate-800",
        ctaGradient: "bg-gradient-to-l from-slate-700 via-[var(--color-brand-primary)] to-[var(--color-brand-blue)]",
        mobileCtaGradient: "from-slate-700 via-[var(--color-brand-primary)] to-[var(--color-brand-blue)]",
        thumbSelected: "ring-2 ring-slate-400/50 border-slate-300",
      };
    case "OFFER_2":
      return {
        selectedCard:
          "border-indigo-500/55 bg-gradient-to-bl from-indigo-50/95 via-white to-[var(--color-brand-light)]/25 shadow-[0_22px_56px_-20px_rgba(79,70,229,0.32)] ring-2 ring-indigo-400/25",
        idleCard: "hover:border-indigo-200 hover:bg-indigo-50/30",
        priceClass: "text-indigo-950",
        ctaGradient: "bg-gradient-to-l from-indigo-700 via-[var(--color-brand-primary)] to-[var(--color-brand-blue)]",
        mobileCtaGradient: "from-indigo-700 via-[var(--color-brand-primary)] to-[var(--color-brand-blue)]",
        thumbSelected: "ring-2 ring-indigo-400/45 border-indigo-200",
      };
    case "OFFER_3":
      return {
        selectedCard:
          "border-[var(--color-brand-accent)]/65 bg-gradient-to-bl from-amber-50/90 via-white to-[var(--color-brand-light)]/40 shadow-[0_26px_60px_-18px_rgba(201,164,74,0.38)] ring-2 ring-[var(--color-brand-accent)]/30",
        idleCard: "hover:border-[var(--color-brand-accent)]/45 hover:bg-amber-50/25",
        priceClass: "text-[var(--color-brand-deep)]",
        ctaGradient: "bg-gradient-to-l from-[var(--color-brand-accent)] via-amber-600 to-[var(--color-brand-primary)]",
        mobileCtaGradient: "from-[var(--color-brand-accent)] via-amber-600 to-[var(--color-brand-primary)]",
        thumbSelected: "ring-2 ring-[var(--color-brand-accent)]/55 border-[var(--color-brand-accent)]/40",
      };
    default:
      return {
        selectedCard:
          "border-[var(--color-brand-primary)]/70 bg-[var(--color-brand-light)]/35 shadow-[0_20px_50px_-18px_rgba(26,86,219,0.35)] ring-2 ring-[var(--color-brand-primary)]/20",
        idleCard: "hover:border-[var(--color-brand-primary)]/40",
        priceClass: "text-[var(--color-brand-primary)]",
        ctaGradient: "bg-gradient-to-l from-[var(--color-brand-deep)] via-[var(--color-brand-primary)] to-[var(--color-brand-blue)]",
        mobileCtaGradient: "from-[var(--color-brand-deep)] via-[var(--color-brand-primary)] to-[var(--color-brand-blue)]",
        thumbSelected: "ring-2 ring-[var(--color-brand-primary)]/35",
      };
  }
}

function ReviewAvatar({ name }: { name: string }) {
  const ch = name.trim().charAt(0) || "?";
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-brand-primary)] via-[var(--color-brand-blue)] to-[var(--color-brand-deep)] text-lg font-black text-white shadow-md ring-2 ring-white"
      aria-hidden
    >
      {ch}
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" dir="ltr" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", i < rating ? "fill-amber-400 text-amber-400" : "fill-[var(--color-brand-border)]/50 text-[var(--color-brand-border)]")}
        />
      ))}
    </div>
  );
}

function BetweenFormFigure({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="my-5 overflow-hidden rounded-2xl border border-[var(--color-brand-border)] bg-white shadow-[0_16px_40px_-24px_rgba(26,86,219,0.18)]">
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 448px"
        />
      </div>
    </figure>
  );
}

const pillarIcons = [ShieldCheck, BadgeCheck, CheckCircle2] as const;

function SectionTitle({ children, eyebrow }: { children: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-3 sm:mb-4">
      {eyebrow ? (
        <p className="mb-1 text-xs font-bold tracking-wide text-[var(--color-brand-primary)]">{eyebrow}</p>
      ) : null}
      <h2 className="text-lg font-black leading-snug text-[var(--color-brand-ink)] sm:text-xl">{children}</h2>
    </div>
  );
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

  const trustStoryImage = useMemo(() => {
    const img = d.productDescriptionGallery[0] ?? d.productHeroGallery[1];
    if (!img) return null;
    return { src: img.src, alt: img.alt };
  }, [d.productDescriptionGallery, d.productHeroGallery]);

  const compareCenterImage = useMemo(() => {
    const row = authenticityExtras[0];
    if (row) return { src: row.imageSrc, alt: row.imageAlt };
    return { src: d.productLifestyleVisual.imageSrc, alt: d.productLifestyleVisual.imageAlt };
  }, [authenticityExtras, d.productLifestyleVisual]);

  const scienceSideImage = useMemo(() => {
    const img = d.productDescriptionGallery[2] ?? d.productDescriptionGallery[1];
    if (!img) return null;
    return { src: img.src, alt: img.alt };
  }, [d.productDescriptionGallery]);

  const selectedVisual = useMemo(() => getOfferVisual(selected.code), [selected.code]);

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
      <article className="bg-[var(--color-brand-mist)]/35 pb-28 md:pb-14">
        {d.pdpUrgencyLine.trim() ? (
          <div className="border-b border-[var(--color-brand-deep)]/10 bg-[var(--color-brand-primary)] text-white">
            <p className="mx-auto max-w-3xl px-4 py-2.5 text-center text-[11px] font-bold leading-snug sm:text-sm">
              {d.pdpUrgencyLine}
            </p>
          </div>
        ) : null}

        {/* NamBeauty-style storefront: معرض نظيف | شرائح ثقة → عنوان قوي → عروض بطاقات → CTA → شبكة ثقة → نموذج */}
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-14 md:items-start">
            <div className="flex flex-col md:sticky md:top-24 md:self-start">
              <div className="rounded-[1.75rem] border border-[var(--color-brand-border)] bg-white p-3 shadow-[0_28px_64px_-28px_rgba(26,86,219,0.35)]">
                <ProductGallery images={d.productHeroGallery} variant="storefront" />
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:gap-7">
              <div className="flex flex-wrap justify-end gap-2">
                {d.heroStats.map((s) => (
                  <span
                    key={`${s.value}-${s.label}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-brand-border)] bg-white px-3 py-1.5 text-[11px] font-bold text-[var(--color-brand-ink)] shadow-sm sm:text-xs"
                  >
                    <span className="tabular-nums" dir="ltr">
                      {s.value}
                    </span>
                    <span className="font-semibold text-[var(--color-brand-slate)]">{s.label}</span>
                  </span>
                ))}
              </div>

              <header className="space-y-3 sm:space-y-4">
                <p className="text-xs font-bold text-[var(--color-brand-primary)] sm:text-sm">SKINKSA الرسمي</p>
                <h1 className="text-balance text-3xl font-black leading-[1.15] tracking-tight text-[var(--color-brand-ink)] sm:text-4xl">
                  {d.pdpShortTitle}
                </h1>
                <p className="text-pretty text-base leading-relaxed text-[var(--color-brand-slate)] sm:text-lg">{d.pdpSubtitle}</p>
                {d.productHeroQuote ? (
                  <blockquote className="mt-4 rounded-2xl border border-[var(--color-brand-primary)]/22 bg-gradient-to-br from-[var(--color-brand-light)]/5 via-white to-[var(--color-brand-mist)]/25 px-4 py-3.5 text-sm font-semibold leading-relaxed text-[var(--color-brand-ink)] shadow-sm sm:px-5 sm:text-base">
                    {d.productHeroQuote}
                  </blockquote>
                ) : null}
                <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-[var(--color-brand-slate)] sm:text-base">
                  <span className="font-black tabular-nums text-[var(--color-brand-ink)]" dir="ltr">
                    {d.heroRatingScore}
                  </span>
                  <span>
                    ({d.heroRatingCaption})<span className="mx-1.5 text-[var(--color-brand-border)]">·</span>
                  </span>
                  <span className="font-semibold text-[var(--color-brand-ink)]">
                    من {formatMoney(selected.price, d.currency, d.numberLocale)} {d.currencyLabelAr}
                  </span>
                  <span className="text-[var(--color-brand-slate)]">
                    /{" "}
                    {selected.pieces === 1 ? "عبوة" : selected.pieces === 2 ? "عبوتان" : `${selected.pieces} عبوات`}{" "}
                    مختارة
                  </span>
                </p>
                {d.topPromoStrip ? (
                  <p className="rounded-xl border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-light)]/60 px-3 py-2.5 text-center text-xs font-bold text-[var(--color-brand-deep)] sm:text-sm">
                    {d.topPromoStrip}
                  </p>
                ) : null}
              </header>

              <div
                id="product-checkout"
                className="scroll-mt-28 overflow-hidden rounded-[1.75rem] border-2 border-[var(--color-brand-border)] bg-white shadow-[0_32px_88px_-36px_rgba(26,86,219,0.35)] ring-1 ring-[var(--color-brand-primary)]/10"
              >
                <div
                  className="h-1.5 bg-gradient-to-l from-[var(--color-brand-primary)] via-[var(--color-brand-blue)] to-[var(--color-brand-accent)]"
                  aria-hidden
                />

                <div className="border-b border-[var(--color-brand-border)]/80 bg-gradient-to-b from-[var(--color-brand-mist)]/5 to-white px-4 py-4 sm:px-5 sm:py-5">
                  <p className="mb-1 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
                    SKINKSA · طلب مباشر
                  </p>
                  <p className="mb-3 text-sm font-black text-[var(--color-brand-ink)] sm:text-base">اختاري العرض ثم أكملي بياناتك:</p>
                  <div className="flex flex-col gap-3">
                    {offers.map((offer, idx) => {
                      const pct = savingsPercent(offer.price, offer.compare);
                      const saveAmt = savingsAbsolute(offer.price, offer.compare);
                      const isOn = idx === selectedIdx;
                      const ov = getOfferVisual(offer.code);
                      const thumb =
                        offer.code === "OFFER_1" || offer.code === "OFFER_2" || offer.code === "OFFER_3"
                          ? d.offerBundleImages[offer.code]
                          : undefined;
                      return (
                        <button
                          key={offer.code}
                          type="button"
                          onClick={() => setSelectedIdx(idx)}
                          className={cn(
                            "w-full rounded-2xl border-2 p-4 text-right transition duration-300 sm:p-5",
                            isOn
                              ? ov.selectedCard
                              : cn("border-[var(--color-brand-border)] bg-white shadow-sm", ov.idleCard)
                          )}
                        >
                          <div className="flex flex-row-reverse items-start gap-4">
                            {thumb ? (
                              <div
                                className={cn(
                                  "relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border bg-white sm:h-24 sm:w-24",
                                  isOn ? ov.thumbSelected : "border-[var(--color-brand-border)]"
                                )}
                              >
                                <Image src={thumb.src} alt={thumb.alt} fill className="object-contain p-2" sizes="96px" />
                              </div>
                            ) : null}
                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="flex flex-wrap items-center justify-end gap-2">
                                {saveAmt != null && saveAmt > 0 ? (
                                  <span className="rounded-full bg-[var(--color-brand-success)]/12 px-2.5 py-1 text-[11px] font-black text-[var(--color-brand-success)] sm:text-xs">
                                    وفّري {formatMoney(saveAmt, d.currency, d.numberLocale)} {d.currencyLabelAr}
                                  </span>
                                ) : pct != null && pct > 0 ? (
                                  <span className="rounded-full bg-[var(--color-brand-primary)] px-2.5 py-1 text-[11px] font-bold text-white">
                                    ٪{pct} توفير
                                  </span>
                                ) : null}
                                {offer.badge ? (
                                  <span className="rounded-full border border-[var(--color-brand-border)] bg-white px-2.5 py-1 text-[11px] font-bold text-[var(--color-brand-ink)]">
                                    {offer.badge}
                                  </span>
                                ) : null}
                              </div>
                              <p className="text-sm font-black text-[var(--color-brand-ink)] sm:text-base">
                                {offerCtaLine(offer.pieces)}
                              </p>
                              <p className="text-sm leading-snug text-[var(--color-brand-slate)]">{offer.label}</p>
                              <div className="flex flex-wrap items-baseline justify-end gap-2 pt-1" dir="ltr">
                                <span
                                  className={cn(
                                    "text-2xl font-black tabular-nums sm:text-3xl",
                                    isOn ? ov.priceClass : "text-[var(--color-brand-primary)]"
                                  )}
                                >
                                  {formatMoney(offer.price, d.currency, d.numberLocale)} {d.currencyLabelAr}
                                </span>
                                {offer.compare != null && (
                                  <span className="text-sm tabular-nums text-[var(--color-brand-slate)]/55 line-through">
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

                <div className="border-t border-[var(--color-brand-border)]/80 bg-[var(--color-brand-mist)]/20 px-4 py-5 sm:px-6 sm:py-6">
                  <h2 className="text-balance text-center text-lg font-black leading-snug text-[var(--color-brand-ink)] sm:text-xl">
                    أكملي بياناتك — جاهزة للشحن
                  </h2>
                </div>

                <CheckoutFormFlow mode="inline" compact={false} embedded embeddedShowHeader={false} assignCheckoutId={false} />
              </div>

              <ul className="space-y-2.5 text-sm leading-snug text-[var(--color-brand-ink)]">
                {d.pdpBullets.slice(0, 4).map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-[var(--color-brand-primary)]" aria-hidden>
                      —
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              {d.pdpBetweenFormImages[0] ? (
                <BetweenFormFigure src={d.pdpBetweenFormImages[0].src} alt={d.pdpBetweenFormImages[0].alt} />
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--color-brand-primary)]/25 bg-gradient-to-br from-[var(--color-brand-light)]/60 to-white px-4 py-4 shadow-sm">
                  <p className="text-[11px] font-semibold text-[var(--color-brand-primary)]">عدد الطلبات اليومية</p>
                  <p className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-3xl font-black tabular-nums text-[var(--color-brand-ink)]" dir="ltr">
                      {d.pdpDailyOrdersFigure}
                    </span>
                  </p>
                  <p className="mt-1 text-xs font-medium text-[var(--color-brand-slate)]">{d.pdpDailyOrdersCaption}</p>
                  <p className="mt-2 border-t border-[var(--color-brand-border)] pt-2 text-[10px] leading-relaxed text-[var(--color-brand-slate)]/90">
                    {d.pdpDailyOrdersNote}
                  </p>
                </div>
                <div className="flex flex-col justify-center rounded-2xl border border-[var(--color-brand-border)] bg-white/90 px-4 py-4 shadow-sm">
                  <p className="text-[11px] font-semibold text-[var(--color-brand-slate)]">عدد مرات الشراء</p>
                  <p className="mt-2 text-sm">
                    <span className="text-2xl font-black tabular-nums text-[var(--color-brand-ink)]" dir="ltr">
                      {d.socialStrip.stat}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-brand-slate)]">{d.socialStrip.statLabel}</p>
                </div>
              </div>

              {d.pdpBetweenFormImages[1] ? (
                <BetweenFormFigure src={d.pdpBetweenFormImages[1].src} alt={d.pdpBetweenFormImages[1].alt} />
              ) : null}

              {(d.pdpScarcityHeadline || d.pdpScarcityBody) && (
                <div className="rounded-2xl border border-[var(--color-brand-accent)]/35 bg-gradient-to-br from-[var(--color-brand-accent)]/[0.07] via-white to-[var(--color-brand-light)]/35 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Timer className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brand-accent)]" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-snug text-[var(--color-brand-ink)]">{d.pdpScarcityHeadline}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)]">{d.pdpScarcityBody}</p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-[var(--color-brand-border)]/70 pt-4">
                    <p className="mb-3 text-center text-[10px] font-semibold text-[var(--color-brand-slate)] sm:text-[11px]">
                      لمحة سريعة على الباقات — أصلي SKINKSA
                    </p>
                    <div className="flex justify-center gap-2 sm:gap-4">
                      {(["OFFER_1", "OFFER_2", "OFFER_3"] as const).map((code) => {
                        const img = d.offerBundleImages[code];
                        const quickLabels: Record<typeof code, string> = {
                          OFFER_1: "عبوة",
                          OFFER_2: "عبوتان",
                          OFFER_3: "٣ عبوات",
                        };
                        return (
                          <div key={code} className="w-[4.25rem] shrink-0 text-center sm:w-24">
                            <div className="relative mx-auto aspect-square overflow-hidden rounded-xl border border-[var(--color-brand-border)] bg-white shadow-sm">
                              <Image src={img.src} alt={img.alt} fill className="object-contain p-1" sizes="72px" />
                            </div>
                            <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-brand-ink)]">{quickLabels[code]}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {d.pdpBetweenFormImages[2] ? (
                <BetweenFormFigure src={d.pdpBetweenFormImages[2].src} alt={d.pdpBetweenFormImages[2].alt} />
              ) : null}

              <div className="space-y-0 divide-y divide-[var(--color-brand-border)] border-t border-[var(--color-brand-border)] pt-1">
                {productDesc ? (
                  <details className="group py-3">
                    <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-brand-ink)]">
                      وصف المنتج
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)]">{productDesc}</p>
                  </details>
                ) : null}
                <details className="group py-3">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-brand-ink)]">
                    الشحن والتوصيل
                  </summary>
                  <p className="mt-2 text-sm text-[var(--color-brand-slate)]">{d.valueStripDelivery}</p>
                </details>
                <details className="group py-3">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-brand-ink)]">الضمان</summary>
                  <p className="mt-2 text-sm text-[var(--color-brand-slate)]">
                    {d.authenticity.guarantee.title}. {d.valueStripRegulatory}
                  </p>
                </details>
                <details className="group py-3">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-brand-ink)]">الاسترجاع</summary>
                  <p className="mt-2 text-sm text-[var(--color-brand-slate)]">
                    التفاصيل في{" "}
                    <Link
                      href="/returns-policy"
                      className="font-semibold text-[var(--color-brand-primary)] underline underline-offset-2"
                    >
                      سياسة الإرجاع
                    </Link>
                    .
                  </p>
                </details>
                <details className="group py-3">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-brand-ink)]">
                    طريقة الاستخدام
                  </summary>
                  <ul className="mt-2 space-y-2 text-sm text-[var(--color-brand-slate)]">
                    {d.productHowTo.map((step) => (
                      <li key={step.step}>
                        <span className="font-semibold text-[var(--color-brand-ink)]">{step.title}</span>
                        <span className="text-[var(--color-brand-border)]"> — </span>
                        {step.desc}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              {d.pdpBetweenFormImages[3] ? (
                <BetweenFormFigure src={d.pdpBetweenFormImages[3].src} alt={d.pdpBetweenFormImages[3].alt} />
              ) : null}

              <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--color-brand-border)] bg-gradient-to-b from-white via-white to-[var(--color-brand-mist)]/60 p-6 shadow-[0_28px_80px_-32px_rgba(26,86,219,0.18)] sm:p-8 md:p-10">
                <div
                  className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[var(--color-brand-primary)]/[0.07] blur-3xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-[var(--color-brand-accent)]/[0.09] blur-3xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-l from-transparent via-[var(--color-brand-primary)]/35 to-transparent"
                  aria-hidden
                />

                <div className="relative space-y-6">
                  <p className="text-pretty text-base font-medium leading-relaxed text-[var(--color-brand-ink)] sm:text-lg">
                    {d.pdpEmpathyLine}
                  </p>

                  <p className="text-pretty rounded-2xl border border-[var(--color-brand-primary)]/18 bg-[var(--color-brand-light)]/55 px-4 py-4 text-sm font-semibold leading-relaxed text-[var(--color-brand-deep)] sm:px-5 sm:text-base">
                    {d.pdpSolutionLine}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {d.pdpTrustPillars.map((p, i) => {
                      const Icon = pillarIcons[i] ?? ShieldCheck;
                      const idxLabel = ["٠١", "٠٢", "٠٣"][i] ?? String(i + 1);
                      return (
                        <div
                          key={p.title}
                          className="group relative overflow-hidden rounded-2xl border border-[var(--color-brand-border)]/90 bg-white/95 p-4 shadow-[0_14px_44px_-22px_rgba(26,86,219,0.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-20px_rgba(26,86,219,0.28)]"
                        >
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <span className="text-2xl font-black tabular-nums leading-none text-[var(--color-brand-primary)]/30 transition group-hover:text-[var(--color-brand-primary)]/50">
                              {idxLabel}
                            </span>
                            <Icon className="h-6 w-6 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
                          </div>
                          <p className="text-sm font-bold text-[var(--color-brand-ink)]">{p.title}</p>
                          <p className="mt-2 text-[11px] leading-relaxed text-[var(--color-brand-slate)] sm:text-xs">{p.body}</p>
                        </div>
                      );
                    })}
                  </div>

                  {trustStoryImage ? (
                    <div className="relative mt-2 overflow-hidden rounded-2xl border border-[var(--color-brand-border)] shadow-lg">
                      <div className="relative aspect-[2/1] sm:aspect-[21/8]">
                        <Image
                          src={trustStoryImage.src}
                          alt={trustStoryImage.alt}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 768px) 100vw, 896px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-deep)]/55 via-[var(--color-brand-deep)]/15 to-transparent" />
                        <p className="absolute bottom-3 end-4 max-w-sm text-end text-[10px] font-bold leading-snug text-white/95 drop-shadow-md sm:bottom-4 sm:text-xs">
                          SKINKSA — أصلي · واضح · بمسار يُتتبّع
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-6 pt-2">
                    <SectionTitle eyebrow="وضوح المصدر">الأصلي مقابل غير المؤكد</SectionTitle>

                    <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch">
                      <div className="flex flex-col rounded-2xl border-2 border-[var(--color-brand-success)]/45 bg-gradient-to-br from-[var(--color-brand-success)]/[0.09] to-white p-5 shadow-[0_16px_48px_-24px_rgba(13,148,100,0.25)] lg:col-span-5">
                        <p className="text-xs font-black tracking-wide text-[var(--color-brand-success)]">
                          {d.pdpAuthenticCompare.officialTitle}
                        </p>
                        <ul className="mt-4 flex flex-1 flex-col gap-3">
                          {d.pdpAuthenticCompare.officialBullets.map((line) => (
                            <li key={line} className="flex gap-3 text-sm leading-relaxed text-[var(--color-brand-ink)]">
                              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brand-success)]" aria-hidden />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="relative hidden flex-col items-center justify-center gap-4 lg:col-span-2 lg:flex">
                        <div
                          className="pointer-events-none absolute inset-y-10 start-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--color-brand-border)] to-transparent"
                          aria-hidden
                        />
                        {compareCenterImage ? (
                          <div className="relative z-[1] w-full max-w-[9.5rem] overflow-hidden rounded-2xl border-2 border-white shadow-2xl ring-4 ring-[var(--color-brand-mist)]">
                            <div className="relative aspect-[3/4] w-full">
                              <Image
                                src={compareCenterImage.src}
                                alt={compareCenterImage.alt}
                                fill
                                className="object-cover"
                                sizes="150px"
                              />
                            </div>
                          </div>
                        ) : null}
                        <span className="relative z-[1] rounded-full bg-[var(--color-brand-ink)] px-3 py-1.5 text-[10px] font-black tracking-wide text-white shadow-lg">
                          مقارنة
                        </span>
                      </div>

                      <div className="flex flex-col rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/55 p-5 shadow-inner lg:col-span-5">
                        <p className="text-xs font-black text-[var(--color-brand-slate)]">{d.pdpAuthenticCompare.otherTitle}</p>
                        <ul className="mt-4 flex flex-1 flex-col gap-3">
                          {d.pdpAuthenticCompare.otherBullets.map((line) => (
                            <li key={line} className="flex gap-3 text-sm leading-relaxed text-[var(--color-brand-slate)]">
                              <span
                                className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand-error)]/75"
                                aria-hidden
                              />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {compareCenterImage ? (
                      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-brand-border)] shadow-md lg:hidden">
                        <div className="relative aspect-[16/10] w-full">
                          <Image
                            src={compareCenterImage.src}
                            alt={compareCenterImage.alt}
                            fill
                            className="object-cover"
                            sizes="100vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-ink)]/45 to-transparent" />
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl bg-[var(--color-brand-deep)] px-4 py-4 text-center text-[11px] font-semibold leading-relaxed text-white/95 sm:text-xs">
                      <span>{d.topPromoStrip}</span>
                      <span className="hidden h-1 w-1 rounded-full bg-white/45 sm:inline" aria-hidden />
                      <span>{d.cartTrustLine}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--color-brand-border)] bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-5xl space-y-14 px-4 sm:space-y-16 sm:px-6">
            <div>
              <SectionTitle eyebrow="نقاط الألم">شفتي نفسج في هالنقاط؟</SectionTitle>
              <ul className="mt-6 space-y-4">
                {d.painChecklist.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/20 p-4 shadow-sm sm:p-5"
                  >
                    <p className="text-sm font-bold text-[var(--color-brand-ink)] sm:text-base">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)]">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-[var(--color-brand-primary)]/20 bg-gradient-to-b from-white via-[var(--color-brand-light)]/12 to-[var(--color-brand-mist)]/25 p-6 shadow-[0_24px_64px_-28px_rgba(26,86,219,0.22)] sm:p-8">
              <div
                className="pointer-events-none absolute -start-20 top-0 h-48 w-48 rounded-full bg-[var(--color-brand-primary)]/[0.06] blur-3xl"
                aria-hidden
              />
              <SectionTitle eyebrow={d.mechanismBlock.eyebrow}>{d.mechanismBlock.title}</SectionTitle>
              <div className="relative mt-4 space-y-4 text-sm leading-relaxed text-[var(--color-brand-slate)] sm:text-base">
                {d.mechanismBlock.paras.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
              <div className="relative mt-6 rounded-2xl border border-[var(--color-brand-accent)]/30 bg-white/90 px-4 py-4 shadow-inner sm:px-5 sm:py-5">
                <p className="text-sm font-bold text-[var(--color-brand-ink)]">{d.mechanismBlock.calloutTitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)]">{d.mechanismBlock.calloutBody}</p>
              </div>
            </div>

            <div>
              <SectionTitle eyebrow="الثقة والمصداقية">ليش يختارونا؟</SectionTitle>
              <h3 className="mt-2 text-balance text-lg font-black leading-snug text-[var(--color-brand-ink)] sm:text-xl">{d.authorityBand.title}</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {d.authorityBand.points.map((pt) => (
                  <div
                    key={pt.t}
                    className="rounded-2xl border border-[var(--color-brand-border)] bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <p className="text-sm font-black text-[var(--color-brand-primary)]">{pt.t}</p>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--color-brand-slate)] sm:text-sm">{pt.d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border-2 border-[var(--color-brand-accent)]/35 bg-gradient-to-br from-amber-50/30 via-white to-[var(--color-brand-light)]/20 p-6 sm:p-8">
              <h3 className="text-balance text-lg font-black leading-snug text-[var(--color-brand-ink)] sm:text-xl">{d.objectionBuster.title}</h3>
              <ul className="mt-5 space-y-4">
                {d.objectionBuster.lines.map((line, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-[var(--color-brand-slate)] sm:text-base">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brand-success)]" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionTitle eyebrow={d.vsComparison.eyebrow}>{d.vsComparison.title}</SectionTitle>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-brand-slate)]">{d.vsComparison.subtitle}</p>
              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {d.vsComparison.alternatives.map((alt) => (
                  <div
                    key={alt.name}
                    className="flex flex-col rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/35 p-5 shadow-sm"
                  >
                    <p className="text-sm font-black text-[var(--color-brand-ink)]">{alt.name}</p>
                    <p className="mt-1 text-xs font-semibold text-[var(--color-brand-slate)]">{alt.priceHint}</p>
                    <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                      {alt.cons.map((c) => (
                        <li key={c} className="flex gap-2 text-sm text-[var(--color-brand-slate)]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-error)]/80" aria-hidden />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="flex flex-col rounded-2xl border-2 border-[var(--color-brand-success)]/45 bg-gradient-to-br from-[var(--color-brand-success)]/[0.08] via-white to-white p-5 shadow-[0_20px_56px_-24px_rgba(13,148,100,0.28)]">
                  <p className="text-xs font-black uppercase tracking-wide text-[var(--color-brand-success)]">{d.vsComparison.ours.name}</p>
                  <p className="mt-1 text-xs font-semibold text-[var(--color-brand-slate)]">{d.vsComparison.ours.priceHint}</p>
                  <ul className="mt-4 flex flex-1 flex-col gap-3">
                    {d.vsComparison.ours.pros.map((pro) => (
                      <li key={pro} className="flex gap-3 text-sm leading-relaxed text-[var(--color-brand-ink)]">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brand-success)]" aria-hidden />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {d.productBenefits.length > 0 ? (
              <div>
                <SectionTitle eyebrow="باختصار">اللي تلمسينه يومياً</SectionTitle>
                <ul className="mt-4 space-y-3">
                  {d.productBenefits.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-[var(--color-brand-slate)]">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>

        {/* Science / proof — bento + hero visual */}
        <section className="border-t border-[var(--color-brand-border)] bg-gradient-to-b from-white to-[var(--color-brand-mist)]/35 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionTitle eyebrow="الأساس العلمي">لماذا تثقين بالتركيبة</SectionTitle>
            <div
              className={cn(
                "mt-8 grid gap-8 lg:items-start",
                scienceSideImage ? "lg:grid-cols-2 lg:gap-12" : ""
              )}
            >
              {scienceSideImage ? (
                <div className="relative order-2 overflow-hidden rounded-3xl border border-[var(--color-brand-border)] bg-white shadow-[0_28px_70px_-28px_rgba(26,86,219,0.22)] lg:order-1">
                  <div className="relative aspect-[4/5] w-full lg:sticky lg:top-28">
                    <Image
                      src={scienceSideImage.src}
                      alt={scienceSideImage.alt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 420px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-deep)]/30 to-transparent" />
                  </div>
                </div>
              ) : null}
              <ul className={cn("order-1 flex flex-col gap-3", scienceSideImage ? "lg:order-2" : "")}>
                {Array.from(d.scienceProofList)
                  .slice(0, 6)
                  .map((line, i) => (
                    <li
                      key={line}
                      className="flex gap-4 rounded-2xl border border-[var(--color-brand-border)] bg-white/95 p-4 shadow-sm transition hover:shadow-md sm:p-5"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-blue)] text-base font-black text-white shadow-inner sm:h-12 sm:w-12">
                        {i + 1}
                      </span>
                      <p className="min-w-0 flex-1 text-sm leading-relaxed text-[var(--color-brand-slate)] sm:text-base">{line}</p>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Stats band */}
        <section className="border-y border-[var(--color-brand-border)] bg-white py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-center text-xl font-black text-[var(--color-brand-ink)] sm:text-2xl">أرقام تثق بها</h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-[var(--color-brand-slate)]">{d.pdpBoldStatsNote}</p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {d.heroStats.slice(0, 3).map((s) => (
                <div key={s.label} className="rounded-xl border border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/30 py-4">
                  <p className="text-lg font-bold text-[var(--color-brand-primary)] sm:text-xl">{s.value}</p>
                  <p className="mt-1 text-xs text-[var(--color-brand-slate)]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Full-width result image */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <p className="text-xs font-semibold text-[var(--color-brand-primary)]">{d.productResultVisual.eyebrow}</p>
          <h2 className="mt-1 text-lg font-bold text-[var(--color-brand-ink)] sm:text-xl">{d.productResultVisual.title}</h2>
          <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--color-brand-border)] shadow-sm sm:aspect-[16/10]">
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
          <p className="text-xs font-semibold text-[var(--color-brand-primary)]">{d.productLifestyleVisual.eyebrow}</p>
          <h2 className="mt-1 text-lg font-bold text-[var(--color-brand-ink)] sm:text-xl">{d.productLifestyleVisual.title}</h2>
          <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--color-brand-border)] shadow-sm sm:aspect-[16/10]">
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
        <section className="border-t border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/25 py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionTitle>لمحة من القصة</SectionTitle>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {d.storyFrames.map((sf) => (
                <div
                  key={sf.headline}
                  className="overflow-hidden rounded-2xl border border-[var(--color-brand-border)] bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3]">
                    <Image src={sf.src} alt={sf.alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="text-[11px] font-semibold text-[var(--color-brand-primary)]">{sf.badge}</p>
                    <p className="text-sm font-bold leading-snug text-[var(--color-brand-ink)]">{sf.headline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ingredient chips */}
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <SectionTitle>مكوّنات بارزة</SectionTitle>
          <div className="flex flex-wrap justify-center gap-2">
            {d.productIngredients.map((ing) => (
              <span
                key={ing.name}
                className="rounded-full border border-[var(--color-brand-border)] bg-white px-3 py-1 text-xs text-[var(--color-brand-ink)] shadow-sm"
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
                <div key={galleryKey(img)} className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--color-brand-border)] bg-white shadow-sm">
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
                <div key={row.imageSrc} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--color-brand-border)] shadow-sm">
                  <Image src={row.imageSrc} alt={row.imageAlt} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Guarantee CTA strip */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="rounded-2xl border border-[var(--color-brand-border)] bg-gradient-to-br from-[var(--color-brand-light)]/40 to-white px-5 py-6 text-center shadow-sm sm:px-8">
            <p className="text-xs font-semibold text-[var(--color-brand-primary)]">{d.authenticity.guarantee.kicker}</p>
            <h2 className="mt-1 text-lg font-bold text-[var(--color-brand-ink)]">{d.authenticity.guarantee.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)] line-clamp-3">{d.authenticity.guarantee.body}</p>
            <Link
              href={d.authenticity.guarantee.returnsLink.href}
              className="mt-3 inline-block text-sm font-semibold text-[var(--color-brand-primary)] underline underline-offset-4"
            >
              {d.authenticity.guarantee.returnsLink.label}
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
          <SectionTitle>الأسئلة الشائعة</SectionTitle>
          <div className="divide-y divide-[var(--color-brand-border)] border-y border-[var(--color-brand-border)] rounded-xl bg-white/80">
            {faqList.map((item) => (
              <details key={item.question} className="group px-1 py-3 sm:px-2">
                <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-brand-ink)]">{item.question}</summary>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)] line-clamp-5">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <SectionTitle>التقييمات</SectionTitle>
              <p className="-mt-1 text-sm text-[var(--color-brand-slate)]">{d.reviewsEyebrow}</p>
            </div>
            <p className="text-sm text-[var(--color-brand-slate)]">
              <span className="font-bold tabular-nums text-[var(--color-brand-ink)]" dir="ltr">
                {d.heroRatingScore}
              </span>
              <span className="mx-1">·</span>
              {d.heroRatingCaption}
            </p>
          </div>
          <div className="space-y-4">
            {d.productReviews.map((r) => (
              <article
                key={`${r.name}-${r.city}-${r.text.slice(0, 32)}`}
                className="rounded-xl border border-[var(--color-brand-border)] bg-white/90 p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-row-reverse items-start gap-3 sm:gap-4">
                  <ReviewAvatar name={r.name} />
                  <div className="min-w-0 flex-1 space-y-2 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
                      <span className="font-bold text-[var(--color-brand-ink)]">{r.name}</span>
                      <span className="text-xs text-[var(--color-brand-slate)]">{r.city}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-success)]/12 px-2 py-0.5 text-[10px] font-bold text-[var(--color-brand-success)] sm:text-[11px]">
                        <BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        مشتريات موثّقة
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1" dir="ltr">
                      <StarRow rating={r.rating} />
                      {r.relativeTime ? (
                        <span className="text-[11px] font-medium text-[var(--color-brand-slate)]" dir="rtl">
                          {r.relativeTime}
                        </span>
                      ) : null}
                    </div>
                    {r.tag ? <p className="text-[11px] text-[var(--color-brand-slate)]">{r.tag}</p> : null}
                    <p className="text-sm leading-relaxed text-[var(--color-brand-slate)]">{r.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="border-t border-[var(--color-brand-border)] bg-white">
          <div className="mx-auto max-w-5xl px-3 py-2 sm:px-4 sm:py-2.5">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-1">
              <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                <nav className="shrink-0 text-[10px] text-[var(--color-brand-slate)] sm:text-xs" aria-label="مسار التنقل">
                  <ol className="flex flex-wrap items-center gap-x-1.5">
                    <li>
                      <Link href="/" className="font-medium text-[var(--color-brand-primary)] hover:underline">
                        الرئيسية
                      </Link>
                    </li>
                    <li aria-hidden className="text-[var(--color-brand-border)]">
                      /
                    </li>
                    <li>
                      <Link href="/collections" className="font-medium text-[var(--color-brand-primary)] hover:underline">
                        المجموعة
                      </Link>
                    </li>
                    <li aria-hidden className="text-[var(--color-brand-border)]">
                      /
                    </li>
                    <li className="font-semibold text-[var(--color-brand-ink)]">{d.pdpBreadcrumbCurrent}</li>
                  </ol>
                </nav>
                <p
                  className="min-w-0 text-[10px] leading-snug text-[var(--color-brand-slate)] sm:max-w-[min(100%,36rem)] sm:truncate sm:text-[11px]"
                  title={d.productHeadline}
                >
                  {d.productHeadline}
                </p>
              </div>

              <div
                className="flex flex-wrap items-center gap-x-2 gap-y-0.5 border-t border-[var(--color-brand-border)]/50 pt-1.5 text-[10px] leading-tight text-[var(--color-brand-slate)] sm:border-t-0 sm:pt-0 sm:text-[11px]"
                aria-label="مؤشرات الثقة والطلبات"
              >
                <span className="whitespace-nowrap font-bold uppercase tracking-wide text-[var(--color-brand-primary)]">طلبات تراكمية</span>
                <span className="font-black tabular-nums text-[var(--color-brand-ink)]" dir="ltr">
                  {d.socialStrip.stat}
                </span>
                <span className="hidden text-[var(--color-brand-border)] sm:inline" aria-hidden>
                  ·
                </span>
                <span className="line-clamp-1 max-w-[11rem] sm:max-w-[14rem]" title={d.socialStrip.statLabel}>
                  {d.socialStrip.statLabel}
                </span>
                <span className="text-[var(--color-brand-border)] sm:inline" aria-hidden>
                  ·
                </span>
                <span className="whitespace-nowrap font-semibold text-[var(--color-brand-ink)]">{d.socialStrip.ratingLine}</span>
                <span className="text-[var(--color-brand-border)] sm:inline" aria-hidden>
                  ·
                </span>
                <span className="line-clamp-1 max-w-[14rem] md:max-w-[18rem]" title={`مناطق: ${d.socialStrip.cities.join("، ")}`}>
                  {d.socialStrip.cities.join(" · ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-brand-border)] bg-white/95 px-3 py-2.5 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-[var(--color-brand-slate)]">المجموع</p>
            <p className="truncate text-base font-bold text-[var(--color-brand-ink)] tabular-nums" dir="ltr">
              {formatMoney(selected.price, d.currency, d.numberLocale)} {d.currencyLabelAr}
            </p>
          </div>
          <button
            type="button"
            onClick={scrollToCheckoutAndTrack}
            className={cn(
              "relative shrink-0 overflow-hidden rounded-full px-6 py-2.5 text-sm font-black text-white shadow-lg transition hover:brightness-110 active:scale-[0.98] bg-gradient-to-l",
              selectedVisual.mobileCtaGradient
            )}
          >
            <span className="relative z-[1]">{d.pdpPrimaryCta}</span>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" aria-hidden />
          </button>
        </div>
      </div>
    </>
  );
}
