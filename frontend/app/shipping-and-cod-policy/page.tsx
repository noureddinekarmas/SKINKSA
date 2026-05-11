import type { Metadata } from "next";
import { ShieldCheck, Truck, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "سياسة الشحن والدفع عند الاستلام | SKINKSA",
};

export default function ShippingPage() {
  return (
    <main dir="rtl" className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">سياسة الشحن والدفع عند الاستلام</h1>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <ShieldCheck className="w-8 h-8 text-[#15803D] mx-auto mb-2" />
            <p className="font-bold text-[#15803D]">دفع عند الاستلام</p>
            <p className="text-xs text-[#475569] mt-1">لا دفع مسبق مطلوب</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <Truck className="w-8 h-8 text-[#2563EB] mx-auto mb-2" />
            <p className="font-bold text-[#2563EB]">شحن مجاني</p>
            <p className="text-xs text-[#475569] mt-1">داخل المملكة العربية السعودية</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <Clock className="w-8 h-8 text-[#B7791F] mx-auto mb-2" />
            <p className="font-bold text-[#B7791F]">3-5 أيام عمل</p>
            <p className="text-xs text-[#475569] mt-1">وقت التوصيل المتوقع</p>
          </div>
        </div>

        <div className="space-y-8 text-[#475569] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">نظام الدفع عند الاستلام (COD)</h2>
            <p>نؤمن بأن الثقة هي أساس علاقتنا معك. لذلك نعتمد نظام الدفع عند الاستلام حصرياً - تستلمين منتجك أولاً ثم تدفعين.</p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>لا يُطلب منك أي دفع مسبق</li>
              <li>ادفعي نقداً لمندوب التوصيل عند استلام طلبك</li>
              <li>لا تحتاجين لبطاقة ائتمان أو حساب مصرفي</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">التوصيل داخل المملكة</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>التوصيل مجاني لجميع مناطق المملكة العربية السعودية</li>
              <li>يُشحن الطلب خلال 1-2 يوم عمل من تأكيده</li>
              <li>يصل الطلب خلال 3-5 أيام عمل</li>
              <li>ستحصلين على رقم تتبع عبر الرسائل النصية أو واتساب</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">تأكيد الطلب</h2>
            <p>بعد تقديم طلبك، سيتواصل معك فريقنا خلال 24 ساعة للتأكيد وتحديد تفاصيل التوصيل.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">ملاحظة مهمة</h2>
            <p>في حالة عدم التواجد لاستلام الطلب، سيحاول المندوب التوصيل مرة أخرى. يُرجى التواصل مع فريق الدعم في حالة وجود أي مشكلة في التوصيل.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
