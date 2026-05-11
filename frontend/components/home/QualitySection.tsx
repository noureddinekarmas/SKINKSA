import { Award, FlaskConical, Leaf, ShieldAlert } from "lucide-react";

const qualities = [
  {
    icon: ShieldAlert,
    title: "مرخص من SFDA",
    description: "جميع منتجاتنا مسجلة ومعتمدة من الهيئة العامة للغذاء والدواء لضمان الأمان التام.",
  },
  {
    icon: Award,
    title: "ضمان ذهبي 30 يوماً",
    description: "ثقتنا بمنتجاتنا تجعلنا نقدم ضمان الاسترداد الفوري إذا لم تشعري بالرضا التام عن النتائج.",
  },
  {
    icon: FlaskConical,
    title: "تركيبة علمية",
    description: "تركيزات مدروسة من ببتيد النحاس والمكونات النشطة لضمان أفضل نتيجة حقيقية.",
  },
  {
    icon: Leaf,
    title: "مكونات لطيفة",
    description: "خالٍ من المواد القاسية، مصمم ليناسب حتى البشرة الحساسة في أجواء السعودية.",
  },
];

export default function QualitySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-bold uppercase tracking-widest text-[#1a56db] bg-blue-50 px-3 py-1 rounded-full">الجودة والثقة</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1c2e] mt-4">نحترم بشرتك ونقدر ثقتك</h2>
          <p className="text-[#4b5e78] mt-4 text-lg">أعلى معايير الجودة العالمية لحمايتك ورعايتك</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {qualities.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-5 p-8 rounded-3xl border border-[#d5e3f0] hover:border-[#1a56db]/30 hover:shadow-xl transition-all bg-white group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#f0f7ff] group-hover:bg-blue-50 flex items-center justify-center flex-shrink-0 transition-colors">
                <Icon className="w-7 h-7 text-[#1a56db]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f1c2e] text-xl mb-2">{title}</h3>
                <p className="text-[#4b5e78] text-base leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
