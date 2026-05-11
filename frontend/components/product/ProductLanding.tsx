"use client";

import Image from "next/image";
import {
  Award,
  Beaker,
  CheckCircle,
  ChevronLeft,
  MapPin,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
} from "lucide-react";
import { useState } from "react";

import ProductGallery from "@/components/product/ProductGallery";
import { faqItems } from "@/lib/content/faq";
import {
  AUTHORITY_BAND,
  MECHANISM_BLOCK,
  OBJECTION_BUSTER,
  PAIN_CHECKLIST,
  PRODUCT_BENEFITS,
  PRODUCT_GALLERY,
  PRODUCT_HEADLINE,
  PRODUCT_HERO_QUOTE,
  PRODUCT_HOW_TO,
  PRODUCT_INGREDIENTS,
  PRODUCT_KICKER,
  PRODUCT_REVIEWS,
  PRODUCT_TAGLINE,
  SCIENCE_PROOF_LIST,
  SOCIAL_STRIP,
  STORY_FRAMES,
  type StoryFrame,
} from "@/lib/content/product-page";
import { STATIC_PRODUCT } from "@/lib/content/products";
import { formatSar } from "@/lib/currency";
import { useCartStore } from "@/lib/cart/store";
import { trackCommerceEvent, generateEventId } from "@/lib/tracking";

type OfferCode = "OFFER_1" | "OFFER_2" | "OFFER_3";

const offers = STATIC_PRODUCT.offers.map((o) => ({
  code: o.code as OfferCode,
  pieces: o.quantity,
  price: Number(o.price_sar),
  compare: o.compare_at_sar != null ? Number(o.compare_at_sar) : null,
  label: o.label_ar,
  badge: o.badge_ar,
}));

function defaultOfferIndex() {
  const i = STATIC_PRODUCT.offers.findIndex((o) => o.is_default);
  return i >= 0 ? i : 1;
}

/** ألوان مختلفة قليلاً حتى تبدو الدائرة أو كـ «عملاء» وليس شعاراً مكرراً */
const HERO_AVATAR_GRADIENTS = [
  "from-[#1a56db] to-[#143a8c]",
  "from-[#0d9488] to-[#0d7c57]",
  "from-[#7c2d12] to-[#b45309]",
] as const;

/** كل باقة لها لون «منتَقى» عند التحديد — يتمدّد لزر الشراء (تقوية تحويل بصرية) */
const OFFER_THEME: Record<
  OfferCode,
  {
    selected: string;
    idle: string;
    hover: string;
    badgeOn: string;
    savingsOn: string;
    accentBar: string;
    cta: string;
    ctaHover: string;
    ctaShadow: string;
    stickyHint: string;
    stickyBtn: string;
  }
> = {
  OFFER_1: {
    selected:
      "border-emerald-500 bg-gradient-to-l from-emerald-50 via-white to-white shadow-[0_12px_36px_-10px_rgba(13,148,100,0.45)] ring-2 ring-emerald-500/20",
    idle: "border-[var(--color-brand-border)] bg-white",
    hover: "hover:border-emerald-400/55 hover:bg-emerald-50/40",
    badgeOn: "border-emerald-400 bg-emerald-100 text-emerald-900",
    savingsOn: "text-emerald-800",
    accentBar: "bg-emerald-500",
    cta: "from-emerald-600 to-emerald-900",
    ctaHover: "hover:from-emerald-500 hover:to-emerald-900",
    ctaShadow: "shadow-[0_20px_44px_-14px_rgba(5,150,105,0.55)]",
    stickyHint: "text-emerald-700",
    stickyBtn: "bg-gradient-to-l from-emerald-600 to-emerald-800 shadow-[0_10px_30px_-8px_rgba(5,150,105,0.5)]",
  },
  OFFER_2: {
    selected:
      "border-[var(--color-brand-primary)] bg-gradient-to-l from-[var(--color-brand-light)] via-white to-white shadow-[0_12px_36px_-10px_rgba(26,86,219,0.4)] ring-2 ring-[var(--color-brand-primary)]/25",
    idle: "border-[var(--color-brand-border)] bg-white",
    hover: "hover:border-[var(--color-brand-primary)]/45 hover:bg-[var(--color-brand-mist)]/50",
    badgeOn: "border-[var(--color-brand-primary)]/35 bg-[var(--color-brand-light)] text-[var(--color-brand-ink)]",
    savingsOn: "text-[var(--color-brand-success)]",
    accentBar: "bg-[var(--color-brand-primary)]",
    cta: "from-[var(--color-brand-primary)] to-[#0f2d66]",
    ctaHover: "hover:from-[#2563eb] hover:to-[#0f2d66]",
    ctaShadow: "shadow-[0_20px_44px_-14px_rgba(26,86,219,0.85)]",
    stickyHint: "text-[var(--color-brand-success)]",
    stickyBtn:
      "bg-gradient-to-l from-[var(--color-brand-primary)] to-[#143a8c] shadow-[0_10px_30px_-8px_rgba(26,86,219,0.45)]",
  },
  OFFER_3: {
    selected:
      "border-[#c9a44a] bg-gradient-to-l from-amber-50 via-white to-white shadow-[0_12px_36px_-10px_rgba(201,164,74,0.42)] ring-2 ring-amber-400/35",
    idle: "border-[var(--color-brand-border)] bg-white",
    hover: "hover:border-amber-400/55 hover:bg-amber-50/50",
    badgeOn: "border-amber-400 bg-amber-100 text-amber-950",
    savingsOn: "text-amber-900",
    accentBar: "bg-[#c9a44a]",
    cta: "from-amber-600 to-amber-900",
    ctaHover: "hover:from-amber-500 hover:to-amber-900",
    ctaShadow: "shadow-[0_20px_44px_-14px_rgba(180,83,9,0.45)]",
    stickyHint: "text-amber-800",
    stickyBtn: "bg-gradient-to-l from-amber-600 to-amber-900 shadow-[0_10px_30px_-8px_rgba(180,83,9,0.45)]",
  },
};

function StoryFrameCard({ frame }: { frame: StoryFrame }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border-2 border-white bg-white shadow-[0_20px_50px_-20px_rgba(15,28,46,0.35)] ring-1 ring-[var(--color-brand-border)]">
      <div className="relative aspect-[5/4] w-full sm:aspect-[4/3]">
        <Image src={frame.src} alt={frame.alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 380px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <span className="absolute right-4 top-4 max-w-[85%] rounded-full bg-[#c9a44a] px-3 py-1.5 text-center text-[11px] font-black text-white shadow-md sm:text-xs">
          {frame.badge}
        </span>
        <p className="absolute bottom-4 right-4 left-4 text-balance text-lg font-black leading-tight text-white drop-shadow-md sm:text-xl">
          {frame.headline}
        </p>
      </div>
      <div className="flex flex-1 flex-col border-t border-[var(--color-brand-border)] bg-gradient-to-b from-white to-[var(--color-brand-mist)]/50 p-5 sm:p-6">
        <p className="text-pretty text-sm leading-relaxed text-[var(--color-brand-slate)]">{frame.body}</p>
      </div>
    </article>
  );
}

export default function ProductLanding() {
  const [selectedIdx, setSelectedIdx] = useState(defaultOfferIndex);
  const addOfferToCart = useCartStore((s) => s.addOfferToCart);
  const selected = offers[selectedIdx];
  const primaryTheme = OFFER_THEME[selected.code];

  function handleAddToCart() {
    const eventId = generateEventId("atc");
    addOfferToCart(
      {
        code: selected.code,
        quantity: selected.pieces,
        price_sar: selected.price,
        label_ar: selected.label,
      },
      {
        id: STATIC_PRODUCT.id,
        slug: STATIC_PRODUCT.slug,
        titleAr: STATIC_PRODUCT.title_ar,
      }
    );
    trackCommerceEvent({
      eventName: "AddToCart",
      eventId,
      value: selected.price,
      currency: "SAR",
      contents: [
        {
          id: STATIC_PRODUCT.slug,
          quantity: selected.pieces,
          item_price: selected.price,
        },
      ],
    });
  }

  return (
    <>
      <article className="pb-32 md:pb-0">
        {/* Top urgency — premium strip */}
        <div className="border-b border-[var(--color-brand-border)] bg-gradient-to-l from-[#1e3a5f] via-[#1a56db] to-[#2563eb] py-2.5 text-center text-white">
          <p className="px-4 text-xs font-bold sm:text-sm">
            الدفع عند الاستلام داخل السعودية · ما يحتاج كرت · توصيل لباب البيت من ٣–٥ أيام عمل
          </p>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -start-40 -top-20 h-96 w-96 rounded-full bg-[var(--color-brand-primary)]/12 blur-3xl" />
          <div className="pointer-events-none absolute -end-32 top-40 h-80 w-80 rounded-full bg-[#c9a44a]/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-screen-xl grid-cols-1 gap-10 px-4 py-8 sm:gap-14 sm:px-6 md:grid-cols-2 md:py-12 lg:gap-16">
            <div className="md:sticky md:top-28 md:self-start">
              <div className="mb-3 flex flex-wrap items-center gap-2 md:hidden">
                <span className="rounded-full bg-[var(--color-brand-success)]/15 px-2.5 py-1 text-[10px] font-bold text-[var(--color-brand-success)]">
                  عميلات من كل المناطق
                </span>
                <span className="rounded-full border border-[var(--color-brand-border)] bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[var(--color-brand-slate)]">
                  مرخّص SFDA
                </span>
              </div>
              <ProductGallery images={PRODUCT_GALLERY} />
            </div>

            <div className="flex flex-col gap-5 md:sticky md:top-28 md:self-start md:gap-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-primary)] sm:text-xs">
                  {PRODUCT_KICKER}
                </p>
                <h1 className="mt-2 text-balance text-2xl font-bold leading-snug text-[var(--color-brand-ink)] sm:text-3xl lg:text-[2.125rem]">
                  {PRODUCT_HEADLINE}
                </h1>
                <p className="mt-3 max-w-prose text-pretty text-sm font-medium leading-relaxed text-[var(--color-brand-slate)] sm:text-base">
                  {PRODUCT_TAGLINE}
                </p>

                <blockquote className="relative mt-4 overflow-hidden rounded-2xl border border-[var(--color-brand-border)] bg-gradient-to-bl from-white via-[var(--color-brand-mist)]/60 to-[var(--color-brand-mist)] px-5 py-4 shadow-sm ring-1 ring-black/[0.03] sm:px-6 sm:py-5">
                  <Quote
                    className="pointer-events-none absolute right-2 top-2 h-14 w-14 text-[var(--color-brand-primary)]/[0.12] sm:right-3 sm:top-3 sm:h-[4.5rem] sm:w-[4.5rem]"
                    aria-hidden
                  />
                  <p className="relative text-pretty text-sm font-medium leading-[1.7] text-[var(--color-brand-ink)] sm:text-base">
                    {PRODUCT_HERO_QUOTE}
                  </p>
                  <footer className="relative mt-3 flex items-center gap-2 border-t border-[var(--color-brand-border)]/80 pt-3">
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[var(--color-brand-primary)]/25 to-transparent" aria-hidden />
                    <span className="shrink-0 text-[11px] font-semibold tracking-wide text-[#c9a44a]">
                      جمالك الآن
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[var(--color-brand-primary)]/25 to-transparent" aria-hidden />
                  </footer>
                </blockquote>
              </div>

              {/* Social proof bar */}
              <div className="rounded-2xl border border-[var(--color-brand-border)] bg-white/90 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 space-x-reverse rtl:space-x-reverse">
                      {PRODUCT_REVIEWS.slice(0, 3).map((r, i) => (
                        <div
                          key={r.name}
                          title={`${r.name} — ${r.city}`}
                          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br ${HERO_AVATAR_GRADIENTS[i]} text-xs font-bold text-white shadow`}
                        >
                          {r.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="flex items-center gap-1 text-lg font-black text-[var(--color-brand-ink)]">
                        <span>{SOCIAL_STRIP.stat}</span>
                        <TrendingUp className="h-4 w-4 text-[var(--color-brand-success)]" aria-hidden />
                      </p>
                      <p className="text-xs font-semibold text-[var(--color-brand-slate)]">{SOCIAL_STRIP.statLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill="var(--color-brand-accent)" className="text-[var(--color-brand-accent)]" />
                    ))}
                  </div>
                </div>
                <p className="mt-3 border-t border-[var(--color-brand-border)] pt-3 text-xs font-semibold text-[var(--color-brand-slate)]">
                  {SOCIAL_STRIP.ratingLine}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SOCIAL_STRIP.cities.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-mist)] px-2 py-0.5 text-[11px] font-bold text-[var(--color-brand-ink)]"
                    >
                      <MapPin className="h-3 w-3 text-[var(--color-brand-primary)]" aria-hidden />
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Value props — compact strip */}
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 rounded-xl border border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/40 px-3 py-2 text-[11px] font-medium text-[var(--color-brand-slate)] sm:justify-start sm:text-xs">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Truck className="h-3.5 w-3.5 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
                  توصيل داخل المملكة · ٣–٥ أيام عمل
                </span>
                <span className="hidden text-[var(--color-brand-border)] sm:inline" aria-hidden>
                  |
                </span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
                  ضمان ٣٠ يوماً
                </span>
                <span className="hidden text-[var(--color-brand-border)] sm:inline" aria-hidden>
                  |
                </span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Award className="h-3.5 w-3.5 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
                  منتج مرخّص SFDA
                </span>
              </div>

              {/* Offers */}
              <div>
                <p className="text-sm font-semibold text-[var(--color-brand-ink)]">اختيار الكمية</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--color-brand-slate)] sm:text-xs">
                  مفعول أي روتين عناية يتوقف كثيراً على الاستمرار لعدة أسابيع. عبوتان فأكثر تقلّل فرصة توقّفك قبل أن تتكوّن النتيجة — والاختيار يظل لكِ.
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {offers.map((offer, idx) => {
                    const savings = offer.compare ? offer.compare - offer.price : 0;
                    const per = (offer.price / offer.pieces).toFixed(0);
                    const t = OFFER_THEME[offer.code];
                    const isOn = idx === selectedIdx;
                    return (
                      <button
                        key={offer.code}
                        type="button"
                        onClick={() => setSelectedIdx(idx)}
                        className={`relative flex items-center justify-between overflow-hidden rounded-2xl border-2 px-4 py-3 text-right transition duration-200 ${
                          isOn ? t.selected : `${t.idle} ${t.hover}`
                        }`}
                      >
                        <span
                          className={`pointer-events-none absolute top-3 bottom-3 right-3 w-1.5 rounded-full transition ${
                            isOn ? `${t.accentBar} opacity-100` : "bg-[var(--color-brand-border)] opacity-25"
                          }`}
                          aria-hidden
                        />
                        {offer.badge && (
                          <span
                            className={`absolute -top-2 right-4 max-w-[calc(100%-2rem)] rounded-md border px-2 py-0.5 text-[10px] font-semibold shadow-sm ${
                              isOn
                                ? t.badgeOn
                                : "border-[var(--color-brand-border)] bg-white text-[var(--color-brand-ink)]"
                            }`}
                          >
                            {offer.badge}
                          </span>
                        )}
                        <span className="flex flex-col gap-0.5 pe-6">
                          <span className="text-sm font-semibold text-[var(--color-brand-ink)]">{offer.label}</span>
                          <span className="text-[11px] text-[var(--color-brand-slate)]">
                            متوسط{" "}
                            <span dir="ltr" className="sar-glyph tabular-nums">
                              {formatSar(per)}
                            </span>{" "}
                            للعبوة ضمن الخيار
                          </span>
                          {savings > 0 && (
                            <span className={`text-[11px] font-semibold ${isOn ? t.savingsOn : "text-[var(--color-brand-success)]"}`}>
                              أقل من السعر المرجعي بمقدار{" "}
                              <span dir="ltr" className="sar-glyph tabular-nums">
                                {formatSar(savings)}
                              </span>{" "}
                              لهذا العدد
                            </span>
                          )}
                        </span>
                        <span className="flex shrink-0 flex-col items-end">
                          <span
                            dir="ltr"
                            className="sar-glyph text-xl font-bold tabular-nums text-[var(--color-brand-ink)] sm:text-2xl"
                          >
                            {formatSar(offer.price)}
                          </span>
                          {offer.compare != null && (
                            <span
                              dir="ltr"
                              className="sar-glyph text-xs tabular-nums text-[var(--color-brand-slate)] line-through"
                            >
                              {formatSar(offer.compare)}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l py-4 text-lg font-black text-white transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 ${primaryTheme.cta} ${primaryTheme.ctaShadow} ${primaryTheme.ctaHover}`}
              >
                أضيفي للسلة — الدفع عند الاستلام
                <ChevronLeft size={22} aria-hidden />
              </button>

              <p className="text-center text-[11px] leading-relaxed text-[var(--color-brand-slate)]">
                بإضافة المنتج للسلة أنتِ توافقين على{" "}
                <a
                  href="/terms-and-conditions"
                  className="font-bold text-[var(--color-brand-primary)] underline underline-offset-2"
                >
                  الشروط
                </a>
                . إذا عندج حمل أو علاج جلدي قوي، استشيري طبيبتج.
              </p>
            </div>
          </div>
        </section>

        {/* Pain — mirror */}
        <section className="border-y border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/70 py-16 sm:py-20">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--color-brand-error)]">
                نقولها صريحة
              </span>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">شفتي نفسج في هالنقاط؟</h2>
              <p className="mt-3 text-pretty text-[var(--color-brand-slate)]">
                إذا واحدة منها تطنّ في راسج… فأنتِ مو لوحدج، وهذي بالضبط الفئة اللي صممنا لها الروتين يكون أذكى مو أكثر.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {PAIN_CHECKLIST.map((p) => (
                <div
                  key={p.title}
                  className="rounded-3xl border-2 border-white bg-white p-6 shadow-md ring-1 ring-[var(--color-brand-border)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-brand-error)]/10">
                    <span className="text-lg" aria-hidden>
                      ❡
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-black text-[var(--color-brand-ink)]">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)]">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story frames — bento */}
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--color-brand-primary)]">
                صور + كلام… على مزاج التسويق اللي يبيع
              </span>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">
                نفس الرسالة بأقطار مختلفة… عشان تدخلينها من جميع الجوانب
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">{STORY_FRAMES.map((f) => <StoryFrameCard key={f.headline} frame={f} />)}</div>
          </div>
        </section>

        {/* Mechanism + science */}
        <section className="border-t border-[var(--color-brand-border)] bg-gradient-to-b from-[var(--color-brand-mist)] to-white py-16 sm:py-24">
          <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-start gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-primary)]/10 px-3 py-1 text-xs font-black text-[var(--color-brand-primary)]">
                <Beaker className="h-3.5 w-3.5" aria-hidden />
                {MECHANISM_BLOCK.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl font-black leading-snug text-[var(--color-brand-ink)] sm:text-4xl">{MECHANISM_BLOCK.title}</h2>
              {MECHANISM_BLOCK.paras.map((para) => (
                <p key={para.slice(0, 24)} className="mt-4 text-pretty leading-relaxed text-[var(--color-brand-slate)]">
                  {para}
                </p>
              ))}
              <div className="mt-8 rounded-3xl border-2 border-[var(--color-brand-accent)]/35 bg-gradient-to-br from-white to-[#fffbeb] p-6 shadow-inner">
                <p className="text-lg font-black text-[var(--color-brand-ink)]">{MECHANISM_BLOCK.calloutTitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)]">{MECHANISM_BLOCK.calloutBody}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-[var(--color-brand-border)] bg-white p-6 shadow-lg">
                <h3 className="flex items-center gap-2 text-lg font-black text-[var(--color-brand-ink)]">
                  <Sparkles className="h-5 w-5 text-[var(--color-brand-accent)]" aria-hidden />
                  نقاط «إثبات» سريعة (مو تطبيل)
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {SCIENCE_PROOF_LIST.map((line) => (
                    <li key={line} className="flex gap-3 text-sm font-semibold text-[var(--color-brand-ink)]">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-success)]" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-[var(--color-brand-border)] shadow-md">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={PRODUCT_GALLERY[3].src}
                    alt={PRODUCT_GALLERY[3].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 520px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c2e]/80 to-transparent" />
                  <p className="absolute bottom-5 right-5 left-5 text-balance text-lg font-black text-white">
                    العلم يرتّب «ليش»… والضمان يرتّب «وش لو»
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits checklist */}
        <section className="border-t border-[var(--color-brand-border)] bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">وش يتغيّر في حياتج اليومية؟</h2>
              <p className="mt-3 text-pretty text-[var(--color-brand-slate)]">
                مو كلام فخم… كل نقطة تحسّين إحساس حقيقي لما الروتين يثبت.
              </p>
              <ul className="mt-8 flex flex-col gap-4">
                {PRODUCT_BENEFITS.map((b) => (
                  <li key={b} className="flex gap-3 text-sm font-bold text-[var(--color-brand-ink)]">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-success)]/15">
                      <CheckCircle size={14} className="text-[var(--color-brand-success)]" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl ring-2 ring-[var(--color-brand-primary)]/20">
                <Image
                  src={PRODUCT_GALLERY[2].src}
                  alt={PRODUCT_GALLERY[2].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute start-4 top-4 rounded-2xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-brand-primary)]">تحسّس فوري</p>
                  <p className="text-sm font-black text-[var(--color-brand-ink)]">نعومة… بدون «زيط»</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ingredients spotlight */}
        <section className="border-t border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/40 py-16 sm:py-24">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--color-brand-accent)]">
                مكوّنات تحت الضوء
              </span>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">تعرفين وش يدخل على بشرتج… ومو بس اسم لامع</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PRODUCT_INGREDIENTS.map((ing) => (
                <div
                  key={ing.name}
                  className="relative overflow-hidden rounded-3xl border border-[var(--color-brand-border)] bg-white p-6 shadow-lg"
                >
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-brand-primary)]">{ing.hook}</span>
                  <h3 className="mt-2 text-lg font-black text-[var(--color-brand-ink)]">{ing.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)]">{ing.desc}</p>
                  <p className="mt-4 rounded-xl bg-[var(--color-brand-mist)] px-3 py-2 text-xs font-bold text-[var(--color-brand-ink)]">
                    ✓ {ing.microProof}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Authority */}
        <section className="border-t border-[var(--color-brand-border)] bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">{AUTHORITY_BAND.title}</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {AUTHORITY_BAND.points.map((p) => (
                <div key={p.t} className="rounded-3xl border-2 border-[var(--color-brand-border)] bg-gradient-to-b from-white to-[var(--color-brand-mist)]/30 p-6 text-center shadow-sm">
                  <p className="text-xl font-black text-[var(--color-brand-primary)]">{p.t}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)]">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to */}
        <section className="border-t border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/30 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--color-brand-accent)]">٣ خطوات بس</span>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">خلّي الروتين «خفيف» عشان يثبت</h2>
            </div>
            <div className="mt-12 flex flex-col gap-6 md:flex-row md:gap-4">
              {PRODUCT_HOW_TO.map((step) => (
                <div key={step.step} className="relative flex flex-1 flex-col rounded-3xl border border-[var(--color-brand-border)] bg-white p-6 shadow-md">
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand-primary)] text-lg font-black text-white shadow-lg">
                    {step.step}
                  </span>
                  <p className="text-lg font-black text-[var(--color-brand-ink)]">{step.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-slate)]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="border-t border-[var(--color-brand-border)] bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--color-brand-accent)]">شهادات من السعودية</span>
              <h2 className="mt-3 text-3xl font-black text-[var(--color-brand-ink)] sm:text-4xl">كلام بنات… مو إعلان مسجّل</h2>
              <p className="mt-3 text-sm text-[var(--color-brand-slate)]">
                نخلي النبرة واقعية لأن المصداقية أغلى من أي فلتر.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCT_REVIEWS.map((r) => (
                <figure
                  key={r.name}
                  className="flex h-full flex-col rounded-[1.75rem] border border-[var(--color-brand-border)] bg-gradient-to-b from-white to-[var(--color-brand-mist)]/20 p-5 shadow-md"
                >
                  <Quote className="h-6 w-6 text-[var(--color-brand-primary)]/30" aria-hidden />
                  <div className="mt-3 flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={13} fill="var(--color-brand-accent)" className="text-[var(--color-brand-accent)]" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm font-bold leading-relaxed text-[var(--color-brand-ink)]">
                    &ldquo;{r.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--color-brand-border)] pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/12 text-sm font-black text-[var(--color-brand-primary)]">
                      {r.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-[var(--color-brand-ink)]">{r.name}</p>
                      <p className="text-xs text-[var(--color-brand-slate)]">
                        {r.city} · <span className="text-[var(--color-brand-success)]">{r.tag}</span>
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-10 text-center text-[11px] text-[var(--color-brand-slate)]">
              النتائج تختلف؛ الوصف تجميلي وليس تشخيصاً طبياً.
            </p>
          </div>
        </section>

        {/* Objection buster */}
        <section className="border-t border-[var(--color-brand-border)] bg-[#0f1c2e] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-black sm:text-3xl">{OBJECTION_BUSTER.title}</h2>
            <ul className="mt-8 flex flex-col gap-4 text-right">
              {OBJECTION_BUSTER.lines.map((line) => (
                <li
                  key={line}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold leading-relaxed text-white/95"
                >
                  {line}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-black text-[#0f1c2e] shadow-xl transition hover:bg-[var(--color-brand-mist)]"
            >
              جرّبي بدون ضغط — اطلبي بالسلة
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-[var(--color-brand-border)] bg-[var(--color-brand-mist)]/20 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-black text-[var(--color-brand-ink)]">أسئلة تكرّر… وإجاباتنا جاهزة</h2>
            <div className="mt-8 flex flex-col gap-3">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-[var(--color-brand-border)] bg-white p-5 shadow-sm open:ring-2 open:ring-[var(--color-brand-primary)]/15"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-[var(--color-brand-ink)]">
                    {item.question}
                    <ChevronLeft className="h-5 w-5 shrink-0 text-[var(--color-brand-primary)] transition group-open:-rotate-90" aria-hidden />
                  </summary>
                  <p className="mt-4 border-t border-[var(--color-brand-border)] pt-4 text-sm leading-relaxed text-[var(--color-brand-slate)]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </article>

      {/* Mobile sticky */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-[var(--color-brand-border)] bg-white/95 px-4 py-3 shadow-[0_-16px_48px_rgba(15,28,46,0.18)] backdrop-blur-lg md:hidden">
        <div className="min-w-0 flex-1">
          <p className={`text-[10px] font-black ${primaryTheme.stickyHint}`}>الدفع عند الاستلام</p>
          <p className="truncate text-lg font-black text-[var(--color-brand-ink)]">
            <span dir="ltr" className="sar-glyph tabular-nums">
              {formatSar(selected.price)}
            </span>
          </p>
          <p className="truncate text-[10px] text-[var(--color-brand-slate)]">{selected.label}</p>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className={`shrink-0 rounded-xl px-5 py-3.5 text-sm font-black text-white ${primaryTheme.stickyBtn}`}
        >
          إضافة للسلة
        </button>
      </div>
    </>
  );
}
