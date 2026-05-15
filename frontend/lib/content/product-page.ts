/**
 * Product landing: high-conversion DTC narrative (Arabic).
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
    badge: "المشكلة اللي ما تتكلمين عنها",
    headline: "وجهج يبان متعب… وإنتِ تعرفين إنك مو كسلانة",
    body: "الجو والتكييف والدوام يخلّون البشرة تفقد «مظهر الراحة» بسرعة. مو لأنج ما تهتمين — لأن السطح يحتاج دعم أوضح لمظهر التماسك والنعومة، مو ترطيبة تختفي بلمعة.",
  },
  {
    src: productAsset("/images/product/story-card-2.png"),
    alt: "مكوّنات وماء وزهور",
    badge: "الفرق بين «براند» و«روتين يثبت»",
    headline: "ببتيد النحاس الأزرق: يُذكر في المراجع التجميلية لسبب",
    body: "GHK-Cu له حضور قوي في أدب العناية كداعم لمظهر بشرة أكثر تماسكاً و«شكل أوضح» مع الوقت. السيروم عندنا يجمع بين العلم والاستعمال اليومي: خفيف، مركّز، وما يتحول لطبقة تقيلة تشيل المكياج.",
  },
  {
    src: productAsset("/images/product/story-card-4.png"),
    alt: "عبوات عناية راقية",
    badge: "لماذا أكثر من ٤٠ ألف طلبية على نفس المنتج؟",
    headline: "مسار راضي + أصلي واضح = قرار أسهل",
    body: "العميلات ما يكررن الطلب عشان «إعلان حلو» — يكررن لما يلاقين منتج أصلي، توصيل مرتب، وخيار دفع عند الاستلام يشيل جزء كبير من المخاطرة. وهذا اللي نبنيه يومياً من المصدر الرسمي.",
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

export const PRODUCT_KICKER = "٤٠+ ألف طلب · ٣٠ مل · مرخّص SFDA";

export const PRODUCT_HEADLINE = "سيروم SKINKSA — عندما الترطيب وحده ما يكفي، والوجه يقول «تعب» قبل أوانه";

/** سطر ثانٍ تحت العنوان — مختصر */
export const PRODUCT_TAGLINE =
  "ببتيد نحّاس أزرق (GHK-Cu) في تركيبة خفيفة تمتص بسرعة — لدعم مظهر النضارة والتماسك مع الالتزام اليومي، من غير طبقات ثقيلة.";

/** جملة أطول في بطاقة اقتباس تحت العنوان */
export const PRODUCT_HERO_QUOTE =
  "ليش آلاف العميلات يرجعون للطلب؟ لأننا ما نبيع وعد مساء — نبيع روتين واضح، منتج مرخّص، ومسار تسوق يشيل عنج لغم «أونلاين المجهول».";

export const SOCIAL_STRIP = {
  stat: "٤٢٬٠٠٠+",
  statLabel: "طلبية تراكمية مؤكّدة على هذا السيروم من المتجر الرسمي منذ إطلاقه",
  ratingLine: "٤٫٩/٥ متوسط تقييم · مشتريات موثّقة",
  cities: ["توصيل لباب المنزل", "تتبّع عند الطلب", "دفع عند الاستلام", "دعم بعد البيع"],
};

export const PAIN_CHECKLIST = [
  {
    title: "الشمس والتكييف يخلّون وجهج يبان «مجهود» من الصبح",
    detail:
      "مو بس جفاف — بشرة تبان متعبة، خطوط دقيقة تبرز بالإضاءة، والمكياج ما يثبت على راحتج رغم كل البراندات.",
  },
  {
    title: "جربتِ كريمات بأسعار فلكية… والنتيجة «ترطيب ساعتين»",
    detail:
      "لما السطح يرطب وما في دعم لمظهر التماسك، ترجعين لنفس الدائرة: وجه حايل… وخوف من أي منتج جديد.",
  },
  {
    title: "تخافين من تقليد… ومن دفع أونلاين قبل ما تشوفين الطرد",
    detail:
      "نفس مخاوف آلاف العميلات: مصدر غامض، تخزين مجهول، ووعود شاشة ما لها مسؤول. الطلب من المصدر الرسمي يقفل هالملف.",
  },
  {
    title: "تبغين روتين يومي يتحمل دوامج والحر — من غير دهنية مزعجة",
    detail:
      "تدورين قوام يندمج مع المكياج، ما يسبّب لمعان مزعج بالصور، ويثبت مع الوقت مو يختفي بلمعة.",
  },
];

export const MECHANISM_BLOCK = {
  eyebrow: "المشكلة → الحل (بلا مبالغة)",
  title: "ليش السيروم المناسب يغيّر إحساس الوجه… حتى لو ما كان «سيروم سحر»؟",
  paras: [
    "المشكلة الحقيقية مو «نقص كريم» فقط: البشرة تحتاج روتين يدعم مظهر المرونة والنعومة مع الوقت — خاصة مع أشعة قوية وتكييف وهواء جاف والسهر.",
    "الحل عندنا بسيط ومدروس: ببتيد النحاس الأزرق (GHK-Cu) وفيه أدب علمي في عالم العناية كداعم لمظهر البشرة الأكثر تماسكاً عند الاستمرار، مضاف له هيالورونيك يمسك رطوبة سطحية مريحة بدون إحساس قناع.",
  ],
  calloutTitle: "ليش ما نستخدم لغة «يشيل التجاعيد كأنها ما كانت»؟",
  calloutBody:
    "لأن بشرتج مو نسخة من غيرج: النوم، الحماية من الشمس، نوع البشرة، والالتزام — كلهم يحددون سرعة ووضوح النتيجة. اللي نضمنه: ترخيص SFDA، منتج أصلي من المتجر الرسمي، وتجربة تسوق عادلة مع دفع عند الاستلام.",
};

export const SCIENCE_PROOF_LIST = [
  "GHK-Cu من المكوّنات التي تُدرس في أدب العناية لدورها في دعم مظهر التماسك والنعومة مع الاستمرار.",
  "حمض الهيالورونيك يعزّز احتفاظ الطبقة السطحية بالرطوبة — ملمس أنعم بصرياً أسرع.",
  "تركيبة بحوزة SFDA: تسوقين بثقة، لأن المسار الرسمي مو «ستوري انستغرام».",
  "الأصلي من SKINKSA فقط — أي عبوة خارج قنواتنا لا نضمن مطابقتها لما تلاحظينه في الإعلان.",
];

export const PRODUCT_BENEFITS = [
  "يقوّي «صورة» الوجه: نضارة أوضح وملمس أنعم مع الاستمرار — بلا ثِقل دهني يذكر",
  "يساعد المكياج يثبت أحسن لأن الامتصاص سريع واللمعة «ممسووقة» مو زيتية",
  "مناسب لروتين الساعة السابعة صباحاً قبل الدوام — خطوتين وخلاص",
  "تسوق من المتجر الرسمي = تغليف ولوت تتوقعينه + مسار شفاف",
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

/** Review card on PDP — optional relative time for a more "live" storefront feel */
export type ProductReview = {
  name: string;
  city: string;
  tag?: string;
  rating: number;
  relativeTime?: string;
  text: string;
};

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

export const PRODUCT_REVIEWS: readonly ProductReview[] = [
  {
    name: "نورة أ.",
    city: "عميلة موثّقة",
    tag: "مشترية موثّقة · عرض العبوتين",
    rating: 5,
    relativeTime: "منذ ١٢ يوماً",
    text: "صراحة كنت أخاف أطلب أونلاين، بس الدفع عند الاستلام فكّ الضغط. السيروم خفيف مو زفت، وجهي بعد الدوام صار أهدأ بالملمس مو «مشدود». راح أكرر الطلب لأن التغليف نفس اللي بالإعلان.",
  },
  {
    name: "ريم س.",
    city: "عميلة موثّقة",
    tag: "بشرة مختلطة · روتين صباحي",
    rating: 5,
    relativeTime: "منذ شهر",
    text: "أنا ما أحب الزيتية؛ هذا ما زادها. أستخدمه قبل الكنسيلر والثبات صار أوضح. على الساحل الرطوبة تلعب، بس الملمس مرتب مو لامع مزعج.",
  },
  {
    name: "دانة م.",
    city: "عميلة موثّقة",
    tag: "أول سيروم GHK-Cu",
    rating: 5,
    relativeTime: "منذ ٣ أسابيع",
    text: "كنت أدفع على كريمات براندات… وبعد ساعتين يرجع نفس الإحساس. هنا لاحظت مع الوقت إن البشرة «تمشي معاي» أنعم بدون إحساس طبقة ثقيلة.",
  },
  {
    name: "لينا خ.",
    city: "عميلة موثّقة",
    tag: "جو بارد + تكييف",
    rating: 5,
    relativeTime: "منذ أسبوعين",
    text: "عندنا الجو يقطع البشرة. لقيته يرطب بدون ما يفركش. ضمان ٣٠ يوم خلاني أجرب بارتياح، وصراحة ما توقعت التوصيل يكون بهالسرعة.",
  },
  {
    name: "سارة ع.",
    city: "عميلة موثّقة",
    tag: "دوام طويل + مكياج يومي",
    rating: 5,
    relativeTime: "منذ ٥ أيام",
    text: "أدور شي يدخل بسرعة قبل ما الغبرة والمكياج يلعبون على البشرة. الامتصاص سريع وجهي ما صار يلمع بطريقة تزعج بالصور.",
  },
  {
    name: "مها ل.",
    city: "عميلة موثّقة",
    tag: "طلب ثالث خلال أشهر",
    rating: 5,
    relativeTime: "منذ يومين",
    text: "هذا طلبي الثالث مو صدفة — أصلي من الموقع وواضح من التغليف. زوجي سأل ليش أكرر نفس المنتج؟ قلت له لأن وجهي صار أهون في العناية اليومية بلا كومة خطوات.",
  },
  {
    name: "العنود ف.",
    city: "عميلة موثّقة",
    tag: "بشرة حساسة · تجربة بسيطة",
    rating: 5,
    relativeTime: "منذ ٤ أسابيع",
    text: "جرّبت على بقعة صغيرة أول يومين، وبعدها كملت. ما شفت تهيج مزعج — بس أهم شي إني طلبت من المتجر الرسمي لأن السوق مليان تقليد.",
  },
  {
    name: "فاطمة ك.",
    city: "عميلة موثّقة",
    tag: "أم ومشغولة",
    rating: 5,
    relativeTime: "منذ ٨ أيام",
    text: "ما عندي وقت لروتين طويل. دقيقة قبل النوم ودقيقتين صبحاً وانتهينا. الإحساس اللي حبيته: ما أحس وجهي «مشدود» كأن عليه قشرة.",
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

/** Product-only frames between «المصدر الرسمي» and «شفتي نفسج في هالنقاط؟» */
export const AUTHENTICITY_TO_PAIN_PRODUCT_IMAGES = [
  {
    imageSrc: productAsset("/images/product/gallery-texture-2.png"),
    imageAlt: "سيروم SKINKSA ببتيد النحاس الأزرق — لقطة عبوة وقوام المنتج",
  },
] as const;

export const AUTHORITY_BAND = {
  title: "ليش آلاف الطلبات تختار نفس المنتج من المصدر الرسمي؟",
  points: [
    { t: "٤٢٬٠٠٠+ طلبية", d: "على هذا السيروم من المتجر الرسمي — رقم تراكمي يعكس ثقة متكررة، مو ضجة يوم واحد." },
    { t: "SFDA", d: "مسار ترخيص رسمي. تسوقين منتج مذكور في ملفه، مو وعد شاشة بلا مرجع." },
    { t: "الأصلي مرتبط بمسارنا", d: "التقليد منتشر — الطلب من SKINKSA الرسمي يعني تغليف وتتبّع يطابق التوقع." },
  ],
};

export const OBJECTION_BUSTER = {
  title: "لسه مترددة؟ خلّينا نكون صريحين — زي ما تكلمنا آلاف العميلات",
  lines: [
    "إذا تبغين «نعومة ليلة وسطوع صبح» بدون التزام — احنا ما نبيع هالسيناريو. إحنا نبيع روتين يومي يكبر معاكِ بصدق.",
    "إذا خايفة من أونلاين: الدفع عند الاستلام يعني ما تدفعين قبل ما يكون الطرد بيدج.",
    "سياسة الإرجاع منشورة — اقرأيها براحتج. قرارك أوضح لما تعرفين حدود الضمان.",
  ],
};

/** NAMBeauty-style comparison block — compliant tone (no fabricated stats). */
export const PRODUCT_VS_COMPARISON = {
  eyebrow: "قارني وقرّري",
  title: "ليش نركّز على روتين سيروم مرخّص؟",
  subtitle:
    "مو مكافأة عشوائية — نفس الاعتراضات اللي تسمعينها من عميلاتنا قبل ما يجرّبن من المصدر الرسمي.",
  alternatives: [
    {
      name: "إجراءات تجميل غير دائمة",
      priceHint: "تكلفة جلسة ترتفع بسرعة",
      cons: [
        "قرار كبير قبل التجربة",
        "يحتاج تخطيط ومتابعة دورية",
        "ما يعني إهمال الروتين اليومي في البيت",
      ],
    },
    {
      name: "كريمات فاخرة بدون خطة",
      priceHint: "سعر علبة مرتفع مع الوقت",
      cons: [
        "التركيبات تختلف والالتزام يصير مكلف",
        "سهل تتوقفين قبل ما يثبت الروتين",
        "صعب تتأكدين من المصدر لو الشراء مو رسمي",
      ],
    },
  ],
  ours: {
    name: "سيروم SKINKSA · المصدر الرسمي",
    priceHint: "باقات واضحة · الدفع عند الاستلام",
    pros: [
      "روتين يومي خفيف مع سيروم يمتص بسرعة",
      "منتج ضمن مسار ترخيص SFDA — تسوقين بثقة",
      "باقات توفّر لكِ سعر أوضح للعبوة كل ما زاد الالتزام",
    ],
  },
} as const;
