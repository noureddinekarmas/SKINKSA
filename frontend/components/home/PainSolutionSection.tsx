import Image from "next/image";
import { X, CheckCircle2 } from "lucide-react";
import { HOME_IMAGES } from "@/lib/content/home-images";

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
    <section className="py-20 bg-[var(--color-brand-mist)]">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center md:mb-14">
          <span className="inline-block rounded-full border border-[var(--color-brand-error)]/25 bg-red-50 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[var(--color-brand-error)]">
            الواقع الذي تعيشينه
          </span>
          <h2 className="mt-4 text-3xl font-black text-[var(--color-brand-ink)] md:text-4xl">
            هل تشعرين أن وجهك يظهر عليه التعب دائمًا؟
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-brand-slate)]">
            الضغوط اليومية والهواء الجاف، والمنتجات التجارية المقلدة تسلب بشرتك نضارتها. أنتِ لستِ وحدك في هذا الإحباط.
          </p>
        </div>

        <div className="relative mx-auto mb-12 max-w-3xl overflow-hidden rounded-3xl border-2 border-[var(--color-brand-border)] shadow-xl">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={HOME_IMAGES.storyPain}
              alt="روتين عناية ببشرة منتعشة"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0f1c2e]/85 to-transparent px-4 py-5 text-center">
            <p className="text-sm font-bold text-white">روتين خفيف اليوم… بشرة أهدأ بكرة</p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center rounded-3xl border border-red-100 bg-white p-8 shadow-sm">
            <div className="mb-6 border-b border-red-50 pb-4">
              <h3 className="text-xl font-black text-[var(--color-brand-error)]">المشكلة التي نعاني منها جميعاً</h3>
            </div>
            <div className="space-y-5">
              {painPoints.map((point) => (
                <div key={point} className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50">
                    <X className="h-4 w-4 text-[var(--color-brand-error)]" />
                  </div>
                  <span className="text-base leading-relaxed text-[var(--color-brand-slate)]">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/90 to-white p-8 shadow-lg md:-translate-y-2">
            <div className="mb-6 border-b border-emerald-100 pb-4">
              <h3 className="text-xl font-black text-[var(--color-brand-success)]">حل SKINKSA الموثوق</h3>
            </div>
            <div className="space-y-5">
              {solutions.map((solution) => (
                <div key={solution} className="flex items-start gap-4">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[var(--color-brand-success)]" />
                  <span className="text-base font-semibold leading-relaxed text-[var(--color-brand-ink)]">{solution}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
