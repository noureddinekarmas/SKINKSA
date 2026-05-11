import { Suspense } from "react";
import ThankYouContent from "./ThankYouContent";

export const metadata = {
  title: "تم تأكيد طلبك | SKINKSA",
  description: "تم استلام طلبك بنجاح من SKINKSA",
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
