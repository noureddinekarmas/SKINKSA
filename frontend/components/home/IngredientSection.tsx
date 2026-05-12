import Image from "next/image";
import { Droplets, Sparkles, FlaskConical } from "lucide-react";
import { HOME_IMAGES } from "@/lib/content/home-images";

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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1524] via-[#0f1c2e] to-[#142a42] py-20 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(26,86,219,0.2),transparent_50%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border border-[var(--color-brand-accent)]/40 bg-[var(--color-brand-accent)]/15 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[var(--color-brand-accent)]">
            التركيبة الفاخرة
          </span>
          <h2 className="mt-5 text-3xl font-black md:text-4xl">مكونات تحبها بشرتك وتعيد لها الحياة</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/75">
            لم نعتمد على الوعود الفارغة، بل اخترنا أقوى المكونات المدعومة علمياً لإعادة الحيوية لوجهك من الأعماق.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.name}
              className="group rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-lg backdrop-blur-sm transition-colors hover:border-[var(--color-brand-accent)]/35 hover:bg-white/[0.09]"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-brand-accent)]/20 transition-colors group-hover:bg-[var(--color-brand-accent)]/30">
                <ingredient.icon className="h-8 w-8 text-[var(--color-brand-accent)]" />
              </div>
              <h3 className="text-xl font-bold text-white">{ingredient.name}</h3>
              <p className="mt-1 font-mono text-sm tracking-wider text-white/40">{ingredient.nameEn}</p>
              <p className="mt-3 text-base leading-relaxed text-white/80">{ingredient.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="flex max-w-3xl flex-col items-center gap-6 rounded-3xl border border-[var(--color-brand-accent)]/35 bg-gradient-to-br from-white/[0.08] to-transparent p-8 shadow-[0_0_60px_-12px_rgba(201,164,74,0.25)] backdrop-blur-md md:flex-row md:text-right">
            <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/5 md:h-36 md:w-44">
              <Image
                src={HOME_IMAGES.ingredientSfda}
                alt="جودة وسيروم SKINKSA"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 176px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xl font-black text-[var(--color-brand-accent)]">مرخص وآمن 100%</h4>
              <p className="mt-2 text-base leading-relaxed text-white/80">
                تركيبتنا ليست مجرد كلمات، بل هي نتائج مختبرة ومعتمدة من الهيئة العامة للغذاء والدواء (SFDA)، لتضعيها على
                بشرتك وأنتِ في قمة الاطمئنان.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
