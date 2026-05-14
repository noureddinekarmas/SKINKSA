"use client";

import Link from "next/link";
import { CreditCard, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import ProductGallery from "@/components/product/ProductGallery";
import { CheckoutFormFlow } from "@/components/checkout/CheckoutFormFlow";
import type { ProductLandingData } from "@/lib/content/product-landing-data";
import { formatMoney } from "@/lib/currency";
import { useCartStore } from "@/lib/cart/store";
import { trackCommerceEvent, generateEventId } from "@/lib/tracking";

/** كل باقة لها لون عند التحديد */
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

function savingsPercent(price: number, compare: number | null): number | null {
  if (compare == null || compare <= price) return null;
  return Math.round(((compare - price) / compare) * 100);
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
  const primaryTheme = themeForOfferCode(selected.code);

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

  return (
    <>
      <article className="pb-32 md:pb-0">
        <section className="border-b border-[var(--color-brand-border)] bg-white">
          <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 md:grid-cols-2 md:gap-10 md:py-10">
            <div className="md:sticky md:top-24 md:self-start">
              <ProductGallery images={d.productHeroGallery} />
            </div>

            <div className="flex flex-col gap-4 md:sticky md:top-24 md:self-start md:gap-5">
              <div>
                <h1 className="text-balance text-xl font-black leading-tight text-[var(--color-brand-ink)] sm:text-2xl">
                  {d.pdpShortTitle}
                </h1>
                <p className="mt-2 max-w-prose text-pretty text-xs font-semibold leading-relaxed text-[var(--color-brand-slate)] sm:text-sm">
                  {d.topPromoStrip}
                </p>
              </div>

              <div>
                <p className="text-sm font-black text-[var(--color-brand-ink)] sm:text-base">اختاري العرض</p>
                <div className="mt-2 flex flex-col gap-2.5">
                  {offers.map((offer, idx) => {
                    const t = themeForOfferCode(offer.code);
                    const isOn = idx === selectedIdx;
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
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-black leading-snug text-[var(--color-brand-ink)] sm:text-base">{offer.label}</p>
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

              <div className="scroll-mt-28">
                <CheckoutFormFlow mode="inline" />
              </div>

              <p className="text-[11px] font-semibold leading-relaxed text-[var(--color-brand-slate)]">
                {d.valueStripDelivery} · {d.valueStripRegulatory}
                {" · "}
                <Link href="/returns-policy" className="font-bold text-[var(--color-brand-primary)] underline underline-offset-2">
                  سياسة الإرجاع
                </Link>
              </p>

              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-[var(--color-brand-slate)]">
                <span className="inline-flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
                  الدفع عند الاستلام
                </span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
                  {d.mobileBadgeQuality}
                </span>
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Mobile sticky */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-brand-border)] bg-white/95 px-3 py-3 shadow-[0_-16px_48px_rgba(15,28,46,0.18)] backdrop-blur-lg md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className={`text-[10px] font-black ${primaryTheme.stickyHint}`}>الدفع عند الاستلام</p>
            <p className="truncate text-base font-black text-[var(--color-brand-ink)]">
              <span dir="ltr" className="tabular-nums">
                {formatMoney(selected.price, d.currency, d.numberLocale)}
              </span>{" "}
              <span className="text-sm font-bold">{d.currencyLabelAr}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={scrollToCheckoutAndTrack}
            className={`shrink-0 rounded-xl px-5 py-3 text-sm font-black text-white ${primaryTheme.stickyBtn}`}
          >
            {d.pdpPrimaryCta}
          </button>
        </div>
      </div>
    </>
  );
}
