"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShieldCheck, Truck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Success card */}
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#E2E8F0] space-y-5">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-[#15803D]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">شكراً لك! 🎉</h1>
          <p className="text-[#475569]">
            تم استلام طلبك بنجاح. سيتواصل معك فريقنا لتأكيد التفاصيل قريباً.
          </p>
          {orderId && (
            <div className="bg-[#F8FAFC] rounded-xl p-4">
              <p className="text-[#475569] text-sm">رقم الطلب</p>
              <p className="font-bold text-[#312E81] text-lg font-mono">{orderId}</p>
            </div>
          )}
        </div>

        {/* What happens next */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] space-y-4">
          <h2 className="font-bold text-[#0F172A] text-lg">ماذا يحدث بعد ذلك؟</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#B7791F] flex-shrink-0 mt-0.5" />
              <p className="text-[#475569] text-sm">سيتصل بك أحد موظفينا خلال 24 ساعة لتأكيد طلبك وعنوان التوصيل</p>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <p className="text-[#475569] text-sm">يتم شحن الطلب خلال 1-2 أيام عمل ويصل خلال 3-5 أيام</p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#15803D] flex-shrink-0 mt-0.5" />
              <p className="text-[#475569] text-sm">تدفعين عند استلام الطلب فقط. لا دفع مسبق مطلوب</p>
            </div>
          </div>
        </div>

        <Link href="/" className="block">
          <Button className="w-full bg-[#312E81] hover:bg-indigo-800 text-white h-12 rounded-xl font-bold">
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </main>
  );
}
