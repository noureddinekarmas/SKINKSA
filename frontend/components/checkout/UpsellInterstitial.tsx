"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { applyUpsell, finalizeOrder } from "@/lib/api/orders";
import type { ShopCurrency } from "@/lib/content/product-landing-data";
import { formatMoney } from "@/lib/currency";
import { trackCommerceEvent, generateEventId } from "@/lib/tracking";

interface Props {
  orderId: string;
  baseTotal: number;
  currency: ShopCurrency;
  currencyLabelAr: string;
  numberLocale: string;
  upsellAddonPrice: number;
  productSlug: string;
  productTitleAr: string;
  onComplete: (finalTotal: number) => void;
}

export default function UpsellInterstitial({
  orderId,
  baseTotal,
  currency,
  currencyLabelAr,
  numberLocale,
  upsellAddonPrice,
  productSlug,
  productTitleAr,
  onComplete,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(12);
  const [processing, setProcessing] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const eventId = generateEventId("upsell_view");
    trackCommerceEvent({
      eventName: "UpsellView",
      eventId,
      value: upsellAddonPrice,
      currency,
      contents: [{ id: "upsell_addon", quantity: 1, item_price: upsellAddonPrice }],
      contentName: "عرض إضافي بعد الطلب",
    });
  }, [currency, upsellAddonPrice]);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }
    const timer = setTimeout(() => {
      if (timeLeft === 1) {
        setExpired(true);
      }
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleDecision = async (accepted: boolean) => {
    if (processing) return;
    setProcessing(true);
    const eventId = generateEventId(accepted ? "upsell_accept" : "upsell_skip");
    trackCommerceEvent({
      eventName: accepted ? "UpsellAccept" : "UpsellSkip",
      eventId,
      value: accepted ? upsellAddonPrice : 0,
      currency,
      ...(accepted
        ? {
            contents: [{ id: "upsell_addon", quantity: 1, item_price: upsellAddonPrice }],
            contentName: "عرض إضافي بعد الطلب",
          }
        : {}),
    });
    try {
      await applyUpsell(orderId, accepted);
      const finalEventId = generateEventId("purchase");
      await finalizeOrder(orderId, finalEventId);
      const finalTotal = accepted ? baseTotal + upsellAddonPrice : baseTotal;
      trackCommerceEvent({
        eventName: "Purchase",
        eventId: finalEventId,
        value: finalTotal,
        currency,
        contents: [
          {
            id: productSlug,
            quantity: 1,
            item_price: finalTotal,
          },
        ],
        contentName: productTitleAr,
      });
      onComplete(finalTotal);
    } catch (err) {
      console.error("Finalize error:", err);
      onComplete(baseTotal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1c2e]/90 p-4" dir="rtl">
      <div className="w-full max-w-sm space-y-5 rounded-2xl bg-white p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100">
          <span className="text-3xl">✨</span>
        </div>
        <h2 className="text-xl font-bold text-[#0f1c2e]">عرض خاص بعد الطلب</h2>
        <p className="text-sm text-[#4b5e78]">
          أضيفي منتج مكمل بسعر{" "}
          <span className="font-bold text-[#1a56db]">
            <span dir="ltr" className="tabular-nums">
              {formatMoney(upsellAddonPrice, currency, numberLocale)}
            </span>{" "}
            {currencyLabelAr}
          </span>{" "}
          فقط قبل تثبيت الطلب النهائي.
        </p>

        {!expired ? (
          <div className="text-sm text-[#4b5e78]">
            ينتهي العرض خلال{" "}
            <span className="text-lg font-bold text-[#c9a44a]">{timeLeft}</span> ثانية
          </div>
        ) : (
          <div className="text-sm text-[#4b5e78]">العرض انتهى</div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => handleDecision(true)}
            disabled={processing}
            className="h-12 w-full rounded-xl bg-[#1a56db] text-base font-bold text-white hover:bg-[#1a4a8a]"
          >
            {processing ? "جاري التأكيد..." : "نعم، أضيفيه للطلب"}
          </Button>
          <button
            onClick={() => handleDecision(false)}
            disabled={processing}
            className="w-full text-sm text-[#4b5e78] underline"
          >
            لا، كملي طلبي بدون إضافة
          </button>
        </div>
      </div>
    </div>
  );
}
