"use client";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart/store";
import { PRODUCT_CART_IMAGE } from "@/lib/content/products";
import { formatMoney } from "@/lib/currency";
import { ShieldCheck } from "lucide-react";
import CheckoutModal from "@/components/checkout/CheckoutModal";

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, cartTotal, removeItem, openCheckout } = useCartStore();
  const total = cartTotal();

  return (
    <>
      <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-white" dir="rtl">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-[#0f1c2e]">سلتك جاهزة</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {items.length === 0 ? (
              <p className="text-[#4b5e78] text-center py-8">سلتك فارغة</p>
            ) : (
              items.map((item) => {
                const thumbSrc =
                  item.image && item.image !== "/placeholders/serum-bottle.svg"
                    ? item.image
                    : PRODUCT_CART_IMAGE;
                const ccy = item.currency ?? "SAR";
                const loc = ccy === "SAR" ? "en-SA" : ccy === "QAR" ? "en-QA" : "en-KW";
                const label = ccy === "SAR" ? "ر.س" : ccy === "QAR" ? "ر.ق" : "د.ك";
                return (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-[#f0f7ff] rounded-xl">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeDrawer}
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#d5e3f0] bg-white"
                  >
                    <Image
                      src={thumbSrc}
                      alt={item.titleAr}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeDrawer}
                      className="font-semibold text-[#0f1c2e] text-sm line-clamp-2 hover:text-[#1a56db] transition-colors"
                    >
                      {item.titleAr}
                    </Link>
                    <p className="text-[#4b5e78] text-xs mt-1">
                      {item.offerCode} · {item.quantity} عبوة
                    </p>
                    <p className="text-[#1a56db] font-bold mt-1">
                      <span dir="ltr" className="tabular-nums">
                        {formatMoney(item.totalPrice, ccy, loc)}
                      </span>{" "}
                      <span className="text-sm font-bold">{label}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#4b5e78] hover:text-red-500 text-xs"
                  >
                    حذف
                  </button>
                </div>
              );
              })
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-[#d5e3f0] space-y-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-[#0d9464]">
                <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                <span>الدفع عند الاستلام عند التسليم</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-[#4b5e78]">الإجمالي</span>
                <span className="text-xl font-bold text-[#0f1c2e]">
                  <span dir="ltr" className="tabular-nums">
                    {formatMoney(
                      total,
                      items[0]?.currency ?? "SAR",
                      items[0]?.currency === "SAR"
                        ? "en-SA"
                        : items[0]?.currency === "QAR"
                          ? "en-QA"
                          : "en-KW"
                    )}
                  </span>{" "}
                  <span className="text-base font-bold">
                    {items[0]?.currency === "SAR" ? "ر.س" : items[0]?.currency === "QAR" ? "ر.ق" : "د.ك"}
                  </span>
                </span>
              </div>
              <Button
                onClick={() => {
                  closeDrawer();
                  openCheckout();
                }}
                className="w-full bg-[#1a56db] hover:bg-[#1a4a8a] text-white h-12 text-base font-bold rounded-xl"
              >
                تأكيد الطلب الآن
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <CheckoutModal />
    </>
  );
}
