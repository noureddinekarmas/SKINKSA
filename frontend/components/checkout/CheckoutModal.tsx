"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Lock, Phone, ShieldCheck, Truck, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCartStore } from "@/lib/cart/store";
import { checkoutMetaForCurrency } from "@/lib/content/product-landing-data";
import type { ShopCurrency } from "@/lib/content/product-landing-data";
import { createDraftOrder } from "@/lib/api/orders";
import { formatMoney } from "@/lib/currency";
import { isValidPhoneForCurrency } from "@/lib/phone";
import { trackCommerceEvent, generateEventId, getAttributionFromStorage } from "@/lib/tracking";

import UpsellInterstitial from "./UpsellInterstitial";

function buildSchema(meta: ReturnType<typeof checkoutMetaForCurrency>) {
  return z.object({
    customer_name: z.string().min(2, "اكتبي الاسم الكامل"),
    customer_phone: z.string().refine(
      (p) => isValidPhoneForCurrency(p, meta.currency),
      meta.phoneSchemaMessage
    ),
  });
}

type FormData = {
  customer_name: string;
  customer_phone: string;
};

export default function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, items, cartTotal, clearCart } = useCartStore();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!isCheckoutOpen) return;
    reset();
  }, [isCheckoutOpen, formKey, reset]);

  useEffect(() => {
    if (!isCheckoutOpen) return;
    const eventId = generateEventId("initiate_checkout");
    const state = useCartStore.getState();
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
  }, [isCheckoutOpen]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    const eventId = generateEventId("submit_cod");
    const attribution = getAttributionFromStorage();
    const ccy = items[0]?.currency ?? "SAR";

    try {
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

  if (showUpsell && orderId) {
    const first = items[0];
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
        primaryOrderQuantity={first?.quantity ?? 1}
        productSlug={first?.slug ?? "blueskin"}
        productTitleAr={first?.titleAr ?? "SKINKSA"}
        onComplete={() => {
          setShowUpsell(false);
          closeCheckout();
          clearCart();
          reset();
          window.location.href = `/thank-you?order=${orderId}`;
        }}
      />
    );
  }

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={(open) => !open && closeCheckout()}>
      <DialogContent className="sm:max-w-md overflow-hidden border-0 bg-[#f0f7ff] p-0 shadow-2xl" dir="rtl">
        {/* HEADER / TRUST SECTION */}
        <div className="bg-gradient-to-l from-[#1e3a5f] to-[#1a3d6d] px-6 py-5 text-white">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">خطوة أخيرة لتأكيد طلبك</h2>
            <Lock className="h-5 w-5 text-blue-200" />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
            <div className="flex flex-col">
              <span className="text-xs text-blue-200">الإجمالي المطلوب</span>
              <span className="text-2xl font-black">
                <span dir="ltr" className="tabular-nums">
                  {formatMoney(cartTotal(), checkoutCurrency, meta.numberLocale)}
                </span>{" "}
                <span className="text-lg font-bold">{meta.currencyLabelAr}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/20 px-3 py-1.5 text-green-100">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-bold">الدفع عند الاستلام</span>
            </div>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="px-6 py-5">
          <div className="mb-5 text-center">
            <p className="text-sm font-medium text-[#4b5e78]">{meta.checkoutIntro}</p>
          </div>

          <form key={formKey} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#94a3b8]">
                <User size={18} />
              </div>
              <input
                {...register("customer_name")}
                type="text"
                placeholder="الاسم الكامل (مثال: نورة محمد)"
                className={`block w-full rounded-xl border bg-white p-3.5 pr-10 text-sm text-[#0f1c2e] shadow-sm transition-shadow focus:outline-none focus:ring-2 ${
                  errors.customer_name ? "border-red-400 focus:ring-red-400" : "border-[#cbd5e1] focus:ring-[#1a56db]"
                }`}
                dir="rtl"
              />
              {errors.customer_name && (
                <p className="mt-1.5 px-1 text-xs font-medium text-[#dc2626]">{errors.customer_name.message}</p>
              )}
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#94a3b8]">
                <Phone size={18} />
              </div>
              <input
                {...register("customer_phone")}
                type="tel"
                placeholder={meta.phonePlaceholder}
                className={`block w-full rounded-xl border bg-white p-3.5 pr-10 text-left text-sm text-[#0f1c2e] shadow-sm transition-shadow focus:outline-none focus:ring-2 ${
                  errors.customer_phone ? "border-red-400 focus:ring-red-400" : "border-[#cbd5e1] focus:ring-[#1a56db]"
                } placeholder:text-right`}
                dir="ltr"
              />
              {errors.customer_phone && (
                <p className="mt-1.5 px-1 text-xs font-medium text-[#dc2626]">{errors.customer_phone.message}</p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-[#dc2626]">
                <span className="font-bold">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#c9a44a] to-[#d4a843] text-lg font-bold text-white shadow-[0_0_20px_rgba(201,164,74,0.3)] transition-all hover:-translate-y-0.5 hover:from-[#d4a843] hover:to-[#c9a44a]"
              >
                {loading ? (
                  "جاري تأكيد الطلب..."
                ) : (
                  <>
                    <span>أكدي الطلب الآن</span>
                    <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 pb-1 pt-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748b]">
                <Truck className="h-3.5 w-3.5" />
                <span>{meta.checkoutFooterDelivery}</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-[#cbd5e1]" />
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748b]">
                <Lock className="h-3.5 w-3.5" />
                <span>بياناتك مشفرة وآمنة</span>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
