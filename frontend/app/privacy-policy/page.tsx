import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | SKINKSA",
};

export default function PrivacyPolicyPage() {
  return (
    <main dir="rtl" className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 prose prose-slate max-w-none">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">سياسة الخصوصية</h1>
        <p className="text-[#475569] text-sm mb-8">آخر تحديث: يناير 2025</p>

        <section className="space-y-6 text-[#475569] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">مقدمة</h2>
            <p>تلتزم SKINKSA بحماية خصوصيتك وبياناتك الشخصية. تشرح هذه السياسة كيفية جمع معلوماتك واستخدامها وحمايتها.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">المعلومات التي نجمعها</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>الاسم الكامل ورقم الجوال عند تقديم الطلب</li>
              <li>عنوان التوصيل</li>
              <li>بيانات الاستخدام وسجلات الزيارة</li>
              <li>معلومات الإحالة (UTM parameters، fbclid، إلخ) لتحسين تجربتك</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">كيف نستخدم معلوماتك</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>معالجة وتأكيد طلباتك</li>
              <li>التواصل معك بشأن طلبك وعملية التوصيل</li>
              <li>تحسين منتجاتنا وخدماتنا</li>
              <li>إرسال عروض ترويجية (يمكنك إلغاء الاشتراك في أي وقت)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">بكسلات التتبع والتحليلات</h2>
            <p>نستخدم بكسلات تتبع من Meta (فيسبوك/إنستقرام)، TikTok، وSnapchat لتحسين إعلاناتنا وتقديم تجربة مخصصة. يمكنك إيقاف هذا التتبع عبر إعدادات المتصفح الخاص بك.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">أمان البيانات</h2>
            <p>نحمي بياناتك بأحدث معايير التشفير. لا نبيع أو نؤجر بياناتك لأطراف ثالثة دون موافقتك.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">التواصل معنا</h2>
            <p>للاستفسار عن بياناتك أو طلب حذفها، تواصل معنا عبر: support@officialskinksa.store</p>
          </div>
        </section>
      </div>
    </main>
  );
}
