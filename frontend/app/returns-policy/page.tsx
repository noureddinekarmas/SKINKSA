import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الإرجاع | SKINKSA",
};

export default function ReturnsPage() {
  return (
    <main dir="rtl" className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">سياسة الإرجاع والاستبدال</h1>
        <p className="text-[#475569] text-sm mb-8">آخر تحديث: يناير 2025</p>

        <div className="space-y-8 text-[#475569] leading-relaxed">
          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
            <h2 className="text-lg font-bold text-[#15803D] mb-2">التزامنا بجودتك</h2>
            <p>رضاك عن منتجاتنا أولويتنا. إذا لم تكوني راضية عن جودة المنتج، تواصلي معنا وسنجد الحل المناسب.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">حالات قبول الإرجاع</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>المنتج وصل تالفاً أو مكسوراً</li>
              <li>المنتج المستلم مختلف عما تم طلبه</li>
              <li>المنتج يعاني من عيب تصنيعي واضح</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">شروط الإرجاع</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>يجب الإبلاغ عن المشكلة خلال 48 ساعة من الاستلام</li>
              <li>يجب أن يكون المنتج في حالته الأصلية وغير مستخدم (في حالة عيب التصنيع)</li>
              <li>يجب إرفاق صور توضح المشكلة</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">إجراءات الإرجاع</h2>
            <div className="space-y-3">
              {[
                "تواصلي معنا عبر واتساب أو البريد الإلكتروني خلال 48 ساعة",
                "أرسلي صور للمنتج مع وصف للمشكلة",
                "سيراجع فريقنا طلبك ويرد خلال 24 ساعة",
                "في حالة القبول، سيتم ترتيب الاستلام أو الاستبدال",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#312E81] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">ملاحظة</h2>
            <p>نظراً لطبيعة منتجات العناية بالبشرة وضمان سلامة جميع العملاء، لا يُقبل الإرجاع بسبب عدم الرغبة في المنتج بعد فتحه.</p>
          </div>

          <div className="bg-[#F8FAFC] rounded-xl p-5">
            <p className="font-medium text-[#0F172A]">للتواصل معنا:</p>
            <p className="text-[#475569] text-sm mt-1">واتساب أو البريد: support@officialskinksa.store</p>
          </div>
        </div>
      </div>
    </main>
  );
}
