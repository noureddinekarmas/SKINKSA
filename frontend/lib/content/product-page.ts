/**
 * Product landing: high-conversion DTC narrative (KSA tone).
 * Gallery + story frames use assets under /public/images/product/.
 */
import type { StaticImageData } from "next/image";

import { productAsset } from "@/lib/content/product-assets";

export type GalleryImage = {
  src: string | StaticImageData;
  alt: string;
  thumbLabel?: string;
  /** Shown as overlay on the main (large) gallery image */
  overlay?: {
    kicker?: string;
    title: string;
    subtitle?: string;
  };
};

export const PRODUCT_GALLERY: GalleryImage[] = [
  {
    src: productAsset("/images/product/gallery-main-1.png"),
    alt: "تركيبة عناية فاخرة بتركيز نظيف",
    thumbLabel: "العبوة",
    overlay: {
      kicker: "SKINKSA · 30 مل",
      title: "سيروم يشتغل مع بشرتك… مو ضدّك",
      subtitle: "ببتيد النحاس الأزرق — خفيف، مركّز، ويلائم روتينك اليومي بلا إرهاق",
    },
  },
  {
    src: productAsset("/images/product/gallery-texture-2.png"),
    alt: "قوام سائل أنيق يُوزّع بلطف",
    thumbLabel: "القوام",
    overlay: {
      kicker: "يمتص بسرعة",
      title: "بدون لزوجة تشيل المكياج",
      subtitle: "مناسب للحرّ وللي ما يحبّون طبقات ثقيلة",
    },
  },
  {
    src: productAsset("/images/product/gallery-usage-3.png"),
    alt: "لمسة يد ناعمة على الوجه",
    thumbLabel: "الاستخدام",
    overlay: {
      kicker: "٣ دقايق",
      title: "خطوات بسيطة… بس مفعولها يكبر مع الأيام",
      subtitle: "ثبّتيها يومياً ولاحظي الفرق على ملمس الوجه",
    },
  },
  {
    src: productAsset("/images/product/gallery-quality-4.png"),
    alt: "مختبر وجودة ونظافة",
    thumbLabel: "الجودة",
    overlay: {
      kicker: "وش يفرّق؟",
      title: "تركيبة مدروسة… مو كلام فاضي",
      subtitle: "نخلي العلم يشرح ليش البشرة تردّ بطريقة أنعم وأهدأ",
    },
  },
];

/** Single hero still used where one asset is required (e.g. legacy references). */
export const PRODUCT_HERO_IMAGE: GalleryImage = PRODUCT_GALLERY[0];
export const PRODUCT_DESCRIPTION_GALLERY: GalleryImage[] = PRODUCT_GALLERY.slice(1);

/** Full-width visuals: قبل/بعد + لقطة حياة يومية (مسارات تحت /public/images/product/) */
export const PRODUCT_RESULT_VISUAL = {
  eyebrow: "وقت المقارنة",
  title: "قبل وبعد… لما تهتمّين للمنطقة الحساسة حول العين",
  body:
    "لما يلتزم الروتين، كثير من العميلات يلاحظن بشرة تبين أهدأ وأوضح. الصورة توضيحية للاتجاه العام — مو نتيجة مضمونة للجميع، وتختلف حسب نوع البشرة والنوم والعوامل الخارجية.",
  imageSrc: productAsset("/images/product/section-before-after.jpg"),
  imageAlt: "مقارنة قبل وبعد لمنطقة تحت العين — مظهر أكثر إشراقاً ونعومة",
} as const;

export const PRODUCT_LIFESTYLE_VISUAL = {
  eyebrow: "في يومج العادي",
  title: "نفس العبوة اللي تشوفينها… بين إيديك بوضوح",
  body:
    "سيروم SKINKSA بلون أزرق نقي يمتص بسرعة — يناسبج إذا تبغين مظهر نضارة من غير طبقات تقيلة، وتمشين مع المكياج لما يسكن على البشرة.",
  imageSrc: productAsset("/images/product/section-lifestyle-model.png"),
  imageAlt: "لقطة ترويجية لعارضة تحمل عبوة سيروم SKINKSA ببتيد النحاس الأزرق بلون سائل أزرق واضح",
} as const;

/** Bento / story frames: image + matched marketing caption */
export type StoryFrame = {
  src: string;
  alt: string;
  badge: string;
  headline: string;
  body: string;
};

export const STORY_FRAMES: StoryFrame[] = [
  {
    src: productAsset("/images/product/story-card-1.png"),
    alt: "ترطيب لطيف",
    badge: "وجهج يقول تعب؟",
    headline: "التكييف والسهر يبانون… بس مو لازم يثبتون",
    body: "دايم تلاحظين بعد الظهر: ملمس مو حلو، وجه يبين متعبان، ومع المكياج يزيد الإحساس؟ هذا مو كسل منج… بشرتج تحتاج شي يدعم مظهر المرونة والنضارة مو بس يرطب لحظة ويخلص.",
  },
  {
    src: productAsset("/images/product/story-card-2.png"),
    alt: "مكوّنات وماء وزهور",
    badge: "ليش ذا المكوّن؟",
    headline: "ببتيد النحاس الأزرق: اسم يدور… والسبب علمي",
    body: "GHK-Cu من المكوّنات اللي تدرس في عالم العناية لدوره في دعم مظهر البشرة الأكثر تماسكاً و«مظهر شبابي» عند الالتزام. مو سِحْر — روتين ذكي يلاقي بشرتج في المنتصف: مركّز وما يثقل.",
  },
  {
    src: productAsset("/images/product/story-card-4.png"),
    alt: "عبوات عناية راقية",
    badge: "ثقة قبل الفلوس",
    headline: "تسوّقين أونلاين بس خايفة؟ عندج حق",
    body: "دفع عند الاستلام يعني ما تدفعين لين تشوفين الطرد بيدج. وضمان ٣٠ يوم يشيل عنج ضغط التجربة: إذا ما حسّيتي إن التجربة مو فايدة لج، ترجعين وفق سياسة الاسترجاع.",
  },
];

/**
 * Hero carousel: main pack shot first, then the three marketing assets synced from
 * Desktop/skinksa (story-card-1, gallery-texture-2, section-before-after).
 */
export const PRODUCT_HERO_GALLERY: GalleryImage[] = [
  PRODUCT_GALLERY[0],
  {
    src: productAsset("/images/product/story-card-1.png"),
    alt: STORY_FRAMES[0].alt,
    thumbLabel: "القصة",
    overlay: {
      kicker: STORY_FRAMES[0].badge,
      title: STORY_FRAMES[0].headline,
      subtitle:
        STORY_FRAMES[0].body.length > 160 ? `${STORY_FRAMES[0].body.slice(0, 157).trim()}…` : STORY_FRAMES[0].body,
    },
  },
  {
    src: productAsset("/images/product/gallery-texture-2.png"),
    alt: PRODUCT_GALLERY[1].alt,
    thumbLabel: PRODUCT_GALLERY[1].thumbLabel ?? "القوام",
    overlay: PRODUCT_GALLERY[1].overlay,
  },
  {
    src: productAsset("/images/product/section-before-after.jpg"),
    alt: PRODUCT_RESULT_VISUAL.imageAlt,
    thumbLabel: "قبل وبعد",
    overlay: {
      kicker: PRODUCT_RESULT_VISUAL.eyebrow,
      title: PRODUCT_RESULT_VISUAL.title,
      subtitle:
        PRODUCT_RESULT_VISUAL.body.length > 200
          ? `${PRODUCT_RESULT_VISUAL.body.slice(0, 197).trim()}…`
          : PRODUCT_RESULT_VISUAL.body,
    },
  },
];

export const PRODUCT_KICKER = "منتج واحد · ٣٠ مل · SFDA";

export const PRODUCT_HEADLINE = "سيروم SKINKSA — بروتين خفيف، مدروس، ومرخّص";

/** سطر ثانٍ تحت العنوان — مختصر */
export const PRODUCT_TAGLINE =
  "ببتيد نحاس أزرق مع هيالورونيك: يمتص بسرعة ويناسب الجو الحار.";

/** جملة أطول في بطاقة اقتباس تحت العنوان */
export const PRODUCT_HERO_QUOTE =
  "مو وعود خرافية — تجربة تسوق واضحة، ومنتج يخفّف ذلك السؤال اللي يتكرر: «ليش جربت كثير… وما ثبت؟»";

export const SOCIAL_STRIP = {
  stat: "+١٠٠٠",
  statLabel: "عميلة خلال فترة قصيرة",
  ratingLine: "تقييم تجربة شراء عالي من مدن المملكة",
  cities: ["الرياض", "جدة", "الدمام", "المدينة", "أبها"],
};

export const PAIN_CHECKLIST = [
  { title: "بشرة تبين حايلة بعد الظهر", detail: "حتى مع الترطيب العادي، الإرهاق يبان — وتبغين شي يوقف هالإحساس." },
  { title: "تعزفين عن الطبقات الثقيلة", detail: "الحر والغبار… وما يحتاج وجهج «متعب» من كثر المنتجات." },
  { title: "تبغين تسوّقين بأمان", detail: "دفع عند الاستلام + متجر رسمي يعني ما تخاطرين بفلوسج على مجهول." },
];

export const MECHANISM_BLOCK = {
  eyebrow: "علوم مبسّطة لبنات البيت",
  title: "مو كيمياء مخيفة — تفاعل بسيط: رطّبي → ركّزي → ثبّتي",
  paras: [
    "البشرة لما تكون رطبة شوي، تستقبل السيروم أحسن. ببتيد النحاس الأزرق يدخل كـ «دعم» لمظهر المرونة والنعومة اللي تدورين عليها مع الوقت، مو زيت يسكر المسام.",
    "الهيالورونيك يمسك رطوبة السطح فيعطي «فل» خفيف للخطوط الدقيقة بدون ما يبان المظهر لامع مزعج.",
  ],
  calloutTitle: "ليش ما نقول «يشيل التجاعيد» بجرة قلم؟",
  calloutBody:
    "لأن بشرتج مو نسخة من غيرج. واحنا نحترم ذكاء العميلة: النتائج مركّبة من نوع البشرة + الالتزام + الحماية من الشمس. اللي نقدر نضمنه لج: تركيبة فاخرة، تسهيل روتين، وتجربة تسوق عادلة.",
};

export const SCIENCE_PROOF_LIST = [
  "مكوّن أساس معروف في أدب العناية لدعم مظهر التماسك (GHK-Cu).",
  "الهيالورونيك يدعم الاحتفاظ بالرطوبة في طبقة القرنية.",
  "منتج بحوزة SFDA — وما نخاف نقول: تسوقي من المصدر الرسمي فقط.",
];

export const PRODUCT_BENEFITS = [
  "يدعم مظهر النضارة والنعومة بدون ثِقل دهني يذكر",
  "يلمساحات تبين تعبانة: هدوء في الملمس مع الاستمرار",
  "يندمج مع المكياج لأن امتصاصه سريع",
  "مناسب لأغلب الأنواع — وجربي على بقعة صغيرة أولاً لو بشرتج حساسة مرّة",
];

export const PRODUCT_HOW_TO = [
  {
    step: "١",
    title: "نظّفي بلطف",
    desc: "غسول لطيف، وما تفروكين بقوّة — بشرتج مو ميدان حرب.",
  },
  {
    step: "٢",
    title: "رطّبي شوي… وبعدها السيروم",
    desc: "٣–٤ قطرات تكفي. ربّتي لبرا وفوق، وخلّي يمتص قبل ما تكملين.",
  },
  {
    step: "٣",
    title: "صبح = واقي شمس… مساء = مرطبك",
    desc: "الحماية توقف الرجوع للبداية — وهذي أكبر أمانة نعطيج إياها.",
  },
];

export const PRODUCT_INGREDIENTS = [
  {
    name: "ببتيد النحاس الأزرق (GHK-Cu)",
    hook: "نجمة الروتين",
    desc: "يُذكر في الأبحاث والمراجع التجميلية كداعم لمظهر البشرة الأكثر تماسكاً ونعومة عند الاستخدام المنتظم.",
    microProof: "مكوّن «علامة +» مو مكوّن جناح",
  },
  {
    name: "حمض الهيالورونيك",
    hook: "يمسك الماء على السطح",
    desc: "يعطي امتلاء بصري لطيف وملمس مخملي — من غير ما يخلي الوجه يتلمع بطريقة تزعجج بالصور.",
    microProof: "يشتهر كمرطب متعدد الأوزان في التركيبات الفاخرة",
  },
  {
    name: "مكوّنات نضارة مدعومة",
    hook: "لمسة إشراق تحت control",
    desc: "تكمّل الصورة: توهّج أنظف، وشكل «صاحية» حتى لو نومج قليل.",
    microProof: "تركيبة متوازنة — مو تركيز أعمى على لمعان",
  },
];

export const PRODUCT_REVIEWS = [
  {
    name: "نورة أ.",
    city: "الرياض",
    tag: "طلبت عرض العبوتين",
    rating: 5,
    text: "بصراحة خفت من أونلاين، بس الدفع عند الاستلام راح عني همّة. الملمس خفيف وما يحسسني بطبقة، ومع أسبوعين صار وجهي أهدأ بعد الدوام.",
  },
  {
    name: "ريمـ س.",
    city: "جدة",
    tag: "بشرة مختلطة",
    rating: 5,
    text: "أنا ما أحب الزيتية، هذا ما زادها. حطيته قبل الكنسيلر وتماسك أحسن من قبل. التوصيل جا بسرعة يعني زين على الساحل.",
  },
  {
    name: "دانة م.",
    city: "الخبر",
    tag: "أول تجربة سيروم",
    rating: 5,
    text: "كنت أستخدم كريمات براندات معروفة ومجمّدة، بس ما لاحظت «ثبات». هنا حسيت بشرتي تمشي معاي: نعومة وما في شدّة غريبة.",
  },
  {
    name: "لينا خ.",
    city: "أبها",
    tag: "الجو البارد يخشّن",
    rating: 5,
    text: "عندنا الجو يقطع البشرة، ولقيته يرطب بدون ما يكرّش. ضمان ٣٠ يوم خلاني أقول خلاص… أجرب بارتياح.",
  },
];

/** Authentic product vs unofficial sellers — trust band above the fold */
export const AUTHENTICITY_SECTION = {
  eyebrow: "المصدر الرسمي فقط",
  title: "الأصلي من SKINKSA… والباقي؟ ما نقدر نضمن تركيبته",
  lead:
    "التركيبة المرخّصة وعرض العبوات الرسمي يُباعان عبر هذا المتجر فقط. أي عبوة خارج قنواتنا معرضة للتقليد — ولا نملك آلية للتحقق من مصدرها أو سلامتها.",
  real: {
    label: "المنتج الرسمي من المتجر",
    items: [
      "نفس التغليف واللوت اللي تتوقعينه من المصدر المعتمد.",
      "سياسة استرجاع مكتوبة + دعم فريقنا بعد الشراء.",
      "تتبّع شحن من نظامنا — مو وسيط مجهول.",
    ],
  },
  fake: {
    label: "عروض خارج المتجر الرسمي",
    items: [
      "أسعار غير منطقية أو قوائم بيع عشوائية بلا مرجع واضح.",
      "عبوات بلا بيانات ترخيص أو مطابقة للمعايير اللي تعلنينها لعائلتج.",
      "لا يوجد ضمان مطابق لسياسة SKINKSA المنشورة.",
    ],
  },
  guarantee: {
    kicker: "ضمان ذهبي",
    title: "٣٠ يوم راحة بال",
    body:
      "إذا ما كانت تجربتج مع المنتج الأصلي تستحق الاستمرار — ارجعي وفق سياسة الاسترجاع المنشورة. نخلي قرارك سهل… من غير لغو.",
    footBeforeLink: "التفاصيل الكاملة في",
    returnsLink: { href: "/returns-policy", label: "سياسة الإرجاع" },
    footAfterLink: "قبل الدفع.",
  },
};

export const AUTHORITY_BAND = {
  title: "ليش مصدرك يهم؟",
  points: [
    { t: "SFDA", d: "منتج ضمن مسار ترخيص رسمي — وذي أمانة لعائلتج." },
    { t: "متجرنا فقط", d: "التقليد منتشر — الطلب من هنا يعني نفس التغليف والتتبع." },
    { t: "دعم بعد البيع", d: "مو بنبيع ونسكر الخط — تبغين توضيح؟ نردّ." },
  ],
};

export const OBJECTION_BUSTER = {
  title: "لسه مترددة؟ خلّينا نكون صريحين",
  lines: [
    "إذا تبغين «معجزة يوم» — هذا مو منتجنا. إحنا نبني نتيجة مع الوقت.",
    "إذا تبغين تجرّبين بدون مخاطرة فلوس — الدفع عند الاستلام موجود لج.",
    "إذا ما عجبك التوجه — سياسة الاسترجاع مكتوبة… اقرأيها براحتج قبل ما تدفعين ولا ريال.",
  ],
};
