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
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-mist)] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[var(--color-brand-primary)]">
            الجودة والثقة
          </span>
          <h2 className="mt-4 text-3xl font-black text-[var(--color-brand-ink)] md:text-4xl">نحترم بشرتك ونقدر ثقتك</h2>
          <p className="mt-4 text-lg text-[var(--color-brand-slate)]">أعلى معايير الجودة لحمايتك ورعايتك</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {qualities.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex gap-5 rounded-3xl border border-[var(--color-brand-border)] bg-white p-8 transition-all hover:border-[var(--color-brand-primary)]/35 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-brand-mist)] transition-colors group-hover:bg-[var(--color-brand-light)]">
                <Icon className="h-7 w-7 text-[var(--color-brand-primary)]" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-black text-[var(--color-brand-ink)]">{title}</h3>
                <p className="text-base leading-relaxed text-[var(--color-brand-slate)]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
