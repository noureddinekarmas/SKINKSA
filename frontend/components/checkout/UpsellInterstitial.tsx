"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { applyUpsell, finalizeOrder } from "@/lib/api/orders";
import type { ShopCurrency, UpsellBundleConfig } from "@/lib/content/product-landing-data";
import { formatMoney } from "@/lib/currency";
import { trackCommerceEvent, generateEventId } from "@/lib/tracking";

function formatArDigits(n: number): string {
  return n.toLocaleString("ar-SA-u-nu-arab", { maximumFractionDigits: 0 });
}

interface Props {
  orderId: string;
  baseTotal: number;
  currency: ShopCurrency;
  currencyLabelAr: string;
  numberLocale: string;
  upsellAddonPrice: number;
  upsellCompareAtPrice: number;
  upsellBundle: UpsellBundleConfig;
  /** Bottles in the cart for the main offer (before upsell) */
  primaryOrderQuantity: number;
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
  upsellCompareAtPrice,
  upsellBundle,
  primaryOrderQuantity,
  productSlug,
  productTitleAr,
  onComplete,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(12);
  const [processing, setProcessing] = useState(false);
  const [expired, setExpired] = useState(false);

  const addonQty = upsellBundle.addonBottleQty;
  const totalIfAccepted = primaryOrderQuantity + addonQty;
  const totalMlIfAccepted = totalIfAccepted * 30;

  useEffect(() => {
    const eventId = generateEventId("upsell_view");
    trackCommerceEvent({
      eventName: "UpsellView",
      eventId,
      value: upsellAddonPrice,
      currency,
      contents: [{ id: "upsell_addon", quantity: addonQty, item_price: upsellAddonPrice }],
      contentName: "عرض إضافي بعد الطلب",
    });
  }, [addonQty, currency, upsellAddonPrice]);

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
            contents: [{ id: "upsell_addon", quantity: addonQty, item_price: upsellAddonPrice }],
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

  const fmt = (v: number) => formatMoney(v, currency, numberLocale);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1c2e]/90 p-4" dir="rtl">
      <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 text-center shadow-2xl">
        <div className="flex justify-center gap-1 text-3xl" aria-hidden>
          <span>✨</span>
          <span>🎁</span>
          <span>💎</span>
          <span>📦</span>
        </div>
        <h2 className="text-lg font-bold leading-snug text-[#0f1c2e]">{upsellBundle.headlineAr}</h2>
        <p className="text-sm font-medium text-[#4b5e78]">{upsellBundle.hookLineAr}</p>

        <div className="rounded-xl border-2 border-[#1a56db]/20 bg-gradient-to-br from-[#f0f7ff] to-white p-4 text-right shadow-sm">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-[#1a56db]">
            📋 كميتك بالضبط
          </p>
          <ul className="space-y-2 text-sm text-[#334155]">
            <li className="flex flex-wrap items-baseline justify-between gap-1">
              <span>طلبك الحالي</span>
              <span className="font-bold text-[#0f1c2e]" dir="ltr">
                {formatArDigits(primaryOrderQuantity)}{" "}
                {primaryOrderQuantity === 1 ? "عبوة" : "عبوات"}
              </span>
            </li>
            <li className="flex flex-wrap items-baseline justify-between gap-1 border-t border-[#cbd5e1]/80 pt-2">
              <span className="flex items-center gap-1">
                <span>مع العرض 🔥</span>
              </span>
              <span className="font-bold text-[#0f1c2e]" dir="ltr">
                +{formatArDigits(addonQty)} {addonQty === 1 ? "عبوة" : "عبوات"} ({upsellBundle.bottleLabelAr})
              </span>
            </li>
            <li className="flex flex-wrap items-baseline justify-between gap-1 border-t-2 border-dashed border-[#c9a44a]/50 pt-2">
              <span className="font-bold text-[#0f1c2e]">✅ إجمالي عبواتك عند الموافقة</span>
              <span className="text-base font-black text-[#1a56db]" dir="ltr">
                {formatArDigits(totalIfAccepted)} عبوات
              </span>
            </li>
            <li className="text-center text-xs text-[#64748b]">
              🧴 ≈ {formatArDigits(totalMlIfAccepted)} مل سيروم فقط لهذا الطلب
            </li>
          </ul>
        </div>

        <div className="rounded-xl bg-[#fffbeb] px-4 py-3 text-center">
          <p className="mb-1 text-xs font-bold text-[#92400e]">💰 سعر العرض (إضافة واحدة على الطلب)</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-[#64748b] line-through" dir="ltr">
              {fmt(upsellCompareAtPrice)} {currencyLabelAr}
            </span>
            <span className="text-2xl font-black text-[#0f1c2e]" dir="ltr">
              {fmt(upsellAddonPrice)} {currencyLabelAr}
            </span>
          </div>
        </div>

        {!expired ? (
          <div className="text-sm text-[#4b5e78]">
            ⏱️ ينتهي العرض خلال{" "}
            <span className="text-lg font-bold text-[#c9a44a]">{formatArDigits(timeLeft)}</span> ثانية
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
            {processing ? "جاري التأكيد..." : "✅ نعم — أضيفي العبوة للطلب"}
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
