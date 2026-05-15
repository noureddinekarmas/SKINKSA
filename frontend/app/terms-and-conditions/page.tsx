import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام | SKINKSA",
};

export default function TermsPage() {
  return (
    <main dir="rtl" className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">الشروط والأحكام</h1>
        <p className="text-[#475569] text-sm mb-8">آخر تحديث: يناير 2025</p>

        <div className="space-y-8 text-[#475569] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">القبول بالشروط</h2>
            <p>باستخدامك موقع SKINKSA أو تقديم طلب، فإنك توافق على هذه الشروط والأحكام. يُرجى قراءتها بعناية.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">نطاق الخدمة</h2>
            <p>
              تقدم SKINKSA منتجات العناية بالبشرة للمستهلكين ضمن المناطق التي نخدمها وتشحن إليها. مدى التوصيل وسرعته
              يختلف حسب عنوان الطلب وشركاء الشحن المعتمدين عندك.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">الطلبات والدفع</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>جميع الطلبات تتم بنظام الدفع عند الاستلام (COD)</li>
              <li>لا يُقبل الإلغاء بعد بدء عملية الشحن</li>
              <li>الأسعار المعروضة شاملة للضريبة</li>
              <li>نحتفظ بالحق في رفض أي طلب بموجب سياستنا الداخلية</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">المنتجات والوصف</h2>
            <p>نسعى لتقديم معلومات دقيقة عن منتجاتنا. نتائج استخدام المنتج قد تختلف من شخص لآخر. المنتجات ليست دواءً ولا تُغني عن استشارة الطبيب.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">الملكية الفكرية</h2>
            <p>جميع محتويات الموقع، بما فيها النصوص والصور والعلامات التجارية، هي ملك حصري لـ SKINKSA ومحمية بموجب قوانين الملكية الفكرية.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">تعديل الشروط</h2>
            <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر التحديثات على هذه الصفحة.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
