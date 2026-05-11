import { X, CheckCircle2 } from "lucide-react";

const painPoints = [
  "بشرة متعبة وباهتة وتفتقد للحيوية",
  "خطوط دقيقة تظهر وتجعلك تبدين أكبر سناً",
  "جفاف يزعجك ولا يستجيب للمرطبات العادية",
  "تجارب محبطة مع منتجات غالية بلا أي نتيجة",
];

const solutions = [
  "تركيبة علمية فعّالة توقظ بشرتك من الداخل",
  "دعم مرونة البشرة لتستعيدي شبابك وثقتك",
  "ترطيب مكثف يروي البشرة ويمتص في ثوانٍ",
  "نتائج حقيقية مضمونة (أو تستردين مبلغك)",
];

export default function PainSolutionSection() {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-bold uppercase tracking-widest text-[#B91C1C] bg-red-100 px-3 py-1 rounded-full">الواقع الذي تعيشينه</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mt-4">هل تشعرين أن وجهك يظهر عليه التعب دائمًا؟</h2>
          <p className="text-[#475569] mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            الضغوط اليومية في السعودية، والمنتجات التجارية المقلدة تسلب بشرتك نضارتها. أنتِ لستِ وحدك في هذا الإحباط.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Pain */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-red-100 flex flex-col justify-center">
            <div className="mb-6 border-b border-red-50 pb-4">
              <h3 className="font-bold text-[#B91C1C] text-xl">المشكلة التي نعاني منها جميعاً</h3>
            </div>
            <div className="space-y-5">
              {painPoints.map((point) => (
                <div key={point} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-[#B91C1C]" />
                  </div>
                  <span className="text-[#475569] text-base leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className="bg-gradient-to-br from-[#f0fdf4] to-white rounded-3xl p-8 shadow-lg border border-green-100 flex flex-col justify-center transform md:-translate-y-4">
            <div className="mb-6 border-b border-green-100 pb-4">
              <h3 className="font-bold text-[#15803D] text-xl">حل SKINKSA الموثوق</h3>
            </div>
            <div className="space-y-5">
              {solutions.map((solution) => (
                <div key={solution} className="flex items-start gap-4">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-6 h-6 text-[#15803D]" />
                  </div>
                  <span className="text-[#0F172A] text-base font-semibold leading-relaxed">{solution}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
