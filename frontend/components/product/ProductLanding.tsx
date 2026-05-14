"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, ShieldCheck, Timer } from "lucide-react";
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

const pillarIcons = [ShieldCheck, BadgeCheck, CheckCircle2] as const;

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2.5 text-sm font-bold text-[var(--color-brand-ink)] sm:text-base">
      <span className="h-1.5 w-8 rounded-full bg-[var(--color-brand-primary)]" aria-hidden />
      {children}
    </h2>
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
      <article className="bg-gradient-to-b from-[var(--color-brand-mist)]/80 via-white to-[var(--color-brand-mist)]/40 pb-28 md:pb-12">
        {d.pdpUrgencyLine.trim() ? (
          <div className="border-b border-[var(--color-brand-accent)]/20 bg-[var(--color-brand-accent)]/[0.09]">
            <p className="mx-auto max-w-3xl px-4 py-2 text-center text-[11px] font-bold text-[var(--color-brand-ink)] sm:text-xs">
              {d.pdpUrgencyLine}
            </p>
          </div>
        ) : null}
        <div className="border-b border-[var(--color-brand-border)] bg-white/90 backdrop-blur-sm">
          <p className="mx-auto max-w-5xl px-4 py-2.5 text-center text-xs font-medium text-[var(--color-brand-slate)] sm:text-sm">
            {d.productHeadline}
          </p>
        </div>

        <nav className="border-b border-[var(--color-brand-border)] bg-white/70 text-sm text-[var(--color-brand-slate)]" aria-label="مسار التنقل">
          <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-deep)]">
                  الرئيسية
                </Link>
              </li>
              <li aria-hidden className="text-[var(--color-brand-border)]">
                /
              </li>
              <li>
                <Link href="/collections" className="font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-deep)]">
                  المجموعة
                </Link>
              </li>
              <li aria-hidden className="text-[var(--color-brand-border)]">
                /
              </li>
              <li className="font-semibold text-[var(--color-brand-ink)]">{d.pdpBreadcrumbCurrent}</li>
            </ol>
          </div>
        </nav>

        {/* Funnel: يسار معرض فقط | عنوان → باقات → CTA → نموذج → نقاط + إثبات + ندرة + تفاصيل */}
        <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-12 md:items-start">
            {/* عمود الصور: معرض + ندرة فقط (sticky مثل صفحات دارينا) */}
            <div className="flex flex-col gap-5 md:sticky md:top-24 md:self-start">
              <div className="rounded-[1.25rem] border border-[var(--color-brand-border)] bg-white p-2 shadow-[0_20px_50px_-28px_rgba(26,86,219,0.35)]">
                <ProductGallery images={d.productHeroGallery} variant="storefront" />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <header className="space-y-3 border-b border-[var(--color-brand-border)] pb-5">
                <p className="text-[11px] font-semibold tracking-wide text-[var(--color-brand-primary)] sm:text-xs">
                  SKINKSA الرسمي
                </p>
                <h1 className="text-2xl font-bold leading-snug text-[var(--color-brand-ink)] sm:text-3xl">
                  {d.pdpShortTitle}
                </h1>
                <p className="text-sm leading-relaxed text-[var(--color-brand-slate)] sm:text-base">{d.pdpSubtitle}</p>
                <p className="text-sm text-[var(--color-brand-slate)]">
                  <span className="font-semibold text-[var(--color-brand-ink)]" dir="ltr">
                    {d.heroRatingScore}
                  </span>
                  <span className="mx-1.5 text-[var(--color-brand-border)]">·</span>
                  {d.heroRatingCaption}
                </p>
              </header>

              <SectionTitle>اختيار الباقة</SectionTitle>
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
                      className={`flex w-full flex-row-reverse items-center gap-3 rounded-2xl border bg-white px-3 py-3 text-right shadow-sm transition sm:px-4 sm:py-3.5 ${
                        isOn
                          ? "border-[var(--color-brand-primary)] ring-2 ring-[var(--color-brand-primary)]/20"
                          : "border-[var(--color-brand-border)] hover:border-[var(--color-brand-primary)]/40"
                      }`}
                    >
                      {thumb ? (
                        <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl border border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/40 sm:h-20 sm:w-20">
                          <Image src={thumb.src} alt={thumb.alt} fill className="object-contain p-1.5" sizes="80px" />
                        </div>
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center justify-end gap-2">
                          {pct != null && pct > 0 && (
                            <span className="rounded-md bg-[var(--color-brand-primary)] px-2 py-0.5 text-[11px] font-semibold text-white">
                              ٪{pct} توفير
                            </span>
                          )}
                          {offer.badge && (
                            <span className="rounded-md border border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/50 px-2 py-0.5 text-[11px] font-semibold text-[var(--color-brand-ink)]">
                              {offer.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-[var(--color-brand-slate)]">{offerCtaLine(offer.pieces)}</p>
                            <p className="text-sm font-medium text-[var(--color-brand-ink)]">{offer.label}</p>
                          </div>
                          <div className="flex flex-col items-end gap-0.5 sm:text-end" dir="ltr">
                            <span className="text-lg font-bold tabular-nums text-[var(--color-brand-ink)] sm:text-xl">
                              {formatMoney(offer.price, d.currency, d.numberLocale)} {d.currencyLabelAr}
                            </span>
                            {offer.compare != null && (
                              <span className="text-xs tabular-nums text-[var(--color-brand-slate)]/70 line-through">
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

              <button
                type="button"
                onClick={scrollToCheckoutAndTrack}
                className="w-full rounded-2xl bg-[var(--color-brand-primary)] py-3.5 text-center text-sm font-bold text-white shadow-[0_16px_40px_-16px_rgba(26,86,219,0.55)] transition hover:brightness-105"
              >
                {d.pdpPrimaryCta}
              </button>

              <div className="scroll-mt-28">
                <CheckoutFormFlow mode="inline" compact />
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
                      {d.socialStrip.stat}+
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-brand-slate)]">{d.socialStrip.statLabel}</p>
                </div>
              </div>

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

              <div className="rounded-2xl border border-[var(--color-brand-border)] bg-white/90 p-4 shadow-sm">
                <p className="text-sm leading-relaxed text-[var(--color-brand-ink)]">{d.pdpEmpathyLine}</p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-[var(--color-brand-primary)]">{d.pdpSolutionLine}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {d.pdpTrustPillars.map((p, i) => {
                  const Icon = pillarIcons[i] ?? ShieldCheck;
                  return (
                    <div
                      key={p.title}
                      className="flex gap-3 rounded-xl border border-[var(--color-brand-border)] bg-white/90 px-3 py-3 shadow-sm"
                    >
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
                      <div>
                        <p className="text-xs font-bold text-[var(--color-brand-ink)]">{p.title}</p>
                        <p className="mt-1 text-[11px] leading-snug text-[var(--color-brand-slate)] sm:text-xs">{p.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <SectionTitle>الأصلي مقابل غير المؤكد</SectionTitle>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--color-brand-success)]/35 bg-[var(--color-brand-success)]/[0.06] p-4">
                    <p className="text-xs font-bold text-[var(--color-brand-success)]">{d.pdpAuthenticCompare.officialTitle}</p>
                    <ul className="mt-3 space-y-2">
                      {d.pdpAuthenticCompare.officialBullets.map((line) => (
                        <li key={line} className="flex gap-2 text-xs leading-snug text-[var(--color-brand-ink)] sm:text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-success)]" aria-hidden />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4">
                    <p className="text-xs font-bold text-neutral-600">{d.pdpAuthenticCompare.otherTitle}</p>
                    <ul className="mt-3 space-y-2">
                      {d.pdpAuthenticCompare.otherBullets.map((line) => (
                        <li key={line} className="flex gap-2 text-xs leading-snug text-neutral-600 sm:text-sm">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" aria-hidden />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[var(--color-brand-slate)]">
                {d.topPromoStrip} · {d.cartTrustLine}
              </p>
            </div>
          </div>
        </section>

        {/* Science / proof */}
        <section className="border-t border-[var(--color-brand-border)] bg-white/60 py-8">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionTitle>لماذا تثقين بالتركيبة</SectionTitle>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from(d.scienceProofList)
                .slice(0, 6)
                .map((line) => (
                  <li
                    key={line}
                    className="rounded-xl border border-[var(--color-brand-border)] bg-white px-3 py-2.5 text-xs leading-snug text-[var(--color-brand-slate)] shadow-sm sm:text-sm"
                  >
                    {line}
                  </li>
                ))}
            </ul>
          </div>
        </section>

        {/* Stats band */}
        <section className="border-y border-[var(--color-brand-border)] bg-white py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-center text-lg font-bold text-[var(--color-brand-ink)]">أرقام تثق بها</h2>
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
          <div className="space-y-3">
            {d.productReviews.map((r) => (
              <article
                key={`${r.name}-${r.text.slice(0, 24)}`}
                className="rounded-xl border border-[var(--color-brand-border)] bg-white/90 p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-[var(--color-brand-ink)]">{r.name}</span>
                  <span className="text-xs text-[var(--color-brand-slate)]">{r.city}</span>
                </div>
                {r.tag ? <p className="mt-1 text-[11px] text-[var(--color-brand-slate)]">{r.tag}</p> : null}
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)] line-clamp-4">{r.text}</p>
              </article>
            ))}
          </div>
        </section>
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
            className="shrink-0 rounded-xl bg-[var(--color-brand-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-105"
          >
            {d.pdpPrimaryCta}
          </button>
        </div>
      </div>
    </>
  );
}
