"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart/store";
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
            <SheetTitle className="text-xl font-bold text-[#0F172A]">سلتك جاهزة</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {items.length === 0 ? (
              <p className="text-[#475569] text-center py-8">سلتك فارغة</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#0F172A] text-sm line-clamp-2">{item.titleAr}</p>
                    <p className="text-[#475569] text-xs mt-1">
                      {item.offerCode} · {item.quantity} عبوة
                    </p>
                    <p className="text-[#312E81] font-bold mt-1">{item.totalPrice} ر.س</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#475569] hover:text-red-500 text-xs"
                  >
                    حذف
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-[#E2E8F0] pt-4 space-y-4">
              <div className="flex items-center gap-2 text-[#15803D] text-sm">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>الدفع عند الاستلام داخل السعودية</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-[#475569]">الإجمالي</span>
                <span className="text-xl font-bold text-[#0F172A]">{total} ر.س</span>
              </div>
              <Button
                onClick={() => {
                  closeDrawer();
                  openCheckout();
                }}
                className="w-full bg-[#312E81] hover:bg-indigo-800 text-white h-12 text-base font-bold rounded-xl"
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
