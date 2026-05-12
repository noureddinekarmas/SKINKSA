import Image from "next/image";
import { Star, CheckCircle } from "lucide-react";
import { reviews } from "@/lib/content/reviews";
import { HOME_IMAGES } from "@/lib/content/home-images";

export default function SocialProofSection() {
  return (
    <section className="py-20 bg-[var(--color-brand-mist)]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center md:mb-14">
          <span className="inline-block rounded-full border border-[var(--color-brand-primary)]/25 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[var(--color-brand-primary)]">
            آراء عميلاتنا
          </span>
          <h2 className="mt-5 text-3xl font-black text-[var(--color-brand-ink)] md:text-4xl">قصص نجاح من بنات السعودية</h2>
          <p className="mt-4 text-lg text-[var(--color-brand-slate)]">تجارب حقيقية تثبت الفعالية… انضمي إليهن الآن</p>
        </div>

        <div className="relative mb-12 overflow-hidden rounded-3xl border-2 border-[var(--color-brand-border)] shadow-lg">
          <div className="relative aspect-[21/9] min-h-[140px] w-full md:aspect-[24/9]">
            <Image
              src={HOME_IMAGES.storySocial}
              alt="لمسة عناية ناعمة"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1152px"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c2e]/55 via-transparent to-transparent" aria-hidden />
          <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-bold text-white md:text-base">
            دايم يسألون عن «الفرق»… والجواب يبان مع الالتزام والراحة من المصدر الرسمي
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="space-y-5 rounded-3xl border border-[var(--color-brand-border)] bg-white p-8 shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="flex items-start justify-between border-b border-[var(--color-brand-border)] pb-4">
                <div>
                  <div className="mb-2 flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < review.rating ? "fill-[var(--color-brand-accent)] text-[var(--color-brand-accent)]" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-brand-success)]">
                    <CheckCircle className="h-4 w-4" />
                    مشتري موثق
                  </div>
                </div>
              </div>
              <p className="text-base font-medium leading-relaxed text-[var(--color-brand-ink)]">&quot;{review.text}&quot;</p>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-blue)] shadow-sm">
                  <span className="text-lg font-bold text-white">{review.name[0]}</span>
                </div>
                <div>
                  <p className="text-base font-bold text-[var(--color-brand-ink)]">{review.name}</p>
                  <p className="text-sm text-[var(--color-brand-slate)]">من {review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <div className="inline-flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-[var(--color-brand-border)] bg-white px-8 py-5 shadow-md sm:flex-row">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-6 w-6 fill-[var(--color-brand-accent)] text-[var(--color-brand-accent)]" />
              ))}
            </div>
            <div className="hidden h-8 w-px bg-[var(--color-brand-border)] sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[var(--color-brand-ink)]">4.9/5</span>
              <span className="text-base font-semibold text-[var(--color-brand-slate)]">التقييم العام من +1000 عميلة</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
