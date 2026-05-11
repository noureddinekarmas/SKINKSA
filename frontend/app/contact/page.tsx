import { MessageCircle, Mail, Phone, Clock } from "lucide-react";

export const metadata = {
  title: "تواصل معنا | SKINKSA",
  description: "تواصلي مع فريق SKINKSA عبر الواتساب أو البريد الإلكتروني.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-[#312E81]/10 to-white py-20 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-screen-xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B7791F]">تواصل معنا</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-[#0F172A]">نحن هنا لمساعدتك</h1>
          <p className="mt-3 text-[#475569] max-w-md mx-auto">فريق SKINKSA جاهز للرد على استفساراتك خلال ساعات.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-screen-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MessageCircle,
              title: "واتساب",
              value: "+966 5X XXX XXXX",
              sub: "الخيار الأسرع للرد",
              color: "#25D366",
            },
            {
              icon: Mail,
              title: "البريد الإلكتروني",
              value: "support@skinksa.store",
              sub: "نرد خلال 24 ساعة",
              color: "#312E81",
            },
            {
              icon: Phone,
              title: "الهاتف",
              value: "+966 5X XXX XXXX",
              sub: "في أوقات الدوام",
              color: "#312E81",
            },
            {
              icon: Clock,
              title: "أوقات الدعم",
              value: "الأحد – الخميس",
              sub: "٩ صباحًا – ٦ مساءً",
              color: "#B7791F",
            },
          ].map(({ icon: Icon, title, value, sub, color }) => (
            <div key={title} className="rounded-2xl border border-[#E2E8F0] p-6 flex flex-col gap-3 bg-white shadow-sm text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full mx-auto" style={{ background: `${color}15` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <p className="font-bold text-[#0F172A]">{title}</p>
              <p className="text-sm font-medium text-[#312E81] break-all">{value}</p>
              <p className="text-xs text-[#94a3b8]">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-lg">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6 text-center">أو أرسل رسالة</h2>
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">الاسم</label>
              <input
                type="text"
                className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none focus:border-[#312E81] transition"
                placeholder="اسمك الكريم"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">رقم الجوال</label>
              <input
                type="tel"
                className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none focus:border-[#312E81] transition"
                placeholder="05XXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">الرسالة</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none focus:border-[#312E81] transition resize-none"
                placeholder="كيف يمكننا مساعدتك؟"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#312E81] py-3.5 text-sm font-bold text-white hover:bg-[#3730a3] transition"
            >
              إرسال الرسالة
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
