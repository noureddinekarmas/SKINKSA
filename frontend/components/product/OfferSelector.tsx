"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Offer } from "@/lib/api/products";
import { useCartStore } from "@/lib/cart/store";
import { formatSar } from "@/lib/currency";
import { trackCommerceEvent, generateEventId } from "@/lib/tracking";

interface Props {
  offers: Offer[];
  productId: string;
  productTitleAr: string;
  productSlug: string;
}

export default function OfferSelector({ offers, productId, productTitleAr, productSlug }: Props) {
  const defaultOffer = offers.find((o) => o.is_default) || offers[1] || offers[0];
  const [selectedCode, setSelectedCode] = useState(defaultOffer?.code || "OFFER_2");
  const { addOfferToCart } = useCartStore();

  const selectedOffer = offers.find((o) => o.code === selectedCode) || offers[0];

  const handleAddToCart = () => {
    if (!selectedOffer) return;
    const eventId = generateEventId("atc");
    addOfferToCart(
      {
        code: selectedOffer.code as "OFFER_1" | "OFFER_2" | "OFFER_3",
        quantity: selectedOffer.quantity,
        price_sar: Number(selectedOffer.price_sar),
        label_ar: selectedOffer.label_ar,
      },
      { id: productId, slug: productSlug, titleAr: productTitleAr }
    );
    trackCommerceEvent({
      eventName: "AddToCart",
      eventId,
      value: Number(selectedOffer.price_sar),
      currency: "SAR",
      contents: [
        {
          id: productSlug,
          quantity: selectedOffer.quantity,
          item_price: Number(selectedOffer.price_sar),
        },
      ],
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {offers.map((offer) => {
          const isSelected = selectedCode === offer.code;
          const perPiece = (Number(offer.price_sar) / offer.quantity).toFixed(1);
          const saving = offer.compare_at_sar
            ? Number(offer.compare_at_sar) - Number(offer.price_sar)
            : null;
          return (
            <button
              key={offer.code}
              onClick={() => setSelectedCode(offer.code)}
              className={`relative p-4 rounded-xl border-2 text-right transition-all ${
                isSelected
                  ? "border-[#312E81] bg-indigo-50"
                  : "border-[#E2E8F0] bg-white hover:border-indigo-300"
              }`}
            >
              {offer.badge_ar && (
                <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-[#B7791F] text-white">
                  {offer.badge_ar}
                </span>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-[#0F172A]">{offer.label_ar}</span>
                  <p className="text-xs text-[#475569] mt-0.5">
                    <span dir="ltr" className="sar-glyph tabular-nums">
                      {formatSar(perPiece)}
                    </span>{" "}
                    / العبوة
                  </p>
                  {saving && (
                    <p className="text-xs text-[#15803D] mt-0.5">
                      وفر{" "}
                      <span dir="ltr" className="sar-glyph tabular-nums">
                        {formatSar(saving)}
                      </span>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#312E81]">
                    <span dir="ltr" className="sar-glyph tabular-nums">
                      {formatSar(Number(offer.price_sar))}
                    </span>
                  </span>
                  {offer.compare_at_sar && (
                    <p className="text-xs text-[#475569] line-through">
                      <span dir="ltr" className="sar-glyph tabular-nums">
                        {formatSar(Number(offer.compare_at_sar))}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <Button
        onClick={handleAddToCart}
        className="w-full bg-[#312E81] hover:bg-indigo-800 text-white h-14 text-lg font-bold rounded-xl"
      >
        اختاري باقتك الآن
      </Button>
    </div>
  );
}
