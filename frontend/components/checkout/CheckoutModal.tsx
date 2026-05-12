"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isValidSaudiMobile } from "@/lib/phone";
import { createDraftOrder } from "@/lib/api/orders";
import { formatSar } from "@/lib/currency";
import { trackCommerceEvent, generateEventId, getAttributionFromStorage } from "@/lib/tracking";
import { useState, useEffect } from "react";
import UpsellInterstitial from "./UpsellInterstitial";
import { ShieldCheck, Truck, Lock, User, Phone, MapPin, Map, ChevronLeft } from "lucide-react";

const schema = z.object({
  customer_name: z.string().min(2, "اكتبي الاسم الكامل"),
  customer_phone: z
    .string()
    .refine(isValidSaudiMobile, "اكتبي رقم جوال سعودي صحيح مثل 05XXXXXXXX"),
  customer_province: z.string().min(2, "اختاري المنطقة"),
  customer_address: z.string().min(5, "اكتبي اسم المدينة والحي أو الشارع"),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, items, cartTotal, clearCart } = useCartStore();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!isCheckoutOpen) return;
    const eventId = generateEventId("initiate_checkout");
    const state = useCartStore.getState();
    trackCommerceEvent({
      eventName: "InitiateCheckout",
      eventId,
      value: state.cartTotal(),
      currency: "SAR",
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

    try {
      const result = await createDraftOrder({
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_province: data.customer_province,
        customer_address: data.customer_address,
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
        currency: "SAR",
        contents: items.map((item) => ({
          id: item.slug,
          quantity: item.quantity,
          item_price: item.unitPrice,
        })),
        contentName: items[0]?.titleAr,
      });
      setOrderId(result.id);
      setOrderNumber(result.order_number);
      setOrderTotal(result.total_sar);
      setShowUpsell(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ، حاولي مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  if (showUpsell && orderId) {
    return (
      <UpsellInterstitial
        orderId={orderId}
        orderNumber={orderNumber!}
        baseTotal={orderTotal}
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
      <DialogContent className="sm:max-w-md bg-[#f0f7ff] p-0 overflow-hidden border-0 shadow-2xl" dir="rtl">
        
        {/* HEADER / TRUST SECTION */}
        <div className="bg-gradient-to-l from-[#1e3a5f] to-[#1a3d6d] px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">خطوة أخيرة لتأكيد طلبك</h2>
            <Lock className="w-5 h-5 text-blue-200" />
          </div>
          
          <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between backdrop-blur-sm border border-white/20">
            <div className="flex flex-col">
              <span className="text-xs text-blue-200">الإجمالي المطلوب</span>
              <span className="text-2xl font-black">
                <span dir="ltr" className="sar-glyph tabular-nums">
                  {formatSar(cartTotal())}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-500/20 text-green-100 px-3 py-1.5 rounded-lg border border-green-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-bold">الدفع عند الاستلام</span>
            </div>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="px-6 py-5">
          <div className="text-center mb-5">
            <p className="text-[#4b5e78] text-sm font-medium">
              يرجى إدخال بياناتك بدقة لتسريع عملية التوصيل المجاني إلى باب بيتك.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* NAME */}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#94a3b8]">
                <User size={18} />
              </div>
              <input
                {...register("customer_name")}
                type="text"
                placeholder="الاسم الكامل (مثال: نورة محمد)"
                className={`w-full bg-white border ${errors.customer_name ? 'border-red-400 focus:ring-red-400' : 'border-[#cbd5e1] focus:ring-[#1a56db]'} text-[#0f1c2e] text-sm rounded-xl block pr-10 p-3.5 focus:outline-none focus:ring-2 transition-shadow shadow-sm`}
                dir="rtl"
              />
              {errors.customer_name && (
                <p className="text-[#dc2626] text-xs mt-1.5 px-1 font-medium">{errors.customer_name.message}</p>
              )}
            </div>

            {/* PHONE */}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#94a3b8]">
                <Phone size={18} />
              </div>
              <input
                {...register("customer_phone")}
                type="tel"
                placeholder="رقم الجوال (05XXXXXXXX)"
                className={`w-full bg-white border ${errors.customer_phone ? 'border-red-400 focus:ring-red-400' : 'border-[#cbd5e1] focus:ring-[#1a56db]'} text-[#0f1c2e] text-sm rounded-xl block pr-10 p-3.5 focus:outline-none focus:ring-2 transition-shadow shadow-sm text-right placeholder:text-right`}
                dir="ltr"
              />
              {errors.customer_phone && (
                <p className="text-[#dc2626] text-xs mt-1.5 px-1 font-medium">{errors.customer_phone.message}</p>
              )}
            </div>

            {/* PROVINCE */}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#94a3b8]">
                <Map size={18} />
              </div>
              <select
                {...register("customer_province")}
                className={`w-full bg-white border ${errors.customer_province ? 'border-red-400 focus:ring-red-400' : 'border-[#cbd5e1] focus:ring-[#1a56db]'} text-[#0f1c2e] text-sm rounded-xl block pr-10 p-3.5 focus:outline-none focus:ring-2 transition-shadow shadow-sm appearance-none cursor-pointer`}
                dir="rtl"
              >
                <option value="" disabled hidden>المنطقة / المحافظة</option>
                <option value="الرياض">الرياض</option>
                <option value="مكة المكرمة">مكة المكرمة</option>
                <option value="المدينة المنورة">المدينة المنورة</option>
                <option value="المنطقة الشرقية">المنطقة الشرقية</option>
                <option value="القصيم">القصيم</option>
                <option value="عسير">عسير</option>
                <option value="تبوك">تبوك</option>
                <option value="حائل">حائل</option>
                <option value="الحدود الشمالية">الحدود الشمالية</option>
                <option value="جازان">جازان</option>
                <option value="نجران">نجران</option>
                <option value="الباحة">الباحة</option>
                <option value="الجوف">الجوف</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#94a3b8]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              {errors.customer_province && (
                <p className="text-[#dc2626] text-xs mt-1.5 px-1 font-medium">{errors.customer_province.message}</p>
              )}
            </div>

            {/* ADDRESS */}
            <div className="relative">
              <div className="absolute top-3.5 right-0 flex items-center pr-3 pointer-events-none text-[#94a3b8]">
                <MapPin size={18} />
              </div>
              <textarea
                {...register("customer_address")}
                placeholder="المدينة والحي (أو العنوان الوطني) لتسهيل وصول المندوب"
                rows={2}
                className={`w-full bg-white border ${errors.customer_address ? 'border-red-400 focus:ring-red-400' : 'border-[#cbd5e1] focus:ring-[#1a56db]'} text-[#0f1c2e] text-sm rounded-xl block pr-10 p-3.5 focus:outline-none focus:ring-2 transition-shadow shadow-sm resize-none`}
                dir="rtl"
              />
              {errors.customer_address && (
                <p className="text-[#dc2626] text-xs mt-1.5 px-1 font-medium">{errors.customer_address.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-[#dc2626] text-sm p-3 rounded-xl flex items-center gap-2">
                <span className="font-bold">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-l from-[#c9a44a] to-[#d4a843] hover:from-[#d4a843] hover:to-[#c9a44a] text-white h-14 font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(201,164,74,0.3)] transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  "جاري تأكيد الطلب..."
                ) : (
                  <>
                    <span>أكدي الطلب الآن</span>
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>

            {/* FOOTER TRUST BADGES */}
            <div className="flex items-center justify-center gap-4 pt-3 pb-1">
              <div className="flex items-center gap-1.5 text-[#64748b] text-xs font-medium">
                <Truck className="w-3.5 h-3.5" />
                <span>توصيل سريع</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[#cbd5e1]"></div>
              <div className="flex items-center gap-1.5 text-[#64748b] text-xs font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>بياناتك مشفرة وآمنة</span>
              </div>
            </div>

          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
