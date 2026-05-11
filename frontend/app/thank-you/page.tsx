import { Suspense } from "react";
import ThankYouContent from "./ThankYouContent";

export const metadata = {
  title: "شكراً لكِ — طلبج مسجّل | SKINKSA",
  description:
    "تم استلام طلبك. تابعي خطوات التأكيد والتوصيل لضمان وصول أسرع لسيروم SKINKSA الأصلي مع الدفع عند الاستلام.",
};

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-[#475569]">جاري التحميل...</p>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
