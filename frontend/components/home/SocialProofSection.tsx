import { Star, CheckCircle } from "lucide-react";
import { reviews } from "@/lib/content/reviews";

export default function SocialProofSection() {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-bold uppercase tracking-widest text-[#B7791F] bg-amber-100 px-3 py-1 rounded-full">آراء عميلاتنا</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mt-5">قصص نجاح من بنات السعودية</h2>
          <p className="text-[#475569] mt-4 text-lg">تجارب حقيقية تثبت الفعالية.. انضمي إليهن الآن</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-3xl p-8 shadow-md border border-[#E2E8F0] space-y-5 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start border-b border-[#E2E8F0] pb-4">
                <div>
                  <div className="flex mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#15803D] font-bold">
                    <CheckCircle className="w-4 h-4" />
                    مشتري موثق
                  </div>
                </div>
              </div>
              <p className="text-[#0F172A] font-medium text-base leading-relaxed">&quot;{review.text}&quot;</p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#312E81] to-indigo-500 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-lg">{review.name[0]}</span>
                </div>
                <div>
                  <p className="font-bold text-[#0F172A] text-base">{review.name}</p>
                  <p className="text-[#475569] text-sm">من {review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 bg-white px-8 py-5 rounded-3xl shadow-md border border-[#E2E8F0]">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="hidden sm:block w-px h-8 bg-[#E2E8F0]"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#0F172A] font-black text-xl">4.9/5</span>
              <span className="text-[#475569] text-base font-medium">التقييم العام من +1000 عميلة</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
