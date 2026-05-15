"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  BellRing,
  CheckCircle2,
  Headphones,
  MapPinned,
  MessageCircle,
  Package,
  PhoneForwarded,
  Sparkles,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT_CART_IMAGE } from "@/lib/content/products";

const TIMELINE = [
  {
    title: "تأكيد خلال ساعات",
    body: "نتواصل معج لتثبيت الطلب والعنوان — ردّي السريع يعني تجهيز أسرع لطلبج.",
  },
  {
    title: "تجهيز ورقابة جودة",
    body: "نراجع التفاصيل ونغلّف بعناية عشان يوصلج الطرَد كما تتوقعين من SKINKSA.",
  },
  {
    title: "شحن موثوق لباب البيت",
    body: "معظم الطلبات تصل خلال ١–٢ يوم عمل إلى باب منزلك بعد التأكيد، وقد يزيد ذلك قليلاً حسب عنوانك وضغط الشحن.",
  },
  {
    title: "استلام ودفع عند الباب",
    body: "تتفحصين الطرَد براحتج — الدفع عند الاستلام يعني ما تدفعين لين يكون بيدج.",
  },
] as const;

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <main className="relative isolate min-h-[calc(100vh-8rem)] overflow-hidden bg-[#070d16] pb-20 pt-6 text-white sm:pb-28 sm:pt-10">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(26,86,219,0.35),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-[#c9a44a]/20 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-[#1a56db]/25 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/placeholders/pattern.svg')] opacity-[0.04]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        {/* Hero success */}
        <div className="text-center">
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
            <span
              className="absolute inset-0 rounded-full bg-emerald-500/15 ring-2 ring-emerald-400/40 ring-offset-4 ring-offset-[#070d16]"
              aria-hidden
            />
            <span
              className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20 [animation-duration:2.5s]"
              aria-hidden
            />
            <CheckCircle2 className="relative z-10 h-12 w-12 text-emerald-300" strokeWidth={1.75} aria-hidden />
          </div>

          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.28em] text-amber-200/90">تم استلام طلبج</p>
          <h1 className="text-balance text-3xl font-black leading-tight sm:text-4xl md:text-[2.15rem]">
            طلبج مسجّل… وجاهزين نخلّيكِ تنتظرين الطرَد بشوق
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/75 sm:text-base">
            شكراً لثقتج في <span className="font-bold text-white">SKINKSA</span>. فريق التأكيد يتحرك الآن عشان نثبت
            التفاصيل بسرعة — لأن كل يوم تأخير في التأكيد أو العنوان يأثر على وصول الشحنة. خطوتج الجاية بسيطة،
            وبتقربج من أول استخدام للسيروم الأصلي.
          </p>
        </div>

        {orderId && (
          <div className="mt-10 rounded-3xl border border-white/15 bg-white/[0.07] p-5 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] backdrop-blur-md sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/55">مرجع الطلب</p>
                <p className="mt-1 break-all font-mono text-lg font-bold tracking-tight text-white sm:text-xl" dir="ltr">
                  {orderId}
                </p>
                <p className="mt-2 text-xs text-white/60">احفظيه — يفيدج لو تواصلين معنا بخصوص التوصيل.</p>
              </div>
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-amber-400/30 bg-white/10 shadow-lg">
                <Image
                  src={PRODUCT_CART_IMAGE}
                  alt="صورة سيروم SKINKSA"
                  fill
                  className="object-cover"
                  sizes="80px"
                  priority
                />
              </div>
            </div>
          </div>
        )}

        {!orderId && (
          <div className="mt-10 rounded-3xl border border-amber-400/25 bg-gradient-to-br from-amber-500/10 to-transparent p-5 text-center backdrop-blur-sm">
            <p className="text-sm font-semibold text-amber-100">تم تسجيل طلبج بنجاح.</p>
            <p className="mt-1 text-xs text-white/65">إذا ما ظهر رقم مرجعي بالرابط، راسلينا من صفحة التواصل مع رقم جوالج.</p>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent p-6 sm:p-8">
          <div className="mb-8 flex items-center gap-2">
            <Package className="h-5 w-5 text-amber-300" aria-hidden />
            <h2 className="text-lg font-black sm:text-xl">رحلة طلبج… من التأكيد لباب بيتج</h2>
          </div>
          <ol className="space-y-0">
            {TIMELINE.map((step, i) => (
              <li key={step.title} className="relative flex gap-4 pb-10 last:pb-0">
                {i < TIMELINE.length - 1 && (
                  <span
                    className="absolute right-[15px] top-10 bottom-0 w-px bg-gradient-to-b from-amber-400/50 to-transparent sm:right-[19px]"
                    aria-hidden
                  />
                )}
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-black text-[#0f1c2e] shadow-md ring-2 ring-amber-200/40">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <h3 className="font-bold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Confirmation + delivery: conversion helpers */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-[#1a56db]/35 bg-[#1a56db]/10 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2 text-sky-200">
              <PhoneForwarded className="h-5 w-5 shrink-0" aria-hidden />
              <h2 className="text-base font-black">أرفعي نسبة التأكيد — استجيبي بسرعة</h2>
            </div>
            <ul className="space-y-3 text-sm leading-relaxed text-white/80">
              <li className="flex gap-2">
                <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden />
                <span>
                  <strong className="text-white">خلّي جوالك جنبج.</strong> أغلب الملغيات أو التأخير تصير لما ما نقدر
                  نوصل لتأكيد خلال وقت قصير.
                </span>
              </li>
              <li className="flex gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden />
                <span>
                  لو تواصلنا واتساب أو اتصال — <strong className="text-white">ردّي برقم الطلب أو الاسم</strong> عشان
                  نكمّل فوراً.
                </span>
              </li>
              <li className="flex gap-2">
                <Headphones className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden />
                <span>
                  بعض الأرقام تظهر كـ &quot;غير معروف&quot; —{" "}
                  <strong className="text-white">من فريق الشحن أو التأكيد</strong>؛ الرد يرفع نسبة تأكيد طلبج بشكل
                  كبير.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/30 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2 text-emerald-200">
              <Truck className="h-5 w-5 shrink-0" aria-hidden />
              <h2 className="text-base font-black">توصيل أنجح — جهّزي الاستلام</h2>
            </div>
            <ul className="space-y-3 text-sm leading-relaxed text-white/80">
              <li className="flex gap-2">
                <MapPinned className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
                <span>
                  <strong className="text-white">راجعي الحي والمدينة والرمز.</strong> أي تصحيح مبكر يوفّر علينا
                  إعادة توجيه ويخلّي الشحنة توصل أسرع.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden />
                <span>
                  اكتبي <strong className="text-white">معلّم قريب</strong> أو العنوان الوطني لو عندج — السائق يوصل
                  بدقة أعلى وبأقل اتصالات.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden />
                <span>
                  خلال أيام الاستلام، <strong className="text-white">حاولي تكونين متاحة</strong> أو عيّني شخص يستلم
                  بدلج — تقليل محاولات التوصيل يعني وصول أسرع.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Excitement strip */}
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-amber-400/40 bg-gradient-to-l from-amber-500/15 via-amber-400/10 to-transparent px-6 py-8 text-center shadow-[0_20px_60px_-20px_rgba(201,164,74,0.35)]">
          <Sparkles className="h-8 w-8 text-amber-200" aria-hidden />
          <p className="max-w-lg text-balance text-base font-bold text-white sm:text-lg">
            جرّبي أول لمسة خفيفة للسيروم ولاحظي امتصاصه… روتينج الجديد يبدأ من أول أسبوع — وبانتظارج عبوة أصلية
            من <span className="text-amber-200">المصدر الرسمي</span> فقط.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            className="h-12 rounded-2xl border-0 bg-gradient-to-l from-[#1a56db] to-[#0f2d66] px-8 text-base font-black text-white shadow-[0_16px_40px_-12px_rgba(26,86,219,0.75)] hover:from-[#2563eb] hover:to-[#0f2d66]"
          >
            <Link href="/">العودة للمتجر</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-2xl border-2 border-white/25 bg-white/5 text-base font-bold text-white backdrop-blur-sm hover:bg-white/10"
          >
            <Link href="/contact">تواصل معنا لأي تعديل</Link>
          </Button>
        </div>

        <p className="mx-auto mt-8 max-w-md text-center text-[11px] leading-relaxed text-white/45">
          SKINKSA · منتج مرخّص SFDA · الدفع عند الاستلام عند التسليم. النتائج التجميلية تختلف من شخص لآخر؛ الالتزام
          بالروتين يساعد على أفضل تجربة.
        </p>
      </div>
    </main>
  );
}
