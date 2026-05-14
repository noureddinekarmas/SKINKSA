"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Lock, Phone, ShieldCheck, Sparkles, Truck, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCartStore } from "@/lib/cart/store";
import { checkoutMetaForCurrency } from "@/lib/content/product-landing-data";
import type { ShopCurrency } from "@/lib/content/product-landing-data";
import { createDraftOrder } from "@/lib/api/orders";
import { formatMoney } from "@/lib/currency";
import { isValidOrderPhone } from "@/lib/phone";
import { trackCommerceEvent, generateEventId, getAttributionFromStorage } from "@/lib/tracking";

import UpsellInterstitial from "./UpsellInterstitial";

function buildSchema(meta: ReturnType<typeof checkoutMetaForCurrency>) {
  return z.object({
    customer_name: z.string().min(2, "اكتبي الاسم الكامل"),
    customer_phone: z.string().refine(
      (p) => isValidOrderPhone(p, meta.currency),
      meta.phoneSchemaMessage
    ),
  });
}

type FormData = {
  customer_name: string;
  customer_phone: string;
};

type CheckoutFormFlowProps = {
  mode: "modal" | "inline";
  /** When mode=modal: whether the dialog is open (drives reset + initiate checkout) */
  modalOpen?: boolean;
  onRequestClose?: () => void;
  /** PDP storefront style: flat header, single primary button, no gradients */
  compact?: boolean;
  /**
   * When inline+embedded, strips the outer card shell so the form sits flush inside a parent order module.
   */
  embedded?: boolean;
  /** When embedded, show the gradient summary header (total + COD). Set false if the parent shows the title only. */
  embeddedShowHeader?: boolean;
  /** Set false when a parent wrapper already has id="product-checkout" for scroll targets. */
  assignCheckoutId?: boolean;
};

export function CheckoutFormFlow({
  mode,
  modalOpen = true,
  onRequestClose,
  compact = false,
  embedded = false,
  embeddedShowHeader = true,
  assignCheckoutId = true,
}: CheckoutFormFlowProps) {
  const { items, cartTotal, clearCart, closeCheckout } = useCartStore();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initiatedCheckoutRef = useRef(false);

  const checkoutCurrency: ShopCurrency = items[0]?.currency ?? "SAR";
  const meta = useMemo(() => checkoutMetaForCurrency(checkoutCurrency), [checkoutCurrency]);
  const schema = useMemo(() => buildSchema(meta), [meta]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const formKey = items.map((i) => `${i.slug}:${i.currency}`).join("|") || "empty";

  useEffect(() => {
    if (mode === "modal" && !modalOpen) return;
    reset();
  }, [mode, modalOpen, formKey, reset]);

  useEffect(() => {
    if (mode !== "modal" || !modalOpen) return;
    const eventId = generateEventId("initiate_checkout");
    const state = useCartStore.getState();
    if (state.items.length === 0) return;
    const c = state.items[0]?.currency ?? "SAR";
    trackCommerceEvent({
      eventName: "InitiateCheckout",
      eventId,
      value: state.cartTotal(),
      currency: c,
      contents: state.items.map((item) => ({
        id: item.slug,
        quantity: item.quantity,
        item_price: item.unitPrice,
      })),
      contentName: state.items[0]?.titleAr,
    });
  }, [mode, modalOpen]);

  useEffect(() => {
    if (mode !== "inline") return;
    if (items.length === 0 || initiatedCheckoutRef.current) return;
    initiatedCheckoutRef.current = true;
    const eventId = generateEventId("initiate_checkout");
    trackCommerceEvent({
      eventName: "InitiateCheckout",
      eventId,
      value: cartTotal(),
      currency: checkoutCurrency,
      contents: items.map((item) => ({
        id: item.slug,
        quantity: item.quantity,
        item_price: item.unitPrice,
      })),
      contentName: items[0]?.titleAr,
    });
  }, [mode, items, cartTotal, checkoutCurrency]);

  const finishFlow = () => {
    setShowUpsell(false);
    if (mode === "modal") {
      closeCheckout();
      onRequestClose?.();
    }
    clearCart();
    reset();
    initiatedCheckoutRef.current = false;
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    const eventId = generateEventId("submit_cod");
    const attribution = getAttributionFromStorage();
    const ccy = items[0]?.currency ?? "SAR";

    try {
      if (mode === "inline" && items[0]) {
        const atcId = generateEventId("atc");
        trackCommerceEvent({
          eventName: "AddToCart",
          eventId: atcId,
          value: cartTotal(),
          currency: ccy,
          contents: items.map((item) => ({
            id: item.slug,
            quantity: item.quantity,
            item_price: item.unitPrice,
          })),
          contentName: items[0].titleAr,
        });
      }
      const result = await createDraftOrder({
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        checkout_currency: ccy,
        cart_items: items.map((item) => ({
          product_id: item.productId,
          offer_code: item.offerCode,
          quantity: item.quantity,
          unit_price_sar: item.unitPrice,
          title_snapshot: item.titleAr,
        })),
        attribution,
        event_ids: { initiate_checkout: eventId },
      });
      trackCommerceEvent({
        eventName: "SubmitCODForm",
        eventId,
        value: cartTotal(),
        currency: ccy,
        contents: items.map((item) => ({
          id: item.slug,
          quantity: item.quantity,
          item_price: item.unitPrice,
        })),
        contentName: items[0]?.titleAr,
      });
      setOrderId(result.id);
      setOrderTotal(Number(result.total_sar));
      setShowUpsell(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ، حاولي مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  if (showUpsell && orderId && items[0]) {
    const line = items[0];
    return (
      <UpsellInterstitial
        orderId={orderId}
        baseTotal={orderTotal}
        currency={checkoutCurrency}
        currencyLabelAr={meta.currencyLabelAr}
        numberLocale={meta.numberLocale}
        upsellAddonPrice={meta.upsellAddonPrice}
        upsellCompareAtPrice={meta.upsellCompareAtPrice}
        upsellBundle={meta.upsellBundle}
        primaryOrderQuantity={line.quantity}
        productSlug={line.slug}
        productTitleAr={line.titleAr}
        onComplete={() => {
          finishFlow();
          window.location.href = `/thank-you?order=${orderId}`;
        }}
      />
    );
  }

  const isCompactPdp = mode === "inline" && compact && !embedded;

  const headerBlock =
    mode === "modal" ? (
      <div className="relative overflow-hidden border-b-4 border-[var(--color-brand-accent)] bg-gradient-to-bl from-[var(--color-brand-ink)] via-[var(--color-brand-primary)] to-[var(--color-brand-deep)] px-6 py-5 text-white">
        <div
          className="pointer-events-none absolute -start-24 -top-16 h-48 w-48 rounded-full bg-[var(--color-brand-accent)]/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -end-20 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div className="relative mb-4 flex items-center justify-between gap-3">
          <h2 className="text-balance text-xl font-black leading-snug">خطوة أخيرة لتأكيد طلبك</h2>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner backdrop-blur-sm">
            <Lock className="h-5 w-5 text-[var(--color-brand-light)]" />
          </div>
        </div>
        <div className="relative flex items-center justify-between gap-3 rounded-2xl border border-white/25 bg-white/[0.12] p-4 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold tracking-wide text-[var(--color-brand-light)]/90">الإجمالي المطلوب</span>
            <span className="text-2xl font-black tabular-nums">
              <span dir="ltr">{formatMoney(cartTotal(), checkoutCurrency, meta.numberLocale)}</span>{" "}
              <span className="text-lg font-bold">{meta.currencyLabelAr}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[var(--color-brand-success)]/40 bg-[var(--color-brand-success)]/25 px-3 py-2 text-white shadow-sm">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-200" />
            <span className="text-sm font-black">الدفع عند الاستلام</span>
          </div>
        </div>
      </div>
    ) : isCompactPdp ? (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50/80 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">إتمام الطلب</h2>
          <p className="text-xs text-neutral-500">الدفع عند الاستلام</p>
        </div>
        <p className="text-lg font-bold text-neutral-900 tabular-nums" dir="ltr">
          {formatMoney(cartTotal(), checkoutCurrency, meta.numberLocale)}{" "}
          <span className="text-sm font-semibold">{meta.currencyLabelAr}</span>
        </p>
      </div>
    ) : mode === "inline" && embedded ? (
      embeddedShowHeader ? (
        <div className="relative overflow-hidden border-b border-[var(--color-brand-border)] bg-gradient-to-bl from-[var(--color-brand-ink)] via-[var(--color-brand-primary)] to-[var(--color-brand-deep)] px-4 py-4 text-white sm:px-6 sm:py-5">
          <div
            className="pointer-events-none absolute -start-20 -top-12 h-40 w-40 rounded-full bg-[var(--color-brand-accent)]/18 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-brand-accent)]">
                SKINKSA
              </p>
              <h2 className="text-balance text-lg font-black leading-tight sm:text-xl">أكملي بياناتك — جاهزة للشحن</h2>
              <p className="mt-1 max-w-md text-[11px] font-semibold leading-relaxed text-white/85 sm:text-xs">
                بخطوتين فقط: اسمكِ ورقمكِ — من دون دفع أونلاين. فريقنا يتصل للتأكيد.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-stretch gap-2 rounded-2xl border border-white/25 bg-white/[0.12] px-4 py-3 text-center shadow-[0_12px_40px_-16px_rgba(0,0,0,0.35)] backdrop-blur-md sm:min-w-[11rem] sm:text-start">
              <span className="text-[10px] font-bold text-[var(--color-brand-light)]/90">إجمالي الطلب</span>
              <p className="text-2xl font-black tabular-nums sm:text-3xl">
                <span dir="ltr">{formatMoney(cartTotal(), checkoutCurrency, meta.numberLocale)}</span>{" "}
                <span className="text-base font-bold">{meta.currencyLabelAr}</span>
              </p>
              <div className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--color-brand-success)]/40 bg-[var(--color-brand-success)]/25 px-2 py-1 text-[11px] font-black">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-200" aria-hidden />
                دفع عند الاستلام
              </div>
            </div>
          </div>
        </div>
      ) : null
    ) : (
      <div className="relative overflow-hidden border-b-4 border-[var(--color-brand-accent)] bg-gradient-to-bl from-[var(--color-brand-ink)] via-[var(--color-brand-primary)] to-[var(--color-brand-deep)] px-5 py-4 text-white sm:px-6 sm:py-5">
        <div
          className="pointer-events-none absolute -start-20 -top-12 h-40 w-40 rounded-full bg-[var(--color-brand-accent)]/18 blur-3xl"
          aria-hidden
        />
        <div className="relative mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="mb-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-brand-accent)]">
              SKINKSA
            </p>
            <h2 className="text-balance text-lg font-black leading-tight sm:text-xl">أكملي بياناتك — تأكيد الطلب</h2>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm sm:h-11 sm:w-11">
            <Lock className="h-4 w-4 text-[var(--color-brand-light)] sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className="relative flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/25 bg-white/[0.12] p-3 backdrop-blur-md sm:p-4">
          <div>
            <span className="text-[10px] font-bold text-[var(--color-brand-light)]/90 sm:text-[11px]">الإجمالي</span>
            <p className="text-xl font-black tabular-nums sm:text-2xl">
              <span dir="ltr">{formatMoney(cartTotal(), checkoutCurrency, meta.numberLocale)}</span>{" "}
              <span className="text-base font-bold">{meta.currencyLabelAr}</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-[var(--color-brand-success)]/40 bg-[var(--color-brand-success)]/25 px-2.5 py-1.5 text-white sm:gap-2 sm:px-3 sm:py-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-200" />
            <span className="text-[11px] font-black sm:text-sm">الدفع عند الاستلام</span>
          </div>
        </div>
      </div>
    );

  const checkoutDomId = mode === "inline" && assignCheckoutId ? "product-checkout" : undefined;

  if (mode === "inline" && items.length === 0) {
    return (
      <div
        id={checkoutDomId}
        className={
          isCompactPdp
            ? "rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-sm text-neutral-600"
            : embedded
              ? "border border-dashed border-[var(--color-brand-primary)]/35 bg-[var(--color-brand-mist)]/30 p-6 text-center"
              : "rounded-[1.25rem] border-2 border-dashed border-[var(--color-brand-primary)]/35 bg-gradient-to-b from-[var(--color-brand-mist)] to-white p-6 text-center shadow-inner ring-1 ring-[var(--color-brand-primary)]/10"
        }
      >
        <p className={isCompactPdp ? "" : "text-sm font-bold text-[var(--color-brand-slate)]"}>
          اختاري عرضاً أعلاه ليظهر نموذج الطلب.
        </p>
      </div>
    );
  }

  const formWrapClass =
    mode === "modal"
      ? "bg-gradient-to-b from-white to-[var(--color-brand-mist)]/60 px-6 py-5"
      : isCompactPdp
        ? "px-4 py-4 sm:px-5 sm:py-5"
        : embedded
          ? "bg-gradient-to-b from-white via-[var(--color-brand-mist)]/35 to-white px-4 py-5 sm:px-6 sm:py-6"
          : "bg-gradient-to-b from-white via-[var(--color-brand-mist)]/40 to-white px-5 py-5 sm:px-6 sm:py-6";
  const shellClass =
    mode === "inline"
      ? embedded
        ? "bg-white"
        : isCompactPdp
          ? "overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
          : "overflow-hidden rounded-[1.25rem] border-2 border-[var(--color-brand-border)] bg-white shadow-[0_24px_64px_-24px_rgba(26,86,219,0.28)] ring-1 ring-[var(--color-brand-primary)]/[0.08]"
      : "";

  const nameInputClass = isCompactPdp
    ? `block w-full rounded-lg border bg-white p-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 ${
        errors.customer_name ? "border-red-400" : "border-neutral-300"
      }`
    : `block w-full rounded-xl border-2 bg-white p-3.5 pr-11 text-sm font-medium text-[var(--color-brand-ink)] shadow-[0_4px_14px_-6px_rgba(15,28,46,0.12)] transition-all placeholder:text-[var(--color-brand-slate)]/55 focus:outline-none focus:ring-4 ${
        errors.customer_name
          ? "border-[var(--color-brand-error)] focus:border-[var(--color-brand-error)] focus:ring-red-500/15"
          : "border-[var(--color-brand-border)] focus:border-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]/18"
      }`;

  const phoneInputClass = isCompactPdp
    ? `block w-full rounded-lg border bg-white p-3 text-left text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 placeholder:text-right ${
        errors.customer_phone ? "border-red-400" : "border-neutral-300"
      }`
    : `block w-full rounded-xl border-2 bg-white p-3.5 pr-11 text-left text-sm font-medium text-[var(--color-brand-ink)] shadow-[0_4px_14px_-6px_rgba(15,28,46,0.12)] transition-all placeholder:text-[var(--color-brand-slate)]/55 focus:outline-none focus:ring-4 placeholder:text-right ${
        errors.customer_phone
          ? "border-[var(--color-brand-error)] focus:border-[var(--color-brand-error)] focus:ring-red-500/15"
          : "border-[var(--color-brand-border)] focus:border-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]/18"
      }`;

  return (
    <div id={checkoutDomId} className={shellClass}>
      {headerBlock}
      <div className={formWrapClass}>
        {isCompactPdp ? (
          <div className="mb-4 rounded-lg bg-neutral-50 px-3 py-2 text-center text-xs leading-relaxed text-neutral-600">
            {meta.checkoutIntro}
          </div>
        ) : (
          <div className="mb-5 rounded-2xl border border-[var(--color-brand-border)] bg-white/80 px-4 py-3 text-center shadow-sm backdrop-blur-sm">
            <p className="text-pretty text-sm font-semibold leading-relaxed text-[var(--color-brand-slate)]">
              {meta.checkoutIntro}
            </p>
          </div>
        )}

        <form key={formKey} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            {!isCompactPdp && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--color-brand-primary)]/50">
                <User size={18} />
              </div>
            )}
            <input
              {...register("customer_name")}
              type="text"
              placeholder="الاسم الكامل (مثال: نورة محمد)"
              className={nameInputClass}
              dir="rtl"
              autoComplete="name"
            />
            {errors.customer_name && (
              <p className="mt-1.5 px-1 text-xs font-semibold text-[var(--color-brand-error)]">
                {errors.customer_name.message}
              </p>
            )}
          </div>

          <div className="relative">
            {!isCompactPdp && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--color-brand-primary)]/50">
                <Phone size={18} />
              </div>
            )}
            <input
              {...register("customer_phone")}
              type="tel"
              placeholder={meta.phonePlaceholder}
              className={phoneInputClass}
              dir="ltr"
              autoComplete="tel"
            />
            {errors.customer_phone && (
              <p className="mt-1.5 px-1 text-xs font-semibold text-[var(--color-brand-error)]">
                {errors.customer_phone.message}
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
              <span>{error}</span>
            </div>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className={
                isCompactPdp
                  ? "w-full rounded-lg bg-neutral-900 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:pointer-events-none disabled:opacity-50"
                  : "group relative flex min-h-[3.5rem] w-full touch-manipulation items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-l from-[var(--color-brand-primary)] via-[var(--color-brand-blue)] to-[var(--color-brand-deep)] px-4 py-3.5 text-base font-black text-white shadow-[0_16px_40px_-12px_rgba(26,86,219,0.55)] ring-2 ring-[var(--color-brand-accent)]/45 transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-14px_rgba(26,86,219,0.62)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-55 sm:min-h-[3.75rem] sm:text-lg"
              }
            >
              {!isCompactPdp && (
                <>
                  <span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden
                  />
                  <span
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-l from-[var(--color-brand-accent)] via-amber-300 to-[var(--color-brand-accent)]"
                    aria-hidden
                  />
                </>
              )}
              {loading ? (
                <span className={isCompactPdp ? "" : "relative"}>جاري التأكيد…</span>
              ) : isCompactPdp ? (
                "تأكيد الطلب"
              ) : (
                <>
                  <Sparkles className="relative h-5 w-5 shrink-0 text-amber-200 drop-shadow-sm" aria-hidden />
                  <span className="relative text-balance">تأكيد الطلب — ادفعي عند الاستلام</span>
                  <ChevronLeft className="relative h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" aria-hidden />
                </>
              )}
            </button>
          </div>

          {isCompactPdp ? (
            <p className="pb-1 pt-1 text-center text-[11px] text-neutral-500">
              {meta.checkoutFooterDelivery} · الدفع عند الاستلام
            </p>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pb-1 pt-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-brand-slate)]">
                <Truck className="h-3.5 w-3.5 text-[var(--color-brand-primary)]" aria-hidden />
                <span>{meta.checkoutFooterDelivery}</span>
              </div>
              <div className="hidden h-1 w-1 rounded-full bg-[var(--color-brand-border)] sm:block" aria-hidden />
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-brand-slate)]">
                <Lock className="h-3.5 w-3.5 text-[var(--color-brand-success)]" aria-hidden />
                <span>بياناتك محمية</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
