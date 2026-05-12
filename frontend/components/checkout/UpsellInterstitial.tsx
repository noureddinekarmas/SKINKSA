"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { applyUpsell, finalizeOrder } from "@/lib/api/orders";
import { STATIC_PRODUCT } from "@/lib/content/products";
import { trackCommerceEvent, generateEventId } from "@/lib/tracking";
import { formatSar } from "@/lib/currency";

interface Props {
  orderId: string;
  orderNumber: string;
  baseTotal: number;
  onComplete: (finalTotal: number) => void;
}

export default function UpsellInterstitial({ orderId, baseTotal, onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(12);
  const [processing, setProcessing] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const eventId = generateEventId("upsell_view");
    trackCommerceEvent({
      eventName: "UpsellView",
      eventId,
      value: 99,
      currency: "SAR",
      contents: [{ id: "upsell_addon", quantity: 1, item_price: 99 }],
      contentName: "عرض إضافي بعد الطلب",
    });
  }, []);

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
      value: accepted ? 99 : 0,
      currency: "SAR",
      ...(accepted
        ? {
            contents: [{ id: "upsell_addon", quantity: 1, item_price: 99 }],
            contentName: "عرض إضافي بعد الطلب",
          }
        : {}),
    });
    try {
      await applyUpsell(orderId, accepted);
      const finalEventId = generateEventId("purchase");
      await finalizeOrder(orderId, finalEventId);
      const finalTotal = accepted ? baseTotal + 99 : baseTotal;
      trackCommerceEvent({
        eventName: "Purchase",
        eventId: finalEventId,
        value: finalTotal,
        currency: "SAR",
        contents: [
          {
            id: STATIC_PRODUCT.slug,
            quantity: 1,
            item_price: finalTotal,
          },
        ],
        contentName: STATIC_PRODUCT.title_ar,
      });
      onComplete(finalTotal);
    } catch (err) {
      console.error("Finalize error:", err);
      onComplete(baseTotal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f1c2e]/90 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-5">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">✨</span>
        </div>
        <h2 className="text-xl font-bold text-[#0f1c2e]">عرض خاص بعد الطلب</h2>
        <p className="text-[#4b5e78] text-sm">
          أضيفي منتج مكمل بسعر{" "}
          <span className="font-bold text-[#1a56db]">
            <span dir="ltr" className="sar-glyph tabular-nums">
              {formatSar(99)}
            </span>
          </span>{" "}
          فقط قبل تثبيت الطلب النهائي.

        {!expired ? (
          <div className="text-[#4b5e78] text-sm">
            ينتهي العرض خلال{" "}
            <span className="font-bold text-[#c9a44a] text-lg">{timeLeft}</span> ثانية
          </div>
        ) : (
          <div className="text-[#4b5e78] text-sm">العرض انتهى</div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => handleDecision(true)}
            disabled={processing}
            className="w-full bg-[#1a56db] hover:bg-[#1a4a8a] text-white h-12 font-bold text-base rounded-xl"
          >
            {processing ? "جاري التأكيد..." : "نعم، أضيفيه للطلب"}
          </Button>
          <button
            onClick={() => handleDecision(false)}
            disabled={processing}
            className="w-full text-[#4b5e78] text-sm underline"
          >
            لا، كملي طلبي بدون إضافة
          </button>
        </div>
      </div>
    </div>
  );
}
