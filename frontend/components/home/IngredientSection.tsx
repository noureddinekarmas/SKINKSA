import Image from "next/image";
import { Droplets, Sparkles, FlaskConical } from "lucide-react";

const ingredients = [
  {
    name: "ببتيد النحاس الأزرق",
    nameEn: "Blue Copper Peptide (GHK-Cu)",
    description: "سر الشباب الدائم.. يعيد لبشرتك مرونتها ويحارب علامات التعب المزعجة لتستعيدي ثقتك بمظهرك.",
    icon: FlaskConical,
  },
  {
    name: "حمض الهيالورونيك",
    nameEn: "Hyaluronic Acid",
    description: "المغناطيس المائي.. يروي عطش بشرتك الجافة ويملأ الخطوط الرفيعة بإشراقة فورية ونضارة تدوم.",
    icon: Droplets,
  },
  {
    name: "خلاصة النضارة الفائقة",
    nameEn: "Brightening Complex",
    description: "مزيج طبيعي يمحو البهتان ويمنح وجهك توهجاً طبيعياً لتتألقي في كل مناسباتك.",
    icon: Sparkles,
  },
];

export default function IngredientSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0f2744] to-[#0f1c2e] text-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-bold uppercase tracking-widest text-[#c9a44a] bg-[#c9a44a]/20 px-3 py-1 rounded-full">التركيبة الفاخرة</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-5">مكونات تحبها بشرتك وتعيد لها الحياة</h2>
          <p className="text-white/80 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            لم نعتمد على الوعود الفارغة، بل اخترنا أقوى المكونات المدعومة علمياً لإعادة الحيوية لوجهك من الأعماق.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.name}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-4 hover:bg-white/10 transition-colors shadow-lg hover:shadow-2xl"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#c9a44a]/20 flex items-center justify-center mb-4">
                <ingredient.icon className="w-8 h-8 text-[#e8c65a]" />
              </div>
              <h3 className="font-bold text-white text-xl">{ingredient.name}</h3>
              <p className="text-white/40 text-sm font-mono tracking-wider">{ingredient.nameEn}</p>
              <p className="text-white/80 text-base leading-relaxed">{ingredient.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="bg-white/5 border border-[#c9a44a]/30 rounded-3xl p-8 max-w-2xl text-center shadow-[0_0_40px_rgba(201,164,74,0.15)] flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/3">
              <Image
                src="/images/product/bottle-aloe.png"
                alt="مكون ببتيد النحاس الأزرق"
                width={150}
                height={150}
                className="mx-auto drop-shadow-lg"
              />
            </div>
            <div className="w-full md:w-2/3 text-right">
              <h4 className="text-xl font-bold text-[#e8c65a] mb-2">مرخص وآمن 100%</h4>
              <p className="text-white/80 text-base leading-relaxed">
                تركيبتنا ليست مجرد كلمات، بل هي نتائج مختبرة ومعتمدة من الهيئة العامة للغذاء والدواء (SFDA)، لتضعيها على بشرتك وأنتِ في قمة الاطمئنان.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
