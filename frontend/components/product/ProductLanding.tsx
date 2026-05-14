"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Beaker,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  CreditCard,
  MapPin,
  Quote,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import ProductGallery from "@/components/product/ProductGallery";
import { CheckoutFormFlow } from "@/components/checkout/CheckoutFormFlow";
import {
  AUTHENTICITY_TO_PAIN_PRODUCT_IMAGES,
} from "@/lib/content/product-page";
import type { StoryFrame } from "@/lib/content/product-page";
import type { ProductLandingData } from "@/lib/content/product-landing-data";
import { formatMoney } from "@/lib/currency";
import { useCartStore } from "@/lib/cart/store";
import { trackCommerceEvent, generateEventId } from "@/lib/tracking";

/** ألوان مختلفة قليلاً حتى تبدو الدائرة أو كـ «عملاء» وليس شعاراً مكرراً */
const HERO_AVATAR_GRADIENTS = [
  "from-[#1a56db] to-[#143a8c]",
  "from-[#0d9488] to-[#0d7c57]",
  "from-[#7c2d12] to-[#b45309]",
] as const;

/** كل باقة لها لون «منتَقى» عند التحديد — يتمدّد لزر الشراء (تقوية تحويل بصرية) */
const OFFER_THEME = {
  OFFER_1: {
    selected:
      "border-emerald-500 bg-gradient-to-l from-emerald-50 via-white to-white shadow-[0_12px_36px_-10px_rgba(13,148,100,0.45)] ring-2 ring-emerald-500/20",
    idle: "border-[var(--color-brand-border)] bg-white",
    hover: "hover:border-emerald-400/55 hover:bg-emerald-50/40",
    badgeOn: "border-emerald-400 bg-emerald-100 text-emerald-900",
    savingsOn: "text-emerald-800",
    accentBar: "bg-emerald-500",
    cta: "from-emerald-600 to-emerald-900",
    ctaHover: "hover:from-emerald-500 hover:to-emerald-900",
    ctaShadow: "shadow-[0_20px_44px_-14px_rgba(5,150,105,0.55)]",
    stickyHint: "text-emerald-700",
    stickyBtn: "bg-gradient-to-l from-emerald-600 to-emerald-800 shadow-[0_10px_30px_-8px_rgba(5,150,105,0.5)]",
  },
  OFFER_2: {
    selected:
      "border-[var(--color-brand-primary)] bg-gradient-to-l from-[var(--color-brand-light)] via-white to-white shadow-[0_12px_36px_-10px_rgba(26,86,219,0.4)] ring-2 ring-[var(--color-brand-primary)]/25",
    idle: "border-[var(--color-brand-border)] bg-white",
    hover: "hover:border-[var(--color-brand-primary)]/45 hover:bg-[var(--color-brand-mist)]/50",
    badgeOn: "border-[var(--color-brand-primary)]/35 bg-[var(--color-brand-light)] text-[var(--color-brand-ink)]",
    savingsOn: "text-[var(--color-brand-success)]",
    accentBar: "bg-[var(--color-brand-primary)]",
    cta: "from-[var(--color-brand-primary)] to-[#0f2d66]",
    ctaHover: "hover:from-[#2563eb] hover:to-[#0f2d66]",
    ctaShadow: "shadow-[0_20px_44px_-14px_rgba(26,86,219,0.85)]",
    stickyHint: "text-[var(--color-brand-success)]",
    stickyBtn:
      "bg-gradient-to-l from-[var(--color-brand-primary)] to-[#143a8c] shadow-[0_10px_30px_-8px_rgba(26,86,219,0.45)]",
  },
  OFFER_3: {
    selected:
      "border-[#c9a44a] bg-gradient-to-l from-amber-50 via-white to-white shadow-[0_12px_36px_-10px_rgba(201,164,74,0.42)] ring-2 ring-amber-400/35",
    idle: "border-[var(--color-brand-border)] bg-white",
    hover: "hover:border-amber-400/55 hover:bg-amber-50/50",
    badgeOn: "border-amber-400 bg-amber-100 text-amber-950",
    savingsOn: "text-amber-900",
    accentBar: "bg-[#c9a44a]",
    cta: "from-amber-600 to-amber-900",
    ctaHover: "hover:from-amber-500 hover:to-amber-900",
    ctaShadow: "shadow-[0_20px_44px_-14px_rgba(180,83,9,0.45)]",
    stickyHint: "text-amber-800",
    stickyBtn: "bg-gradient-to-l from-amber-600 to-amber-900 shadow-[0_10px_30px_-8px_rgba(180,83,9,0.45)]",
  },
} as const;

type OfferCode = keyof typeof OFFER_THEME;

function themeForOfferCode(code: string): (typeof OFFER_THEME)[OfferCode] {
  if (code === "OFFER_1" || code === "OFFER_2" || code === "OFFER_3") {
    return OFFER_THEME[code];
  }
  return OFFER_THEME.OFFER_3;
}

function offerBuyVerbAr(quantity: number): string {
  if (quantity === 1) return "اشترِ واحدةً";
  if (quantity === 2) return "اشترِ اثنتين";
  return "اشترِ ثلاثًا";
}

function savingsPercent(price: number, compare: number | null): number | null {
  if (compare == null || compare <= price) return null;
  return Math.round(((compare - price) / compare) * 100);
}

function StoryFrameCard({ frame }: { frame: StoryFrame }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border-2 border-white bg-white shadow-[0_20px_50px_-20px_rgba(15,28,46,0.35)] ring-1 ring-[var(--color-brand-border)]">
      <div className="relative aspect-[5/4] w-full sm:aspect-[4/3]">
        <Image src={frame.src} alt={frame.alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 380px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <span className="absolute right-4 top-4 max-w-[85%] rounded-full bg-[#c9a44a] px-3 py-1.5 text-center text-[11px] font-black text-white shadow-md sm:text-xs">
          {frame.badge}
        </span>
        <p className="absolute bottom-4 right-4 left-4 text-balance text-lg font-black leading-tight text-white drop-shadow-md sm:text-xl">
          {frame.headline}
        </p>
      </div>
      <div className="flex flex-1 flex-col border-t border-[var(--color-brand-border)] bg-gradient-to-b from-white to-[var(--color-brand-mist)]/50 p-5 sm:p-6">
        <p className="text-pretty text-sm leading-relaxed text-[var(--color-brand-slate)]">{frame.body}</p>
      </div>
    </article>
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

  const [trustTab, setTrustTab] = useState(0);
  const replaceCartWithOffer = useCartStore((s) => s.replaceCartWithOffer);
  const selected = offers[selectedIdx];
  const primaryTheme = themeForOfferCode(selected.code);

  useEffect(() => {
    const i = d.product.offers.findIndex((o) => o.is_default);
    setSelectedIdx(i >= 0 ? i : 0);
  }, [d.product.slug, d.product.offers]);

  const defaultIdx =
    d.product.offers.findIndex((o) => o.is_default) >= 0
      ? d.product.offers.findIndex((o) => o.is_default)
      : 0;
  const defaultOffer = offers[defaultIdx];

  const minPerBottle = Math.min(...offers.map((o) => o.price / o.pieces));

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

  function scrollToPdpDetails() {
    document.getElementById("pdp-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <article className="pb-32 md:pb-0">
        {/* Top: shipping / COD strip */}
        <div className="border-b border-[var(--color-brand-border)] bg-gradient-to-l from-[#1e3a5f] via-[#1a56db] to-[#2563eb] py-2 text-center text-white/95">
          <p className="px-4 text-[10px] font-semibold sm:text-xs">{d.topPromoStrip}</p>
        </div>

        {/* Hero — DTC PDP (product-first: breadcrumb → urgency → buy box → checkout) */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-[var(--color-brand-mist)]/40 to-white">
          <div className="pointer-events-none absolute -start-40 -top-20 h-96 w-96 rounded-full bg-[var(--color-brand-primary)]/10 blur-3xl" />
          <div className="pointer-events-none absolute -end-32 top-40 h-80 w-80 rounded-full bg-orange-400/15 blur-3xl" />

          <div className="relative mx-auto grid max-w-screen-xl grid-cols-1 gap-10 px-4 py-8 sm:gap-12 sm:px-6 md:grid-cols-2 md:py-12 lg:gap-16">
            <div className="md:sticky md:top-28 md:self-start">
              <div className="mb-3 flex flex-wrap items-center gap-2 md:hidden">
                <span className="rounded-full bg-[var(--color-brand-success)]/15 px-2.5 py-1 text-[10px] font-bold text-[var(--color-brand-success)]">
                  {d.mobileBadgeRegions}
                </span>
                <span className="rounded-full border border-[var(--color-brand-border)] bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[var(--color-brand-slate)]">
                  {d.mobileBadgeQuality}
                </span>
              </div>
              <ProductGallery images={d.productHeroGallery} />
            </div>

            <div className="flex flex-col gap-3 md:sticky md:top-28 md:self-start md:gap-4">
              <nav aria-label="مسار التصفح" className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-[var(--color-brand-slate)] sm:text-xs">
                <Link href="/" className="text-[var(--color-brand-primary)] transition hover:underline">
                  الرئيسية
                </Link>
                <span className="text-[var(--color-brand-border)]">/</span>
                <Link href="/collections" className="text-[var(--color-brand-primary)] transition hover:underline">
                  المجموعة
                </Link>
                <span className="text-[var(--color-brand-border)]">/</span>
                <span className="max-w-[180px] truncate text-[var(--color-brand-ink)]">{d.pdpBreadcrumbCurrent}</span>
              </nav>

              <div className="rounded-xl border border-amber-200/80 bg-gradient-to-l from-amber-50 to-white px-3 py-2 shadow-sm sm:px-4">
                <p className="text-[11px] font-black leading-snug text-amber-950 sm:text-xs">{d.pdpUrgencyLine}</p>
              </div>

              <div>
                <h1 className="text-balance text-2xl font-black leading-[1.2] text-[var(--color-brand-ink)] sm:text-3xl lg:text-[2.1rem]">
                  {d.pdpShortTitle}
                </h1>
                <p className="mt-2 max-w-prose text-pretty text-sm font-semibold leading-relaxed text-[var(--color-brand-slate)] sm:text-base">
                  {d.productTagline}
                </p>
                <p className="mt-3 text-[11px] font-bold text-[var(--color-brand-slate)]">
                  <span className="text-[var(--color-brand-ink)]">الاسم الكامل للمنتج:</span> {d.productHeadline}
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-2xl border border-[var(--color-brand-border)] bg-white p-3 shadow-sm sm:p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={15} fill="var(--color-brand-accent)" className="text-[var(--color-brand-accent)]" />
                    ))}
                  </div>
                  <span className="text-base font-black text-[var(--color-brand-ink)] sm:text-lg" dir="ltr">
                    {d.heroRatingScore}
                  </span>
                  <span className="text-[var(--color-brand-border)]">·</span>
                  <span className="text-[11px] font-bold text-[var(--color-brand-slate)] sm:text-xs">{d.heroRatingCaption}</span>
                </div>
                <ul className="flex flex-col gap-1.5 border-t border-[var(--color-brand-border)] pt-2">
                  {d.productBenefits.slice(0, 4).map((line) => (
                    <li key={line} className="flex items-start gap-2 text-xs font-bold text-[var(--color-brand-ink)] sm:text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-success)]" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-black text-[var(--color-brand-primary)]">
                  من{" "}
                  <span dir="ltr" className="tabular-nums">
                    {formatMoney(minPerBottle, d.currency, d.numberLocale)}
                  </span>{" "}
                  {d.currencyLabelAr} / عبوة ضمن باقة الالتزام
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-brand-border)] pt-2">
                  <div>
                    <p className="text-[10px] font-bold text-[var(--color-brand-slate)]">طلبات وثقة</p>
                    <p className="text-sm font-black text-[var(--color-brand-ink)]">
                      {d.socialStrip.stat}{" "}
                      <span className="text-xs font-semibold text-[var(--color-brand-slate)]">{d.socialStrip.statLabel}</span>
                    </p>
                  </div>
                  <div className="flex -space-x-2 space-x-reverse rtl:space-x-reverse">
                    {d.productReviews.slice(0, 3).map((r, i) => (
                      <div
                        key={r.name}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br ${HERO_AVATAR_GRADIENTS[i]} text-[10px] font-bold text-white shadow`}
                      >
                        {r.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {d.socialStrip.cities.slice(0, 5).map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-mist)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-brand-ink)]"
                    >
                      <MapPin className="h-3 w-3 text-[var(--color-brand-primary)]" aria-hidden />
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-black text-[var(--color-brand-ink)] sm:text-base">اختاري العرض</p>
                <div className="mt-2 flex flex-col gap-2.5">
                  {offers.map((offer, idx) => {
                    const savings = offer.compare ? offer.compare - offer.price : 0;
                    const per = offer.price / offer.pieces;
                    const t = themeForOfferCode(offer.code);
                    const isOn = idx === selectedIdx;
                    const showPerBottle = offer.pieces > 1;
                    const pct = savingsPercent(offer.price, offer.compare);
                    return (
                      <button
                        key={offer.code}
                        type="button"
                        onClick={() => setSelectedIdx(idx)}
                        className={`relative w-full overflow-hidden rounded-2xl border-2 px-3 pb-3 pt-3.5 text-right shadow-sm transition duration-200 sm:px-4 sm:pb-3.5 sm:pt-4 ${
                          isOn ? t.selected : `${t.idle} ${t.hover}`
                        }`}
                      >
                        <span
                          className={`pointer-events-none absolute top-2.5 bottom-2.5 right-2.5 w-1 rounded-full transition sm:right-3 ${
                            isOn ? `${t.accentBar} opacity-100` : "bg-[var(--color-brand-border)] opacity-25"
                          }`}
                          aria-hidden
                        />
                        <div className="mb-2 flex flex-wrap items-center justify-end gap-2 pe-3 sm:pe-4">
                          {offer.badge && (
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-black shadow-sm ${
                                isOn ? t.badgeOn : "border-[var(--color-brand-border)] bg-amber-50 text-amber-950"
                              }`}
                            >
                              {offer.badge}
                            </span>
                          )}
                          {pct != null && pct > 0 && (
                            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
                              ٪{pct} توفير
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 pe-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pe-5">
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="text-[11px] font-black uppercase tracking-wide text-[var(--color-brand-slate)] sm:text-xs">
                              {offerBuyVerbAr(offer.pieces)}
                            </p>
                            <p className="text-sm font-black leading-snug text-[var(--color-brand-ink)] sm:text-base">{offer.label}</p>
                            {(savings > 0 || showPerBottle) && (
                              <p className="text-[11px] font-bold leading-tight sm:text-xs">
                                {savings > 0 && (
                                  <span className={isOn ? t.savingsOn : "text-[var(--color-brand-success)]"}>
                                    وفّري{" "}
                                    <span dir="ltr" className="tabular-nums">
                                      {formatMoney(savings, d.currency, d.numberLocale)}
                                    </span>{" "}
                                    {d.currencyLabelAr}
                                  </span>
                                )}
                                {savings > 0 && showPerBottle && (
                                  <span className="text-[var(--color-brand-border)]"> · </span>
                                )}
                                {showPerBottle && (
                                  <span className="text-[var(--color-brand-slate)]">
                                    <span dir="ltr" className="tabular-nums text-[var(--color-brand-ink)]">
                                      {formatMoney(per, d.currency, d.numberLocale)}
                                    </span>{" "}
                                    {d.currencyLabelAr} / عبوة
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-0.5">
                            <span className="flex items-baseline gap-1" dir="ltr">
                              <span className="text-xl font-black tabular-nums text-[var(--color-brand-ink)] sm:text-2xl">
                                {formatMoney(offer.price, d.currency, d.numberLocale)}
                              </span>
                              <span className="text-xs font-bold text-[var(--color-brand-ink)] sm:text-sm">{d.currencyLabelAr}</span>
                            </span>
                            {offer.compare != null && (
                              <span
                                className="text-[10px] font-bold tabular-nums text-[var(--color-brand-slate)] line-through sm:text-xs"
                                dir="ltr"
                              >
                                {formatMoney(offer.compare, d.currency, d.numberLocale)} {d.currencyLabelAr}
                              </span>
                            )}
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
                className={`flex w-full items-center justify-center rounded-2xl bg-gradient-to-l px-4 py-4 text-base font-black text-white shadow-xl transition sm:text-lg ${primaryTheme.cta} ${primaryTheme.ctaHover} ${primaryTheme.ctaShadow}`}
              >
                {d.pdpPrimaryCta}
                <ChevronLeft className="mr-2 h-5 w-5" aria-hidden />
              </button>

              <div className="rounded-2xl border border-[var(--color-brand-border)] bg-white p-3 shadow-sm">
                <p className="text-center text-[11px] font-black text-[var(--color-brand-slate)]">معلومات سريعة</p>
                <div className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-4">
                  {["الشحن والتوصيل", "الضمان", "الاسترجاع", "الاستخدام"].map((label, i) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setTrustTab(i)}
                      className={`rounded-xl px-2 py-2 text-[10px] font-black transition sm:text-[11px] ${
                        trustTab === i
                          ? "bg-[var(--color-brand-primary)] text-white shadow-md"
                          : "bg-[var(--color-brand-mist)]/60 text-[var(--color-brand-ink)] hover:bg-[var(--color-brand-mist)]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="mt-3 min-h-[4.5rem] rounded-xl bg-[var(--color-brand-mist)]/40 px-3 py-2 text-xs font-semibold leading-relaxed text-[var(--color-brand-ink)]">
                  {trustTab === 0 && (
                    <p>
                      {d.valueStripDelivery} — {d.topPromoStrip}
                    </p>
                  )}
                  {trustTab === 1 && <p>ضمان ٣٠ يوماً وفق السياسة المنشورة. {d.valueStripRegulatory}</p>}
                  {trustTab === 2 && (
                    <p>
                      تفاصيل الاسترجاع مذكورة في{" "}
                      <Link
                        href={d.authenticity.guarantee.returnsLink.href}
                        className="font-black text-[var(--color-brand-primary)] underline underline-offset-2"
                      >
                        {d.authenticity.guarantee.returnsLink.label}
                      </Link>
                      .
                    </p>
                  )}
                  {trustTab === 3 && (
                    <p>{d.productHowTo.map((stepItem) => `${stepItem.title}: ${stepItem.desc}`).join(" ← ")}</p>
                  )}
                </div>
              </div>

              <div className="mt-1 scroll-mt-28">
                <CheckoutFormFlow mode="inline" />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { icon: CreditCard, t: "الدفع عند الاستلام", s: "بدون دفع أونلاين" },
                  { icon: Truck, t: "توصيل سريع", s: d.valueStripDelivery },
                  { icon: RotateCcw, t: "ضمان 30 يوم", s: "استرجاع وفق السياسة" },
                  { icon: ShieldCheck, t: "مرخّص SFDA", s: d.mobileBadgeQuality },
                ].map(({ icon: Icon, t, s }) => (
                  <div
                    key={t}
                    className="flex gap-2 rounded-xl border border-[var(--color-brand-border)] bg-white p-3 shadow-sm"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10">
                      <Icon className="h-4 w-4 text-[var(--color-brand-primary)]" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black leading-tight text-[var(--color-brand-ink)] sm:text-xs">{t}</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-[var(--color-brand-slate)]">{s}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Proof chips + bold stats (Darina-style trust band) */}
        <section className="border-y border-[var(--color-brand-border)] bg-white py-10 sm:py-14" aria-labelledby="pdp-stats-heading">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
            <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {d.scienceProofList.map((line) => (
                <div
                  key={line}
                  className="flex min-w-[240px] max-w-[calc(100vw-3rem)] shrink-0 items-start gap-2 rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/35 px-4 py-3 sm:min-w-[280px]"
                >
                  <span className="text-base font-black text-[var(--color-brand-success)]" aria-hidden>
                    ✓
                  </span>
                  <p className="text-xs font-bold leading-snug text-[var(--color-brand-ink)]">{line}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <h2 id="pdp-stats-heading" className="text-2xl font-black text-[var(--color-brand-ink)] sm:text-3xl">
                الأرقام ما تكذب
              </h2>
              <p className="mt-2 text-sm font-semibold text-[var(--color-brand-slate)]">
                ثقة العميلات أولوية — والمصدر الرسمي يفرق
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border-2 border-[var(--color-brand-primary)]/25 bg-gradient-to-b from-[var(--color-brand-light)]/40 to-white p-6 text-center shadow-sm">
                <p className="text-3xl font-black tabular-nums text-[var(--color-brand-primary)] sm:text-4xl" dir="ltr">
                  {d.heroRatingScore}
                </p>
                <p className="mt-2 text-sm font-black text-[var(--color-brand-ink)]">متوسط التقييم</p>
                <p className="mt-1 text-xs font-semibold text-[var(--color-brand-slate)]">{d.socialStrip.ratingLine}</p>
              </div>
              <div className="rounded-2xl border border-[var(--color-brand-border)] bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">{d.socialStrip.stat}</p>
                <p className="mt-2 text-sm font-black text-[var(--color-brand-ink)]">{d.socialStrip.statLabel}</p>
                <p className="mt-1 text-xs font-semibold text-[var(--color-brand-slate)]">طلبات من المتجر الرسمي</p>
              </div>
              <div className="rounded-2xl border border-[var(--color-brand-border)] bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">٢٤/٧</p>
                <p className="mt-2 text-sm font-black text-[var(--color-brand-ink)]">دعم وتواصل</p>
                <p className="mt-1 text-xs font-semibold text-[var(--color-brand-slate)]">{d.authorityBand.points[2]?.d}</p>
              </div>
            </div>

            <div className="mx-auto mt-6 flex max-w-2xl items-start justify-center gap-2 text-center">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--color-brand-border)] text-[10px] font-black text-[var(--color-brand-slate)]"
                aria-hidden
              >
                i
              </span>
              <p className="text-[11px] leading-relaxed text-[var(--color-brand-slate)]">{d.pdpBoldStatsNote}</p>
            </div>

            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4">
              {d.heroStats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/25 px-2 py-3 text-center"
                >
                  <p className="text-base font-black tabular-nums text-[var(--color-brand-ink)] sm:text-lg">{s.value}</p>
                  <p className="mt-0.5 text-[10px] font-bold text-[var(--color-brand-slate)]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results strip + quote (short — not a long essay above the fold) */}
        <section className="border-b border-[var(--color-brand-border)] bg-gradient-to-l from-[var(--color-brand-mist)]/50 to-white py-8 sm:py-10">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--color-brand-border)] bg-white px-4 py-4 shadow-sm sm:px-6">
              <p className="text-center text-sm font-black text-[var(--color-brand-ink)]">{d.productHeroQuote}</p>
            </div>
          </div>
        </section>

        {/* Authentic product vs unofficial / guarantee */}
        <section
          className="relative overflow-hidden border-y border-white/10 bg-gradient-to-b from-[#0a1524] via-[#0f1c2e] to-[#142a42] py-16 text-white sm:py-24"
          aria-labelledby="authenticity-heading"
          id="pdp-details"
        >
          <div
            className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-[var(--color-brand-primary)]/20 blur-[100px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-400/15 blur-[90px]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-400/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-amber-200">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-300" aria-hidden />
                {d.authenticity.eyebrow}
              </span>
              <h2
                id="authenticity-heading"
                className="mt-5 text-balance text-3xl font-black leading-tight sm:text-4xl md:text-[2.35rem]"
              >
                {d.authenticity.title}
              </h2>
              <p className="mt-4 text-pretty text-sm leading-relaxed text-white/72 sm:text-base">{d.authenticity.lead}</p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8">
              <div className="grid gap-6 md:grid-cols-2 lg:col-span-7">
                <div className="flex flex-col rounded-3xl border border-emerald-400/25 bg-white/[0.06] p-6 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md ring-1 ring-white/10">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/30">
                      <ShieldCheck className="h-6 w-6" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">{d.authenticity.real.label}</h3>
                      <ul className="mt-4 flex flex-col gap-3">
                        {d.authenticity.real.items.map((item) => (
                          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-white/85">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col rounded-3xl border border-dashed border-red-400/35 bg-red-950/20 p-6 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)] backdrop-blur-md ring-1 ring-red-400/10">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 text-red-200 ring-1 ring-red-400/25">
                      <AlertTriangle className="h-6 w-6" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-red-100">{d.authenticity.fake.label}</h3>
                      <ul className="mt-4 flex flex-col gap-3">
                        {d.authenticity.fake.items.map((item) => (
                          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-red-100/85">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400/90" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="flex h-full flex-col justify-between rounded-3xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-400/[0.12] via-white/[0.05] to-transparent p-6 shadow-[0_28px_80px_-28px_rgba(201,164,74,0.45)] ring-1 ring-amber-200/20 backdrop-blur-md sm:p-8">
                  <div>
                    <span className="inline-flex rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-black text-amber-100 ring-1 ring-amber-300/40">
                      {d.authenticity.guarantee.kicker}
                    </span>
                    <h3 className="mt-4 text-2xl font-black text-white sm:text-[1.65rem]">{d.authenticity.guarantee.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-[0.95rem]">{d.authenticity.guarantee.body}</p>
                  </div>
                  <p className="mt-6 border-t border-amber-200/20 pt-4 text-xs leading-relaxed text-amber-100/75">
                    {d.authenticity.guarantee.footBeforeLink}{" "}
                    <Link
                      href={d.authenticity.guarantee.returnsLink.href}
                      className="font-bold text-amber-200 underline underline-offset-2 transition hover:text-white"
                    >
                      {d.authenticity.guarantee.returnsLink.label}
                    </Link>{" "}
                    {d.authenticity.guarantee.footAfterLink}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bridge: product-only frames → pain checklist */}
        <section
          className="border-y border-[var(--color-brand-border)] bg-white py-10 sm:py-14"
          aria-label="لقطات المنتج"
        >
          <div className="mx-auto flex max-w-md flex-col gap-8 px-4 sm:max-w-lg sm:px-6">
            {AUTHENTICITY_TO_PAIN_PRODUCT_IMAGES.map((item) => (
              <div
                key={item.imageSrc}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[var(--color-brand-border)] bg-gradient-to-b from-[var(--color-brand-mist)] to-white shadow-[0_20px_56px_-24px_rgba(26,86,219,0.35)] ring-1 ring-black/[0.04]"
              >
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  className="object-contain object-center p-6 sm:p-8"
                  sizes="(max-width: 640px) 100vw, 512px"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Pain — mirror */}
        <section className="border-y border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/70 py-16 sm:py-20">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--color-brand-error)]">
                نقولها صريحة
              </span>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">شفتي نفسج في هالنقاط؟</h2>
              <p className="mt-3 text-pretty text-[var(--color-brand-slate)]">
                إذا واحدة منها تطنّ في راسج… فأنتِ مو لوحدج، وهذي بالضبط الفئة اللي صممنا لها الروتين يكون أذكى مو أكثر.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {d.painChecklist.map((p) => (
                <div
                  key={p.title}
                  className="rounded-3xl border-2 border-white bg-white p-6 shadow-md ring-1 ring-[var(--color-brand-border)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-brand-error)]/10">
                    <span className="text-lg" aria-hidden>
                      ❡
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-black text-[var(--color-brand-ink)]">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)]">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before / after — results narrative */}
        <section className="border-t border-[var(--color-brand-border)] bg-white py-16 sm:py-24">
          <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
            <div className="text-right lg:max-w-xl lg:justify-self-end">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--color-brand-primary)]">
                {d.productResultVisual.eyebrow}
              </span>
              <h2 className="mt-3 text-3xl font-black leading-snug text-[var(--color-brand-ink)] sm:text-4xl">
                {d.productResultVisual.title}
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-[var(--color-brand-slate)]">{d.productResultVisual.body}</p>
              <p className="mt-4 text-xs leading-relaxed text-[var(--color-brand-slate)]/85">
                الوصف تجميلي. النتائج فردية ولا تُعد تشخيصاً طبياً أو علاجاً لمرض.
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.75rem] border border-[var(--color-brand-border)] bg-[var(--color-brand-mist)] shadow-[0_24px_60px_-24px_rgba(26,86,219,0.45)] ring-1 ring-black/[0.04]">
                <Image
                  src={d.productResultVisual.imageSrc}
                  alt={d.productResultVisual.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 480px"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex border-t border-white/20 bg-gradient-to-t from-black/75 via-black/35 to-transparent pt-10 pb-4">
                  <span className="flex-1 text-center text-sm font-black tracking-wide text-white">بعد</span>
                  <span className="flex-1 text-center text-sm font-black tracking-wide text-white">قبل</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story frames — bento */}
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--color-brand-primary)]">
                صور + كلام… على مزاج التسويق اللي يبيع
              </span>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">
                نفس الرسالة بأقطار مختلفة… عشان تدخلينها من جميع الجوانب
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">{d.storyFrames.map((f) => <StoryFrameCard key={f.headline} frame={f} />)}</div>
          </div>
        </section>

        {/* Lifestyle — model + product in hand */}
        <section className="border-t border-[var(--color-brand-border)] bg-white py-16 sm:py-24">
          <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
            <div className="relative order-2 mx-auto w-full max-w-md lg:order-1 lg:max-w-none">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.75rem] border border-[var(--color-brand-border)] bg-gradient-to-br from-[#e8f2ff] to-[#dbeafe] shadow-[0_24px_60px_-24px_rgba(15,28,46,0.35)] ring-1 ring-black/[0.04]">
                <Image
                  src={d.productLifestyleVisual.imageSrc}
                  alt={d.productLifestyleVisual.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 480px"
                />
              </div>
            </div>
            <div className="order-1 text-right lg:order-2 lg:max-w-xl lg:justify-self-end">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--color-brand-accent)]">
                {d.productLifestyleVisual.eyebrow}
              </span>
              <h2 className="mt-3 text-3xl font-black leading-snug text-[var(--color-brand-ink)] sm:text-4xl">
                {d.productLifestyleVisual.title}
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-[var(--color-brand-slate)]">{d.productLifestyleVisual.body}</p>
            </div>
          </div>
        </section>

        {/* Mechanism + science */}
        <section className="border-t border-[var(--color-brand-border)] bg-gradient-to-b from-[var(--color-brand-mist)] to-white py-16 sm:py-24">
          <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-start gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-primary)]/10 px-3 py-1 text-xs font-black text-[var(--color-brand-primary)]">
                <Beaker className="h-3.5 w-3.5" aria-hidden />
                {d.mechanismBlock.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl font-black leading-snug text-[var(--color-brand-ink)] sm:text-4xl">{d.mechanismBlock.title}</h2>
              {d.mechanismBlock.paras.map((para) => (
                <p key={para.slice(0, 24)} className="mt-4 text-pretty leading-relaxed text-[var(--color-brand-slate)]">
                  {para}
                </p>
              ))}
              <div className="mt-8 rounded-3xl border-2 border-[var(--color-brand-accent)]/35 bg-gradient-to-br from-white to-[#fffbeb] p-6 shadow-inner">
                <p className="text-lg font-black text-[var(--color-brand-ink)]">{d.mechanismBlock.calloutTitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)]">{d.mechanismBlock.calloutBody}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-[var(--color-brand-border)] bg-white p-6 shadow-lg">
                <h3 className="flex items-center gap-2 text-lg font-black text-[var(--color-brand-ink)]">
                  <Sparkles className="h-5 w-5 text-[var(--color-brand-accent)]" aria-hidden />
                  نقاط «إثبات» سريعة (مو تطبيل)
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {d.scienceProofList.map((line) => (
                    <li key={line} className="flex gap-3 text-sm font-semibold text-[var(--color-brand-ink)]">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-success)]" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-[var(--color-brand-border)] shadow-md">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={d.productDescriptionGallery[2].src}
                    alt={d.productDescriptionGallery[2].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 520px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c2e]/80 to-transparent" />
                  <p className="absolute bottom-5 right-5 left-5 text-balance text-lg font-black text-white">
                    العلم يرتّب «ليش»… والضمان يرتّب «وش لو»
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits checklist */}
        <section className="border-t border-[var(--color-brand-border)] bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">وش يتغيّر في حياتج اليومية؟</h2>
              <p className="mt-3 text-pretty text-[var(--color-brand-slate)]">
                مو كلام فخم… كل نقطة تحسّين إحساس حقيقي لما الروتين يثبت.
              </p>
              <ul className="mt-8 flex flex-col gap-4">
                {d.productBenefits.map((b) => (
                  <li key={b} className="flex gap-3 text-sm font-bold text-[var(--color-brand-ink)]">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-success)]/15">
                      <CheckCircle size={14} className="text-[var(--color-brand-success)]" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl ring-2 ring-[var(--color-brand-primary)]/20">
                <Image
                  src={d.productDescriptionGallery[1].src}
                  alt={d.productDescriptionGallery[1].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute start-4 top-4 rounded-2xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-brand-primary)]">تحسّس فوري</p>
                  <p className="text-sm font-black text-[var(--color-brand-ink)]">نعومة… بدون «زيط»</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ingredients spotlight */}
        <section className="border-t border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/40 py-16 sm:py-24">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--color-brand-accent)]">
                مكوّنات تحت الضوء
              </span>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">تعرفين وش يدخل على بشرتج… ومو بس اسم لامع</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {d.productIngredients.map((ing) => (
                <div
                  key={ing.name}
                  className="relative overflow-hidden rounded-3xl border border-[var(--color-brand-border)] bg-white p-6 shadow-lg"
                >
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-brand-primary)]">{ing.hook}</span>
                  <h3 className="mt-2 text-lg font-black text-[var(--color-brand-ink)]">{ing.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)]">{ing.desc}</p>
                  <p className="mt-4 rounded-xl bg-[var(--color-brand-mist)] px-3 py-2 text-xs font-bold text-[var(--color-brand-ink)]">
                    ✓ {ing.microProof}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* قارني — NAMBeauty-style comparison */}
        <section className="border-t border-[var(--color-brand-border)] bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-black uppercase tracking-widest text-orange-600">{d.vsComparison.eyebrow}</span>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">{d.vsComparison.title}</h2>
              <p className="mt-3 text-sm font-semibold text-[var(--color-brand-slate)]">{d.vsComparison.subtitle}</p>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {d.vsComparison.alternatives.map((alt) => (
                <div
                  key={alt.name}
                  className="flex flex-col rounded-2xl border-2 border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/30 p-5"
                >
                  <h3 className="text-lg font-black text-[var(--color-brand-ink)]">{alt.name}</h3>
                  <p className="mt-1 text-xs font-bold text-[var(--color-brand-slate)]">{alt.priceHint}</p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {alt.cons.map((line) => (
                      <li key={line} className="flex gap-2 text-sm text-[var(--color-brand-slate)]">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="flex flex-col rounded-2xl border-2 border-[var(--color-brand-primary)] bg-gradient-to-b from-[var(--color-brand-light)]/80 to-white p-5 shadow-lg ring-2 ring-[var(--color-brand-primary)]/20">
                <h3 className="text-lg font-black text-[var(--color-brand-primary)]">{d.vsComparison.ours.name}</h3>
                <p className="mt-1 text-xs font-bold text-[var(--color-brand-ink)]">{d.vsComparison.ours.priceHint}</p>
                <ul className="mt-4 flex flex-col gap-2">
                  {d.vsComparison.ours.pros.map((line) => (
                    <li key={line} className="flex gap-2 text-sm font-semibold text-[var(--color-brand-ink)]">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-success)]" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How to */}
        <section className="border-t border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/30 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--color-brand-accent)]">٣ خطوات بس</span>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">خلّي الروتين «خفيف» عشان يثبت</h2>
            </div>
            <div className="mt-12 flex flex-col gap-6 md:flex-row md:gap-4">
              {d.productHowTo.map((step) => (
                <div key={step.step} className="relative flex flex-1 flex-col rounded-3xl border border-[var(--color-brand-border)] bg-white p-6 shadow-md">
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand-primary)] text-lg font-black text-white shadow-lg">
                    {step.step}
                  </span>
                  <p className="text-lg font-black text-[var(--color-brand-ink)]">{step.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="border-t border-[var(--color-brand-border)] bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--color-brand-accent)]">{d.reviewsEyebrow}</span>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">كلام بنات… مو إعلان مسجّل</h2>
              <p className="mt-3 text-sm text-[var(--color-brand-slate)]">
                نخلي النبرة واقعية لأن المصداقية أغلى من أي فلتر.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-md rounded-2xl border border-[var(--color-brand-border)] bg-gradient-to-b from-[var(--color-brand-mist)]/40 to-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-3xl font-black text-[var(--color-brand-ink)]" dir="ltr">
                  {d.heroRatingScore}
                </span>
                <div className="flex items-center gap-0.5" aria-hidden>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill="var(--color-brand-accent)" className="text-[var(--color-brand-accent)]" />
                  ))}
                </div>
              </div>
              <p className="mt-1 text-center text-[11px] font-semibold text-[var(--color-brand-slate)]">ملخّص تقييمات العميلات</p>
              <ul className="mt-4 flex flex-col gap-2.5" aria-label="توزيع التقييمات">
                {[
                  { stars: 5, pct: 92 },
                  { stars: 4, pct: 6 },
                  { stars: 3, pct: 2 },
                  { stars: 2, pct: 0 },
                  { stars: 1, pct: 0 },
                ].map((row) => (
                  <li key={row.stars} className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-brand-ink)]">
                    <span className="w-3 tabular-nums opacity-80" dir="ltr">
                      {row.stars}
                    </span>
                    <Star size={12} fill="var(--color-brand-accent)" className="text-[var(--color-brand-accent)]" aria-hidden />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white ring-1 ring-[var(--color-brand-border)]">
                      <div
                        className="h-full rounded-full bg-[var(--color-brand-accent)]"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-9 shrink-0 tabular-nums text-[var(--color-brand-slate)]" dir="ltr">
                      {row.pct}%
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-center text-[10px] leading-relaxed text-[var(--color-brand-slate)]">
                توزيع تجميعي تقريبي للمراجعات المنشورة — لا يمثّل كل الطلبات.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {d.productReviews.map((r) => (
                <figure
                  key={r.name}
                  className="flex h-full flex-col rounded-[1.75rem] border border-[var(--color-brand-border)] bg-gradient-to-b from-white to-[var(--color-brand-mist)]/20 p-5 shadow-md"
                >
                  <Quote className="h-6 w-6 text-[var(--color-brand-primary)]/30" aria-hidden />
                  <div className="mt-3 flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={13} fill="var(--color-brand-accent)" className="text-[var(--color-brand-accent)]" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm font-bold leading-relaxed text-[var(--color-brand-ink)]">
                    &ldquo;{r.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--color-brand-border)] pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/12 text-sm font-black text-[var(--color-brand-primary)]">
                      {r.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-[var(--color-brand-ink)]">{r.name}</p>
                      <p className="text-xs text-[var(--color-brand-slate)]">
                        {r.city} · <span className="text-[var(--color-brand-success)]">{r.tag}</span>
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-10 text-center text-[11px] text-[var(--color-brand-slate)]">
              النتائج تختلف؛ الوصف تجميلي وليس تشخيصاً طبياً.
            </p>
          </div>
        </section>

        {/* Objection buster */}
        <section className="border-t border-[var(--color-brand-border)] bg-[#0f1c2e] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-black sm:text-3xl">{d.objectionBuster.title}</h2>
            <ul className="mt-8 flex flex-col gap-4 text-right">
              {d.objectionBuster.lines.map((line) => (
                <li
                  key={line}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold leading-relaxed text-white/95"
                >
                  {line}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={scrollToCheckoutAndTrack}
              className="mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-black text-[#0f1c2e] shadow-xl transition hover:bg-[var(--color-brand-mist)]"
            >
              جرّبي بدون ضغط — أكملي طلبج هنا
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/20 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-black text-[var(--color-brand-ink)]">أسئلة تكرّر… وإجاباتنا جاهزة</h2>
            <div className="mt-8 flex flex-col gap-3">
              {d.faq.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-[var(--color-brand-border)] bg-white p-5 shadow-sm open:ring-2 open:ring-[var(--color-brand-primary)]/15"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-[var(--color-brand-ink)]">
                    {item.question}
                    <ChevronLeft className="h-5 w-5 shrink-0 text-[var(--color-brand-primary)] transition group-open:-rotate-90" aria-hidden />
                  </summary>
                  <p className="mt-4 border-t border-[var(--color-brand-border)] pt-4 text-sm leading-relaxed text-[var(--color-brand-slate)]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </article>

      {/* Mobile sticky */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-2 border-t border-[var(--color-brand-border)] bg-white/95 px-3 py-3 shadow-[0_-16px_48px_rgba(15,28,46,0.18)] backdrop-blur-lg md:hidden">
        <button
          type="button"
          onClick={scrollToPdpDetails}
          className="shrink-0 rounded-xl border-2 border-[var(--color-brand-primary)] bg-white px-3 py-2.5 text-[11px] font-black text-[var(--color-brand-primary)]"
        >
          تفاصيل
        </button>
        <div className="min-w-0 flex-1">
          <p className={`text-[10px] font-black ${primaryTheme.stickyHint}`}>الدفع عند الاستلام</p>
          <p className="truncate text-base font-black text-[var(--color-brand-ink)]">
            <span dir="ltr" className="tabular-nums">
              {formatMoney(selected.price, d.currency, d.numberLocale)}
            </span>{" "}
            <span className="text-sm font-bold">{d.currencyLabelAr}</span>
          </p>
          <p className="truncate text-[10px] text-[var(--color-brand-slate)]">{selected.label}</p>
        </div>
        <button
          type="button"
          onClick={scrollToCheckoutAndTrack}
          className={`shrink-0 self-center rounded-xl px-4 py-3 text-xs font-black text-white ${primaryTheme.stickyBtn}`}
        >
          اشتري الآن
        </button>
      </div>
    </>
  );
}
