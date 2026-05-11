"use client";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart/store";
import { formatSar } from "@/lib/currency";
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
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-[#f0f7ff] rounded-xl">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeDrawer}
                    className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center"
                  >
                    <span className="text-2xl">✨</span>
                  </Link>
                  <div className="flex-1">
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
                      <span dir="ltr" className="sar-glyph tabular-nums">
                        {formatSar(item.totalPrice)}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#4b5e78] hover:text-red-500 text-xs"
                  >
                    حذف
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-[#d5e3f0] pt-4 space-y-4">
              <div className="flex items-center gap-2 text-[#0d9464] text-sm">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>الدفع عند الاستلام داخل السعودية</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-[#4b5e78]">الإجمالي</span>
                <span className="text-xl font-bold text-[#0f1c2e]">
                  <span dir="ltr" className="sar-glyph tabular-nums">
                    {formatSar(total)}
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
