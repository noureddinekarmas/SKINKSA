"use client";

import { useCartStore } from "@/lib/cart/store";

import { CheckoutFormFlow } from "./CheckoutFormFlow";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout } = useCartStore();

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={(open) => !open && closeCheckout()}>
      <DialogContent className="sm:max-w-md overflow-hidden border-0 bg-[#f0f7ff] p-0 shadow-2xl" dir="rtl">
        <CheckoutFormFlow mode="modal" modalOpen={isCheckoutOpen} onRequestClose={closeCheckout} />
      </DialogContent>
    </Dialog>
  );
}
