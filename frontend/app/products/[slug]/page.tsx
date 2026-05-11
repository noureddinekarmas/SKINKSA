"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ShieldCheck, Truck, MessageCircle, FlaskConical, Droplets, Sparkles, ChevronLeft, CheckCircle, ShieldAlert } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";
import { faqItems } from "@/lib/content/faq";

const GALLERY_IMAGES = [
  { src: "/images/product/hero-flowers.png", alt: "سيروم ببتيد النحاس الأزرق مع الزهور" },
  { src: "/images/product/bottle-plain.png", alt: "زجاجة سيروم ببتيد النحاس الأزرق" },
  { src: "/images/product/woman-using.png", alt: "طريقة استخدام السيروم" },
  { src: "/images/product/bottle-aloe.png", alt: "سيروم ببتيد النحاس مع الألوفيرا" },
];

const OFFERS = [
  { pieces: 1, price: 129, compare: null, label: "كورس النضارة الفورية (عبوة واحدة)", badge: null, code: "OFFER_1" as const },
  { pieces: 2, price: 159, compare: 258, label: "كورس التجديد المتكامل (عبوتين)", badge: "النتيجة المضمونة", code: "OFFER_2" as const },
  { pieces: 3, price: 199, compare: 387, label: "كورس شباب البشرة (٣ عبوات)", badge: "أعلى توفير", code: "OFFER_3" as const },
];

const PRODUCT_ID = "blue-copper-peptide-serum";
const PRODUCT_TITLE_AR = "سيروم ببتيد النحاس الأزرق لشد البشرة وتجديدها – 30 مل";

const benefits = [
  "يدعم مظهر الشد والمرونة لتبدين أصغر سناً",
  "يعزز مظهر النضارة والإشراق ويخفي بهتان الوجه",
  "ترطيب مكثّف يريح البشرة من الجفاف المزعج",
  "يُمتص بسرعة – لا يترك أثراً دهنياً، مثالي قبل المكياج",
  "تركيبة خفيفة تلائم طبيعة الأجواء في السعودية",
];

const howToUse = [
  { step: "١", title: "نظّفي بشرتك بلطف", desc: "اغسلي وجهك بغسولك المعتاد لتهيئته لاستقبال الفوائد." },
  { step: "٢", title: "وزعي قطرات السيروم", desc: "ضعي 2–3 قطرات على بشرتك الرطبة ووزعيها بحركات مساج خفيفة." },
  { step: "٣", title: "احبسي الترطيب", desc: "ضعي مرطبك المفضل فوقه، ولا تنسي واقي الشمس في الصباح لحماية مضاعفة." },
];

const ingredients = [
  { icon: FlaskConical, name: "ببتيد النحاس الأزرق (GHK-Cu)", desc: "سر الشباب الدائم.. يعيد لبشرتك مرونتها ويحارب علامات التعب المزعجة لتستعيدي ثقتك بمظهرك." },
  { icon: Droplets, name: "حمض الهيالورونيك", desc: "المغناطيس المائي.. يروي عطش بشرتك الجافة ويملأ الخطوط الرفيعة بإشراقة فورية." },
  { icon: Sparkles, name: "مستخلص الإضاءة والنضارة", desc: "يمنح وجهك توهجاً طبيعياً لتتخلصي من البهتان وتتألقي في كل مناسباتك." },
];

const reviews = [
  { name: "سارة م.", city: "الرياض", rating: 5, text: "وجهي كان دايماً باين تعبان ومرهق، من أول أسبوعين لاحظت فرق خيالي، بشرتي مشدودة ومنورة. والأحلى الدفع عند الاستلام ريحني من الخوف." },
  { name: "نورة ع.", city: "جدة", rating: 5, text: "تعبت من المنتجات اللي بدون فايدة، بس هذا السيروم صدق غير! أحس بشرتي رجع لها شبابها، يستاهل كل ريال." },
  { name: "مريم ك.", city: "الدمام", rating: 5, text: "الضمان الذهبي شجعني أجرب، وما ندمت أبد. الملمس خفيف ومريح جداً، وتوصيلهم سريع!" },
];

export default function ProductPage() {
  const [selectedIdx, setSelectedIdx] = useState(1); // default: 2pc offer
  const addOfferToCart = useCartStore((s) => s.addOfferToCart);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const selectedOffer = OFFERS[selectedIdx];

  function handleAddToCart() {
    addOfferToCart(
      {
        code: selectedOffer.code,
        quantity: selectedOffer.pieces,
        price_sar: selectedOffer.price,
        label_ar: selectedOffer.label,
      },
      { id: PRODUCT_ID, slug: "blue-copper-peptide-serum", titleAr: PRODUCT_TITLE_AR }
    );
    openDrawer();
  }

  const [activeImg, setActiveImg] = useState(0);

  return (
    <>
      {/* ── PRODUCT HERO ── */}
      <section className="py-6 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-screen-xl grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Image Gallery */}
          <div className="flex flex-col gap-4 sticky top-20">
            {/* Urgency Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-4 text-white shadow-[0_4px_20px_rgba(220,38,38,0.3)] text-center">
              <p className="font-black text-lg md:text-xl">⚠️ الكمية الحالية توشك على النفاذ!</p>
              <p className="text-sm md:text-base mt-1 opacity-90 font-medium">اطلبي الآن قبل نفاذ المخزون - <span className="underline decoration-2 underline-offset-4">الدفع عند الاستلام</span></p>
            </div>

            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#f0f7ff] border border-[#d5e3f0] shadow-lg">
              <Image
                src={GALLERY_IMAGES[activeImg].src}
                alt={GALLERY_IMAGES[activeImg].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={img.src}
                  onClick={() => setActiveImg(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImg
                      ? "border-[#1a56db] shadow-md ring-2 ring-[#1a56db]/20"
                      : "border-[#d5e3f0] hover:border-[#1a56db]/40"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5 sticky top-20">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill="#c9a44a" className="text-[#c9a44a]" />)}
                </div>
                <span className="text-xs text-[#4b5e78] font-medium">+1000 عميلة سعيدة</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0f1c2e] leading-snug">
                سيروم ببتيد النحاس الأزرق
              </h1>
              <p className="text-sm text-[#4b5e78] mt-2 leading-relaxed">ودعي مظهر البشرة المتعبة. السيروم العلمي الفاخر لشد البشرة وتجديدها، مصمم خصيصاً ليمنحك إشراقة استثنائية ونضارة تدوم.</p>
            </div>

            {/* Trust Badges */}
            <div className="bg-[#f0f7ff] rounded-xl p-3 flex flex-col gap-2 border border-[#d5e3f0]">
              <div className="flex items-center gap-2 text-sm text-[#0d9464] font-bold">
                <CheckCircle size={16} />
                <span>مكونات آمنة ومختبرة</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#0f1c2e] font-semibold">
                <ShieldCheck size={16} className="text-[#c9a44a]"/>
                <span>ضمان ذهبي 30 يوماً - استرداد فوري إن لم تلاحظي الفرق</span>
              </div>
            </div>

            {/* Offer selector */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-sm font-semibold text-[#0f1c2e]">اختاري العرض المناسب لكِ</p>
              {OFFERS.map((offer, idx) => {
                const savings = offer.compare ? offer.compare - offer.price : 0;
                return (
                  <button
                    key={offer.code}
                    onClick={() => setSelectedIdx(idx)}
                    className={`relative flex items-center justify-between rounded-xl border-2 px-4 py-3 text-right transition ${
                      idx === selectedIdx
                        ? "border-[#1a56db] bg-[#eff6ff] shadow-md"
                        : "border-[#d5e3f0] bg-white hover:border-[#1a56db]/40"
                    }`}
                  >
                    {offer.badge && (
                      <span className="absolute -top-2.5 right-3 rounded-full bg-[#c9a44a] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        {offer.badge}
                      </span>
                    )}
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-[#0f1c2e]">{offer.label}</span>
                      {savings > 0 && (
                        <span className="text-xs text-[#0d9464] font-semibold">وفرتي {savings} ريال</span>
                      )}
                    </span>
                    <span className="flex items-end gap-1.5">
                      <span className="text-xl font-bold text-[#0f1c2e]">{offer.price}</span>
                      <span className="text-sm text-[#4b5e78] mb-0.5">ريال</span>
                      {offer.compare && (
                        <span className="text-sm text-[#94a3b8] line-through mb-0.5">{offer.compare}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#1a56db] to-[#1e4fba] py-4 text-lg font-bold text-white hover:shadow-xl transition-all shadow-lg transform hover:-translate-y-0.5 mt-2"
            >
              اطلبي الآن وادفعي عند الاستلام
              <ChevronLeft size={20} />
            </button>

            {/* Delivery Reassurance */}
            <div className="flex flex-col gap-2 bg-[#f0f7ff] border border-[#d5e3f0] p-4 rounded-xl">
               <div className="flex items-center gap-2 text-[#0f1c2e] font-semibold text-sm">
                 <Truck size={18} className="text-[#1a56db]" />
                 <span>توصيل سريع ومضمون في جميع أنحاء المملكة</span>
               </div>
               <p className="text-xs text-[#4b5e78] mr-7 leading-relaxed">
                 نؤكد طلبك خلال 24 ساعة، وتصلك شحنتك بسلام من 3-5 أيام عمل. لا تدفعي شيئاً حتى تستلمي طلبك بيدك!
               </p>
            </div>
            
            {/* Authority */}
            <div className="flex flex-wrap gap-3 mt-2 justify-center border-t border-[#d5e3f0] pt-4">
              <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#4b5e78]">
                <ShieldAlert size={14} className="text-[#0d9464]" />
                آمن تماماً
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#4b5e78]">
                <FlaskConical size={14} className="text-[#1a56db]" />
                مدعوم علمياً
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAIN & SOLUTION (Text Right, Image Left) ── */}
      <section className="bg-[#f0f7ff] py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-screen-xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#dc2626]">وجهك باين تعبان؟</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-[#0f1c2e] leading-snug">نحن نفهم معاناتك تماماً</h2>
            <p className="mt-4 text-[#4b5e78] leading-relaxed text-sm md:text-base">
              الإرهاق اليومي، والمنتجات التجارية التي لا تقدم أي نتيجة، كلها تسرق من بشرتك حيويتها. نعلم أنك تبحثين عن منتج حقيقي يمكنك الوثوق به.
            </p>
            <ul className="mt-6 flex flex-col gap-4">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm font-medium text-[#0f1c2e]">
                  <span className="mt-0.5 flex items-center justify-center h-5 w-5 rounded-full bg-[#0d9464]/20 shrink-0">
                    <CheckCircle size={12} className="text-[#0d9464]" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="order-2 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-white">
              <Image
                src="/images/product/woman-using.png"
                alt="طريقة استخدام سيروم ببتيد النحاس"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SCIENCE & AUTHORITY (Image Right, Text Left) ── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-screen-xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-lg border border-[#cbd5e1]">
              <Image
                src="/images/product/bottle-aloe.png"
                alt="سيروم ببتيد النحاس - مكونات طبيعية"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1a56db]">العلم والثقة</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-[#0f1c2e] leading-snug">تركيبة مثبتة.. أمان لا يقبل المساومة</h2>
            <p className="mt-4 text-[#4b5e78] leading-relaxed text-sm md:text-base">
              لأن بشرتك غالية، صممنا هذا السيروم وفق أسس علمية دقيقة. لا نعتمد على الوعود الوهمية، بل على المكونات الفعالة التي تخضع لاختبارات صارمة لضمان حصولك على نتائج مبهرة وآمنة.
            </p>
            <div className="mt-8 bg-white border-2 border-[#0d9464]/20 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-[#0d9464] text-lg flex items-center gap-2">
                  <ShieldCheck size={20} />
                  ضماننا الذهبي 30 يوماً
                </h4>
                <p className="mt-2 text-sm text-[#4b5e78]">
                  نحن واثقون من جودة منتجنا. استخدميه لمدة 30 يوماً، وإذا لم تلاحظي تحسناً في ملمس ونضارة بشرتك، سنعيد لكِ كامل المبلغ بكل رحابة صدر. راحتك وثقتك هي أولويتنا!
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ORIGINALITY WARNING ── */}
      <section className="py-12 px-4 sm:px-6 bg-red-50 border-y border-red-100">
        <div className="mx-auto max-w-screen-xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 flex justify-center">
             <div className="relative w-full max-w-md aspect-video rounded-3xl overflow-hidden shadow-lg border-2 border-red-200">
               <Image
                 src="/images/product/bottle-plain.png"
                 alt="سيروم ببتيد النحاس الأصلي"
                 fill
                 className="object-cover"
                 sizes="(max-width: 768px) 100vw, 400px"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-end p-6 text-center">
                 <h4 className="font-black text-white text-xl">احذري المنتجات المقلدة!</h4>
                 <p className="mt-2 text-sm text-white/90 leading-relaxed">
                   المنتج الأصلي متوفر فقط عبر متجرنا الرسمي
                 </p>
               </div>
             </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="inline-block bg-[#dc2626] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">تنبيه هام جداً</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0f1c2e] leading-snug">نحن المصدر الوحيد للسيروم الأصلي</h2>
            <p className="mt-4 text-[#4b5e78] leading-relaxed text-base">
              علامة SKINKSA هي الجهة الوحيدة المالكة والمصرح لها ببيع هذه التركيبة الفاخرة في السعودية. جميع المنتجات الأخرى التي تباع عبر وسطاء أو متاجر غير رسمية هي <strong className="text-[#dc2626] font-black">نسخ مقلدة ومغشوشة بالكامل</strong>.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              <li className="flex items-start gap-3 text-sm font-semibold text-[#0f1c2e]">
                <span className="mt-0.5 flex items-center justify-center h-5 w-5 rounded-full bg-[#0d9464]/20 shrink-0">
                  <CheckCircle size={12} className="text-[#0d9464]" />
                </span>
                اشترى دائماً من متجرنا الرسمي (هذا الموقع) لضمان حقك.
              </li>
              <li className="flex items-start gap-3 text-sm font-semibold text-[#0f1c2e]">
                <span className="mt-0.5 flex items-center justify-center h-5 w-5 rounded-full bg-[#0d9464]/20 shrink-0">
                  <CheckCircle size={12} className="text-[#0d9464]" />
                </span>
                منتجنا الأصلي هو الوحيد الذي يحمل التراخيص الرسمية من SFDA.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── EMOTIONAL INGREDIENTS ── */}
      <section className="bg-[#f0f7ff] py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-screen-xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c9a44a]">سر التركيبة</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-[#0f1c2e]">مكونات تحبها بشرتك</h2>
            <p className="text-[#4b5e78] mt-3">اكتشفي كيف تعمل هذه المكونات الفاخرة معاً لإعادة الحياة لوجهك</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ingredients.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="rounded-2xl bg-white border border-[#d5e3f0] p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a56db]/5 group-hover:bg-[#1a56db]/10 transition-colors">
                  <Icon size={24} className="text-[#1a56db]" />
                </div>
                <h3 className="font-bold text-lg text-[#0f1c2e]">{name}</h3>
                <p className="text-sm text-[#4b5e78] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="py-16 px-4 sm:px-6">
          <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#c9a44a]">طريقة الاستخدام</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#0f1c2e]">خطوات بسيطة لروتينك اليومي</h2>
          </div>
          <div className="flex flex-col gap-5">
            {howToUse.map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-4 bg-white rounded-2xl border border-[#d5e3f0] p-6 shadow-sm hover:shadow-md transition">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1a56db] text-white font-bold text-lg">
                  {step}
                </span>
                <div>
                  <p className="font-bold text-lg text-[#0f1c2e]">{title}</p>
                  <p className="text-sm text-[#4b5e78] mt-1.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="bg-[#f0f7ff] py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-screen-xl">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#c9a44a]">تجارب حقيقية</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#0f1c2e]">قصص نجاح من بناتنا</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-2xl border border-[#d5e3f0] p-6 flex flex-col gap-4 bg-white shadow-sm">
                <div className="flex">
                  {[1,2,3,4,5].map(s => <Star key={s} size={15} fill="#c9a44a" className="text-[#c9a44a]" />)}
                </div>
                <p className="text-sm text-[#0f1c2e] font-medium leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#d5e3f0]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a56db]/10 text-sm font-bold text-[#1a56db]">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0f1c2e]">{r.name}</p>
                    <p className="text-xs text-[#94a3b8]">من {r.city} - <span className="text-[#0d9464]">مشتري موثق</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#94a3b8] mt-8">* النتائج تختلف حسب نوع البشرة والالتزام بالروتين.</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0f1c2e]">أسئلة شائعة تدور في بالك</h2>
          </div>
          <div className="flex flex-col gap-4">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-xl border border-[#d5e3f0] bg-white p-5 cursor-pointer shadow-sm hover:shadow-md transition">
                <summary className="flex items-center justify-between gap-4 font-bold text-[#0f1c2e] list-none text-base">
                  {item.question}
                  <span className="shrink-0 text-[#1a56db] transition group-open:rotate-45">
                    <ChevronLeft size={20} className="transform -rotate-90 group-open:rotate-90 transition-transform" />
                  </span>
                </summary>
                <p className="mt-4 text-sm text-[#4b5e78] leading-relaxed border-t border-[#d5e3f0] pt-4">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-[#d5e3f0] px-4 py-4 flex items-center gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex-1">
          <p className="text-xs text-[#0d9464] font-bold mb-0.5">الدفع عند الاستلام</p>
          <p className="font-black text-[#0f1c2e] text-lg">{OFFERS[selectedIdx].price} <span className="text-sm font-normal">ريال</span></p>
        </div>
        <button
          onClick={handleAddToCart}
          className="rounded-xl bg-gradient-to-l from-[#1a56db] to-[#1e4fba] px-6 py-3.5 text-base font-bold text-white shadow-lg"
        >
          اطلبي الآن
        </button>
      </div>
    </>
  );
}
