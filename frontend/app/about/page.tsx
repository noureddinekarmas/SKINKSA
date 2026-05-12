import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { STATIC_PRODUCT } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "عن SKINKSA | عناية فاخرة بالبشرة",
  description: "تعرفي على قصة SKINKSA وفلسفتنا في العناية بالبشرة السعودية",
};

export default function AboutPage() {
  return (
    <main dir="rtl">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#312E81] to-indigo-700 text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">عن SKINKSA</h1>
          <p className="text-white/80 text-xl leading-relaxed">
            علامة تجارية سعودية مولودة من شغف حقيقي بالعناية بالبشرة
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <h2 className="text-3xl font-bold text-[#0F172A]">قصتنا</h2>
            <p className="text-[#475569] leading-relaxed">
              بدأت SKINKSA من سؤال بسيط: لماذا لا توجد منتجات عناية بالبشرة مصممة فعلاً للمرأة السعودية؟ منتجات تراعي مناخنا الحار، وتفهم احتياجات بشرتنا، وتكون في متناول الجميع.
            </p>
            <p className="text-[#475569] leading-relaxed">
              من هذا الشغف وُلدت SKINKSA. علامة تجارية تجمع بين العلم الحديث والفهم العميق لاحتياجات المرأة السعودية. كل منتج نطلقه مصمم بعناية، ومختبر بدقة، لأننا نؤمن أن بشرتك تستحق الأفضل.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-72 h-72 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl flex items-center justify-center">
              <Image
                src="/placeholders/lifestyle-vanity.svg"
                alt="SKINKSA"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">فلسفتنا</h2>
          <p className="text-[#475569] text-lg leading-relaxed max-w-2xl mx-auto">
            نؤمن أن العناية الحقيقية تبدأ بالعلم. نختار كل مكون بناءً على الأدلة العلمية، ونصنع تركيباتنا بأعلى معايير الجودة.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            {[
              { title: "علم حقيقي", desc: "مكونات مدروسة ومختبرة" },
              { title: "شفافية تامة", desc: "قائمة مكونات واضحة بدون إخفاء" },
              { title: "جودة لا تُقايَض", desc: "معايير إنتاج لا نتهاون فيها" },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
                <h3 className="font-bold text-[#312E81] text-xl mb-2">{title}</h3>
                <p className="text-[#475569] text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#312E81] text-white text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-5">
          <h2 className="text-3xl font-bold">جربي SKINKSA اليوم</h2>
          <p className="text-white/80">الدفع عند الاستلام · لا مخاطرة · توصيل سريع</p>
          <Link href={`/products/${STATIC_PRODUCT.slug}`}>
            <Button size="lg" className="bg-[#B7791F] hover:bg-amber-700 text-white h-12 px-8 font-bold rounded-xl">
              اطلبي الآن
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
